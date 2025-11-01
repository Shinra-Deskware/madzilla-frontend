// client/src/Admin/AdminComplaints.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, TextField, Button, Stack, TablePagination
} from "@mui/material";
import http from "../api/http";
import "./Styles/AdminOrders.css"; // reuse same table style

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        orderId: "",
        userPhone: "",
        type: "",
        status: "",
        title: "",
        createdAt: ""
    });
    const [editRow, setEditRow] = useState(null);
    const [adminNotes, setAdminNotes] = useState("");

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const res = await http.get("/api/admin/complaints");
            // order newest first as safety
            const list = (res.data?.complaints || []).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setComplaints(list);
        } catch (err) {
            console.error("Failed to load complaints", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(0);
    };

    const filteredList = useMemo(() => {
        return complaints.filter(c =>
            (c.orderId || "").toLowerCase().includes(filters.orderId.toLowerCase()) &&
            (c.userPhone || "").toLowerCase().includes(filters.userPhone.toLowerCase()) &&
            (c.type || "").toLowerCase().includes(filters.type.toLowerCase()) &&
            (c.status || "").toLowerCase().includes(filters.status.toLowerCase()) &&
            (c.title || "").toLowerCase().includes(filters.title.toLowerCase()) &&
            new Date(c.createdAt).toLocaleString().toLowerCase().includes(filters.createdAt.toLowerCase())
        );
    }, [complaints, filters]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page, rowsPerPage]);

    const approve = async (id) => {
        await http.put(`/api/admin/complaints/${id}/approve`, { adminNotes });
        setEditRow(null);
        setAdminNotes("");
        fetchComplaints();
    };

    const markReceived = async (id) => {
        await http.put(`/api/admin/complaints/${id}/receive`, { adminNotes });
        setEditRow(null);
        setAdminNotes("");
        fetchComplaints();
    };

    const reject = async (id) => {
        const note = adminNotes || prompt("Reason?");
        await http.put(`/api/admin/complaints/${id}/reject`, { adminNotes: note });
        setEditRow(null);
        setAdminNotes("");
        fetchComplaints();
    };

    if (loading) {
        return (
            <div className="admin-orders-loading">
                <CircularProgress sx={{ color: "#fff" }} />
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <h2>🧾 Complaints & Returns</h2>

            <TableContainer component={Paper} className="admin-orders-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>

                        {/* Filters */}
                        <TableRow>
                            <TableCell><TextField size="small" placeholder="Search…" onChange={e => handleFilter("orderId", e.target.value)} /></TableCell>
                            <TableCell><TextField size="small" placeholder="Phone…" onChange={e => handleFilter("userPhone", e.target.value)} /></TableCell>
                            <TableCell><TextField size="small" placeholder="Type…" onChange={e => handleFilter("type", e.target.value)} /></TableCell>
                            <TableCell><TextField size="small" placeholder="Title…" onChange={e => handleFilter("title", e.target.value)} /></TableCell>
                            <TableCell><TextField size="small" placeholder="Status…" onChange={e => handleFilter("status", e.target.value)} /></TableCell>
                            <TableCell><TextField size="small" placeholder="Date…" onChange={e => handleFilter("createdAt", e.target.value)} /></TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.map(c => {
                            const isRowOpen = editRow === c._id;

                            // Next action hints:
                            // OPEN + type=COMPLAINT → Approve/Reject
                            // OPEN + type=RETURN    → Approve/Reject (approve == RETURN_ACCEPTED)
                            // APPROVED + type=RETURN → Mark Received (moves to RETURN_RECEIVED + refund INITIATED)
                            return (
                                <TableRow key={c._id}>
                                    <TableCell>{c.orderId}</TableCell>
                                    <TableCell>{c.userPhone}</TableCell>
                                    <TableCell>{c.type}</TableCell>
                                    <TableCell>{c.title}</TableCell>
                                    <TableCell>
                                        {c.type === "RETURN" && c.status === "OPEN" && "Return Requested"}
                                        {c.type === "RETURN" && c.status === "APPROVED" && "Return Accepted — Send item"}
                                        {c.type === "RETURN" && c.status === "REJECTED" && "Return Rejected ❌"}
                                        {c.type === "COMPLAINT" && c.status === "OPEN" && "Open"}
                                        {c.type === "COMPLAINT" && c.status === "APPROVED" && "Resolved ✅"}
                                        {c.type === "COMPLAINT" && c.status === "REJECTED" && "Closed ❌"}
                                    </TableCell>
                                    <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>

                                    <TableCell align="right" style={{ minWidth: 320 }}>
                                        {isRowOpen ? (
                                            <>
                                                {/* User Message */}
                                                <div style={{ fontSize: 13, marginBottom: 6, opacity: 0.9 }}>
                                                    <strong>Message:</strong> {c.message || "-"}
                                                </div>

                                                {/* Admin Notes (Black text on white) */}
                                                <TextField
                                                    size="small"
                                                    margin="dense"
                                                    label="Admin Notes"
                                                    fullWidth
                                                    value={adminNotes}
                                                    onChange={e => setAdminNotes(e.target.value)}
                                                    sx={{
                                                        "& .MuiInputBase-root": { background: "#fff", color: "#000" },
                                                        "& .MuiInputLabel-root": { color: "#000" }
                                                    }}
                                                />

                                                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                                    {c.status === "OPEN" && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                                onClick={() => approve(c._id)}
                                                            >
                                                                Approve
                                                            </Button>

                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => reject(c._id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}

                                                    {c.status === "APPROVED" && c.type === "RETURN" && (
                                                        <Button
                                                            variant="contained"
                                                            color="warning"
                                                            size="small"
                                                            onClick={() => markReceived(c._id)}
                                                        >
                                                            Mark Item Received
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="text"
                                                        color="inherit"
                                                        size="small"
                                                        onClick={() => { setEditRow(null); setAdminNotes(""); }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Stack>
                                            </>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => { setEditRow(c._id); setAdminNotes(c.adminNotes || ""); }}
                                            >
                                                Review
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredList.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
        </div>
    );
}

import React, { useEffect, useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, TextField, TablePagination, Button, Stack
} from "@mui/material";
import http from "../api/http";
import "./Styles/AdminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        fullName: "", phoneNumber: "", emailId: "", city: "", state: "", pinCode: ""
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editRow, setEditRow] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await http.get("/api/admin/users");
                setUsers(res.data.users || []);
            } catch (err) {
                console.error("Fetch users failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleFilter = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setPage(0);
    };

    const handleEdit = (u) => {
        setEditRow(u._id);
        setEditData({ ...u });
    };

    const handleCancel = () => {
        setEditRow(null);
        setEditData({});
    };

    const handleSave = async () => {
        try {
            await http.put(`/api/admin/users/${editData._id}`, editData);
            setUsers((prev) => prev.map((u) => (u._id === editRow ? editData : u)));
            setEditRow(null);
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleChangeEdit = (path, value) => {
        if (path.startsWith("address.")) {
            const field = path.split(".")[1];
            setEditData((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setEditData((prev) => ({ ...prev, [path]: value }));
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            return (
                u.fullName?.toLowerCase().includes(filters.fullName.toLowerCase()) &&
                u.phoneNumber?.toLowerCase().includes(filters.phoneNumber.toLowerCase()) &&
                u.emailId?.toLowerCase().includes(filters.emailId.toLowerCase()) &&
                u.address.city?.toLowerCase().includes(filters.city.toLowerCase()) &&
                u.address.state?.toLowerCase().includes(filters.state.toLowerCase()) &&
                u.address.pinCode?.toLowerCase().includes(filters.pinCode.toLowerCase())
            );
        });
    }, [users, filters]);

    const paginatedUsers = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, page, rowsPerPage]);

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    if (loading)
        return (
            <div className="admin-users-loading">
                <CircularProgress sx={{ color: "#fff" }} />
            </div>
        );

    return (
        <div className="admin-users">
            <h2>👥 All Users</h2>
            <TableContainer component={Paper} className="admin-users-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Pin Code</TableCell>
                            <TableCell>Orders Count</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>

                        <TableRow>
                            {Object.keys(filters).map((f) => (
                                <TableCell key={f}>
                                    <TextField
                                        size="small"
                                        value={filters[f]}
                                        onChange={(e) => handleFilter(f, e.target.value)}
                                        placeholder="Search..."
                                        fullWidth
                                    />
                                </TableCell>
                            ))}
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No matching users
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers.map((u) => (
                                <TableRow key={u._id}>
                                    <TableCell>
                                        {editRow === u._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.fullName || ""}
                                                onChange={(e) => handleChangeEdit("fullName", e.target.value)}
                                            />
                                        ) : (
                                            u.fullName
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === u._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.phoneNumber || ""}
                                                onChange={(e) => handleChangeEdit("phoneNumber", e.target.value)}
                                            />
                                        ) : (
                                            u.phoneNumber
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === u._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.emailId || ""}
                                                onChange={(e) => handleChangeEdit("emailId", e.target.value)}
                                            />
                                        ) : (
                                            u.emailId
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === u._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.address?.city || ""}
                                                onChange={(e) => handleChangeEdit("address.city", e.target.value)}
                                            />
                                        ) : (
                                            u.address?.city
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === u._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.address?.state || ""}
                                                onChange={(e) => handleChangeEdit("address.state", e.target.value)}
                                            />
                                        ) : (
                                            u.address?.state
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === u._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.address?.pinCode || ""}
                                                onChange={(e) => handleChangeEdit("address.pinCode", e.target.value)}
                                            />
                                        ) : (
                                            u.address?.pinCode
                                        )}
                                    </TableCell>
                                    <TableCell>{u.orders?.length || 0}</TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        {editRow === u._id ? (
                                            <Stack direction="row" spacing={1}>
                                                <Button variant="contained" color="success" size="small" onClick={handleSave}>
                                                    Save
                                                </Button>
                                                <Button variant="outlined" color="inherit" size="small" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(u)}>
                                                Edit
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30]}
                sx={{
                    color: "#fff",
                    "& .MuiSelect-icon": { color: "#fff" },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { color: "#fff" },
                }}
            />
        </div>
    );
}

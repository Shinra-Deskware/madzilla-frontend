import React, { useEffect, useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, TextField, TablePagination, Button, Stack,
    Select, MenuItem
} from "@mui/material";
import http from "../api/http";
import "./Styles/AdminOrders.css";
import {
    ORDER_STATUS,
    PAYMENT_STATUS,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS
} from "../Constants/constants";


const paymentOptions = Object.keys(PAYMENT_STATUS).map(k => ({
    value: PAYMENT_STATUS[k],
    label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS[k]]
}));

const deliverySteps = Object.keys(ORDER_STATUS).map(k => ({
    value: ORDER_STATUS[k],
    label: ORDER_STATUS_LABELS[ORDER_STATUS[k]]
}));

const formatPaymentStatus = (status) =>
    PAYMENT_STATUS_LABELS[status] || status;

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        orderId: "",
        trackingId: "",
        fullName: "",
        phoneNumber: "",
        total: "",
        paymentStatus: "",
        status: "",
        createdAt: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editRow, setEditRow] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await http.get("/api/admin/orders");
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error("Fetch orders failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleFilter = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(0);
    };

    const handleEdit = (order) => {
        setEditRow(order._id);
        setEditData(JSON.parse(JSON.stringify(order)));
    };

    const handleCancel = () => {
        setEditRow(null);
        setEditData({});
    };

    const handleSave = async () => {
        try {
            await http.put(`/api/admin/orders/${editData.orderId}`, editData);
            window.location.reload();
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleChangeEdit = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(o =>
            (o.orderId || "").toLowerCase().includes(filters.orderId.toLowerCase()) &&
            (o.trackingId || "").toLowerCase().includes(filters.trackingId.toLowerCase()) &&
            (o.address.fullName || "").toLowerCase().includes(filters.fullName.toLowerCase()) &&
            (o.phoneNumber || "").toLowerCase().includes(filters.phoneNumber.toLowerCase()) &&
            String(o.total).includes(filters.total) &&
            (o.status || "").toLowerCase().includes(filters.status.toLowerCase()) &&
            (o.paymentStatus || "").toLowerCase().includes(filters.paymentStatus.toLowerCase()) &&
            new Date(o.createdAt).toLocaleString().toLowerCase().includes(filters.createdAt.toLowerCase())
        );
    }, [orders, filters]);

    const paginatedOrders = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredOrders.slice(start, start + rowsPerPage);
    }, [filteredOrders, page, rowsPerPage]);

    if (loading)
        return (
            <div className="admin-orders-loading">
                <CircularProgress sx={{ color: "#fff" }} />
            </div>
        );

    return (
        <div className="admin-orders">
            <h2>📦 All Orders</h2>

            <TableContainer component={Paper} className="admin-orders-table">
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Track ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Total ₹</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Delivery</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>

                        <TableRow>
                            {["orderId", "trackingId", "fullName", "phoneNumber", "total", "paymentStatus", "status", "createdAt"].map(f => (
                                <TableCell key={f}>
                                    <TextField size="small" placeholder="Search..."
                                        value={filters[f]}
                                        onChange={e => handleFilter(f, e.target.value)}
                                        fullWidth />
                                </TableCell>
                            ))}
                            <TableCell />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedOrders.length === 0 ? (
                            <TableRow><TableCell colSpan={9} align="center">No records</TableCell></TableRow>
                        ) : (
                            paginatedOrders.map(o => (
                                <TableRow key={o._id}>
                                    <TableCell>{o.orderId}</TableCell>

                                    {/* Tracking */}
                                    <TableCell>
                                        {editRow === o._id ? (
                                            <TextField size="small"
                                                value={editData.trackingId || ""}
                                                onChange={e => handleChangeEdit("trackingId", e.target.value)}
                                            />
                                        ) : o.trackingId}
                                    </TableCell>

                                    {/* Name */}
                                    <TableCell>
                                        {editRow === o._id ? (
                                            <TextField size="small"
                                                value={editData.address.fullName}
                                                onChange={e =>
                                                    setEditData(prev => ({
                                                        ...prev,
                                                        address: { ...prev.address, fullName: e.target.value }
                                                    }))
                                                }
                                            />
                                        ) : o.address.fullName}
                                    </TableCell>

                                    {/* Phone */}
                                    <TableCell>{o.phoneNumber}</TableCell>

                                    {/* Total */}
                                    <TableCell>₹{o.total}</TableCell>

                                    {/* Payment Status */}
                                    <TableCell>
                                        {editRow === o._id ? (
                                            <Select size="small"
                                                value={editData.paymentStatus}
                                                onChange={e => handleChangeEdit("paymentStatus", e.target.value)}
                                            >
                                                <MenuItem value={editData.paymentStatus}>
                                                    {formatPaymentStatus(editData.paymentStatus)}
                                                </MenuItem>
                                            </Select>
                                        ) : formatPaymentStatus(o.paymentStatus)}
                                    </TableCell>

                                    {/* Delivery */}
                                    <TableCell>
                                        {editRow === o._id ? (
                                            <Select size="small"
                                                value={editData.status}
                                                onChange={e => handleChangeEdit("status", e.target.value)}
                                            >
                                                <MenuItem value={ORDER_STATUS.CANCELLED}>
                                                    {ORDER_STATUS_LABELS.CANCELLED}
                                                </MenuItem>

                                                {deliverySteps
                                                    .filter(opt => opt.value !== ORDER_STATUS.CANCELLED)
                                                    .map(opt => (
                                                        <MenuItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        ) : ORDER_STATUS_LABELS[o.status] || o.status}
                                    </TableCell>

                                    <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>

                                    <TableCell align="right">
                                        {editRow === o._id ? (
                                            <Stack spacing={1} direction="row">
                                                <Button variant="contained" size="small" onClick={handleSave}>Save</Button>
                                                <Button variant="outlined" size="small" onClick={handleCancel}>Cancel</Button>
                                            </Stack>
                                        ) : (
                                            <>
                                                <Button variant="outlined" size="small" onClick={() => handleEdit(o)}>
                                                    Edit
                                                </Button>

                                                {/* ✅ Refund Requested Buttons */}
                                                {o.paymentStatus === PAYMENT_STATUS.REFUND_REQUESTED && (
                                                    <Stack spacing={1} direction="row" sx={{ mt: 1 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={async () => {
                                                                await http.put(`/api/admin/orders/${o.orderId}/refund-approve`);
                                                                window.location.reload();
                                                            }}
                                                        >
                                                            Approve Refund
                                                        </Button>

                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={async () => {
                                                                const reason = prompt("Reason?");
                                                                await http.put(`/api/admin/orders/${o.orderId}/refund-reject`, { reason });
                                                                window.location.reload();
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Stack>
                                                )}

                                                {/* ✅ Final Refund Button */}
                                                {o.status === ORDER_STATUS.RETURN_RECEIVED &&
                                                    o.paymentStatus === PAYMENT_STATUS.REFUND_INITIATED && (
                                                        <Button sx={{ mt: 1 }}
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={async () => {
                                                                await http.put(`/api/admin/orders/${o.orderId}/refund`);
                                                                window.location.reload();
                                                            }}
                                                        >
                                                            Refund Customer
                                                        </Button>
                                                    )}
                                            </>
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
                count={filteredOrders.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
        </div>
    );
}

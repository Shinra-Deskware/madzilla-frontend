import React, { useEffect, useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, TextField, TablePagination, Button, Stack, Snackbar, Alert
} from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import http from "../api/http";
import "./Styles/AdminProducts.css";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        key: "", productId: "", title: "", stock: "", price: "", originalPrice: "", discount: "", rating: "", totalReviews: ""
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editRow, setEditRow] = useState(null);
    const [editData, setEditData] = useState({});
    const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await http.get("/api/sections/products");
                setProducts(res.data || []);
            } catch {
                setToast({ open: true, msg: "Failed to fetch products", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleFilter = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setPage(0);
    };

    const handleEdit = (p) => {
        setEditRow(p._id);
        setEditData({ ...p });
    };

    const handleCancel = () => {
        setEditRow(null);
        setEditData({});
    };

    const handleChangeEdit = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!editData.title?.trim()) {
            return setToast({ open: true, msg: "Title cannot be empty", type: "warning" });
        }

        if (!editData.productId?.trim()) {
            return setToast({ open: true, msg: "Product ID cannot be empty", type: "warning" });
        }
        const body = {
            ...editData,
            price: Number(editData.price),
            productId: String(editData.productId),
            originalPrice: Number(editData.originalPrice),
            discount: Number(editData.discount),
            rating: Number(editData.rating),
            totalReviews: Number(editData.totalReviews),
            stock: editData.stock === true || editData.stock === "true",
        };

        try {
            await http.put(`/api/admin/products/${editRow}`, body);
            setProducts((prev) => prev.map((p) => (p._id === editRow ? body : p)));
            setToast({ open: true, msg: "✅ Product updated", type: "success" });
            setEditRow(null);
        } catch {
            setToast({ open: true, msg: "❌ Update failed", type: "error" });
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            Object.keys(filters).every((key) =>
                !filters[key] || String(p[key]).toLowerCase().includes(filters[key].toLowerCase())
            )
        );
    }, [products, filters]);

    const paginatedProducts = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredProducts.slice(start, start + rowsPerPage);
    }, [filteredProducts, page, rowsPerPage]);

    if (loading) {
        return (
            <div className="admin-products-loading">
                <CircularProgress sx={{ color: "#fff" }} />
            </div>
        );
    }

    return (
        <div className="admin-products">
            <h2>🧸 All Products</h2>

            <TableContainer component={Paper} className="admin-products-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Original Price</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Total Reviews</TableCell>
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
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No matching products
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProducts.map((p) => (
                                <TableRow key={p._id}>
                                    <TableCell>{p.key}</TableCell>

                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.productId}
                                                onChange={(e) => handleChangeEdit("productId", e.target.value)}
                                            />
                                        ) : p.productId}
                                    </TableCell>

                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.title}
                                                onChange={(e) => handleChangeEdit("title", e.target.value)}
                                            />
                                        ) : p.title}
                                    </TableCell>

                                    <TableCell>
                                        {editRow === p._id ? (
                                            <Select
                                                size="small"
                                                value={editData.stock}
                                                onChange={(e) => handleChangeEdit("stock", e.target.value)}
                                            >
                                                <MenuItem value={true}>In Stock</MenuItem>
                                                <MenuItem value={false}>Out of Stock</MenuItem>
                                            </Select>
                                        ) : p.stock ? "In Stock" : "Out of Stock"}
                                    </TableCell>

                                    {["price", "originalPrice", "discount", "rating", "totalReviews"].map((field) => (
                                        <TableCell key={field}>
                                            {editRow === p._id ? (
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={editData[field]}
                                                    onChange={(e) => handleChangeEdit(field, e.target.value)}
                                                />
                                            ) : p[field]}
                                        </TableCell>
                                    ))}

                                    <TableCell align="right">
                                        {editRow === p._id ? (
                                            <Stack direction="row" spacing={1}>
                                                <Button variant="contained" color="success" size="small" onClick={handleSave}>
                                                    Save
                                                </Button>
                                                <Button variant="outlined" size="small" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(p)}>
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
                count={filteredProducts.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(0);
                }}
                rowsPerPageOptions={[10, 20, 30]}
                sx={{ color: "#fff" }}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast((p) => ({ ...p, open: false }))}
            >
                <Alert severity={toast.type}>{toast.msg}</Alert>
            </Snackbar>
        </div>
    );
}

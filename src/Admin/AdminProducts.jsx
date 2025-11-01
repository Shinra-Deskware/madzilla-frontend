import React, { useEffect, useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, TextField, TablePagination, Button, Stack
} from "@mui/material";
import http from "../api/http";
import "./Styles/AdminProducts.css";
import { Select, MenuItem } from "@mui/material";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        key: "", title: "", stock: "", price: "", originalPrice: "", discount: "", rating: "", totalReviews: ""
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editRow, setEditRow] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await http.get("/api/sections/products");
                setProducts(res.data || []);
            } catch (err) {
                console.error("Fetch products failed:", err);
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

    const handleSave = async () => {
        try {
            await http.put(`/api/admin/products/${editData._id}`, editData);
            setProducts((prev) => prev.map((p) => (p._id === editRow ? editData : p)));
            setEditRow(null);
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleChangeEdit = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            return (
                (!filters.key || String(p.key).toLowerCase().includes(filters.key.toLowerCase())) &&
                (!filters.title || String(p.title).toLowerCase().includes(filters.title.toLowerCase())) &&
                (!filters.stock || String(p.stock).toLowerCase().includes(filters.stock.toLowerCase())) &&
                (!filters.price || String(p.price).toLowerCase().includes(filters.price.toLowerCase())) &&
                (!filters.originalPrice || String(p.originalPrice).toLowerCase().includes(filters.originalPrice.toLowerCase())) &&
                (!filters.discount || String(p.discount).toLowerCase().includes(filters.discount.toLowerCase())) &&
                (!filters.rating || String(p.rating).toLowerCase().includes(filters.rating.toLowerCase())) &&
                (!filters.totalReviews || String(p.totalReviews).toLowerCase().includes(filters.totalReviews.toLowerCase()))
            );
        });
    }, [products, filters]);


    const paginatedProducts = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredProducts.slice(start, start + rowsPerPage);
    }, [filteredProducts, page, rowsPerPage]);

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    if (loading)
        return (
            <div className="admin-products-loading">
                <CircularProgress sx={{ color: "#fff" }} />
            </div>
        );

    return (
        <div className="admin-products">
            <h2>🧸 All Products</h2>
            <TableContainer component={Paper} className="admin-products-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
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
                                                value={editData.title || ""}
                                                onChange={(e) => handleChangeEdit("title", e.target.value)}
                                            />
                                        ) : (
                                            p.title
                                        )}
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
                                        ) : (
                                            p.stock ? "In Stock" : "Out of Stock"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.price || ""}
                                                onChange={(e) => handleChangeEdit("price", e.target.value)}
                                            />
                                        ) : (
                                            p.price
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.originalPrice || ""}
                                                onChange={(e) => handleChangeEdit("originalPrice", e.target.value)}
                                            />
                                        ) : (
                                            p.originalPrice
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.discount || ""}
                                                onChange={(e) => handleChangeEdit("discount", e.target.value)}
                                            />
                                        ) : (
                                            p.discount
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.rating || ""}
                                                onChange={(e) => handleChangeEdit("rating", e.target.value)}
                                            />
                                        ) : (
                                            p.rating
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRow === p._id ? (
                                            <TextField
                                                size="small"
                                                value={editData.totalReviews || ""}
                                                onChange={(e) => handleChangeEdit("totalReviews", e.target.value)}
                                            />
                                        ) : (
                                            p.totalReviews
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editRow === p._id ? (
                                            <Stack direction="row" spacing={1}>
                                                <Button variant="contained" color="success" size="small" onClick={handleSave}>
                                                    Save
                                                </Button>
                                                <Button variant="outlined" color="inherit" size="small" onClick={handleCancel}>
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

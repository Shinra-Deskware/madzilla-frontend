import {
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    LinearProgress,
    Dialog,
    SwipeableDrawer,
    IconButton,
    Snackbar,
    Alert
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";

export default function ReviewUploadModal({ open, onClose, mode }) {
    const isMobile = mode === "mobile";

    // State
    const [productId, setProductId] = useState("");
    const [productModel, setProductModel] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ open: false, type: "success", msg: "" });

    // Image Upload Handler
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 3) {
            setToast({ open: true, type: "error", msg: "Max 3 images allowed" });
            return;
        }

        for (let file of files) {
            const ext = file.name.split(".").pop().toLowerCase();
            if (!["jpg", "png", "webp"].includes(ext)) {
                setToast({ open: true, type: "error", msg: "Only JPG, PNG, WEBP allowed" });
                return;
            }
        }

        setImages([...images, ...files]);
    };

    // Video Upload Handler
    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > 30) {
            setToast({ open: true, type: "error", msg: "Video must be under 30MB" });
            return;
        }

        setVideo(file);
    };

    // Validation Logic
    const validateForm = () => {
        const newErrors = {};

        if (!productId.trim()) newErrors.productId = "Product ID is required";
        if (!productModel.trim()) newErrors.productModel = "Product model is required";

        if (reviewText.trim().length < 20)
            newErrors.reviewText = "Review must be at least 20 characters";

        if (images.length < 1) newErrors.images = "Upload at least 1 image";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = () => {
        const missing = [];

        if (!productId.trim()) missing.push("Product ID");
        if (!productModel.trim()) missing.push("Product Model");
        if (reviewText.trim().length < 20) missing.push("Review (min 20 chars)");
        if (images.length < 1) missing.push("At least 1 Image");

        // If missing fields exist
        if (missing.length > 0) {
            setToast({
                open: true,
                type: "error",
                msg: `Missing: ${missing.join(", ")}`
            });
            return;
        }

        // Success
        setToast({
            open: true,
            type: "success",
            msg: "Review submitted successfully!"
        });

        onClose();
    };

    // GLOBAL DARK MODE INPUT STYLE
    const whiteInput = {
        InputLabelProps: { style: { color: "white" } },
        inputProps: { style: { color: "white" } },
        FormHelperTextProps: { style: { color: "#ff4d4d" } },
        sx: { color: "white" }
    };

    const Content = (
        <Box sx={{ p: 2, width: isMobile ? "90%" : 450, mx: "auto", color: "white" }}>
            {/* Close for mobile */}
            <IconButton
                onClick={onClose}
                sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
            >
                <CloseRoundedIcon />
            </IconButton>

            {/* Product ID */}
            <TextField
                fullWidth
                label="Product ID"
                margin="normal"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                error={!!errors.productId}
                helperText={errors.productId}
                {...whiteInput}
            />

            {/* Product Model */}
            <Select
                fullWidth
                displayEmpty
                sx={{ mt: 2, color: "white" }}
                value={productModel}
                onChange={(e) => setProductModel(e.target.value)}
            >
                <MenuItem value="">Select Product Model</MenuItem>
                <MenuItem value="Classic">Classic</MenuItem>
                <MenuItem value="Bluetooth">Bluetooth</MenuItem>
                <MenuItem value="Humidifier">Humidifier</MenuItem>
            </Select>

            {errors.productModel && (
                <Typography sx={{ mt: 0.5, color: "#ff4d4d" }}>
                    {errors.productModel}
                </Typography>
            )}

            {/* Upload Section */}
            <Box
                sx={{
                    mt: 3,
                    p: 3,
                    border: "1px dashed #bbb",
                    borderRadius: 2,
                    textAlign: "center",
                    color: "white"
                }}
            >

                <div style={{ display: 'flex', alignItems: "center", width: '100%', justifyContent: "space-between" }}>
                    <Button variant="contained" component="label">
                        Upload Images
                        <input hidden type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    </Button>

                    <Button variant="contained" component="label">
                        Upload Video
                        <input hidden type="file" accept="video/*" onChange={handleVideoUpload} />
                    </Button>

                </div>
                {errors.images && (
                    <Typography sx={{ color: "#ff4d4d", mt: 1 }}>
                        {errors.images}
                    </Typography>
                )}
            </Box>

            {/* Preview Files */}
            {/* Preview Files */}
            <Box sx={{ mt: 3 }}>
                {images.map((img, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box sx={{ width: "80%" }}>
                            <Typography variant="body2" sx={{ color: "#00ff90" }}>
                                {img.name}
                            </Typography>
                            <LinearProgress variant="determinate" value={100} />
                        </Box>

                        <IconButton
                            sx={{ color: "red" }}
                            onClick={() => {
                                const updated = images.filter((_, i) => i !== idx);
                                setImages(updated);
                            }}
                        >
                            ✕
                        </IconButton>
                    </Box>
                ))}

                {video && (
                    <Box
                        sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box sx={{ width: "80%" }}>
                            <Typography variant="body2" sx={{ color: "#00ff90" }}>
                                {video.name}
                            </Typography>
                            <LinearProgress variant="determinate" value={100} />
                        </Box>

                        <IconButton sx={{ color: "red" }} onClick={() => setVideo(null)}>
                            ✕
                        </IconButton>
                    </Box>
                )}
            </Box>


            {/* Review Text */}
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Write your review"
                margin="normal"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                error={!!errors.reviewText}
                helperText={errors.reviewText}
                {...whiteInput}
            />

            {/* Submit */}
            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
            >
                Submit Review
            </Button>
        </Box>
    );

    return (
        <>
            {/* Desktop popup */}
            {!isMobile && (
                <Dialog
                    open={open}
                    onClose={onClose}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { background: "#000", color: "white", border: "2px solid white", borderRadius: '10px' } }}
                >
                    {Content}
                </Dialog>
            )}

            {/* Mobile bottom sheet */}
            {isMobile && (
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onOpen={() => { }}
                    onClose={onClose}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            maxHeight: "80vh",
                            overflowY: "auto",
                            background: "#000",
                            color: "white",
                            position: "absolute"
                        }
                    }}
                >
                    {Content}
                </SwipeableDrawer>
            )}

            {/* Toast */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity={toast.type}>{toast.msg}</Alert>
            </Snackbar>
        </>
    );
}

import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    IconButton,
    Fade,
    CircularProgress,
} from "@mui/material";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import * as Icons from "@mui/icons-material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";


import "./styles/productsPage.css";
import ProductAccordionSection from "../Common/ProductAccordionSection";
import http from "../api/http";
import { useUser } from "../context/UserContext"; // ✅ user context
import { productsData } from "../Constants/Data";
import ReviewUploadUI from "../Common/ReviewUploadUI";
import ReviewUploadModal from "../Common/ReviewUploadUI";

export default function ProductsPage() {
    const { user } = useUser(); // ✅ user._id available
    const [openReview, setOpenReview] = useState(false);

    const handleOpen = () => setOpenReview(true);
    const handleClose = () => setOpenReview(false);


    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [productIndex, setProductIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [cartCounts, setCartCounts] = useState({});
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [files, setFiles] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Responsive detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Fetch products
    useEffect(() => {
        setProducts(productsData);
        setLoading(false);
    }, []);
    // ✅ Always reload local cart from storage (latest version)
    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const counts = {};
        localCart.forEach((item) => (counts[item.key] = item.count));
        setCartCounts(counts);
    }, [products, productIndex]);
    // 🧩 On user login or page refresh, push local cart to DB (if logged in)
    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (user && user._id && localCart.length) {
            http.post(`/api/users/${user._id}/cart/save`, { cart: localCart });
        }
    }, [user, productIndex]);


    // ✅ Local cart helpers
    const getLocalCart = () => {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch {
            return [];
        }
    };

    const saveLocalCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cart-updated"));
    };

    // ✅ Add to cart (local only)
    // ✅ Add to cart (and broadcast change)
    const addToCart = (countToAdd = 1) => {
        const product = products[productIndex];
        if (!product?.key) return;

        const localCart = getLocalCart();
        const existing = localCart.find((item) => item.key === product.key);

        if (existing) {
            existing.count += countToAdd;
        } else {
            localCart.push({
                key: product.key,
                productId: product.productId,
                title: product.title,
                count: countToAdd,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
            });
        }

        saveLocalCart(localCart);
        setCartCounts((prev) => ({
            ...prev,
            [product.key]: (prev[product.key] || 0) + countToAdd,
        }));

        // ✅ Notify Sidebar instantly
        const totalItems = localCart.reduce((s, it) => s + (it.count || it.qty || 1), 0);
        const ev = new CustomEvent("cart-updated", { detail: { count: totalItems, items: localCart } });
        window.dispatchEvent(ev);
    };

    // ✅ Remove / decrease item count (and broadcast change)
    const removeFromCart = () => {
        const product = products[productIndex];
        if (!product?.key) return;

        const localCart = getLocalCart();
        const existing = localCart.find((item) => item.key === product.key);
        if (!existing) return;

        if (existing.count > 1) existing.count -= 1;
        else localCart.splice(localCart.indexOf(existing), 1);

        saveLocalCart(localCart);
        setCartCounts((prev) => ({
            ...prev,
            [product.key]: Math.max((prev[product.key] || 1) - 1, 0),
        }));

        // ✅ Notify Sidebar instantly
        const totalItems = localCart.reduce((s, it) => s + (it.count || it.qty || 1), 0);
        const ev = new CustomEvent("cart-updated", { detail: { count: totalItems, items: localCart } });
        window.dispatchEvent(ev);
    };


    // ============================
    // ⏳ Loading
    // ============================
    if (loading) return <CircularProgress sx={{ m: 4 }} />;
    if (!products.length)
        return <Typography sx={{ p: 3 }}>No products found.</Typography>;

    const product = products[productIndex];
    const images = product.images || [];

    const goPrev = () => {
        const prevIndex = (productIndex - 1 + products.length) % products.length;
        setProductIndex(prevIndex);
        setSelectedImage(0);
    };

    const goNext = () => {
        const nextIndex = (productIndex + 1) % products.length;
        setProductIndex(nextIndex);
        setSelectedImage(0);
    };

    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    const handleSubmit = (e) => {
        e.preventDefault();
        setReviewText("");
        setRating(0);
        setFiles([]);
    };

    // ============================
    // 📱 MOBILE VIEW
    // ============================
    if (isMobile) {
        return (
            <div className="product-page">
                <div className="product-body">
                    <div className="product-header">
                        <ArrowLeftIcon className="icon" onClick={goPrev} />
                        <div className="product-title">
                            <h2>{product.title}</h2>
                        </div>
                        <ArrowRightIcon className="icon" onClick={goNext} />
                    </div>

                    <div className="product-image-section">
                        {/* --- MOBILE MAIN IMAGE (YouTube support, same styling) --- */}
                        {(() => {
                            const img = images[selectedImage];
                            const isYouTube =
                                img.includes("youtube.com") || img.includes("youtu.be");

                            if (isYouTube) {
                                const match =
                                    img.match(/v=([^&]+)/) ||
                                    img.match(/shorts\/([^?]+)/) ||
                                    img.match(/youtu\.be\/([^?]+)/);

                                const videoId = match ? match[1] : "";

                                return (
                                    <iframe
                                        className="product-main-image"  // ⬅ SAME STYLE as image
                                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`}
                                        title="YouTube video"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        style={{
                                            border: "none",
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "#000",
                                            borderRadius: "12px",
                                        }}
                                    />
                                );
                            }

                            return (
                                <img
                                    src={`/productImages/${img}`}
                                    alt={img}
                                    loading="lazy"
                                    className="product-main-image"
                                />
                            );
                        })()}
                    </div>

                    <div className="thumbnail-row">
                        {images.map((img, index) => (
                            (() => {
                                const isYouTube =
                                    img.includes("youtube.com") || img.includes("youtu.be");

                                const thumbSrc = isYouTube
                                    ? "/assets/youtube.gif"
                                    : `/productImages/${img}`;

                                return (
                                    <img
                                        key={index}
                                        src={thumbSrc}
                                        alt={img}
                                        loading="lazy"
                                        onClick={() => setSelectedImage(index)}
                                        className={`thumb ${selectedImage === index ? "active" : ""}`}
                                    />
                                );
                            })()
                        ))}
                    </div>

                    <div className="page-product-info">
                        <h3 className="product-name">{product.title}</h3>
                        <div className="product-price-row">
                            <div className="price-left">
                                <span className="offer-price">₹{product.price}</span>
                                <span className="original-price">₹{product.originalPrice}</span>
                                <span className="offer-pill">{product.discount}% OFF</span>
                            </div>
                            <Box className="rating-badge">
                                <StarIcon className="rating-star" />
                                <Typography className="rating-text">
                                    {product.rating} ({product.totalReviews})
                                </Typography>
                                <VerifiedIcon className="assured-icon" />
                            </Box>
                        </div>
                        <div className="rating-stock-row">
                            <div className="delivery-row">
                                <LocalShippingIcon className="delivery-icon" />
                                <span>Free Delivery All Over India</span>
                            </div>
                            <div className="stock-badge">
                                <CheckCircleIcon className="stock-icon" />
                                <span>In Stock</span>
                            </div>
                        </div>
                    </div>

                    <Box className="tabs-section">
                        <Tabs
                            value={tabValue}
                            onChange={(e, v) => setTabValue(v)}
                            variant="fullWidth"
                        >
                            <Tab label="Description" />
                            <Tab label="Warranty" />
                        </Tabs>
                        <div className="tab-content">
                            {tabValue === 0 && (
                                <div className="feature-list">
                                    {product.features?.length > 0 ? (
                                        product.features.map((feature, i) => {
                                            const IconComponent = Icons[feature.icon];
                                            return (
                                                <div key={i} className="feature-line">
                                                    {IconComponent && (
                                                        <IconComponent color={feature.color} fontSize="medium" />
                                                    )}
                                                    <span>{feature.text}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>No features available.</p>
                                    )}
                                </div>
                            )}
                            {tabValue === 1 && (
                                <p>
                                    {product.warranty ||
                                        product.warrantyDetails ||
                                        "No warranty information."}
                                </p>
                            )}
                        </div>
                    </Box>

                    <ProductAccordionSection product={product} />

                    <Button variant="contained" onClick={handleOpen}>
                        Write a Review
                    </Button>
                    <ReviewUploadModal
                        open={openReview}
                        onClose={handleClose}
                        mode={isMobile ? "mobile" : "desktop"}
                    />
                </div>
                <footer className="bottom-sheet">
                    <div className="sheet-content">
                        {(cartCounts[product.key] || 0) === 0 ? (
                            <button
                                disabled={!product.stock}
                                className="add-cart-btn-big"
                                onClick={() => addToCart(1)}
                            >
                                {product.stock ? "Add to Cart" : "Unavailable"}
                            </button>
                        ) : (
                            <div className="qty-total-row">
                                <div className="qty-selector">
                                    <button className="qty-btn" onClick={() => removeFromCart()}>
                                        −
                                    </button>
                                    <span className="qty-count">
                                        {cartCounts[product.key] || 0}
                                    </span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => addToCart(1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="total-price">
                                    Total: <strong>₹{product.price}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        );
    }

    // ============================
    // 💻 DESKTOP VIEW
    // ============================
    return (
        <Box className="product-wrapper">
            <Box className="product-page-container">
                <Box className="side-arrow" onClick={goPrev}>
                    <div className="arrow-button">‹</div>
                </Box>

                {/* LEFT SECTION */}
                <Box className="left-section">
                    <Box className="image-row">

                        <Box className="left-thumbnails">
                            {images.map((img, idx) => {
                                const isYouTube = img.includes("youtube.com") || img.includes("youtu.be");
                                let videoId = "";

                                if (isYouTube) {
                                    const match =
                                        img.match(/v=([^&]+)/) ||
                                        img.match(/shorts\/([^?]+)/) ||
                                        img.match(/youtu\.be\/([^?]+)/);
                                    videoId = match ? match[1] : "";
                                }

                                const thumbnailSrc = isYouTube
                                    ? '/assets/youtube.gif'
                                    : `/productImages/${img}`;

                                return (
                                    <Box
                                        key={idx}
                                        className={`thumb-container ${selectedImage === idx ? "selected" : ""}`}
                                        onClick={() => setSelectedImage(idx)}
                                    >
                                        <img
                                            src={thumbnailSrc}
                                            alt={`thumb-${idx}`}
                                            loading="lazy"
                                            className="thumb-image"
                                            onError={(e) => (e.target.src = "/fallback-thumb.jpg")}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>

                        <Box className="main-image-box">
                            {(() => {
                                const selected = images[selectedImage];
                                const isYouTube =
                                    selected.includes("youtube.com") || selected.includes("youtu.be");

                                if (isYouTube) {
                                    const match =
                                        selected.match(/v=([^&]+)/) ||
                                        selected.match(/shorts\/([^?]+)/) ||
                                        selected.match(/youtu\.be\/([^?]+)/);
                                    const videoId = match ? match[1] : "";

                                    return (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1`}
                                            title="YouTube video"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{
                                                border: "none",
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "12px",
                                                backgroundColor: "#000",
                                            }}
                                            className="main-image"
                                        />
                                    );
                                }

                                return (
                                    <img
                                        src={`/productImages/${selected}`}
                                        alt={selected}
                                        loading="lazy"
                                        className="main-image"
                                    />
                                );
                            })()}
                        </Box>
                    </Box>
                    {(cartCounts[product.key] || 0) === 0 ? (
                        <Button
                            variant="contained"
                            onClick={() => addToCart(1)}
                            className="add-to-cart-btn"
                        >
                            Add to Cart
                        </Button>
                    ) : (
                        <Box className="cart-counter">
                            <IconButton onClick={() => removeFromCart()} className="counter-btn">
                                <RemoveIcon />
                            </IconButton>
                            <Typography className="cart-count-text">
                                {cartCounts[product.key] || 0}
                            </Typography>
                            <IconButton onClick={() => addToCart(1)} className="counter-btn">
                                <AddIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* RIGHT SECTION */}
                <Box className="right-section">
                    <Box className="title-row">
                        <Typography variant="h4" className="product-title">
                            {product.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Box className="rating-badge">
                                <StarIcon className="rating-star" />
                                <Typography className="rating-text">
                                    {product.rating}
                                </Typography>
                                <VerifiedIcon className="assured-icon" />
                            </Box>
                            <SpeedDial
                                ariaLabel="Share Product"
                                icon={<ShareIcon style={{ color: "#fff", fontSize: "20px" }} />}
                                direction="right"
                                FabProps={{
                                    size: "small",
                                    sx: {
                                        boxShadow: "none",
                                        background: "transparent",
                                        "&:hover": { background: "rgba(255,255,255,0.1)" }
                                    }
                                }}
                                sx={{
                                    '& .MuiSpeedDial-actions': {
                                        gap: "6px",
                                        paddingRight: "4px"
                                    }
                                }}
                            >
                                {/* Copy */}
                                <SpeedDialAction
                                    icon={<ContentCopyIcon style={{ fontSize: 18, color: "#fff" }} />}
                                    tooltipTitle="Copy Link"
                                    tooltipPlacement="top"
                                    sx={{ background: "#111", width: 32, height: 32 }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("Link copied!");
                                    }}
                                />

                                {/* WhatsApp */}
                                <SpeedDialAction
                                    icon={<WhatsAppIcon style={{ fontSize: 18, color: "#25D366" }} />}
                                    tooltipTitle="WhatsApp"
                                    tooltipPlacement="top"
                                    sx={{ background: "#111", width: 32, height: 32 }}
                                    onClick={() =>
                                        window.open(
                                            `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
                                            "_blank"
                                        )
                                    }
                                />

                                {/* Instagram */}
                                <SpeedDialAction
                                    icon={<InstagramIcon style={{ fontSize: 18, color: "#cd48cfff" }} />}
                                    tooltipTitle="Instagram"
                                    tooltipPlacement="top"
                                    sx={{ background: "#111", width: 32, height: 32 }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("Link copied (Instagram web doesn’t support direct share)");
                                    }}
                                />

                                {/* Twitter */}
                                <SpeedDialAction
                                    icon={<TwitterIcon style={{ fontSize: 18, color: "#1DA1F2" }} />}
                                    tooltipTitle="Twitter"
                                    tooltipPlacement="top"
                                    sx={{ background: "#111", width: 32, height: 32 }}
                                    onClick={() =>
                                        window.open(
                                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
                                            "_blank"
                                        )
                                    }
                                />

                                {/* Facebook */}
                                <SpeedDialAction
                                    icon={<FacebookIcon style={{ fontSize: 18, color: "#1877F2" }} />}
                                    tooltipTitle="Facebook"
                                    tooltipPlacement="top"
                                    sx={{ background: "#111", width: 32, height: 32 }}
                                    onClick={() =>
                                        window.open(
                                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                                            "_blank"
                                        )
                                    }
                                />
                            </SpeedDial>
                        </Box>
                    </Box>
                    <Box className="page-price-stock-row">
                        <Box className="page-price-block">
                            <Typography className="page-price-current">
                                ₹{product.price}
                            </Typography>
                            <Typography className="page-price-original">
                                ₹{product.originalPrice}
                            </Typography>
                            <Box className="page-price-discount-badge">
                                {product.discount}% OFF
                            </Box>
                        </Box>
                        <Box className="stock-row-inline">
                            <>
                                <CheckCircleIcon className="stock-icon in-stock" />
                                <Typography className="stock-text in-stock-text">
                                    In Stock
                                </Typography>
                            </>
                        </Box>
                    </Box>

                    <Box className="page-delivery-info">
                        <LocalShippingIcon className="delivery-icon" />
                        <Typography className="free-delivery-inline">
                            Free Delivery All Over India
                        </Typography>
                    </Box>

                    <Tabs
                        value={tabValue}
                        onChange={(e, val) => setTabValue(val)}
                        textColor="inherit"
                        indicatorColor="secondary"
                        className="tabs"
                    >
                        <Tab label="Info" />
                        <Tab label="Warranty" />
                    </Tabs>
                    {tabValue === 0 && (
                        <Fade in={true} timeout={500}>
                            <Box className="info-text-box">
                                {product.features?.length > 0 ? (
                                    product.features.map((feature, i) => {
                                        const IconComponent = Icons[feature.icon];
                                        return (
                                            <div key={i} className="feature-line">
                                                {IconComponent && <IconComponent />}
                                                <span>{feature.text}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <Typography>No features available.</Typography>
                                )}
                            </Box>
                        </Fade>
                    )}

                    {tabValue === 1 && (
                        <Fade in={true} timeout={500}>
                            <Typography className="tab-content">
                                {product.warranty ||
                                    product.warrantyDetails ||
                                    "No warranty information."}
                            </Typography>
                        </Fade>
                    )}
                </Box>

                <Box className="side-arrow" onClick={goNext}>
                    <div className="arrow-button">›</div>
                </Box>
            </Box>

            <Box className="description-section">
                <Typography variant="h5" className="section-heading">
                    ABOUT PRODUCT
                </Typography>
                {product.productDescription.map((item, i) => (
                    <Box key={i} className="desc-row">
                        <img
                            src={`/productImages/${item.image}`}
                            alt={item.image}
                            loading="lazy"
                            className="desc-img"
                        />
                        <Typography className="desc-text">{item.text}</Typography>
                    </Box>
                ))}
            </Box>

            <ProductAccordionSection product={product} />

            <Button variant="contained" onClick={handleOpen} style={{ marginBottom: '1rem' }}>
                Write a Review
            </Button>
            <ReviewUploadModal
                open={openReview}
                onClose={handleClose}
                mode={isMobile ? "mobile" : "desktop"}
            />
        </Box>
    );
}

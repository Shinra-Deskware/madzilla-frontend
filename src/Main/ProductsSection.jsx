import React, { useRef, useEffect, useState } from "react";
import {
    Box,
    Button,
    Tabs,
    Tab,
    Typography,
    Fade,
    IconButton,
    useMediaQuery,
    CircularProgress
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import GppGoodIcon from "@mui/icons-material/GppGood";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import * as Icons from "@mui/icons-material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import "./Styles/productsSection.css";
import { useNavigate } from "react-router-dom";
import http from "../api/http";

export default function ProductsSection() {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const isMobile = useMediaQuery("(max-width:768px)");

    // ✅ STATE
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [activeImages, setActiveImages] = useState([]);

    // ✅ Fetch products (instead of sampleProductsData)
    useEffect(() => {
        const load = async () => {
            try {
                const res = await http.get("/api/sections/products");
                setProducts(res.data || []);
                setActiveImages(res.data.map(() => 0));
                setSelectedImage(res.data[0]?.images?.[0] || null);
            } catch {
                setProducts([]);
            }
            setLoading(false);
        };
        load();
    }, []);

    // ✅ Scroll highlight for mobile
    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider) return;
        const center = slider.scrollLeft + slider.offsetWidth / 2;
        let best = 0, min = Infinity;

        products.forEach((_, index) => {
            const card = slider.children[index];
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(center - cardCenter);
            if (dist < min) {
                min = dist;
                best = index;
            }
        });

        setActiveIndex(best);
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        slider.addEventListener("scroll", handleScroll);
        return () => slider.removeEventListener("scroll", handleScroll);
    }, [products]);

    const handleThumbnailClick = (cardIndex, thumbIndex) => {
        setActiveImages(prev => {
            const arr = [...prev];
            arr[cardIndex] = thumbIndex;
            return arr;
        });
    };

    const goPrev = () => {
        setTabValue(0);
        const prev = (currentProductIndex - 1 + products.length) % products.length;
        setCurrentProductIndex(prev);
        setSelectedImage(products[prev].images[0]);
    };

    const goNext = () => {
        setTabValue(0);
        const next = (currentProductIndex + 1) % products.length;
        setCurrentProductIndex(next);
        setSelectedImage(products[next].images[0]);
    };

    const serviceIcons = {
        "UPI / Debit / Credit Cards Accepted": <PaymentIcon className="service-icon payment-icon" />,
        "2 Year Warranty": <GppGoodIcon className="service-icon warranty-icon" />,
        "7 Days Replacement": <AutorenewIcon className="service-icon replacement-icon" />
    };

    const currentProduct = products[currentProductIndex];

    return (
        <Box className="product-wrapper">

            {/* Title (desktop) */}
            {!isMobile && (
                <Typography variant="h3" className="product-section-title">
                    OUR PRODUCTS
                </Typography>
            )}

            {/* Loader */}
            {loading && (
                <Box sx={{ textAlign: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Empty */}
            {!loading && !products.length && (
                <Typography sx={{ textAlign: "center", p: 3 }}>
                    No products found.
                </Typography>
            )}

            {/* ======================== 📱 MOBILE VIEW ======================== */}
            {!loading && products.length > 0 && isMobile && (
                <>
                    <Typography variant="h3" className="product-section-mobile-title">
                        OUR PRODUCTS
                    </Typography>
                    <Box className="mobile-products-section-container">
                        <Box className="interest-slider" ref={sliderRef}>
                            {products.map((item, cardIndex) => (
                                <Box
                                    key={cardIndex}
                                    className={`interest-card ${activeIndex === cardIndex ? "active-card" : ""
                                        }`}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '10px' }}>
                                        <Typography className="section-product-name">
                                            {item.subTitle}
                                        </Typography>
                                        <div>
                                            <Box className="rating-badge">
                                                <StarIcon className="rating-star" />
                                                <Typography className="rating-text">
                                                    {item.rating} ({item.totalReviews})
                                                </Typography>
                                                <VerifiedIcon className="assured-icon" />
                                            </Box>
                                        </div>

                                    </div>
                                    <Box className="interest-header">
                                        <img
                                            src={`/assets/${item.images[activeImages[cardIndex]]}`}
                                            loading="lazy"
                                            alt={item.title}
                                        />
                                    </Box>

                                    <Box className="thumbnail-row">
                                        {item.images.map((img, i) => (
                                            <Box
                                                key={i}
                                                className={`thumbnail ${activeImages[cardIndex] === i ? "active" : ""
                                                    }`}
                                                onClick={() => handleThumbnailClick(cardIndex, i)}
                                            >
                                                <img src={`/assets/${img}`} loading="lazy" alt="" />
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box className="product-info">
                                        <Box className="product-price-row">
                                            <Box className="price-left">
                                                <span className="offer-price">₹{item.price}</span>
                                                <span className="original-price">₹{item.originalPrice}</span>
                                                <span className="offer-pill">{item.discount}%</span>
                                            </Box>
                                        </Box>

                                        <Box className="rating-stock-row">
                                            <Box className="section-delivery-row">
                                                <LocalShippingIcon className="delivery-icon" />
                                                <span>Free Delivery All Over India</span>
                                            </Box>
                                        </Box>

                                        <Box className="interest-footer">
                                            <button
                                                disabled={!item.stock}
                                                onClick={() => navigate("/dashboard/products")}
                                            >
                                                {item.stock ? "SHOP NOW" : "Unavailable"}
                                            </button>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}

            {/* ======================== 🖥 DESKTOP VIEW ======================== */}
            {!loading && products.length > 0 && !isMobile && currentProduct && (
                <Box className="product-section-container">
                    {/* Left Section */}
                    <Box className="section-left-section">
                        <Box className="side-arrow" onClick={goPrev}>
                            <div className="arrow-button">‹</div>
                        </Box>
                        <div className="left-side-shop-now">
                            <Box className="section-image-row">
                                <Box className="left-thumbnails">
                                    {currentProduct.images.map((img, idx) => (
                                        <Box
                                            key={idx}
                                            component="img"
                                            src={`/assets/${img}`}
                                            loading="lazy"
                                            alt={`thumb-${idx}`}
                                            className={`thumb-image ${selectedImage === img ? "selected" : ""
                                                }`}
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    ))}
                                </Box>
                                <Box className="section-main-image-box">
                                    <Box
                                        component="img"
                                        src={`/assets/${selectedImage}`}
                                        loading="lazy"
                                        alt="product"
                                        className="section-main-image"
                                    />
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => navigate("/dashboard/products")}
                                className="add-to-cart-btn"
                            >
                                SHOP NOW
                            </Button>
                        </div>
                    </Box>

                    {/* Right Section */}
                    <Box className="products-right-section">
                        <div>
                            <Box className="title-row">
                                <Typography variant="h4" className="product-title">
                                    {currentProduct.title}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Box className="rating-badge">
                                        <StarIcon className="rating-star" />
                                        <Typography className="rating-text">
                                            {currentProduct.rating} ({currentProduct.totalReviews})
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

                            <Box className="section-price-stock-row">
                                <Box className="section-price-block">
                                    <Typography className="section-price-current">
                                        ₹{currentProduct.price}
                                    </Typography>
                                    <Typography className="section-price-original">
                                        ₹{currentProduct.originalPrice}
                                    </Typography>
                                    <Box className="section-price-discount-badge">
                                        {currentProduct.discount}%
                                    </Box>
                                </Box>

                                <Box className="stock-row-inline">
                                    {currentProduct.stock ? (
                                        <>
                                            <CheckCircleIcon className="stock-icon in-stock" />
                                            <Typography className="stock-text in-stock-text">
                                                In Stock
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <CancelIcon className="stock-icon out-stock" />
                                            <Typography className="stock-text out-stock-text">
                                                Out of Stock
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>

                            <Box className="section-delivery-info">
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

                            <Box>
                                <Fade in={tabValue === 0} timeout={500} unmountOnExit>
                                    <Box className="info-text-box">
                                        <div className="info-text">{currentProduct.description}</div>
                                        <Box className="info-grid">
                                            <Box className="info-column">
                                                <Typography className="section-title">Highlights</Typography>
                                                {currentProduct.features.map((feature, i) => {
                                                    const IconComponent = Icons[feature.icon];
                                                    return (
                                                        <div className="feature-line" key={i}>
                                                            <IconComponent />
                                                            {feature.text}
                                                        </div>
                                                    );
                                                })}
                                            </Box>
                                            <Box className="info-column">
                                                <Typography className="section-title">Services</Typography>
                                                {currentProduct.services.map((s, i) => (
                                                    <div className="service-line" key={`service-${i}`}>
                                                        {serviceIcons[s]}
                                                        <span className="service-text">{s}</span>
                                                    </div>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Fade>

                                <Fade in={tabValue === 1} timeout={500} unmountOnExit>
                                    <Typography className="tab-content">
                                        {currentProduct.warrantyDetails || currentProduct.warranty}
                                    </Typography>
                                </Fade>
                            </Box>
                        </div>

                        <Box className="side-arrow" onClick={goNext}>
                            <div className="arrow-button">›</div>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

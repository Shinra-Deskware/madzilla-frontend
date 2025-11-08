import React, { useRef, useEffect, useState } from "react";
import {
    Box,
    Button,
    Tabs,
    Tab,
    Typography,
    Fade,
    useMediaQuery,
    CircularProgress
} from "@mui/material";
import {
    Payment,
    GppGood,
    Autorenew,
    Replay,
    LocalShipping,
    SupportAgent,
    FactCheck,
    BuildCircle,
    DoNotDisturbAlt
} from "@mui/icons-material";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import * as Icons from "@mui/icons-material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WarningAmber from "@mui/icons-material/WarningAmber";
import PowerOff from "@mui/icons-material/PowerOff";
import Build from "@mui/icons-material/Build";
import WaterDrop from "@mui/icons-material/WaterDrop";
import Cable from "@mui/icons-material/Cable";
import BluetoothDisabled from "@mui/icons-material/BluetoothDisabled";
import SystemSecurityUpdateWarning from "@mui/icons-material/SystemSecurityUpdateWarning";
import CleanHands from "@mui/icons-material/CleanHands";
import DeleteForever from "@mui/icons-material/DeleteForever";
import FireExtinguisher from "@mui/icons-material/FireExtinguisher";

import "./Styles/productsSection.css";
import { useNavigate } from "react-router-dom";
import { productsData, services, warnings, warrantyClaim } from "../Constants/Data";

export default function ProductsSection() {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const isMobile = useMediaQuery("(max-width:768px)");
    const icons = {
        Payment,
        GppGood,
        Autorenew,
        Replay,
        LocalShipping,
        SupportAgent,
        FactCheck,
        BuildCircle,
        DoNotDisturbAlt,
        WarningAmber,
        PowerOff,
        Build,
        WaterDrop,
        Cable,
        BluetoothDisabled,
        SystemSecurityUpdateWarning,
        CleanHands,
        DeleteForever,
        FireExtinguisher
    };
    // ✅ STATE
    const [products, setProducts] = useState(productsData);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [activeImages, setActiveImages] = useState([]);

    // ✅ Fetch products (instead of sampleProductsData)
    useEffect(() => {
        setProducts(productsData)
        setActiveImages(productsData.map(() => 0));
        setSelectedImage(productsData[0]?.images?.[0] || null);
        setLoading(false);
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

    const currentProduct = products[currentProductIndex];

    return (
        <Box className="productsection-wrapper">

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
                                startIcon={<ArrowOutwardIcon />}
                                onClick={() => navigate("/dashboard/products")}
                                className="add-to-cart-btn"
                            >
                                SHOP NOW
                            </Button>
                        </div>
                    </Box>

                    {/* Right Section */}
                    <Box className="products-right-section">
                        <div className="child">
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
                                        {/* Copy Link */}
                                        <SpeedDialAction
                                            icon={<ContentCopyIcon style={{ fontSize: 18, color: "#fff" }} />}
                                            tooltipTitle="Copy Link"
                                            tooltipPlacement="top"
                                            sx={{ background: "#111", width: 32, height: 32 }}
                                            onClick={() => navigator.clipboard.writeText("https://www.shinra-deskware.com/dashboard/products")}
                                        />

                                        {/* WhatsApp */}
                                        <SpeedDialAction
                                            icon={<WhatsAppIcon style={{ fontSize: 18, color: "#25D366" }} />}
                                            tooltipTitle="WhatsApp"
                                            tooltipPlacement="top"
                                            sx={{ background: "#111", width: 32, height: 32 }}
                                            onClick={() =>
                                                window.open(
                                                    `https://wa.me/919346407877?text=${encodeURIComponent("Hi, I’m interested in Madzilla Deskware")}`,
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
                                            onClick={() =>
                                                window.open("https://www.instagram.com/shinra_deskwares/", "_blank")
                                            }
                                        />

                                        {/* Facebook */}
                                        <SpeedDialAction
                                            icon={<FacebookIcon style={{ fontSize: 18, color: "#1877F2" }} />}
                                            tooltipTitle="Facebook"
                                            tooltipPlacement="top"
                                            sx={{ background: "#111", width: 32, height: 32 }}
                                            onClick={() =>
                                                window.open("https://www.facebook.com/profile.php?id=61583097886891", "_blank")
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
                                <Tab label="About" />
                                <Tab label="Warranty" />
                                <Tab label="Services" />
                                <Tab label="Precautions" />
                            </Tabs>

                            <Box>
                                {tabValue === 0 && <Fade in={true} timeout={500} unmountOnExit>
                                    <Box className="info-text-box">
                                        <div className="info-text">{currentProduct.description}</div>
                                        <Box className="info-grid">
                                            <Box className="info-column">
                                                {currentProduct.features.map((feature, i) => {
                                                    const IconComponent = Icons[feature.icon];
                                                    return (
                                                        <div className="feature-line" key={i}>
                                                            <IconComponent color={feature.color} fontSize="medium" />
                                                            {feature.text}
                                                        </div>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Fade>}

                                {tabValue === 1 && <Fade in={true} timeout={500} unmountOnExit>
                                    <Typography className="tab-content">
                                        <Box className="info-column">
                                            {warrantyClaim.map((item, index) => {
                                                const IconComponent = icons[item.icon];
                                                return (
                                                    <Box key={index} className="feature-line" display="flex" alignItems="center" gap={1}>
                                                        <IconComponent color={item.color} fontSize="medium" />
                                                        <Typography variant="body2">{item.text}</Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Typography>
                                </Fade>}

                                {tabValue === 2 && <Fade in={true} timeout={500} unmountOnExit>
                                    <Typography className="tab-content">
                                        <Box className="info-column">
                                            {services.map((service, index) => {
                                                const IconComponent = icons[service.icon];
                                                return (
                                                    <Box key={index} className="feature-line" display="flex" alignItems="center" gap={1}>
                                                        <IconComponent color={service.color} fontSize="medium" />
                                                        <Typography variant="body2">{service.text}</Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Typography>
                                </Fade>}
                                {tabValue === 3 && <Fade in={true} timeout={500} unmountOnExit>
                                    <Typography className="tab-content">
                                        <Box className="info-column">
                                            {warnings.map((service, index) => {
                                                const IconComponent = icons[service.icon];
                                                return (
                                                    <Box key={index} className="feature-line" display="flex" alignItems="center" gap={1}>
                                                        <IconComponent color={service.color} fontSize="medium" />
                                                        <Typography variant="body2">{service.text}</Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Typography>
                                </Fade>}
                            </Box>
                        </div>

                        <Box className="side-arrow margin-left-side-arrow" onClick={goNext}>
                            <div className="arrow-button">›</div>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

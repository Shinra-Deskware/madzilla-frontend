import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import http from "../api/http";

export default function ProductAccordionSection({ product }) {
    const [reviewData, setReviewData] = useState([]);
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const res = await http.get("/api/sections/reviews");
                setReviewData(res.data || []);
            } catch {
                setReviewData([]);
            }
        };
        loadReviews();
    }, []);
    const renderStars = (r) => {
        const full = Math.floor(r);
        const half = r % 1 >= 0.5;
        return (
            <>
                {"★".repeat(full)}
                {half ? "☆" : ""}
                {"☆".repeat(5 - full - (half ? 1 : 0))}
            </>
        );
    };
    return (
        <Box className="accordion-section">
            {/* 1. Warranty & Safety */}
            <Accordion className="accordion-box">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="accordion-title">Warranty & Safety</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Warranty
                    </Typography>
                    <Typography>{product.warrantyDetails}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Safety & Warnings
                    </Typography>
                    {product.warnings.map((w, i) => (
                        <Box key={i} className="warning-line">
                            <WarningAmberIcon className="warning-icon" />
                            <Typography>{w}</Typography>
                        </Box>
                    ))}

                    <Typography className="disclaimer-text">
                        {product.legalDisclaimer}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* 2. Box, Power & App Info */}
            <Accordion className="accordion-box">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="accordion-title">Box, Power & App Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1">What's in the Box</Typography>
                    {product.whatsInTheBox.map((item, i) => (
                        <Typography key={i}>• {item}</Typography>
                    ))}

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Power Specs</Typography>
                    <Typography>Voltage: {product.powerSpecs.voltage}</Typography>
                    <Typography>Current: {product.powerSpecs.current}</Typography>
                    <Typography>Connector: {product.powerSpecs.connector}</Typography>
                    <Typography>Max Power: {product.powerSpecs.powerConsumption}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>App Info</Typography>
                    <Typography>App: {product.appInfo.name}</Typography>
                    <Typography>iOS: {product.appInfo.ios}</Typography>
                    <Typography>Android: {product.appInfo.android}</Typography>
                    <Typography>Pairing: {product.appInfo.pairing}</Typography>
                </AccordionDetails>
            </Accordion>

            {/* 3. Returns & Age */}
            <Accordion className="accordion-box">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="accordion-title">Returns & Age Guidelines</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1">Return Policy</Typography>
                    <Typography>{product.returnPolicy}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Age Restriction</Typography>
                    <Typography>{product.ageRestriction}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Care Instructions</Typography>
                    {product.careInstructions.map((item, i) => (
                        <Typography key={i}>• {item}</Typography>
                    ))}
                </AccordionDetails>
            </Accordion>

            {/* 4. Certifications */}
            <Accordion className="accordion-box">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="accordion-title">Certifications & Labels</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{product.certificationInfo}</Typography>
                </AccordionDetails>
            </Accordion>

            {/* 5. Reviews */}
            <Accordion className="accordion-box">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="accordion-title">Customer Reviews</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="review-list">
                        {reviewData.map((item, index) => (
                            <div className="review-card" key={index}>
                                <div className="media-wrapper">
                                    <iframe
                                        src={(function () {
                                            let videoId = "";
                                            const match =
                                                item.url.match(/v=([^&]+)/) || item.url.match(/shorts\/([^?]+)/);
                                            if (match) videoId = match[1];
                                            return `https://www.youtube.com/embed/${videoId}?rel=0`;
                                        })()}
                                        title="YouTube video"
                                        style={{ border: "none" }}
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="review-video"
                                    />
                                </div>
                                <div className="review-content">
                                    <div className="review-message">{item.message}</div>
                                    <div className="review-footer">
                                        <div className="username">{item.username}</div>
                                        <div className="rating">{renderStars(item.rating)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function ProductAccordionSection({ product }) {
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
                    {product.reviews.map((rev, i) => (
                        <Box key={i} className="review-card">
                            <Box className="review-header">
                                <Typography className="review-user">
                                    ⭐ {rev.user} ({rev.rating}★)
                                    <VerifiedIcon
                                        sx={{ fontSize: "1rem", color: "#00e676", ml: 1 }}
                                    />
                                </Typography>
                            </Box>
                            <Typography className="review-text">{rev.comment}</Typography>
                            {rev.images.length > 0 && (
                                <Box className="review-images">
                                    {rev.images.map((img, j) => (
                                        <img key={j}
                                            src={`/assets/${img}`} alt={img} className="review-img" />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

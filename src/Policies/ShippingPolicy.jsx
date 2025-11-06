import React from "react";
import { Box, Typography, Divider, useMediaQuery } from "@mui/material";

export function Content() {
    return (
        <>
            {/* 1. Overview */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    1. Overview
                </Typography>
                <Typography variant="body2">
                    This Shipping Policy describes how <strong>Shinra Studios</strong> (“we,” “our,” or “us”) handles
                    order processing, dispatch, and delivery for all Madzilla products
                    purchased through <strong>shinra-deskware.com</strong> or authorized channels.
                </Typography>
            </Box>

            {/* 2. Order Processing */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    2. Order Processing Time
                </Typography>
                <Typography variant="body2">
                    Orders are processed within <strong>24–48 hours</strong> of successful payment confirmation.
                    Orders placed on weekends or public holidays are processed the next working day.
                    Once processed, you’ll receive a confirmation email with tracking details.
                </Typography>
            </Box>

            {/* 3. Delivery Time */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    3. Delivery Time
                </Typography>
                <Typography variant="body2">
                    Typical delivery time within India is <strong>5–7 business days</strong> from the date of dispatch.
                    Remote or rural areas may take an additional 2–3 days depending on courier coverage.
                </Typography>
            </Box>

            {/* 4. Shipping Partners */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    4. Shipping Partners
                </Typography>
                <Typography variant="body2">
                    We work with trusted logistics partners including Delhivery, DTDC, BlueDart,
                    and India Post for domestic orders. International deliveries are managed through
                    reputed global couriers. Once shipped, tracking details are shared via email or WhatsApp.
                </Typography>
            </Box>

            {/* 5. Shipping Charges */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    5. Shipping Charges
                </Typography>
                <Typography variant="body2">
                    <strong>Free shipping</strong> is available for prepaid orders within India.
                    Cash on Delivery (COD) orders and international shipments may attract additional service or handling fees,
                    which are displayed at checkout.
                </Typography>
            </Box>

            {/* 6. Address Accuracy */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    6. Address Accuracy & Failed Deliveries
                </Typography>
                <Typography variant="body2">
                    Customers are responsible for providing a complete and accurate delivery address.
                    We are not liable for delays or non-delivery due to incorrect, incomplete, or
                    unresponsive contact details. In case of failed delivery attempts due to customer unavailability,
                    re-delivery or reshipment costs may apply.
                </Typography>
            </Box>

            {/* 7. Delays & Force Majeure */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    7. Delivery Delays & Force Majeure
                </Typography>
                <Typography variant="body2">
                    Delivery timelines are estimates and may vary due to weather conditions, customs delays,
                    courier network issues, or unforeseen circumstances beyond our control. Shinra Studios shall
                    not be held responsible for delays caused by such external factors.
                </Typography>
            </Box>

            {/* 8. Damaged or Lost Parcels */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    8. Damaged or Lost Parcels
                </Typography>
                <Typography variant="body2">
                    In the rare event of damage or loss during transit, please notify us within{" "}
                    <strong>48 hours</strong> of receiving the package (or expected delivery date for lost shipments).
                    Provide clear photos or unboxing videos for verification. Once validated, we will arrange
                    a replacement or refund as per our Return & Refund Policy.
                </Typography>
            </Box>

            {/* 9. International Shipping & Customs */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    9. International Shipping & Customs
                </Typography>
                <Typography variant="body2">
                    International orders may be subject to customs duties, import taxes, or fees imposed
                    by the destination country. Such charges are the responsibility of the recipient.
                    Customs clearance delays are beyond our control. We recommend contacting your local customs office
                    for details before placing an international order.
                </Typography>
            </Box>

            {/* 10. Return Shipping Responsibility */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    10. Return Shipping Responsibility
                </Typography>
                <Typography variant="body2">
                    For defective or incorrect products, Shinra Studios covers return shipping.
                    For voluntary returns (non-defective), the customer bears the return shipping cost.
                    Please refer to our{" "}
                    <a
                        href="/dashboard/returnrefundpolicy"
                        className="policy-link"
                    >
                        Return & Refund Policy
                    </a>{" "}
                    for detailed instructions.
                </Typography>
            </Box>

            {/* 11. Liability Limitation */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    11. Limitation of Liability
                </Typography>
                <Typography variant="body2">
                    Shinra Studios is not liable for indirect or consequential losses arising from delayed delivery,
                    address errors, courier negligence, or events beyond our control. Our maximum liability
                    is limited to the order value of the affected product.
                </Typography>
            </Box>

            {/* 12. Policy Updates */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    12. Policy Updates
                </Typography>
                <Typography variant="body2">
                    We reserve the right to modify this Shipping Policy at any time.
                    The latest version will always be available on{" "}
                    <a
                        href="https://www.shinra-deskware.com/policies/shippingpolicy"
                        className="policy-link"
                    >
                        our official website
                    </a>
                    . Updates are effective immediately upon publication.
                </Typography>
            </Box>

            {/* 13. Contact */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    13. Contact & Support
                </Typography>
                <Typography variant="body2">
                    For any questions or concerns about shipping, please contact:
                    <br />
                    📧 Email:{" "}
                    <a href="mailto:support@shinrastudios.com" className="policy-link">
                        support@shinrastudios.com
                    </a>
                    <br />
                    💬 WhatsApp:{" "}
                    <a href="https://wa.me/916303666387" className="policy-link">
                        +91 6303666387
                    </a>
                    <br />
                    📍 Address: HMT Swarnapuri Colony, Hyderabad – 500050, India
                </Typography>
            </Box>
        </>
    );
}

export default function ShippingPolicyPage() {
    const isMobile = useMediaQuery("(max-width:768px)");
    return (
        <Box
            className="policy-container"
            sx={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: isMobile ? "1.5rem 1rem" : "3rem 2rem",
                lineHeight: 1.7,
            }}
        >
            <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="bold"
                gutterBottom
                textAlign="center"
            >
                Shipping Policy
            </Typography>

            <Typography
                variant="body1"
                textAlign="center"
                mb={3}
            >
                We strive to deliver your Madzilla safely and on time. Please review
                our detailed shipping policy to understand processing times, delivery
                expectations, and responsibilities.
            </Typography>

            <Divider sx={{ mb: 2 }} />
            <Content />
            <Divider sx={{ my: 3 }} />

            <Typography
                variant="body2"
                textAlign="center"
                fontStyle="italic"
            >
                © {new Date().getFullYear()} Shinra Studios · All rights reserved.
            </Typography>
        </Box>
    );
}

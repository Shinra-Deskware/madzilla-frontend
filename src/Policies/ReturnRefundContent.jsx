import React from "react";
import { Box, Typography } from "@mui/material";

export default function ReturnRefundContent() {
    return (
        <>
            {/* Section 1 - Eligibility */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    1. Eligibility for Returns
                </Typography>
                <Typography variant="body2">
                    Returns are accepted within <strong>7 days of delivery</strong> for
                    items that are defective, damaged, or incorrect. Products must be
                    unused, in original packaging, and include all accessories.
                </Typography>
            </Box>

            {/* Section 2 - Non-Returnable Items */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    2. Non-Returnable Items
                </Typography>
                <Typography variant="body2">
                    The following items cannot be returned or refunded:
                </Typography>
                <ul className="policy-list">
                    <li>Customized or special edition Madzilla models</li>
                    <li>Products damaged due to misuse, water, or modifications</li>
                    <li>Items purchased under clearance or promotional offers</li>
                    <li>Gift cards or digital downloads</li>
                </ul>
            </Box>

            {/* Section 3 - Return Process */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    3. How to Initiate a Return
                </Typography>
                <Typography variant="body2">
                    Contact us within 7 days of delivery via:
                </Typography>
                <ul className="policy-list">
                    <li>
                        Email:{" "}
                        <a href="mailto:support@shinrastudios.com" className="policy-link">
                            support@shinrastudios.com
                        </a>
                    </li>
                    <li>
                        WhatsApp:{" "}
                        <a href="https://wa.me/916303666387" className="policy-link">
                            +91 6303666387
                        </a>
                    </li>
                </ul>
                <Typography variant="body2">
                    Include your order ID, product name, and a brief issue description.
                    Our team will guide you through return pickup or drop-off steps.
                </Typography>
            </Box>

            {/* Section 4 - Refund Process */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    4. Refund Process
                </Typography>
                <Typography variant="body2">
                    After receiving and inspecting your return, we’ll notify you by email
                    or WhatsApp. Approved refunds are processed within{" "}
                    <strong>5–7 business days</strong> to your original payment method.
                    Depending on your bank, it may take 3–5 additional days for the
                    amount to appear in your account.
                </Typography>
            </Box>

            {/* Section 5 - Replacements */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    5. Replacements & Exchanges
                </Typography>
                <Typography variant="body2">
                    Damaged or defective products can be replaced at no additional cost.
                    If the same product is unavailable, a full refund will be issued.
                </Typography>
            </Box>

            {/* Section 6 - Shipping Responsibility */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    6. Shipping Responsibility
                </Typography>
                <Typography variant="body2">
                    For verified defective or incorrect items, Shinra Studios covers
                    return shipping costs. For voluntary returns, customers are
                    responsible for return shipping fees.
                </Typography>
            </Box>

            {/* Section 7 - Late or Missing Refunds */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    7. Late or Missing Refunds
                </Typography>
                <Typography variant="body2">
                    If your refund hasn’t appeared after 7 business days:
                </Typography>
                <ul className="policy-list">
                    <li>Check your bank account again after 2–3 days.</li>
                    <li>Contact your bank or credit card provider.</li>
                    <li>
                        If still unresolved, contact us at{" "}
                        <a href="mailto:support@shinrastudios.com" className="policy-link">
                            support@shinrastudios.com
                        </a>
                        .
                    </li>
                </ul>
            </Box>

            {/* Section 8 - Contact */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    8. Customer Support
                </Typography>
                <Typography variant="body2">
                    For questions about returns or refunds, reach us anytime:
                </Typography>
                <ul className="policy-list">
                    <li>Email: support@shinrastudios.com</li>
                    <li>WhatsApp: +91 6303666387</li>
                    <li>Instagram / Facebook: @MadzillaOfficial</li>
                </ul>
            </Box>
        </>
    );
}

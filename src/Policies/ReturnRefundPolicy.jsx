// /src/pages/ReturnRefundPolicy.jsx
import React from "react";
import { Box, Typography, Divider, useMediaQuery } from "@mui/material";

export function Content() {
    return (
        <>
            {/* 1. Eligibility */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    1. Eligibility for Returns
                </Typography>
                <Typography variant="body2" >
                    Returns are accepted within <strong>7 days of delivery</strong> for items that are
                    defective, damaged, or incorrect. Products must be unused, in their
                    original packaging, and include all accessories and documentation.
                    We may request photos or video proof before authorizing a return.
                </Typography>
            </Box>

            {/* 2. Non-Returnable */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    2. Non-Returnable Items
                </Typography>
                <Typography variant="body2" >
                    The following are <strong>not eligible</strong> for return or refund:
                </Typography>
                <ul className="policy-list">
                    <li>Customized, limited, or special-edition Madzilla units</li>
                    <li>Items showing signs of misuse, alteration, or physical damage</li>
                    <li>Products exposed to liquid or electrical modification</li>
                    <li>Items sold under clearance, promotional, or bundle offers</li>
                </ul>
            </Box>

            {/* 3. Return Process */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    3. Return Procedure
                </Typography>
                <Typography variant="body2" >
                    Contact our team within 7 days of delivery at{" "}
                    <a href="mailto:support@shinra-deskware.com" className="policy-link">
                        support@shinra-deskware.com
                    </a>{" "}
                    or WhatsApp{" "}
                    <a href="https://wa.me/9193464 07877" className="policy-link">
                        +91 93464 07877
                    </a>
                    . Provide your order ID, a brief issue description, and photos/videos
                    if applicable. Once approved, we will arrange pickup or share the
                    nearest drop-off instructions.
                </Typography>
            </Box>

            {/* 4. Inspection & Approval */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    4. Inspection & Approval
                </Typography>
                <Typography variant="body2" >
                    All returned items undergo quality inspection. Refund or replacement
                    approval is at the sole discretion of Shinra Studios after verifying
                    condition, authenticity, and reported issue. Products failing
                    inspection may be shipped back to the customer at their expense.
                </Typography>
            </Box>

            {/* 5. Refund Timeline */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    5. Refund Process & Timeline
                </Typography>
                <Typography variant="body2" >
                    Once a return is approved, refunds are processed within
                    <strong> 5–7 business days </strong> via the original payment method.
                    Bank or card processors may take an additional 3–5 days to credit the
                    amount. Refunds are issued only to the account used for purchase.
                </Typography>
            </Box>

            {/* 6. Replacements */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    6. Replacements & Exchanges
                </Typography>
                <Typography variant="body2" >
                    If the same product or variant is available, a free replacement will
                    be shipped once the returned item passes inspection. If unavailable,
                    a full refund will be provided. Replacement products carry the
                    remaining warranty period of the original item.
                </Typography>
            </Box>

            {/* 7. Shipping Responsibility */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    7. Shipping Responsibility
                </Typography>
                <Typography variant="body2" >
                    Shinra Studios covers return shipping for verified manufacturing
                    defects, wrong deliveries, or transit damage. For voluntary returns or
                    cases where inspection finds no fault, the customer bears shipping
                    costs. Please pack products securely; we are not responsible for
                    damage during return transit due to inadequate packaging.
                </Typography>
            </Box>

            {/* 8. Fraud & Abuse Prevention */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    8. Fraud & Abuse Prevention
                </Typography>
                <Typography variant="body2" >
                    To prevent abuse, repeated or excessive return requests may be
                    declined. Refunds will not be issued for claims determined to be
                    fraudulent, abusive, or inconsistent with product usage evidence.
                    Suspicious activities may be reported to payment gateways or relevant
                    authorities.
                </Typography>
            </Box>

            {/* 9. Late or Missing Refunds */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    9. Late or Missing Refunds
                </Typography>
                <Typography variant="body2" >
                    If your refund has not appeared after 7 business days, please check
                    with your bank or card provider first. If unresolved, contact us at{" "}
                    <a href="mailto:support@shinra-deskware.com" className="policy-link">
                        support@shinra-deskware.com
                    </a>{" "}
                    for assistance.
                </Typography>
            </Box>

            {/* 10. Limitation of Liability */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    10. Limitation of Liability
                </Typography>
                <Typography variant="body2" >
                    In no event shall Shinra Studios or its affiliates be liable for any
                    indirect, incidental, or consequential damages arising from product
                    use, shipping delays, or refund processing beyond the purchase value
                    of the product.
                </Typography>
            </Box>

            {/* 11. Policy Updates */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    11. Policy Changes
                </Typography>
                <Typography variant="body2" >
                    We reserve the right to update, modify, or replace any part of this
                    policy at any time without prior notice. The most current version will
                    always be available on{" "}
                    <a href="https://www.shinra-deskware.com/policies/returnpolicy" className="policy-link">
                        our official website
                    </a>
                    . Continued use of our services after updates constitutes acceptance of
                    those changes.
                </Typography>
            </Box>

            {/* 12. Customer Support */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    12. Customer Support
                </Typography>
                <Typography variant="body2" >
                    For any questions about this Return & Refund Policy, please contact:
                    <br />
                    📧 Email:{" "}
                    <a href="mailto:support@shinra-deskware.com" className="policy-link">
                        support@shinra-deskware.com
                    </a>
                    <br />
                    💬 WhatsApp:{" "}
                    <a href="https://wa.me/9193464 07877" className="policy-link">
                        +91 93464 07877
                    </a>
                    <br />
                    📍 Address: HMT Swarnapuri Colony, Hyderabad – 500050 (India)
                </Typography>
            </Box>
        </>
    );
}

export default function ReturnRefundPolicyPage() {
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
                Return & Refund Policy
            </Typography>

            <Typography
                variant="body1"
                
                textAlign="center"
                mb={3}
            >
                At <strong>Shinra Studios</strong>, customer satisfaction is our priority.
                Please review the following terms carefully to understand your rights
                and our responsibilities regarding returns and refunds.
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

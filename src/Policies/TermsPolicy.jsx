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
                    These Terms of Service (“Terms”) govern your use of{" "}
                    <strong>shinra-deskware.com</strong> and the purchase of any
                    <strong> Madzilla</strong> products or related accessories sold by{" "}
                    <strong>Shinra Studios</strong> (“we,” “our,” or “us”). By accessing
                    or purchasing from our site, you agree to these Terms and our
                    associated Privacy, Shipping, and Return Policies.
                </Typography>
            </Box>

            {/* 2. Eligibility & Account */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    2. Eligibility & Account
                </Typography>
                <Typography variant="body2">
                    By using this site, you confirm that you are at least 18 years old or
                    have the consent of a parent or guardian. You agree to provide
                    accurate, complete, and current information when making purchases or
                    creating an account. You are responsible for maintaining the
                    confidentiality of your login credentials.
                </Typography>
            </Box>

            {/* 3. Product Information */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    3. Product Information & Availability
                </Typography>
                <Typography variant="body2">
                    We strive to display accurate descriptions, colors, and images of our
                    products. However, minor variations may occur due to screen
                    differences or manufacturing tolerances. We reserve the right to
                    modify, discontinue, or replace products without prior notice.
                </Typography>
            </Box>

            {/* 4. Pricing & Payment */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    4. Pricing & Payment
                </Typography>
                <Typography variant="body2">
                    All prices listed are in Indian Rupees (INR) unless stated otherwise
                    and are subject to change without notice. Payment must be completed
                    through authorized gateways before order processing. Shinra Studios is
                    not responsible for delays caused by payment failures or gateway
                    issues.
                </Typography>
            </Box>

            {/* 5. Shipping & Delivery */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    5. Shipping & Delivery
                </Typography>
                <Typography variant="body2">
                    Orders are shipped in accordance with our{" "}
                    <a
                        href="/dashboard/shipping"
                        className="policy-link"
                    >
                        Shipping Policy
                    </a>
                    . Delivery times may vary based on location and courier availability.
                    We are not liable for delays or losses caused by external factors
                    beyond our control.
                </Typography>
            </Box>

            {/* 6. Returns & Refunds */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    6. Returns & Refunds
                </Typography>
                <Typography variant="body2">
                    Returns, replacements, and refunds are governed by our{" "}
                    <a
                        href="/dashboard/returnrefundpolicy"
                        className="policy-link"
                    >
                        Return & Refund Policy
                    </a>
                    . Refund approvals are at our discretion after inspection and
                    verification of product condition.
                </Typography>
            </Box>

            {/* 7. Warranty */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    7. Warranty
                </Typography>
                <Typography variant="body2">
                    All Madzilla products include a <strong>1-Year Limited Warranty</strong> covering
                    manufacturing defects. Warranty does not cover physical damage,
                    modification, improper usage, or exposure to liquids. For details, refer to our
                    warranty section.
                </Typography>
            </Box>

            {/* 8. Intellectual Property */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    8. Intellectual Property
                </Typography>
                <Typography variant="body2">
                    All website content, product designs, logos, and trademarks are the
                    exclusive property of <strong>Shinra Studios</strong>. Reproduction,
                    modification, or redistribution of any material without written
                    consent is strictly prohibited. Unauthorized use may result in legal
                    action under applicable intellectual property laws.
                </Typography>
            </Box>

            {/* 9. User Conduct */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    9. User Conduct
                </Typography>
                <Typography variant="body2">
                    You agree not to use our products or website for any unlawful or
                    prohibited purpose, including but not limited to:
                </Typography>
                <ul className="policy-list">
                    <li>Engaging in fraud, hacking, or distribution of malware</li>
                    <li>Harassment or abuse of our team or community members</li>
                    <li>Misrepresentation or resale of Shinra Studios products</li>
                    <li>Violation of applicable local, state, or international laws</li>
                </ul>
            </Box>

            {/* 10. Limitation of Liability */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    10. Limitation of Liability
                </Typography>
                <Typography variant="body2">
                    To the fullest extent permitted by law, Shinra Studios shall not be
                    liable for any indirect, incidental, or consequential damages,
                    including but not limited to data loss, personal injury, or product
                    misuse. Our total liability is limited to the purchase price of the
                    product.
                </Typography>
            </Box>

            {/* 11. Indemnification */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    11. Indemnification
                </Typography>
                <Typography variant="body2">
                    You agree to indemnify and hold harmless Shinra Studios, its
                    affiliates, partners, and employees from any claims, damages, or
                    losses resulting from your violation of these Terms or misuse of our
                    products.
                </Typography>
            </Box>

            {/* 12. Governing Law */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    12. Governing Law & Jurisdiction
                </Typography>
                <Typography variant="body2">
                    These Terms are governed by and construed in accordance with the laws
                    of <strong>India</strong>. Any disputes arising from the use of our
                    website or products shall fall under the exclusive jurisdiction of the
                    courts of <strong>Hyderabad, Telangana</strong>.
                </Typography>
            </Box>

            {/* 13. Policy Updates */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    13. Updates to These Terms
                </Typography>
                <Typography variant="body2">
                    Shinra Studios reserves the right to update, modify, or replace any
                    part of these Terms at any time without prior notice. The latest
                    version will always be available on{" "}
                    <a
                        href="https://www.shinra-deskware.com/policies/terms"
                        className="policy-link"
                    >
                        our official website
                    </a>
                    . Continued use of our site after updates constitutes acceptance.
                </Typography>
            </Box>

            {/* 14. Contact */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    14. Contact Us
                </Typography>
                <Typography variant="body2">
                    For questions regarding these Terms of Service, please contact:
                    <br />
                    📧 Email:{" "}
                    <a href="mailto:support@shinrastudios.com" className="policy-link">
                        support@shinrastudios.com
                    </a>
                    <br />
                    📍 Address: HMT Swarnapuri Colony, Hyderabad – 500050, India
                </Typography>
            </Box>
        </>
    );
}

export default function TermsPolicyPage() {
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
                Terms of Service
            </Typography>

            <Typography
                variant="body1"

                textAlign="center"
                mb={3}
            >
                These Terms define your rights, responsibilities, and legal relationship
                with <strong>Shinra Studios</strong>. Please read them carefully before
                using our website or purchasing any product.
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

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
                    This Privacy Policy explains how <strong>Shinra Studios</strong> (“we,” “our,” or “us”)
                    collects, uses, and protects your personal information when you visit
                    or make a purchase from <strong>shinra-deskware.com</strong> or any
                    affiliated Madzilla platform. By using our website, you agree to this
                    policy.
                </Typography>
            </Box>

            {/* 2. Information We Collect */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    2. Information We Collect
                </Typography>
                <Typography variant="body2">
                    We may collect the following information to process orders and improve
                    our service:
                </Typography>
                <ul className="policy-list">
                    <li>Personal details: name, email, phone number, billing and shipping address</li>
                    <li>Payment information (handled securely via third-party gateways)</li>
                    <li>Device and browser data (for analytics and performance)</li>
                    <li>Messages or feedback you submit via support or social media</li>
                </ul>
            </Box>

            {/* 3. How We Use Your Data */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    3. How We Use Your Data
                </Typography>
                <Typography variant="body2">
                    We use your information to:
                </Typography>
                <ul className="policy-list">
                    <li>Process and deliver your orders</li>
                    <li>Provide support and respond to inquiries</li>
                    <li>Send order confirmations and updates</li>
                    <li>Improve product quality and website performance</li>
                    <li>Comply with legal and tax requirements</li>
                </ul>
            </Box>

            {/* 4. Cookies & Tracking */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    4. Cookies & Tracking Technologies
                </Typography>
                <Typography variant="body2">
                    Our website uses cookies to personalize your experience and analyze
                    traffic. You can disable cookies in your browser settings, but certain
                    features may stop working properly. We never store sensitive
                    information in cookies.
                </Typography>
            </Box>

            {/* 5. Third-Party Services */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    5. Third-Party Services
                </Typography>
                <Typography variant="body2">
                    We may use third-party providers such as:
                </Typography>
                <ul className="policy-list">
                    <li>Payment gateways (e.g., Razorpay, PayPal, Stripe)</li>
                    <li>Analytics tools (e.g., Google Analytics, Meta Pixel)</li>
                    <li>Shipping partners and logistics providers</li>
                </ul>
                <Typography variant="body2">
                    These providers have their own privacy policies. We encourage you to
                    review them to understand how your information is handled by these
                    third parties.
                </Typography>
            </Box>

            {/* 6. Data Retention & Security */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    6. Data Retention & Security
                </Typography>
                <Typography variant="body2">
                    We retain personal data only for as long as necessary to fulfill
                    orders, comply with regulations, or resolve disputes. All sensitive
                    data is transmitted over secure HTTPS and stored using encryption and
                    restricted access controls.
                </Typography>
            </Box>

            {/* 7. Your Rights */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    7. Your Rights
                </Typography>
                <Typography variant="body2">
                    Depending on your location, you may have the right to:
                </Typography>
                <ul className="policy-list">
                    <li>Access the data we hold about you</li>
                    <li>Request correction or deletion of your data</li>
                    <li>Withdraw consent for marketing communications</li>
                    <li>Request a copy of your stored information</li>
                </ul>
                <Typography variant="body2">
                    To exercise these rights, contact us at{" "}
                    <a href="mailto:support@shinrastudios.com" className="policy-link">
                        support@shinrastudios.com
                    </a>
                    .
                </Typography>
            </Box>

            {/* 8. Data Sharing & Disclosure */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    8. Data Sharing & Disclosure
                </Typography>
                <Typography variant="body2">
                    We do not sell or rent your personal information. We share data only
                    with trusted partners required for payment processing, shipping, or
                    analytics — all of whom follow strict confidentiality obligations.
                </Typography>
            </Box>

            {/* 9. Children's Privacy */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    9. Children's Privacy
                </Typography>
                <Typography variant="body2">
                    Our products and website are not intended for children under 13. We do
                    not knowingly collect data from minors. If you believe a child has
                    provided us information, please contact us to remove it.
                </Typography>
            </Box>

            {/* 10. International Users */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    10. International Users
                </Typography>
                <Typography variant="body2">
                    By using our site, you consent to your data being processed and stored
                    in India or any country where our service providers operate. Local
                    data protection laws may differ from those in your region.
                </Typography>
            </Box>

            {/* 11. Policy Updates */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    11. Policy Updates
                </Typography>
                <Typography variant="body2">
                    We may revise this policy periodically to reflect legal, operational,
                    or business changes. Updates take effect immediately upon posting on{" "}
                    <a
                        href="https://www.shinra-deskware.com/policies/privacypolicy"
                        className="policy-link"
                    >
                        our official website
                    </a>
                    . Continued use of our services after such updates implies your
                    acceptance.
                </Typography>
            </Box>

            {/* 12. Contact Information */}
            <Box className="policy-section">
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    12. Contact Information
                </Typography>
                <Typography variant="body2">
                    If you have questions about this Privacy Policy, please contact:
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

export default function PrivacyPolicyPage() {
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
                Privacy Policy
            </Typography>

            <Typography
                variant="body1"
                textAlign="center"
                mb={3}
            >
                We value your trust and are committed to protecting your privacy.
                Please read this policy to understand how we handle your data.
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

import { Box, Typography } from "@mui/material";
import {
    Facebook,
    Instagram,
    Twitter,
    YouTube,
    Phone,
    LocationOn,
    Email,
    Home,
    Engineering,
    EmojiPeople, 
    PermContactCalendar
} from "@mui/icons-material";

import "./Styles/contactSection.css";

export default function ContactSection() {
    return (
        <Box className="footer-section">
            <Box className="footer-container">

                {/* Brand */}
                <Box className="footer-column footer-brand">
                    <Box className="footer-logo">
                        <img src="/assets/shinra-logo.png" alt="Madzilla Logo" className="footer-logo-img" />
                        <Typography variant="h6" className="footer-logo-text">
                            S H I N R A
                        </Typography>
                    </Box>

                    <Typography className="footer-about">
                        Innovative, creative, and reliable — we bring ideas to life through
                        design, technology, and precision craftsmanship.
                    </Typography>
                </Box>

                {/* Store + Social */}
                <Box className="footer-middle-row">

                    {/* Store */}
                    <Box className="footer-column">
                        <Typography variant="h6" className="footer-title">Store</Typography>
                        <Box className="footer-contact"><Home className="footer-icon" />Home</Box>
                        <Box className="footer-contact"><EmojiPeople className="footer-icon" />About</Box>
                        <Box className="footer-contact"><Engineering className="footer-icon" />Service</Box>
                        <Box className="footer-contact"><PermContactCalendar className="footer-icon" />Contact</Box>
                    </Box>

                    {/* Social */}
                    <Box className="footer-column">
                        <Typography variant="h6" className="footer-title">Social</Typography>
                        <Box className="footer-contact"><Twitter className="footer-icon" />Twitter</Box>
                        <Box className="footer-contact"><Instagram className="footer-icon" />Instagram</Box>
                        <Box className="footer-contact"><YouTube className="footer-icon" />YouTube</Box>
                        <Box className="footer-contact"><Facebook className="footer-icon" />Facebook</Box>
                    </Box>

                </Box>

                {/* Contact */}
                <Box className="footer-column footer-contact-col">
                    <Typography className="footer-title">Get in Touch</Typography>

                    <Box className="footer-contact">
                        <LocationOn className="footer-icon" />
                        <span>MADZILLA, HMT Swarnapuri Colony, Hyderabad - 500050</span>
                    </Box>

                    <Box className="footer-contact">
                        <Phone className="footer-icon" />
                        <a href="tel:+916303666387" className="footer-contact-link">
                            +91 6303666387
                        </a>
                    </Box>

                    <Box className="footer-contact">
                        <Email className="footer-icon" />
                        <a href="mailto:support@shinrastudios.com" className="footer-contact-link">
                            support@shinrastudios.com
                        </a>
                    </Box>
                </Box>

            </Box>

            <Typography className="footer-copy">
                © {new Date().getFullYear()} Madzilla · Powered by Shinra Studios
            </Typography>
        </Box>
    );
}

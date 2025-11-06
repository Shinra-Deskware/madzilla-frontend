import { Box, Typography, useMediaQuery } from "@mui/material";
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
    PermContactCalendar,
    WhatsApp
} from "@mui/icons-material";

import "./Styles/contactSection.css";
import PolicyBottomSheet from "../components/PolicyBottomSheet";

export default function ContactSection() {
    const isMobile = useMediaQuery("(max-width:768px)");
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
                    {!isMobile && <Box className="footer-column">
                        <Typography variant="h6" className="footer-title">Store</Typography>
                        <Box className="footer-contact"><Home className="footer-icon" />Home</Box>
                        <Box className="footer-contact"><EmojiPeople className="footer-icon" />Products</Box>
                        <Box className="footer-contact"><Engineering className="footer-icon" />Contact</Box>
                        <Box className="footer-contact"><PermContactCalendar className="footer-icon" />About Us</Box>
                    </Box>}
                    <Box className="footer-column">
                        <Typography variant="h6" className="footer-title">Quick Links</Typography>
                        <Box className="footer-contact">
                            <Home className="footer-icon" />
                            <PolicyBottomSheet type="return" label="Return & Refund Policy" />
                        </Box>
                        <Box className="footer-contact">
                            <EmojiPeople className="footer-icon" />
                            <PolicyBottomSheet type="privacy" label="Privacy Policy" />
                        </Box>
                        <Box className="footer-contact">
                            <Engineering className="footer-icon" />
                            <PolicyBottomSheet type="terms" label="Terms Of Service" />
                        </Box>
                        <Box className="footer-contact">
                            <PermContactCalendar className="footer-icon" />
                            <PolicyBottomSheet type="shipping" label="Shipping Policy" />
                        </Box>
                    </Box>
                    {/* Social */}
                    {/* Social Section */}
                    <Box className="footer-column">
                        <Typography variant="h6" className="footer-title">
                            Social
                        </Typography>
                        {/* WhatsApp */}
                        <Box
                            className="footer-contact"
                            onClick={() =>
                                window.open(
                                    "https://wa.me/919346407877?text=" +
                                    encodeURIComponent("Hi, I’d like to know more about Madzilla Deskware!"),
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <WhatsApp className="footer-icon" />
                            <Typography variant="body2" sx={{ color: "#fff" }}>
                                WhatsApp
                            </Typography>
                        </Box>
                        {/* Instagram */}
                        <Box
                            className="footer-contact"
                            onClick={() =>
                                window.open("https://www.instagram.com/shinra_deskwares/", "_blank", "noopener,noreferrer")
                            }
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <Instagram className="footer-icon" />
                            <Typography variant="body2" sx={{ color: "#fff" }}>
                                Instagram
                            </Typography>
                        </Box>
                        {/* YouTube */}
                        <Box
                            className="footer-contact"
                            onClick={() =>
                                window.open("https://www.youtube.com/@ShinraDeskware", "_blank", "noopener,noreferrer")
                            }
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <YouTube className="footer-icon" />
                            <Typography variant="body2" sx={{ color: "#fff" }}>
                                YouTube
                            </Typography>
                        </Box>
                        {/* Facebook */}
                        <Box
                            className="footer-contact"
                            onClick={() =>
                                window.open("https://www.facebook.com/profile.php?id=61583097886891", "_blank", "noopener,noreferrer")
                            }
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <Facebook className="footer-icon" />
                            <Typography variant="body2" sx={{ color: "#fff" }}>
                                Facebook
                            </Typography>
                        </Box>
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
                        <a href="tel:+9193464 07877" className="footer-contact-link">
                            +91 93464 07877
                        </a>
                    </Box>
                    <Box className="footer-contact">
                        <Email className="footer-icon" />
                        <a href="mailto:support@shinra-deskware.com" className="footer-contact-link">
                            support@shinra-deskware.com
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

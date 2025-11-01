import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Stack,
    Drawer,
    TextField,
    Button
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import XIcon from "@mui/icons-material/X"; // Temporary for Twitter
import "./styles/contactPage.css";


const ContactPage = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const contactActions = [
        {
            label: "Call Us",
            icon: <PhoneIcon />,
            gradient: "linear-gradient(135deg, #2854ff, #5ba3ff)",
            onClick: () => { }
        },
        {
            label: "Email Us",
            icon: <EmailIcon />,
            gradient: "linear-gradient(135deg, #0ac177, #39ffb5)",
            onClick: () => setOpenDrawer(true)
        },
        {
            label: "Chat",
            icon: <ChatBubbleOutlineIcon />,
            gradient: "linear-gradient(135deg, #7a2fff, #c184ff)",
            onClick: () => { }
        }
    ];

    return (
        <>
            <Box className="contact-container">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Let’s get in touch!
                </Typography>

                {/* Illustration Section */}
                <Box className="illustration">
                    <img
                        src={`/assets/illustration.webp`}
                        loading="lazy"
                        alt="Contact Illustration"
                        className="contact-image"
                    />
                </Box>

                {/* Contact Buttons */}
                <Stack direction="row" spacing={2} className="contact-buttons">
                    {contactActions.map((item, idx) => (
                        <Box
                            className="action-card"
                            key={idx}
                            onClick={item.onClick}
                        >
                            <Box
                                className="action-icon"
                                style={{ background: item.gradient }}
                            >
                                {item.icon}
                            </Box>
                            <Typography className="action-text">{item.label}</Typography>
                        </Box>
                    ))}
                </Stack>

                {/* Social Media Section */}
                <Box className="social-section">
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Our social media
                    </Typography>
                    <Stack spacing={1}>
                        <Box className="social-item">
                            <IconButton><XIcon /></IconButton>
                            <Typography variant="body1">Twitter</Typography>
                        </Box>
                        <Box className="social-item">
                            <IconButton><InstagramIcon /></IconButton>
                            <Typography variant="body1">Instagram</Typography>
                        </Box>
                        <Box className="social-item">
                            <IconButton><FacebookIcon /></IconButton>
                            <Typography variant="body1">Facebook</Typography>
                        </Box>
                        <Box className="social-item">
                            <IconButton><LinkedInIcon /></IconButton>
                            <Typography variant="body1">LinkedIn</Typography>
                        </Box>
                        <Box className="social-item">
                            <IconButton><OndemandVideoIcon /></IconButton>
                            <Typography variant="body1">Medium</Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>

            {/* ------------------ Bottom Drawer ------------------ */}
            <Drawer
                anchor="bottom"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        padding: 3,
                        backgroundColor: "#000",
                        color: "#fff",
                        border: '1px solid white',
                        borderBottom: '0px',
                        minHeight: "40vh"
                    }
                }}
            >
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => setOpenDrawer(false)}>
                        <CloseIcon className="close-icon" />
                    </IconButton>
                </Box>

                <Typography
                    variant="h6"
                    sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
                >
                    Contact Us
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Name"
                        placeholder="Enter Full Name Here"
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        placeholder="Enter Email Address"
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="Message"
                        placeholder="Enter Message"
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#0ac177",
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: "25px",
                            textTransform: "none",
                            paddingY: 1.2,
                            "&:hover": {
                                backgroundColor: "#09a966"
                            }
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};

export default ContactPage;

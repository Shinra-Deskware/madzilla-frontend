import React, { useState } from "react";
import "./styles/ReturnPolicy.css";

import {
    Drawer,
    Box,
    IconButton,
    Typography,
    TextField,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ReturnPolicy() {
    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <>
            <div className="rp-container">
                <div className="rp-left">
                    <h2>Privacy Policy</h2>

                    <p>
                        We value your privacy and are committed to protecting your personal data.
                        When you shop with us, we only collect information necessary to process
                        your order, improve your shopping experience, and provide customer support.
                    </p>

                    <p>
                        We do not sell or share your personal information with third parties
                        for marketing purposes. Your data is stored securely and used only
                        in compliance with applicable data protection laws.
                    </p>

                    <p>
                        You can request access, update, or deletion of your information at any time
                        by contacting our support team.
                    </p>
                    <Box sx={{ mt: 2 }}>
                        <button
                            className="rp-btn"
                            onClick={() => {
                                console.log("Learn More clicked"); // debug
                                setOpenDrawer(true);
                            }}
                            style={{ cursor: "pointer", background: 'white', color:'black' }}  // ensures click
                        >
                            Contact us
                        </button>
                    </Box>
                </div>

                <div className="rp-right">
                    <img src="/assets/illustration.webp" alt="privacy illustration" />
                </div>
            </div>

            {/* ✅ Same drawer here */}
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
                        border: "1px solid white",
                        borderBottom: "0px",
                        minHeight: "40vh"
                    }
                }}
            >
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => setOpenDrawer(false)}>
                        <CloseIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </Box>

                <Typography
                    variant="h6"
                    sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
                >
                    Contact Us
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Name" fullWidth size="small" />
                    <TextField label="Email" fullWidth size="small" />
                    <TextField label="Message" fullWidth multiline minRows={3} />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#0ac177",
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: "25px",
                            textTransform: "none",
                            py: 1.2,
                            "&:hover": { backgroundColor: "#09a966" }
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}

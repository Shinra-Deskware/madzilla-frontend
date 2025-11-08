import React, { useState, useEffect } from "react";
import {
	SwipeableDrawer,
	Box,
	Typography,
	IconButton,
	useMediaQuery,
	Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReturnRefundPolicyPage from "../Policies/ReturnRefundPolicy";
import PrivacyPolicyPage from "../Policies/PrivacyPolicy";
import ShippingPolicyPage from "../Policies/ShippingPolicy";
import TermsPolicyPage from "../Policies/TermsPolicy";
import '../Policies/Styles/policyPage.css'
import ContactPage from "../Policies/ContactPage";
import AboutUs from "../Policies/AboutUs";

// Import your 4 policies

export default function PolicyBottomSheet({ type, label }) {
	const isMobile = useMediaQuery("(max-width:768px)");
	const [open, setOpen] = useState(false);

	// Automatically make all links open in new tab
	useEffect(() => {
		if (open) {
			const links = document.querySelectorAll(".policy-container a");
			links.forEach((link) => {
				link.setAttribute("target", "_blank");
				link.setAttribute("rel", "noopener noreferrer");
			});
		}
	}, [open]);

	const handleOpen = () => {
		if (!isMobile) {
			// Desktop → navigate to full policy page
			switch (type) {
				case "contactus":
					window.open("/dashboard/contactus", "_blank");
					break;
				case "aboutus":
					window.open("/dashboard/aboutus", "_blank");
					break;
				case "return":
					window.open("/dashboard/returnrefundpolicy", "_blank");
					break;
				case "privacy":
					window.open("/dashboard/privacy", "_blank");
					break;
				case "shipping":
					window.open("/dashboard/shipping", "_blank");
					break;
				case "terms":
					window.open("/dashboard/terms", "_blank");
					break;
				default:
					break;
			}
		} else {
			setOpen(true);
		}
	};

	const handleClose = () => setOpen(false);

	// Choose which policy to show
	const renderPolicy = () => {
		switch (type) {
			case "contactus":
				return <ContactPage />;
			case "aboutus":
				return <AboutUs />;
			case "return":
				return <ReturnRefundPolicyPage />;
			case "privacy":
				return <PrivacyPolicyPage />;
			case "shipping":
				return <ShippingPolicyPage />;
			case "terms":
				return <TermsPolicyPage />;
			default:
				return null;
		}
	};

	return (
		<>
			<Typography
				component="span"
				sx={{
					cursor: "pointer",
					"&:hover": { textDecoration: "underline" },
					color: "#fff",
					fontSize: "0.95rem",
				}}
				onClick={handleOpen}
			>
				{label}
			</Typography>

			{/* Bottom Sheet for Mobile */}
			<SwipeableDrawer
				anchor="bottom"
				open={open}
				onClose={handleClose}
				onOpen={() => { }}
				PaperProps={{
					sx: {
						backgroundColor: "#0a0a0a",
						color: "#fff",
						borderTopLeftRadius: "16px",
						borderTopRightRadius: "16px",
						height: "90vh",
						overflowY: "auto",
					},
				}}
			>
				<Box
					sx={{
						position: "sticky",
						top: 0,
						zIndex: 10,
						backgroundColor: "#0a0a0a",
						borderBottom: "1px solid rgba(255,255,255,0.2)",
						p: "0.5rem 1rem",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="subtitle1" fontWeight="bold" color="#fff">
						{label}
					</Typography>
					<IconButton size="small" onClick={handleClose}>
						<CloseIcon sx={{ color: "#fff" }} />
					</IconButton>
				</Box>

				<Box sx={{ padding: "1rem 1.2rem" }}>
					<Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
					{renderPolicy()}
				</Box>
			</SwipeableDrawer>
		</>
	);
}

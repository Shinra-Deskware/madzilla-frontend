import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ShinraLogoAnimated from "./ShinraLogoAnimated";

export default function Intro({ onFinish }) {
    const [showIntro, setShowIntro] = useState(true);
    const [fadeClass, setFadeClass] = useState("fade-in");

    useEffect(() => {
        // start fade in immediately
        const fadeOutTimer = setTimeout(() => {
            setFadeClass("fade-out");
        }, 2000); // after 2s fade out

        const removeTimer = setTimeout(() => {
            setShowIntro(false);
            document.body.classList.add("intro-done");
            if (onFinish) onFinish();
        }, 3500); // after fade-out finishes

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [onFinish]);

    if (!showIntro) return null;

    const getFontSize = () => {
        const w = window.innerWidth;
        if (w < 600) return "30px";
        if (w < 1024) return "50px";
        return "80px";
    };

    // return (
    //     <Box
    //         className={`intro-screen ${fadeClass}`}
    //         sx={{
    //             position: "fixed",
    //             top: 0,
    //             left: 0,
    //             width: "100vw",
    //             height: "100vh",
    //             background: "black",
    //             zIndex: 99999,
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             overflow: "hidden",
    //         }}
    //     >
    //         <Typography
    //             variant="h1"
    //             sx={{
    //                 color: "#fff",
    //                 textTransform: "uppercase",
    //                 letterSpacing: "1vw",
    //                 width: "100%",
    //                 textAlign: "center",
    //                 whiteSpace: "nowrap",
    //                 transform: "scaleX(1.2)",
    //                 lineHeight: 1,
    //                 margin: 0,
    //                 padding: 0,
    //                 fontSize: getFontSize(),
    //             }}
    //         >
    //             MADZILLA
    //         </Typography>
    //     </Box>
    // );
    return (
        <ShinraLogoAnimated/>
    )
}

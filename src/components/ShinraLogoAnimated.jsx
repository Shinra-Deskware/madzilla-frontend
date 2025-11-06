import React, { useEffect, useState } from "react";

export default function ShinraLogoAnimated() {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 600);
        return () => clearTimeout(timer);
    }, []);

    const ROTATE = -15;
    const lineStyle = {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        animation: "draw 8s cubic-bezier(0.23,1,0.32,1) forwards",
    };

    return (
        <div className="shinra-intro-container">
            <div
                id="logo-container">
                <svg width="230" height="230" viewBox="0 0 500 220">
                    <defs>
                        <linearGradient id="metal" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#F2EFEA" />
                            <stop offset="28%" stopColor="#BBBAB6" />
                            <stop offset="55%" stopColor="#7E7F82" />
                            <stop offset="78%" stopColor="#3A3A3C" />
                            <stop offset="100%" stopColor="#0F0F11" />
                        </linearGradient>
                    </defs>
                    <g transform={`rotate(${ROTATE}, 250, 250)`}>
                        {/* center lines */}
                        <line data-id="10" style={{ ...lineStyle, animationDelay: "0s" }} x1="411" y1="200" x2="316.5" y2="36.65" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="2" style={{ ...lineStyle, animationDelay: "0s" }} x1="354.3" y1="200" x2="259.8" y2="36" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />``
                        <line data-id="3" style={{ ...lineStyle, animationDelay: "0s" }} x1="297.6" y1="200" x2="203.1" y2="36" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="4" style={{ ...lineStyle, animationDelay: "0s" }} x1="240.9" y1="200" x2="118.05" y2="-13.11" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        {/* next 1 */}
                        <line data-id="15" style={{ ...lineStyle, animationDelay: "0.2s" }} x1="146.4" y1="36" x2="467.4" y2="36" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="11" style={{ ...lineStyle, animationDelay: "0.2s" }} x1="411" y1="200" x2="439.35" y2="249.11" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="1" style={{ ...lineStyle, animationDelay: "0.2s" }} x1="90" y1="200" x2="411" y2="200" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        {/* next 2 */}
                        <line data-id="8" style={{ ...lineStyle, animationDelay: "0.4s" }} x1="118.05" y1="-13.11" x2="420.45" y2="-13.11" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="9" style={{ ...lineStyle, animationDelay: "0.4s" }} x1="439.35" y1="249.11" x2="136.95" y2="249.11" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        {/* next 3 */}
                        <line data-id="5" style={{ ...lineStyle, animationDelay: "0.6s" }} x1="118.05" y1="-13.11" x2="174.75" y2="-111.33" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="12" style={{ ...lineStyle, animationDelay: "0.6s" }} x1="439.35" y1="249.11" x2="382.65" y2="347.33" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        {/* next 4 */}
                        <line data-id="6" style={{ ...lineStyle, animationDelay: "0.8s" }} x1="146.4" y1="-62.22" x2="373.2" y2="-62.22" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="14" style={{ ...lineStyle, animationDelay: "0.8s" }} x1="411" y1="298.22" x2="184.2" y2="298.22" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        {/* next 5 */}
                        <line data-id="7" style={{ ...lineStyle, animationDelay: "1.0s" }} x1="174.75" y1="-111.33" x2="325.95" y2="-111.33" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                        <line data-id="13" style={{ ...lineStyle, animationDelay: "1.0s" }} x1="382.65" y1="347.33" x2="231.45" y2="347.33" stroke="url(#metal)" strokeWidth="18" strokeLinecap="round" />
                    </g>
                </svg>
            </div>
            {/* TEXT - fades in after logo shift */}
            {showText && (
                <div id="brand-text" className="brand-text">
                    <div className="brand-title">S H I N R A</div>
                    <div className="brand-sub">L U X U R Y&nbsp; D E S K W A R E</div>
                </div>
            )}
        </div>
    );
}

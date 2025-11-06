import { useRef, useEffect, useState } from "react";

// Styles
import "./Styles/homeSection.css";

export default function HomeSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Desktop video handlers
    const desktopVideoRef = useRef(null);
    const handleDesktopMouseEnter = () => {
        if (!desktopVideoRef.current) return;
        desktopVideoRef.current.loop = true;
        desktopVideoRef.current.play();
    };
    const handleDesktopMouseLeave = () => {
        if (!desktopVideoRef.current) return;
        desktopVideoRef.current.loop = false;
        desktopVideoRef.current.pause();
        desktopVideoRef.current.currentTime = 0;
    };
    const handleDesktopVideoEnd = () => {
        if (!desktopVideoRef.current) return;
        desktopVideoRef.current.pause();
        desktopVideoRef.current.currentTime = 0;
    };

    // Mobile video handlers
    const mobileVideoRef = useRef(null);
    const handleMobileVideoEnd = () => {
        if (!mobileVideoRef.current) return;
        mobileVideoRef.current.pause();
        mobileVideoRef.current.currentTime = 0;
    };

    return (
        <div className="hero-content">
            {isMobile ? (
                <>
                    {/* 📱 Mobile layout */}
                    <div className="mobile-hero">
                        <div className="mobile-home-text">
                            <h1 className="hero-title mobile-title">MADZILLA</h1>
                            <p className="hero-description mobile-description">
                                Light up your desk <br />
                                Control it effortlessly with Bluetooth
                            </p>
                        </div>
                        <video
                            ref={mobileVideoRef}
                            src="/assets/Good1.mp4"
                            loading="lazy"
                            autoPlay
                            muted
                            playsInline
                            className="hero-video"
                            onEnded={handleMobileVideoEnd}
                        />
                    </div>

                    <div className="hero-second-content">
                        <div className="available-on">
                            <p className="available-title">Verified on leading platforms</p>
                            <div className="store-links product-links">
                                <a href="https://www.amazon.in" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/meta.png" alt="Amazon" />
                                </a>
                                <a href="https://www.flipkart.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/msme.png" alt="Flipkart" />
                                </a>
                                <a href="https://www.meesho.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/googlebusiness.png" alt="Meesho" />
                                </a>
                                <a href="https://www.ebay.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/whatsapp.png" alt="eBay" />
                                </a>
                            </div>
                        </div>
                        {/* <div className="available-on">
                            <h3 className="available-title">SOON ON...</h3>
                            <div className="store-links">
                                <a
                                    href="https://www.amazon.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginTop: "10px" }}
                                >
                                    <img src="/assets/amazon.png" loading="lazy" alt="Amazon" />
                                </a>
                                <a href="https://www.flipkart.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/flipkart.png" alt="Flipkart" />
                                </a>
                                <a href="https://www.meesho.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/messho.png" alt="Meesho" />
                                </a>
                            </div>
                        </div> */}
                    </div>
                </>
            ) : (
                <>
                    {/* 🖥 Desktop layout */}
                    <div className="hero-first-content">
                        <div className="hero-text-desktop">
                            <h1 className="hero-title">MADZILLA</h1>
                            <p className="hero-description">
                                Light up your desk with Madzilla. <br />
                                Control it effortlessly with Bluetooth and USB power. <br />
                                Built for collectors, gamers, and design lovers alike.
                            </p>
                        </div>
                        <div
                            className="hero-video-container"
                            onMouseEnter={handleDesktopMouseEnter}
                            onMouseLeave={handleDesktopMouseLeave}
                        >
                            <video
                                ref={desktopVideoRef}
                                src="/assets/Good1.mp4"
                                autoPlay
                                muted
                                loading="lazy"
                                playsInline
                                className="hero-video"
                                onEnded={handleDesktopVideoEnd}
                            />
                        </div>
                    </div>

                    <div className="hero-second-content desktop-second-content">
                        <div className="available-on">
                            <h3 className="available-title">VERIFIED ALONG LEADING PALTFORMS</h3>
                            <div className="store-links product-links">
                                <a href="https://www.amazon.in" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/meta.png" alt="Amazon" />
                                </a>
                                <a href="https://www.flipkart.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/msme.png" alt="Flipkart" />
                                </a>
                                <a href="https://www.meesho.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/googlebusiness.png" alt="Meesho" />
                                </a>
                                <a href="https://www.ebay.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/whatsapp.png" alt="eBay" />
                                </a>
                            </div>
                        </div>
                        <div className="available-on">
                            <h3 className="available-title">SOON ON...</h3>
                            <div className="store-links">
                                <a href="https://www.amazon.in" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/amazon.png" alt="Amazon" />
                                </a>
                                <a href="https://www.flipkart.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/flipkart.png" alt="Flipkart" />
                                </a>
                                <a href="https://www.meesho.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/messho.png" alt="Meesho" />
                                </a>
                                <a href="https://www.ebay.com" loading="lazy" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/ebay.png" alt="eBay" />
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

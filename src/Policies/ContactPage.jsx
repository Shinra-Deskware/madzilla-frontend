import React from "react";
import { WhatsApp, Email, Phone, LocationOn } from "@mui/icons-material";

export default function ContactPage() {
    return (
        <div className="contact-container">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">
                We’re here to help — whether it’s product info, orders, or support.
            </p>

            <div className="contact-details">
                <div className="contact-item">
                    <WhatsApp className="contact-icon" />
                    <div>
                        <h3>WhatsApp</h3>
                        <a
                            href="https://wa.me/919346407877?text=Hi, I’m interested in Madzilla"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            +91 93464 07877
                        </a>
                    </div>
                </div>

                <div className="contact-item">
                    <Email className="contact-icon" />
                    <div>
                        <h3>Email</h3>
                        <a href="mailto:support@shinra-deskware.com">
                            support@shinra-deskware.com
                        </a>
                    </div>
                </div>

                <div className="contact-item">
                    <Phone className="contact-icon" />
                    <div>
                        <h3>Phone</h3>
                        <p>+91 93464 07877</p>
                    </div>
                </div>

                <div className="contact-item">
                    <LocationOn className="contact-icon" />
                    <div>
                        <h3>Address</h3>
                        <p>
                            Shinra Deskwares<br />
                            Hyderabad, Telangana, India
                        </p>
                    </div>
                </div>
            </div>

            <div className="contact-footer">
                <p>© {new Date().getFullYear()} Shinra Deskwares. All rights reserved.</p>
            </div>
        </div>
    );
}

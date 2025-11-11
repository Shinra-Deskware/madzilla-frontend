import React, { useEffect, useState } from "react";
import "./Styles/reviewSection.css";
import http from "../api/http";
import { faqs } from "../Constants/Data";

export default function ReviewSection() {
    const [faqData, setfaqData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);
    useEffect(() => {
        setfaqData(faqs);
        const loadReviews = async () => {
            try {
                const res = await http.get("/api/sections/reviews");
                setReviewData(res.data || []);
            } catch {
                setReviewData([]);
            }
        };
        loadReviews();
    }, []);
    const renderStars = (r) => {
        const full = Math.floor(r);
        const half = r % 1 >= 0.5;
        return (
            <>
                {"★".repeat(full)}
                {half ? "☆" : ""}
                {"☆".repeat(5 - full - (half ? 1 : 0))}
            </>
        );
    };
    return (
        <div className="review-section">
            <div className="section-review-header">
                <h1>FAQ</h1>
                <p>Read real experiences and get quick answers.</p>
            </div>
            <div className="top-section">
                <div className="faq-section">
                    <div className="faq-list">
                        {faqData.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openIndex === index ? "open" : ""}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className="faq-question">
                                    <span>{item.question}</span>
                                    <span className="faq-icon">
                                        {openIndex === index ? "−" : "+"}
                                    </span>
                                </div>
                                <div
                                    className="faq-answer"
                                    style={{ maxHeight: openIndex === index ? "200px" : "0px" }}
                                >
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="section-review-header">
                <h1>REVIEWS</h1>
                <p>(All reviews will be published in main channel)</p>
            </div>
            <div className="review-list">
                {reviewData.map((item, index) => (
                    <div className="review-card" key={index}>
                        <div className="media-wrapper">
                            <iframe
                                src={(function () {
                                    let videoId = "";
                                    const match =
                                        item.url.match(/v=([^&]+)/) || item.url.match(/shorts\/([^?]+)/);
                                    if (match) videoId = match[1];
                                    return `https://www.youtube.com/embed/${videoId}?rel=0`;
                                })()}
                                title="YouTube video"
                                style={{ border: "none" }}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="review-video"
                            />
                        </div>
                        <div className="review-content">
                            <div className="review-message">{item.message}</div>
                            <div className="review-footer">
                                <div className="username">{item.username}</div>
                                <div className="rating">{renderStars(item.rating)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import React, { useState } from "react";

import Navbar from "./components/Navbar";
import HomeSection from "./Main/HomeSection";
import ProductsSection from "./Main/ProductsSection";
import ReviewSection from "./Main/ReviewSection";
import ContactSection from "./Main/ContactSection";

import './Common/commonStyles.css'
import Intro from "./components/Intro";

export default function Home() {
	const [introDone, setIntroDone] = useState(false);

	return (
		<>
			{!introDone && <Intro onFinish={() => setIntroDone(true)} />}
			{introDone && (
				<>
					<Navbar />
					<section id="home-section" className="content-section first-section">
						<HomeSection />
					</section>
					<section id="products-section" className="content-section">
						<ProductsSection/>
					</section>
					<section id="review-section" className="content-section">
						<ReviewSection />
					</section>
					<section id="contact-section" className="content-section">
						<ContactSection />
					</section>
				</>
			)}
		</>
	);
}

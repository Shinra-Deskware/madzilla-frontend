import "../Policies/Styles/policyPage.css";

export default function AboutUs() {
    return (
        <div className="about-container">
            <section className="about-hero">
                <h1 className="about-title">About Shinra Deskwares</h1>
                <p className="about-subtitle">
                    Crafting innovation for workspaces and gamers alike.
                </p>
            </section>

            <section className="about-section">
                <h2>Who We Are</h2>
                <p>
                    At <strong>Shinra Deskwares</strong>, we design and build
                    aesthetic, functional desk accessories that elevate your setup.
                    From smart lighting to collectible tech art like <strong>MADZILLA</strong>,
                    our mission is to bring creativity and engineering together.
                </p>
            </section>

            <section className="about-section">
                <h2>Our Mission</h2>
                <p>
                    We aim to create products that not only light up your desk
                    but also reflect your personality and passion for tech and design.
                    Every Shinra product is engineered with precision and love for detail.
                </p>
            </section>

            <section className="about-section">
                <h2>Our Products</h2>
                <p>
                    <strong>MADZILLA</strong> is our flagship collectible desk lamp —
                    blending powerful lighting, Bluetooth control, and striking design.
                    More innovative desk products are in development to expand our ecosystem.
                </p>
            </section>

            <section className="about-verified">
                <h2>Verified Along Leading Platforms</h2>
                <div className="verified-icons">
                    <img src="/assets/meta.png" alt="Meta Verified" loading="lazy" />
                    <img src="/assets/msme.png" alt="Udyam Registered" loading="lazy" />
                    <img src="/assets/googlebusiness.png" alt="Google Business" loading="lazy" />
                    <img src="/assets/whatsapp.png" alt="WhatsApp Business" loading="lazy" />
                </div>
            </section>

            <section className="about-contact">
                <h2>Contact Us</h2>
                <p>
                    📞 <a href="https://wa.me/919346407877?text=Hi, I’m interested in Madzilla" target="_blank" rel="noopener noreferrer">+91 93464 07877</a><br />
                    🌐 <a href="https://www.shinra-deskware.com" target="_blank" rel="noopener noreferrer">www.shinra-deskware.com</a><br />
                    📧 support@shinra-deskware.com
                </p>
            </section>
        </div>
    );
}

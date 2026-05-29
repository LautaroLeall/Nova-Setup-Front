import HeroEcommerce from "../components/Hero";
import "../styles/Home.css";

const Home = () => {
  return (
    <main>
      <HeroEcommerce />
      
      {/* Placeholder sections for scrolling */}
      <section className="home-section-products">
        <h2 className="home-section-title">PRODUCTOS DESTACADOS</h2>
        <div className="home-products-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="home-product-card">
              <div className="home-product-overlay"></div>
              <div className="home-product-info">
                <div className="home-product-category">CATEGORY_0{i}</div>
                <div className="home-product-name">TECH_ITEM_SPEC_0{i}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section-footer">
          <div className="home-footer-text-container">
            <h2 className="home-footer-title">NOVA SETUP</h2>
          </div>
      </section>
    </main>
  );
};

export default Home;

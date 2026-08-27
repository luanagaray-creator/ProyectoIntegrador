import instagram from "../../assets/instagram.png";
import facebook from "../../assets/facebook.png";
import tiktok from "../../assets/tiktok.png";

import "./style.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-social">
        <a
          href="https://www.instagram.com/animadual/?hl=es"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={instagram} alt="Instagram" className="footer-social-img" />
        </a>
        <a className="footer-text" href="https://www.instagram.com/animadual/?hl=es" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>
      <div className="footer-social">
        <a
          href="https://www.facebook.com/tu_empresa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={facebook} alt="Facebook" className="footer-social-img" />
        </a>
        <a className="footer-text" href="https://www.facebook.com/animaformaciondual/?locale=es_LA" target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </div>
      <div className="footer-social">
        <a
          href="https://www.tiktok.com/@anima_dual"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={tiktok} alt="TikTok" className="footer-social-img" />
        </a>
        <a className="footer-text" href="https://www.tiktok.com/@anima_dual" target="_blank" rel="noopener noreferrer">
          TikTok
        </a>
      </div>
    </div>
  );
};

export default Footer;
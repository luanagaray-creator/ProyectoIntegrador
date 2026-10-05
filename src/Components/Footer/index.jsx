import { forwardRef } from "react";
import instagram from "../../assets/instagram.png";
import facebook from "../../assets/facebook.png";
import tiktok from "../../assets/tiktok.png";
import thotem from "../../assets/thotem.png";

import "./style.css";

const Footer = forwardRef(({ isActive = false, home = false }, ref) => {
  return (
    <footer id="footer" ref={ref} className="footer">
      <div className="footer__content">
        <div className="footer__content-social">
          <div className={`footer-social ${isActive ? "is-active" : ""}`}>
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
          <div className={`footer-social ${isActive ? "is-active" : ""}`}>
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
          <div className={`footer-social ${isActive ? "is-active" : ""}`}>
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
        {home === true && (
          <img
            className="footer-thotem"
            src={thotem}
            alt="Thotem"
            className="footer-thotem-img"
          />
        )}
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
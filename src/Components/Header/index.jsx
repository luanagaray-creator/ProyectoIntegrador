import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import bannerAnima1 from "../../assets/banner-anima-1.png";
import bannerAnima2 from "../../assets/banner-anima-2.png";
import bannerAnima3 from "../../assets/banner-anima-3.png";
import thotem from "../../assets/thotem.png";

import "./style.css";

// Agregá o quitá imágenes acá según cuántas quieras rotar
const bannerImages = [bannerAnima1, bannerAnima2, bannerAnima3];
const BANNER_INTERVAL = 6000; // ms entre imágenes

const Header = ({ home, onContactClick }) => {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!home) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (bannerImages.length <= 1 || prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, BANNER_INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [home]);

  const handleContactNavigation = (event) => {
    event.preventDefault();

    if (onContactClick) {
      onContactClick();
      return;
    }

    navigate("/home");
    setTimeout(() => {
      document.getElementById("footer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
  <header className={home === true ? "banner-container" : "header header--solid"}>
    {home === true && (
      <>
        {bannerImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Banner Ánima Campus"
            className={`banner-img ${i === bannerIndex ? "is-active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            onClick={() => navigate("/home")}
          />
        ))}
        <div className="banner-overlay" />
      </>
    )}
    {home === false && (
      <button
        type="button"
        className="thotem-button"
        onClick={() => navigate("/home")}
        aria-label="Ir a la página de inicio"
      >
        <img
          src={thotem}
          alt="Thotem Ánima Campus"
          className="thotem-img"
        />
      </button>
    )}
    <nav className="header">
      <div className="header__sections">
        <Link to="/register" className="header-sections-text">Registrate</Link>
        <Link to="/login" className="header-sections-text">Iniciar sesión</Link>
        {/* <Link to="/home" className="header-sections-text">Inicio</Link> */}
        {/* <Link to="/about" className="header-sections-text">Nosotros</Link> */}
        <Link to="/home#footer" onClick={handleContactNavigation} className="header-sections-text">Contacto</Link>
      </div>
    </nav>
  </header>
  );
};

export default Header;
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import bannerAnima1 from "../../assets/banner-anima-1.png";
import bannerAnima2 from "../../assets/banner-anima-2.png";
import bannerAnima3 from "../../assets/banner-anima-3.png";
import thotem from "../../assets/thotem.png";
import Profile from "../Profile";
import { useAuth } from "../../auth/AuthContext";

import "./style.css";

// Agregá o quitá imágenes acá según cuántas quieras rotar
const bannerImages = [bannerAnima1, bannerAnima2, bannerAnima3];
const BANNER_INTERVAL = 6000; // ms entre imágenes

const Header = ({ home, onContactClick }) => {
  const navigate = useNavigate();
  const { user, authLoading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

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
    setMenuOpen(false);

    if (onContactClick) {
      onContactClick();
      return;
    }

    navigate("/home");
    setTimeout(() => {
      document.getElementById("footer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      navigate("/home");
    } catch (err) {
      setLogoutError(err.message);
    } finally {
      setLoggingOut(false);
    }
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
    <nav className="header__navigation" aria-label="Navegación principal" ref={menuRef}>
      <button ref={menuButtonRef} type="button" className="header__menu-toggle" aria-expanded={menuOpen} aria-controls="header-menu" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <div id="header-menu" className={`header__sections${menuOpen ? ' header__sections--open' : ''}`} onClick={(event) => { if (event.target.closest('a')) setMenuOpen(false); }}>
        {authLoading ? (
          <span className="header-sections-text" role="status">Cargando sesión…</span>
        ) : user ? (
          <button type="button" className="header-sections-text header__logout" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        ) : (
          <>
            <Link to="/register" className="header-sections-text">Registrate</Link>
            <Link to="/login" className="header-sections-text">Iniciar sesión</Link>
          </>
        )}
        {/* <Link to="/home" className="header-sections-text">Inicio</Link> */}
        {/* <Link to="/about" className="header-sections-text">Nosotros</Link> */}
        <Link to="/home#footer" onClick={handleContactNavigation} className="header-sections-text">Contacto</Link>
        {user?.canPurchase && <Link to="/admin-plan" className="header-sections-text">Administrar</Link>}
        {user?.typeUser === 'superadmin' && <Link to="/platform" className="header-sections-text">Instituciones</Link>}
        {user && <Profile name={user.name} typeUser={user.typeUser === 'superadmin' ? 'Super admin' : user.typeUser === 'admin' ? 'Administrador' : 'Usuario'} />}
        {logoutError && <p className="header__session-error" role="alert">{logoutError}</p>}
      </div>
    </nav>
  </header>
  );
};

export default Header;

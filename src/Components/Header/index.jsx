import React from "react";
import { useNavigate, Link } from "react-router-dom";

import bannerAnima from "../../assets/banner-anima.png";
import thotem from "../../assets/thotem.png";

import "./style.css";

const Header = ({home}) => {
  const navigate = useNavigate();

  return (
    <header className={ home === true ? "banner-container" : "header" }>
      { home == true && (
        <img
          src={bannerAnima}
          alt="Banner Ánima Campus"
          className="banner-img"
          onClick={() => navigate("/home")}
        />
      )}
      { home == false && (
        <img
         src={thotem} 
         alt="Thotem Ánima Campus" 
         className="thotem-img" 
         onClick={() => navigate("/home")}
        />
        )}
      <nav className="header">
        <div className="header__sections">
          <Link to="/register" className="header-sections-text">
            Registrate
          </Link>
          <Link to="/login" className="header-sections-text">
            Iniciar Sesión
          </Link>
          <Link to="/home" className="header-sections-text">
            Inicio
          </Link>
          <Link to="/about" className="header-sections-text">
            Nosotros
          </Link>
          <Link to="/contact" className="header-sections-text">
            Contacto
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
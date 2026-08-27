import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./style.css";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home">
      <div className="home__content">
        <button 
          className="home__content-button"
          onClick={() => navigate("/available-packages")}
        >
          ¡Paquetes Disponibles!
        </button>
                <button 
          className="home__content-button"
          onClick={() => navigate("/default-page")}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default Home;

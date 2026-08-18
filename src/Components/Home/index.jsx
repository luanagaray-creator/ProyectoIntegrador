import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../Footer";
import Header from "../Header";

import "./style.css";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home">
      <Header home={true} />
      <div className="home__content">
        <button 
          className="home__content-button"
          onClick={() => navigate("/available-packages")}
        >
          ¡Paquetes Disponibles!
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

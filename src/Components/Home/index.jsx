import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./style.css";

const Home = () => {
  const navigate = useNavigate();
  const aboutContentRef = useRef(null);
  const boxRefs = useRef([]);
  const timeoutIds = useRef([]);

  useEffect(() => {
    const clearTimeouts = () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };

    const hideBoxes = () => {
      clearTimeouts();
      boxRefs.current.forEach((box) => {
        if (box) box.classList.remove("home-about__content-box--visible");
      });
    };

    const showBoxes = () => {
      clearTimeouts();
      boxRefs.current.forEach((box, index) => {
        if (box) {
          const id = setTimeout(() => {
            box.classList.add("home-about__content-box--visible");
          }, index * 180);
          timeoutIds.current.push(id);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showBoxes();
          } else {
            hideBoxes();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    if (aboutContentRef.current) {
      observer.observe(aboutContentRef.current);
    }

    return () => {
      clearTimeouts();
      observer.disconnect();
    };
  }, []);

  const setBoxRef = (index) => (element) => {
    boxRefs.current[index] = element;
  };

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
      <div className="home-about">
        <span className="home-about__title">Sobre nosotros...</span>
        <div ref={aboutContentRef} className="home-about__content">
          <div
            ref={setBoxRef(0)}
            className="home-about__content-box"
          >
            <span className="home-about__content-box-title">Visión</span>
            <p className="home-about__content-box-text">
              Centralizar la comunicación en las instituciones educativas a
              través de una aplicación móvil de avisos institucionales,
              garantizando que los mensajes clave se reciban e interpreten de
              manera oportuna, clara y con la importancia que merecen,
              reduciendo la carga administrativa de los docentes y la
              desinformación en los estudiantes.
            </p>
          </div>
          <div
            ref={setBoxRef(1)}
            className="home-about__content-box"
          >
            <span className="home-about__content-box-title">Misión</span>
            <p className="home-about__content-box-text">
              Ser la plataforma de comunicación institucional referente en el
              sector educativo a nivel nacional, transformando la interacción
              entre instituciones, docentes y estudiantes mediante soluciones
              tecnológicas innovadoras que garanticen una comunicación
              transparente, eficiente y trazable.
            </p>
          </div>
          <div
            ref={setBoxRef(2)}
            className="home-about__content-box"
          >
            <span className="home-about__content-box-title">Valores</span>
            <p className="home-about__content-box-text">
              Formalidad y Claridad: Buscamos que toda comunicación tanto dentro
              del software que desarrollamos como en nuestras interacciones
              internas sea seria, oportuna y transparente para evitar
              ambigüedades.
            </p>
            <p className="home-about__content-box-text">
              Empatía y Respeto: Ponemos a las personas en el centro,
              comprendiendo las necesidades de los usuarios y respetando las
              opiniones, tiempos y aportes de cada integrante del equipo.
            </p>
            <p className="home-about__content-box-text">
              Colaboración e Integración: Promovemos una cultura de trabajo en
              equipo sin barreras jerárquicas, basada en el apoyo mutuo y el
              feedback constructivo entre los distintos miembros del equipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

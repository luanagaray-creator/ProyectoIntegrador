import { useNavigate, Link } from "react-router-dom";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user, authLoading, sessionError } = useAuth();
  const activeSpaces = user?.spaces?.filter(space => space.isActive) || [];
  const canEnterInbox = user?.typeUser === 'superadmin' || (user?.typeUser === 'admin' && user?.managedInstitutions?.length > 0);
  return (
    <div className="home">
      <div className="home__content">
        {(!user || user.canPurchase) && <button
          className="home__content-button"
          onClick={() => navigate(user?.purchase ? '/current-plan' : '/available-packages')}
        >
          {user?.purchase ? 'Plan Actual' : '¡Paquetes Disponibles!'}
        </button>}
        {!authLoading && !sessionError && (user?.hasAccess || canEnterInbox) && <button
          className="home__content-button"
          onClick={() => navigate(canEnterInbox && (user?.typeUser === 'superadmin' || !user?.hasAccess || activeSpaces.length === 1) ? '/default-page' : activeSpaces.length === 1 ? '/default-page' : '/spaces')}
        >
          Ingresar
        </button>}
        {!authLoading && user?.canPurchase && <Link className="home__content-button home__plan-link" to="/admin-plan">Administrar espacios</Link>}
        {!authLoading && user?.typeUser === 'superadmin' && <Link className="home__content-button home__plan-link" to="/platform">Administrar instituciones</Link>}
        {!authLoading && user && user.typeUser !== 'superadmin' && !user.hasAccess && <div className="home__access-notice">
          <p>Tu institución debe habilitarte en un espacio y activar su plan para que puedas ingresar.</p><Link to="/spaces">Ver mis espacios</Link>
        </div>}
      </div>
      <div className="home-about">
        <h2 className="home-about__title">Sobre nosotros</h2>
        <div className="home-about__content">
          <details className="home-about__card">
            <summary className="home-about__card-trigger">
              <span className="home-about__card-title">Visión</span>
              <span className="home-about__card-chevron" aria-hidden="true" />
            </summary>
            <div className="home-about__card-body">
            <p className="home-about__content-box-text">
              Centralizar la comunicación en las instituciones educativas a
              través de una aplicación móvil de avisos institucionales,
              garantizando que los mensajes clave se reciban e interpreten de
              manera oportuna, clara y con la importancia que merecen,
              reduciendo la carga administrativa de los docentes y la
              desinformación en los estudiantes.
            </p>
          
            </div>
          </details>
          <details className="home-about__card">
            <summary className="home-about__card-trigger">
              <span className="home-about__card-title">Misión</span>
              <span className="home-about__card-chevron" aria-hidden="true" />
            </summary>
            <div className="home-about__card-body">
            <p className="home-about__content-box-text">
              Ser la plataforma de comunicación institucional referente en el
              sector educativo a nivel nacional, transformando la interacción
              entre instituciones, docentes y estudiantes mediante soluciones
              tecnológicas innovadoras que garanticen una comunicación
              transparente, eficiente y trazable.
            </p>
          
            </div>
          </details>
          <details className="home-about__card">
            <summary className="home-about__card-trigger">
              <span className="home-about__card-title">Valores</span>
              <span className="home-about__card-chevron" aria-hidden="true" />
            </summary>
            <div className="home-about__card-body">
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
          </details>
        </div>
      </div>
    </div>
  );
};

export default Home;

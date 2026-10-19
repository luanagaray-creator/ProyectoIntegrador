import { useNavigate, Navigate } from "react-router-dom";

import WaveBackground from "../WaveBackground";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const Receipt = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="receipt"><p className="receipt__loading" role="status">Cargando comprobante…</p></div>;
  if (user?.typeUser !== 'admin' || !user.purchase) return <Navigate to="/home" replace />;
  const { purchase } = user;
  const includedSpaces = user.managedSpaces.filter(space => purchase.spaceIds.includes(space.id));

  return (
    <div className="receipt">
      <WaveBackground />
      <div className="receipt__content">
        <section className="receipt__box" aria-labelledby="receipt-title">
          <span className="receipt__status">Pago exitoso</span>
          <h1 id="receipt-title" className="receipt__title">¡Listo! Tu pago fue aprobado</h1>
          <p className="receipt__description">El pago fue simulado. No se realizó ningún cobro.</p>
          <dl className="receipt__details">
            <div className="receipt__row"><dt>Plan</dt><dd>{purchase.plan}</dd></div>
            <div className="receipt__row"><dt>Método de pago</dt><dd>{purchase.method}</dd></div>
            {purchase.paidAt && <div className="receipt__row"><dt>Fecha</dt><dd>{new Date(purchase.paidAt).toLocaleDateString('es-UY')}</dd></div>}
            <div className="receipt__row receipt__row--spaces">
              <dt>Espacios incluidos</dt>
              <dd>{includedSpaces.length ? <ul>{includedSpaces.map(space => <li key={space.id}>{space.institutionName} · {space.name}</li>)}</ul> : 'Sin espacios incluidos'}</dd>
            </div>
            {purchase.amount != null && <div className="receipt__row receipt__row--total"><dt>Total simulado</dt><dd>{Number(purchase.amount).toLocaleString('es-UY')}</dd></div>}
          </dl>
        <button
          className="receipt__content-button"
          onClick={() => navigate("/home")}
        >
          Volver al inicio
        </button>
        </section>
      </div>
    </div>
  );
};

export default Receipt;

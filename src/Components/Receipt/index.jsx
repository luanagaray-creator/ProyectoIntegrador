import { useNavigate, Navigate, useLocation } from "react-router-dom";
import packageJson from '../../../package.json';

import WaveBackground from "../WaveBackground";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const Receipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="receipt"><p className="receipt__loading" role="status">Cargando comprobante…</p></div>;
  const institution = user?.managedInstitutions?.find(item => item.id === location.state?.institutionId);
  const purchase = institution?.plan ? institution : user?.purchase;
  if (user?.typeUser !== 'admin' || !purchase) return <Navigate to="/home" replace />;
  const includedSpaces = user.managedSpaces.filter(space => institution ? space.institutionId === institution.id : purchase.spaceIds.includes(space.id));

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
              <dd>{includedSpaces.length ? <ul>{includedSpaces.map(space => <li key={space.id}>{space.institutionName} · {space.name}</li>)}</ul> : `Podés crear hasta ${packageJson.planLimits[purchase.plan]} espacios desde Administración.`}</dd>
            </div>
            {purchase.amount != null && <div className="receipt__row receipt__row--total"><dt>Total simulado</dt><dd>{Number(purchase.amount).toLocaleString('es-UY')} USD</dd></div>}
          </dl>
        <button
          className="receipt__content-button"
          onClick={() => navigate("/admin-plan")}
        >
          Administrar mis espacios
        </button>
        </section>
      </div>
    </div>
  );
};

export default Receipt;

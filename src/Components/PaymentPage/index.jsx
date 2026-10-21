import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import packageJson from '../../../package.json';
import WaveBackground from '../WaveBackground';
import visa from '../../assets/visa.png';
import mercadoPago from '../../assets/mercadoPago.png';
import mastercard from '../../assets/mastercard.png';
import './style.css';
import '../AdminPlan/style.css';

const methods = [{ name: 'Visa', image: visa }, { name: 'Mercado Pago', image: mercadoPago }, { name: 'Mastercard', image: mastercard }];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, authLoading, simulatePayment, sessionError } = useAuth();
  const selectedPlan = location.state?.plan;
  const validPlan = Object.values(packageJson.planName).includes(selectedPlan);
  const planKey = Object.keys(packageJson.planName).find(key => packageJson.planName[key] === selectedPlan);
  const price = packageJson.planPrices[planKey];
  const [method, setMethod] = useState('Visa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chosenInstitution, setInstitution] = useState('');
  const managedSpaces = user?.managedSpaces || [];
  const institutions = user?.managedInstitutions || [...new Map(managedSpaces.map(space => [space.institutionId, { id: space.institutionId, name: space.institutionName, spaceCount: managedSpaces.filter(item => item.institutionId === space.institutionId).length }])).values()];
  const institutionId = chosenInstitution || location.state?.institutionId || user?.purchase?.institutionId || institutions[0]?.id;
  const institution = institutions.find(item => item.id === institutionId);
  const spaceLimit = packageJson.planLimits[selectedPlan] || 0;
  const exceedsLimit = (institution?.spaceCount || 0) > spaceLimit;
  const continuation = { from: '/payment-page', plan: selectedPlan, institutionId };

  async function pay(event) {
    event.preventDefault();
    if (!user?.canPurchase || !validPlan || loading || !institution || exceedsLimit) return;
    setLoading(true);
    setError('');
    try {
      await simulatePayment({ plan: selectedPlan, method, institutionId });
      navigate('/receipt', { replace: true, state: { institutionId } });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="payment-page">
    <WaveBackground />
    <div className="payment-page__content">
      <form className={`payment-page__content-box${user?.typeUser === 'admin' ? ' payment-page__content-box--admin' : ''}`} onSubmit={pay}>
        <div className="payment-page__content-boxTop">
          <h1 className="payment-page__content-boxTop-text">Seleccioná un método de pago</h1>
          {validPlan && <span className="payment-page__content-boxTop-planName">{selectedPlan}</span>}
        </div>
        <div className="payment-page__summary">
          <p className="payment-page__notice">Pago simulado: no se realizará ningún cobro.</p>
          {validPlan && <span className="payment-page__total">Total <strong>{price} USD</strong></span>}
        </div>
        {user && !user.canPurchase ? <p className="payment-page__notice">Los planes los pagan los administradores. Necesitás que Thotem te autorice como administrador de una institución para contratarlo. <Link to="/home">Volver al inicio</Link></p> : !validPlan ? <Link to="/available-packages">Elegir un paquete</Link> : <>
          {user?.canPurchase && <>
            {institutions.length > 1 && <label className="payment-page__institution">Institución<select className="payment-page__content-boxBottom-input" value={institutionId} disabled={loading} onChange={event => setInstitution(event.target.value)}>{institutions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
            <p className="payment-page__notice">{institution?.name && <strong>{institution.name} · </strong>}Podrás crear hasta {spaceLimit} espacios con el nombre que quieras y {packageJson.planMemberLimits[selectedPlan]} usuarios por espacio, después de contratar el plan.</p>
            {exceedsLimit && <p role="alert">La institución ya tiene {institution.spaceCount} espacios. Eliminá los que no necesites antes de bajar a este plan.</p>}
          </>}
          <div className="payment-page__content-boxCenter" role="group" aria-label="Método de pago">
            {methods.map(item => <button key={item.name} type="button" className="payment-page__method" aria-pressed={method === item.name} onClick={() => setMethod(item.name)} disabled={loading}>
              <img src={item.image} alt={item.name} />
            </button>)}
          </div>
          <hr className="divider" />
          {method !== 'Mercado Pago' && <div className="payment-page__content-boxBottom">
            <label className="payment-page__content-boxBottom-label" htmlFor="demoCard">Tarjeta de demostración</label>
            <input id="demoCard" className="payment-page__content-boxBottom-input" value="•••• •••• •••• 4242" readOnly />
            <label className="payment-page__content-boxBottom-label" htmlFor="demoHolder">Titular de demostración</label>
            <input id="demoHolder" className="payment-page__content-boxBottom-input" value="Usuario de prueba" readOnly />
          </div>}
          {method === 'Mercado Pago' && <p className="payment-page__notice">Se simulará un pago aprobado con Mercado Pago.</p>}
          {(error || sessionError) && <p role="alert">{error || sessionError}</p>}
          {authLoading ? <p role="status">Cargando sesión…</p> : user ? <button className="payment-page__content-boxBottom-button" disabled={loading || !!sessionError || !institution || exceedsLimit}>
            {loading ? 'Procesando…' : 'Simular pago'}
          </button> : <div className="payment-page__notice payment-page__account">
            <p>Para contratar un plan y crear espacios, iniciá sesión con una cuenta administradora.</p>
            <div className="payment-page__account-actions">
              <Link to="/login" state={continuation}>Iniciar sesión</Link>
            </div>
          </div>}
        </>}
      </form>
    </div>
  </div>;
}

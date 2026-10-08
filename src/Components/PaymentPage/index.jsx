import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import packageJson from '../../../package.json';
import WaveBackground from '../WaveBackground';
import visa from '../../assets/visa.png';
import mercadoPago from '../../assets/mercadoPago.png';
import mastercard from '../../assets/mastercard.png';
import './style.css';

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
  const continuation = { from: '/payment-page', plan: selectedPlan };

  async function pay(event) {
    event.preventDefault();
    if (!user || !validPlan || loading) return;
    setLoading(true);
    setError('');
    try {
      await simulatePayment({ plan: selectedPlan, method });
      navigate('/receipt', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="payment-page">
    <WaveBackground />
    <div className="payment-page__content">
      <form className="payment-page__content-box" onSubmit={pay}>
        <div className="payment-page__content-boxTop">
          <h1 className="payment-page__content-boxTop-text">Seleccioná un método de pago</h1>
          {validPlan && <span className="payment-page__content-boxTop-planName">{selectedPlan}</span>}
        </div>
        <div className="payment-page__summary">
          <p className="payment-page__notice">Pago simulado: no se realizará ningún cobro.</p>
          {validPlan && <span className="payment-page__total">Total <strong>{price}</strong></span>}
        </div>
        {!validPlan ? <Link to="/available-packages">Elegir un paquete</Link> : <>
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
          {authLoading ? <p role="status">Cargando sesión…</p> : user ? <button className="payment-page__content-boxBottom-button" disabled={loading || !!sessionError}>
            {loading ? 'Procesando…' : 'Simular pago'}
          </button> : <div className="payment-page__notice payment-page__account">
            <p>Para completar el pago simulado, iniciá sesión o creá tu cuenta.</p>
            <div className="payment-page__account-actions">
              <Link to="/login" state={continuation}>Iniciar sesión</Link>
              <Link to="/register" state={continuation}>Registrarse</Link>
            </div>
          </div>}
        </>}
      </form>
    </div>
  </div>;
}

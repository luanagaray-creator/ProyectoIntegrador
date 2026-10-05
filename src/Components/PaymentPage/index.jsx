import { useLocation, useNavigate } from "react-router-dom";

import WaveBackground from "../WaveBackground";

import visa from "../../assets/visa.png";
import mercadoPago from "../../assets/mercadoPago.png";
import mastercard from "../../assets/mastercard.png";

import "./style.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedPlan = location.state?.plan;

  return (
    <div className="payment-page">
      <WaveBackground />
      <div className="payment-page__content">
        <div className="payment-page__content-box">
          <div className="payment-page__content-boxTop">
            <span className="payment-page__content-boxTop-text">
              Selecciona un metodo de pago
            </span>
            <span className="payment-page__content-boxTop-planName">{selectedPlan}</span>
          </div>
          <div className="payment-page__content-boxCenter">
            <img
              src={visa}
              alt="visa"
              className="payment-page__content-boxCenter-img"
            />
            <img
              src={mercadoPago}
              alt="mercado pago"
              className="payment-page__content-boxCenter-img"
            />
            <img
              src={mastercard}
              alt="mastercard"
              className="payment-page__content-boxCenter-img"
            />
          </div>
          <hr className="divider" />
          <div className="payment-page__content-boxTotal">
            <div className="payment-page__content-boxBottom">
              <label className="payment-page__content-boxBottom-label" htmlFor="cardNumber">
                Número de tarjeta
              </label>
              <input className="payment-page__content-boxBottom-input" type="text" placeholder="Número de tarjeta" />
              <label className="payment-page__content-boxBottom-label" htmlFor="cardHolder">
                Nombre del titular
              </label>
              <input className="payment-page__content-boxBottom-input" type="text" placeholder="Nombre del titular" />
              <label className="payment-page__content-boxBottom-label" htmlFor="expirationDate">
                Fecha de vencimiento (MM/AA)
              </label>
              <input className="payment-page__content-boxBottom-input" type="text" placeholder="Fecha de vencimiento (MM/AA)" />
              <label className="payment-page__content-boxBottom-label" htmlFor="cvv">
                Código de seguridad (CVV)
              </label>
              <input className="payment-page__content-boxBottom-input" type="text" placeholder="Código de seguridad (CVV)" />
            </div>
          </div>
          <button 
            className="payment-page__content-boxBottom-button"
            onClick={() => navigate("/receipt")}
          >Pagar</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
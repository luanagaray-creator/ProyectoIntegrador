import { useNavigate } from "react-router-dom";

import WaveBackground from "../WaveBackground";

import receipt from "../../assets/receipt.png";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const Receipt = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="receipt">
      <WaveBackground />
      <div className="receipt__content">
        <img src={receipt} alt="receipt" className="receipt__content-img" />
        <p style={{ color: 'var(--text-body)', textAlign: 'center' }}>¡Pago simulado completado!<br />{user?.purchase?.plan} · {user?.purchase?.method}<br />{user?.purchase?.amount != null && <>Total simulado: {user.purchase.amount}<br /></>}Ya podés ingresar a Thotem. No se realizó ningún cobro.</p>
        <button
          className="receipt__content-button"
          onClick={() => navigate("/home")}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default Receipt;

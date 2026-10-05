import { useNavigate } from "react-router-dom";

import WaveBackground from "../WaveBackground";

import receipt from "../../assets/receipt.png";

import "./style.css";

const Receipt = () => {
  const navigate = useNavigate();

  return (
    <div className="receipt">
      <WaveBackground />
      <div className="receipt__content">
        <img src={receipt} alt="receipt" className="receipt__content-img" />
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

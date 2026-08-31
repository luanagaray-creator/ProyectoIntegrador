import { useNavigate } from "react-router-dom";

import receipt from "../../assets/receipt.png";

import "./style.css";

const Receipt = () => {
    const navigate = useNavigate();

    return (
        <div className="receipt">
            <div className="receipt__content">
                <div>
                    <img src={receipt} alt="receipt" className="receipt__content-img" />
                </div>
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
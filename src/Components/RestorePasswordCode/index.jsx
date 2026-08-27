import { useNavigate } from "react-router-dom";

import "./style.css";

const RestorePasswordCode = () => {
    const navigate = useNavigate();

    return (
        <div className="restore-password-code">
            <div className="restore-password-code__content">
                <div className="restore-password-code__content-box">
                    <div className="restore-password-code__content-box-textContent">
                        <span className="restore-password-code__content-box-title">
                            Restaurar Contraseña
                        </span>
                        <p className="restore-password-code__content-box-text">
                            Ingresa el código de recuperación.
                        </p>
                    </div>
                    <input
                        type="text"
                        placeholder="Código de recuperación"
                        className="restore-password-code__content-box-input"
                    />
                    <button
                        className="restore-password-code__content-box-button"
                        onClick={() => navigate("/restore-password-confirm")}
                    >
                        Enviar Código
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestorePasswordCode;
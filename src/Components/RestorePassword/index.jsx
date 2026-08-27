import { useNavigate } from "react-router-dom";

import "./style.css";

const RestorePassword = () => {
    const navigate = useNavigate();

    return (
        <div className="restore-password">
            <div className="restore-password__content">
                <form className="restore-password__content-form">
                    <span className="restore-password__content-form-title">
                        Restaurar Contraseña
                    </span>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        className="restore-password__content-form-input"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="restore-password__content-form-input"
                    />
                    <button
                        type="submit"
                        className="restore-password__content-form-button"
                        onClick={() => navigate("/restore-password-code")}
                    >
                        Enviar Solicitud
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RestorePassword;
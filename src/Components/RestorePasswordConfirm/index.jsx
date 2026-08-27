import { useNavigate } from "react-router-dom";

import "./style.css";

const RestorePasswordConfirm = () => {
    const navigate = useNavigate();

    return (
        <div className="restore-password-confirm">
            <div className="restore-password-confirm__content">
                <form className="restore-password-confirm__content-form">
                    <span className="restore-password-confirm__content-form-title">
                        Restaurar Contraseña
                    </span>
                    <input
                        type="password"
                        name="contraseña"
                        placeholder="Contraseña"
                        className="restore-password-confirm__content-form-input"
                    />
                    <input
                        type="password confirmation"
                        name="password confirmation"
                        placeholder="Password confirmation"
                        className="restore-password-confirm__content-form-input"
                    />
                    <button
                        type="submit"
                        className="restore-password-confirm__content-form-button"
                        onClick={() => navigate("/login")}
                    >
                        Cambiar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RestorePasswordConfirm;
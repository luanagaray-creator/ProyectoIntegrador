import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import WaveBackground from "../WaveBackground";

import "./style.css";


const Login = () => {
  const navigate = useNavigate();
  const { login, user, authLoading, sessionError } = useAuth();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, password } = formData;

    if (!name || !password) {
      return "Completá todos los campos";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading && user) return <Navigate to="/home" replace />;

  return (
    <div className="login">
      <WaveBackground />
      <div className="login__content">
        <form className="login__content-form" onSubmit={handleSubmit}>
          <div className="login__content-form-header">
            <h1 className="login__content-form-title">Iniciar Sesión</h1>
            <Link to="/register" className="login__content-form-link">
              Regístrate aquí
            </Link>
          </div>

          {(error || sessionError) && <p className="login__content-form-error" role="alert">{error || sessionError}</p>}
          <input
            type="text"
            name="name"
            autoComplete="username"
            required
            placeholder="Usuario o email"
            className="login__content-form-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            maxLength={128}
            placeholder="Contraseña"
            className="login__content-form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="login__content-form-button"
            disabled={loading || authLoading}
          >
            {loading ? "Iniciando sesión..." : "Login"}
          </button>
          <Link to="/restore-password" className="login__content-form-link">
            ¿Olvidaste tu contraseña? Restaura tu contraseña
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";

import WaveBackground from "../WaveBackground";
import { useAuth } from "../../auth/AuthContext";

import "./style.css";


const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from === '/payment-page' ? '/payment-page' : '/home';
  const destinationState = destination === '/payment-page' ? { plan: location.state.plan } : undefined;
  const { register, user, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    passwordConfirmation: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, password, passwordConfirmation, email } = formData;

    if (!name || !password || !passwordConfirmation || !email) {
      return "Completá todos los campos";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "El email no tiene un formato válido";
    }

    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    if (password !== passwordConfirmation) {
      return "Las contraseñas no coinciden";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate(destination, { replace: true, state: destinationState });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading && user) return <Navigate to={destination} state={destinationState} replace />;

  return (
    <div className="register">
      <WaveBackground />
      <div className="register__content">
        <form className="register__content-form" onSubmit={handleSubmit}>
          <h1 className="register__content-form-title">Registrarse</h1>

          {error && <p className="register__content-form-error">{error}</p>}

          <input
            type="text"
            name="name"
            required
            maxLength={30}
            autoComplete="username"
            placeholder="Nombre de usuario"
            className="register__content-form-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            required
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            placeholder="Contraseña"
            className="register__content-form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="passwordConfirmation"
            required
            maxLength={128}
            autoComplete="new-password"
            placeholder="Confirmá tu contraseña"
            className="register__content-form-input"
            value={formData.passwordConfirmation}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            required
            maxLength={30}
            autoComplete="email"
            placeholder="Email"
            className="register__content-form-input"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="register__content-form-button"
            disabled={loading || authLoading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          <Link to="/login" state={location.state} className="register__content-form-link">
            ¿Ya tenés una cuenta? Iniciá sesión
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;

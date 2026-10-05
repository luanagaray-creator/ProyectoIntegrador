import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WaveBackground from "../WaveBackground";

import "./style.css";

const API_URL = "http://localhost:3000/api/register"; // TODO: reemplazar con el endpoint real

const Register = () => {
  const navigate = useNavigate();

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

    // TODO: Descomentar cuando el backend esté disponible
    /*
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "No se pudo completar el registro");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    */

    setTimeout(() => {
      navigate("/home");
      setLoading(false);
    }, 500);
  };

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
            placeholder="Name"
            className="register__content-form-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="register__content-form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Password Confirmation"
            className="register__content-form-input"
            value={formData.passwordConfirmation}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Recuperation"
            className="register__content-form-input"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="register__content-form-button"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
            {/* {handleSubmit.response && <p className="register__content-form-success">{handleSubmit.response}</p> && navigate("/home")} */}
          </button>
          <Link to="/login" className="register__content-form-link">
            ¿Ya tenés una cuenta? Iniciá sesión
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
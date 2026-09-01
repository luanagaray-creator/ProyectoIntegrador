import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./style.css";

const API_URL = "http://localhost:3000/api/register"; // TODO: reemplazar con el endpoint real

const login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
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
    <div className="login">
      <div className="login__wave" aria-hidden="true">
        <svg className="login__wave-svg" viewBox="0 0 500 900" preserveAspectRatio="none">
          <g className="login__wave-path login__wave-path--back">
            <path d="M210 0C70 140 340 250 150 400C-20 550 300 700 200 900H500V0Z" />
          </g>
          <g className="login__wave-path login__wave-path--front">
            <path d="M290 0C150 160 400 290 230 440C70 590 360 740 270 900H500V0Z" />
          </g>
        </svg>
      </div>
      <div className="login__content">
        <form className="login__content-form" onSubmit={handleSubmit}>
          <h1 className="login__content-form-title">Login</h1>

          {error && <p className="login__content-form-error">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="login__content-form-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login__content-form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="login__content-form-button"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Login"}
            {/* {handleSubmit.response && <p className="login__content-form-success">{handleSubmit.response}</p> && navigate("/home")} */}
          </button>
          <Link to="/restore-password" className="login__content-form-link">
            ¿Olvidaste tu contraseña? Restaura tu contraseña
          </Link>
        </form>
      </div>
    </div>
  );
}

export default login;
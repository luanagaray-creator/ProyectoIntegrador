import { useState } from "react";
import "./style.css";

export default function PasswordInput({ className = "", wrapperClassName = "", ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`password-input ${wrapperClassName}`.trim()}>
      <input
        {...inputProps}
        type={visible ? "text" : "password"}
        className={`password-input__field ${className}`.trim()}
      />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M2.1 3.51 3.51 2.1 21.9 20.49l-1.41 1.41-3.22-3.22A12.3 12.3 0 0 1 12 19.5C7 19.5 2.73 16.39 1 12c.78-1.98 2.1-3.66 3.74-4.9L2.1 3.51ZM12 6.5c5 0 9.27 3.11 11 7.5a12.5 12.5 0 0 1-3.11 4.45l-2.92-2.92a5 5 0 0 0-6.5-6.5L8.3 6.86A12.7 12.7 0 0 1 12 6.5ZM6.18 8.52A10.5 10.5 0 0 0 3.15 12a10.1 10.1 0 0 0 12.61 4.82l-1.87-1.87a5 5 0 0 1-6.84-6.84L6.18 8.52Z" />
          </svg>
        )}
      </button>
    </div>
  );
}

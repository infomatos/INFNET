import { useId, useState } from "react";

export function Field({ id, label, error, help, children }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const helpId = help ? `${fieldId}-help` : undefined;
  const errId = error ? `${fieldId}-err` : undefined;

  return (
    <div className="field">
      {label && (
        <label className="label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      {children({ fieldId, helpId, errId })}
      {help && !error && (
        <div className="help" id={helpId}>
          {help}
        </div>
      )}
      {error && (
        <div className="error" id={errId}>
          {error}
        </div>
      )}
    </div>
  );
}

export function TextInput(props) {
  const { className = "", ...rest } = props;
  return <input className={`input ${className}`} {...rest} />;
}

export function NumberInput(props) {
  const { className = "", ...rest } = props;
  return (
    <input className={`input ${className}`} inputMode="numeric" {...rest} />
  );
}

export function TextArea(props) {
  const { className = "", ...rest } = props;
  return <textarea className={`textarea ${className}`} {...rest} />;
}

export function Select(props) {
  const { className = "", children, ...rest } = props;
  return (
    <select className={`select ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function PasswordInput({ className = "", ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-group">
      <input
        className={`input ${className}`}
        type={show ? "text" : "password"}
        {...rest}
      />
      <button
        type="button"
        className="toggle"
        onClick={() => setShow((s) => !s)}
      >
        {show ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}

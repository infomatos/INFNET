import { useState } from "react";

export default function LoginForm({ onSubmit, onCancel, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <div className="login-form-backdrop">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2> Acesse sua conta</h2>

        {error && <p className="error">{error}</p>}

        <label>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <div className="buttons">
          <button
            type="button"
            className="button button-outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="button button-outline"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { createContext, useContext, useState } from "react";
import { login as loginApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth_user"));
    } catch {
      return null;
    }
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function entrar({ email, password }) {
    setCarregando(true);
    setErro(null);
    try {
      const { user } = await loginApi({ email, password });
      setUsuario(user);
      localStorage.setItem("auth_user", JSON.stringify(user));
    } catch (e) {
      setErro(e.message || "Falha no login");
      throw e;
    } finally {
      setCarregando(false);
    }
  }

  function sair() {
    setUsuario(null);
    localStorage.removeItem("auth_user");
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair, carregando, erro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve estar dentro do AuthProvider");
  return ctx;
}

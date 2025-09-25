import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import "../styles/global.css";
import "../styles/header.css";
import LoginForm from "./login/LoginForm";
import { useAuth } from "../Hooks/useAuth";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const { usuario, entrar, sair, carregando, erro } = useAuth();
  const navigate = useNavigate();

  // sombra ao rolar
  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector(".header-container");
      if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // trava o scroll quando o menu está aberto
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuAberto]);

  // fecha menu no ESC e ao voltar para desktop
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuAberto(false);
    const onResize = () => window.innerWidth > 768 && setMenuAberto(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const alternarMenu = () => setMenuAberto((v) => !v);
  const fecharMenu = () => setMenuAberto(false);

  async function handleLogin(credenciais) {
    try {
      await entrar(credenciais);
      setMostrarLogin(false);
      navigate(0); // aplica permissões
    } catch {}
  }

  function handleSair() {
    sair();
    fecharMenu();
    navigate(0);
  }

  return (
    <>
      <header className={`header-container ${menuAberto ? "menu-open" : ""}`}>
        <div className="header-inner">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" />
          </div>

          <button
            className={`hamburger ${menuAberto ? "is-active" : ""}`}
            onClick={alternarMenu}
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            aria-label="Menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
            <span className="sr-only">Abrir menu</span>
          </button>

          <nav
            id="menu-principal"
            className={`nav ${menuAberto ? "open" : ""}`}
            aria-hidden={!menuAberto}
          >
            <ul onClick={fecharMenu}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Início
                </NavLink>
              </li>

              {usuario?.perfil === "Admin" && (
                <li>
                  <NavLink
                    to="/membros"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Membros
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink
                  to="/eventos"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Eventos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cursos"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Cursos
                </NavLink>
              </li>

              {!usuario && (
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Criar conta
                  </NavLink>
                </li>
              )}
              {/* Admin vê "Usuários" (CRUD). Membro/Visitante vê "Editar cadastro". */}
              {usuario?.perfil === "Admin" ? (
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Usuários
                  </NavLink>
                </li>
              ) : usuario ? (
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Editar cadastro
                  </NavLink>
                </li>
              ) : null}

              <li>
                {usuario ? (
                  <button className="button" onClick={handleSair}>
                    Sair
                  </button>
                ) : (
                  <button
                    className="button button-outline"
                    onClick={() => setMostrarLogin(true)}
                  >
                    Entrar
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div
        className={`menu-backdrop ${menuAberto ? "show" : ""}`}
        onClick={fecharMenu}
      />

      {mostrarLogin && !usuario && (
        <LoginForm
          onSubmit={handleLogin}
          onCancel={() => setMostrarLogin(false)}
          loading={carregando}
          error={erro}
        />
      )}
    </>
  );
}

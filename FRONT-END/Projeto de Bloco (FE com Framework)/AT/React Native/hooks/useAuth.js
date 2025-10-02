import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase';
import {
  getMeuPerfil,
  isAdmin as srvIsAdmin,
  criarPerfilVisitante,
} from '../services/perfis';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  const [perfil, setPerfil] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [erroAuth, setErroAuth] = useState(null);
  const [carregandoAuth, setCarregandoAuth] = useState(false);

  // Sessão inicial + listener
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUsuario(data.session?.user ?? null);
      setCarregandoSessao(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUsuario(session?.user ?? null);
    });
    return () => sub.subscription?.unsubscribe?.();
  }, []);

  // Atualiza perfil e flag admin quando usuário muda
  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!usuario) {
        if (!cancel) {
          setPerfil(null);
          setIsAdmin(false);
        }
        return;
      }
      try {
        const [p, rpcAdmin] = await Promise.all([
          getMeuPerfil().catch(() => null),
          srvIsAdmin().catch(() => false),
        ]);
        if (cancel) return;

        setPerfil(p ?? null);
        const adminFromPerfil = p?.perfil === 'Admin';
        setIsAdmin(Boolean(adminFromPerfil || rpcAdmin));
      } catch {
        if (!cancel) {
          setPerfil((prev) => prev ?? null);
          setIsAdmin(false);
        }
      }
    })();
    return () => {
      cancel = true;
    };
  }, [usuario]);

  // Ações
  async function entrar({ email, senha }) {
    setErroAuth(null);
    setCarregandoAuth(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;
    } catch (e) {
      setErroAuth(e?.message || 'Falha ao autenticar.');
      throw e;
    } finally {
      setCarregandoAuth(false);
    }
  }

  async function sair() {
    setErroAuth(null);
    await supabase.auth.signOut();
  }

  async function cadastrarEmailSenha({ email, senha }) {
    setErroAuth(null);
    setCarregandoAuth(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) throw error;
      return true;
    } catch (e) {
      setErroAuth(e?.message || 'Falha ao cadastrar.');
      throw e;
    } finally {
      setCarregandoAuth(false);
    }
  }

  async function resetarSenha(email) {
    setErroAuth(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://6gkmd5.csb.app',
      });
      if (error) throw error;
      return true;
    } catch (e) {
      setErroAuth(e?.message || 'Falha ao enviar e-mail de recuperação.');
      throw e;
    }
  }

  async function garantirPerfilVisitante(dados) {
    try {
      await criarPerfilVisitante(dados);
    } catch {}
  }

  // Força revalidar perfil/isAdmin (para pull-to-refresh)
  async function refreshAuth() {
    if (!usuario) {
      setPerfil(null);
      setIsAdmin(false);
      return;
    }
    try {
      const [p, admin] = await Promise.all([
        getMeuPerfil().catch(() => null),
        srvIsAdmin().catch(() => false),
      ]);
      setPerfil(p ?? null);
      setIsAdmin(!!admin || p?.perfil === 'Admin');
    } catch {
      // mantém estado atual, mas não trava a UI
    }
  }

  const valor = useMemo(
    () => ({
      // estados
      usuario,
      carregandoSessao,
      perfil,
      isAdmin,
      erroAuth,
      carregandoAuth,
      // ações
      entrar,
      sair,
      cadastrarEmailSenha,
      resetarSenha,
      garantirPerfilVisitante,
      refreshAuth,
    }),
    [usuario, carregandoSessao, perfil, isAdmin, erroAuth, carregandoAuth]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error('useAuth deve ser usado dentro de <AuthProvider />');
  return ctx;
}

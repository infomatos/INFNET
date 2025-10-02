import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import * as Notifications from 'expo-notifications';

import { Platform } from 'react-native';

import { COLORS } from '../theme';
import { VIDEOS } from '../data/video';
import Hero from '../components/Hero';
import VideoGrid from '../components/VideoGrid';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignUpModal';
import AdminPanel from '../components/AdminPainel';
import MinhaContaModal from '../components/MinhaContaModal';
import EditarPerfilModal from '../components/EditarPerfilModal';

import { useAuth } from '../hooks/useAuth';

const validarEmail = (v) => /\S+@\S+\.\S+/.test(v);

export default function HomeScreen({ navigation }) {
  const {
    usuario,
    carregandoSessao,
    isAdmin,
    perfil,
    entrar,
    sair,
    cadastrarEmailSenha,
    resetarSenha,
    garantirPerfilVisitante,
    erroAuth,
    carregandoAuth,
    refreshAuth,
  } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  // ======= estados de UI (modais e formulários) =======
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [mostrarConta, setMostrarConta] = useState(false);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const [cadValues, setCadValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    idade: '',
    endereco: '',
    senha: '',
  });

  // ======= notificações locais (para evitar import não usado) =======

  useEffect(() => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}, []);


  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de notificação negada');
      }
    })();
  }, []);

  // ======= handlers mínimos =======
  function abrirCadastro() {
    setMostrarLogin(false);
    setErro('');
    setCadValues((v) => ({ ...v, email: email || '', senha: senha || '' }));
    setMostrarCadastro(true);
  }

  async function handleCadastrar() {
    setErro('');
    const v = cadValues;
    if (!validarEmail(v.email)) return setErro('Informe um e-mail válido.');
    if (!v.nome || v.nome.length < 2) return setErro('Informe seu nome.');
    if (!v.senha || v.senha.length < 6)
      return setErro('A senha deve ter ao menos 6 caracteres.');

    try {
      await cadastrarEmailSenha({ email: v.email, senha: v.senha });
      // tenta criar perfil visitante (ok se falhar antes de confirmar/login)
      try {
        await garantirPerfilVisitante({
          nome: v.nome,
          email: v.email,
          telefone: v.telefone,
          idade: v.idade,
          endereco: v.endereco,
        });
      } catch {}
      setMostrarCadastro(false);
      setMostrarLogin(false);
      setEmail(v.email);
      setSenha('');
      setCadValues({
        nome: '',
        email: '',
        telefone: '',
        idade: '',
        endereco: '',
        senha: '',
      });
      alert('Cadastro iniciado! Verifique seu e-mail para confirmar a conta.');
    } catch (e) {
      setErro(e?.message || 'Falha ao cadastrar.');
    }
  }

  async function handleLogin() {
    setErro('');
    if (!validarEmail(email)) return setErro('Informe um e-mail válido.');
    if (!senha || senha.length < 6)
      return setErro('A senha deve ter ao menos 6 caracteres.');

    try {
      await entrar({ email, senha });
      setMostrarLogin(false);
      setEmail('');
      setSenha('');
    } catch (e) {
      setErro(e?.message || 'Falha ao autenticar.');
    }
  }

  async function handleResetSenha() {
    if (!validarEmail(email)) return setErro('Preencha um e-mail válido.');
    try {
      await resetarSenha(email);
      alert('Enviamos um e-mail para redefinição de senha.');
    } catch (e) {
      setErro(e?.message || 'Falha ao enviar recuperação.');
    }
  }

  // ======= nome a exibir (com fallbacks) =======
  const displayName = carregandoSessao
    ? ''
    : perfil?.nome ||
      usuario?.user_metadata?.full_name ||
      usuario?.user_metadata?.name ||
      usuario?.email ||
      '';

  const avatarUrl = carregandoSessao
    ? null
    : perfil?.avatar_url || usuario?.user_metadata?.avatar_url || null;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAuth?.(); // revalida perfil/isAdmin
      //
    } finally {
      setRefreshing(false);
    }
  };

  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Hero
          user={carregandoSessao ? null : usuario}
          displayName={displayName}
          avatarUrl={avatarUrl}
          onPressLogin={() => setMostrarLogin(true)}
          onLogout={sair}
          onOpenAccount={() => setMostrarConta(true)}
          onOpenCursos={() => navigation.navigate('Cursos')}
          onOpenDashboard={() => navigation.navigate('Dashboard')}
          onOpenAdmin={() => setMostrarAdmin(true)}
          isAdmin={isAdmin}
        />

        {/* Conteúdo principal */}
        <VideoGrid videos={VIDEOS} />
        <Footer />
      </ScrollView>

      {/* MODAL LOGIN */}
      <LoginModal
        visible={mostrarLogin}
        email={email}
        senha={senha}
        setEmail={setEmail}
        setSenha={setSenha}
        loading={carregandoAuth}
        error={erro || erroAuth}
        onSubmit={handleLogin}
        onCancel={() => setMostrarLogin(false)}
        onResetSenha={handleResetSenha}
        onSignUp={() => setMostrarCadastro(true)}
        onWantSignUp={abrirCadastro}
      />

      {/* MODAL CADASTRO */}
      <SignupModal
        visible={mostrarCadastro}
        values={cadValues}
        setValues={(delta) => setCadValues((prev) => ({ ...prev, ...delta }))}
        loading={carregandoAuth}
        error={erro || erroAuth}
        onSubmit={handleCadastrar}
        onCancel={() => setMostrarCadastro(false)}
      />

      <MinhaContaModal
        visible={mostrarConta}
        onClose={() => setMostrarConta(false)}
        user={usuario}
        perfil={perfil}
        isAdmin={isAdmin}
        onLogout={sair}
        onOpenCursos={() => navigation.navigate('Cursos')}
        onOpenDashboard={() => navigation.navigate('Dashboard')}
        onEdit={() => {
          // fecha "Minha conta" e abre o editor
          setMostrarConta(false);
          setMostrarEditarPerfil(true);
        }}
      />

      {/* Modal de edição de perfil */}
      <EditarPerfilModal
        visible={mostrarEditarPerfil}
        onClose={() => setMostrarEditarPerfil(false)}
        perfil={perfil}
        user={usuario}
        onSaved={() => {
          // se quiser, você pode revalidar o perfil aqui
          setMostrarEditarPerfil(false);
        }}
      />

      {/* PAINEL ADMIN */}
      <AdminPanel
        visible={mostrarAdmin}
        onClose={() => setMostrarAdmin(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.fundo },
});

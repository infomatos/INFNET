import * as Notifications from 'expo-notifications';

import DashboardResumo from './components/DashboardResumo';
import SignupModal from './components/SignUpModal';
import AdminPanel from './components/AdminPainel';
// import CursosList from './components/CursosList';
// import CursoForm from './components/CursoForm';
// import CursoDetalhe from './components/CursoDetalhe';

import DashboardAdmin from './screens/DashboardAdmin';
import DashboardScreen from "./screens/DashboardScreen";
import AdminScreen from "./screens/AdminScreen";
import EventosScreen from "./screens/EventosScreen";
import OfertasScreen from "./screens/OfertasScreen";
import CursosScreen from "./screens/CursosScreen";

// import { salvarCurso } from './services/cursos';
// import { exportarCursosCSV } from './utils/csv';

import {
  getMeuPerfil,
  isAdmin as srvIsAdmin,
  criarPerfilVisitante,
} from './services/perfis';
import { souAdminPeloMeuPerfil } from './services/perfis';

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { COLORS } from './theme';
import { VIDEOS } from './data/video';
import { supabase } from './supabase';
import Hero from './components/Hero';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

/* >>> ADIÇÕES PARA NAVEGAÇÃO <<< */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
/* >>> FIM ADIÇÕES <<< */

function validarEmail(v) {
  return /\S+@\S+\.\S+/.test(v);
}

/* ================== HOME ================== */
function HomeScreen({ navigation }) {
  // estado cursos/telas (mantido, mesmo sem render aqui)
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    mediaProg: 0,
  });
  // const [mostrarForm, setMostrarForm] = useState(false);
  // const [editando, setEditando] = useState(null);
  // const [detalhe, setDetalhe] = useState(null);

  // notificações locais
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
      if (status !== 'granted') console.log('Permissão de notificação negada');
    })();
  }, []);

  // Auth
  const [user, setUser] = useState(null);
  const [sessaoCarregando, setSessaoCarregando] = useState(true);

  // Modal login
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [cadValues, setCadValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    idade: '',
    endereco: '',
    senha: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  /* pequeno estado só para não quebrar onOpenAccount */
  const [mostrarConta, setMostrarConta] = useState(false);

  // Sessão atual + listener
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setSessaoCarregando(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription?.unsubscribe?.();
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const admin = await souAdminPeloMeuPerfil();
      setIsAdmin(admin);
    })();
  }, [user]);

  // quando sessão mudar, descobrir perfil/admin
  useEffect(() => {
    (async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const admin = await srvIsAdmin();
      setIsAdmin(admin);
    })();
  }, [user]);

  // Ação do botão "Cadastrar" (abre modal)
  function abrirCadastro() {
    setMostrarLogin(false);
    setErro('');
    setCadValues((v) => ({ ...v, email: email || '', senha: senha || '' }));
    setMostrarCadastro(true);
  }

  // Handler do submit do cadastro:
  async function handleCadastrar() {
    setErro('');
    const v = cadValues;
    if (!/\S+@\S+\.\S+/.test(v.email))
      return setErro('Informe um e-mail válido.');
    if (!v.nome || v.nome.length < 2) return setErro('Informe seu nome.');
    if (!v.senha || v.senha.length < 6)
      return setErro('A senha deve ter ao menos 6 caracteres.');

    try {
      setLoading(true);
      const { error: e1 } = await supabase.auth.signUp({
        email: v.email,
        password: v.senha,
      });
      if (e1) throw e1;

      await criarPerfilVisitante({
        nome: v.nome,
        email: v.email,
        telefone: v.telefone,
        idade: v.idade,
        endereco: v.endereco,
      });

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
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setErro('');
    if (!validarEmail(email)) return setErro('Informe um e-mail válido.');
    if (!senha || senha.length < 6)
      return setErro('A senha deve ter ao menos 6 caracteres.');

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;
      setMostrarLogin(false);
      setEmail('');
      setSenha('');
    } catch (e) {
      setErro(e?.message || 'Falha ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function handleResetSenha() {
    if (!validarEmail(email))
      return setErro('Preencha o e-mail válido para recuperar a senha.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://guiachurch.com/.br',
    });
    if (error) setErro(error.message);
  }

  async function handleSignUp() {
    if (!validarEmail(email) || senha.length < 6) {
      return setErro('Para cadastrar, informe e-mail válido e senha (6+).');
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: senha });
    setLoading(false);
    if (error) return setErro(error.message);
    setErro('Cadastro iniciado. Verifique seu e-mail para confirmar a conta.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* HERO */}
        <Hero
          user={sessaoCarregando ? null : user}
          onPressLogin={() => setMostrarLogin(true)}
          onLogout={handleLogout}
          onOpenAccount={() => setMostrarConta(true)}
          onOpenCursos={() => navigation.navigate('Cursos')}
          onOpenDashboard={() => navigation.navigate('Dashboard')}
          onOpenAdmin={() => setMostrarAdmin(true)}
          isAdmin={isAdmin}
        />

        {/* MAIN (preservada) */}
        <VideoGrid videos={VIDEOS} />

        {/* (Nada de Cursos aqui; fica na tela própria) */}

        {/* FOOTER */}
        <Footer />
      </ScrollView>

      {/* MODAL LOGIN */}
      <LoginModal
        visible={mostrarLogin}
        email={email}
        senha={senha}
        setEmail={setEmail}
        setSenha={setSenha}
        loading={loading}
        error={erro}
        onSubmit={handleLogin}
        onCancel={() => setMostrarLogin(false)}
        onResetSenha={handleResetSenha}
        onSignUp={handleSignUp}
        onWantSignUp={abrirCadastro}
      />

      <SignupModal
        visible={mostrarCadastro}
        values={cadValues}
        setValues={(delta) => setCadValues((prev) => ({ ...prev, ...delta }))}
        loading={loading}
        error={erro}
        onSubmit={handleCadastrar}
        onCancel={() => setMostrarCadastro(false)}
      />

      <AdminPanel
        visible={mostrarAdmin}
        onClose={() => setMostrarAdmin(false)}
      />
    </SafeAreaView>
  );
}

/* ================== APP (NAVIGATION ROOT) ================== */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#050505' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: COLORS.fundo },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'GUIA Church' }}
        />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: "Admin" }} />
        <Stack.Screen name="Cursos" component={CursosScreen} options={{ title: "Cursos" }} />
        <Stack.Screen name="Ofertas" component={OfertasScreen} options={{ title: "Ofertas" }} />
        <Stack.Screen name="Eventos" component={EventosScreen} options={{ title: "Eventos" }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Painel Dashboard" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.fundo },
});

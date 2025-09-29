import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
function autenticarMock(email, senha) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!emailValido(email)) reject(new Error('E-mail inválido.'));
      else if (!senha || senha.length < 3)
        reject(new Error('A senha deve ter pelo menos 3 caracteres.'));
      else
        resolve({
          id: 'u1',
          nome: 'Cliente Infnet',
          email: String(email).trim(),
        });
    }, 700);
  });
}

export default function LoginTela({ navigation, onLogin }) {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [erro, setErro] = React.useState('');
  const [carregando, setCarregando] = React.useState(false);

  async function entrar() {
    setErro('');
    setCarregando(true);
    try {
      const usuario = await autenticarMock(email, senha);
      onLogin && onLogin(usuario); // <<< troca principal
    } catch (e) {
      setErro(e.message || 'Falha no login.');
    } finally {
      setCarregando(false);
    }
  }

  const desabilitado = !email.trim() || !senha.trim() || carregando;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={estilos.container}>
        <Text style={estilos.titulo}>InfnetFood</Text>
        <Text style={estilos.subtitulo}>Faça login para continuar</Text>

        <View style={estilos.grupo}>
          <Text style={estilos.rotulo}>E-mail</Text>
          <TextInput
            style={estilos.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={estilos.grupo}>
          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput
            style={estilos.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••"
            secureTextEntry
          />
        </View>

        {!!erro && <Text style={estilos.erro}>{erro}</Text>}

        <TouchableOpacity
          onPress={entrar}
          disabled={desabilitado}
          style={[estilos.botao, desabilitado && estilos.botaoDesabilitado]}>
          {carregando ? (
            <ActivityIndicator />
          ) : (
            <Text style={estilos.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Text style={estilos.dica}>
          Dica: e-mail válido + senha (3+ chars) liberam o acesso.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titulo: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  subtitulo: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 12,
  },
  grupo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  erro: { color: '#d93025', textAlign: 'center', marginTop: 4 },
  botao: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4d4f',
    marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dica: { textAlign: 'center', fontSize: 12, opacity: 0.6, marginTop: 6 },
});

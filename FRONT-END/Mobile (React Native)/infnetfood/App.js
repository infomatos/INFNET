import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  configurar,
  sequenciaStatusPedido,
  instalarLogs,
  notificarAgora,
} from './src/servicos/notificacoes';

/* Telas */
import LoginTela from './src/telas/LoginTela';
import HomeTela from './src/telas/HomeTela';
import ProdutosTela from './src/telas/ProdutosTela';
import CarrinhoTela from './src/telas/CarrinhoTela';
import PedidosTela from './src/telas/PedidosTela';
import PerfilTela from './src/telas/PerfilTela';
import MapaTela from './src/telas/MapaTela';
import RestauranteTela from './src/telas/RestauranteTela';
import CheckoutTela from './src/telas/CheckoutTela';
import ConfiguracoesTela from './src/telas/ConfiguracoesTela';
import notificacoes from './src/servicos/notificacoes';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

/* Temas locais */
const TEMAS = {
  light: {
    nome: 'Claro',
    bg: '#ffffff',
    text: '#111111',
    header: '#ff4d4f',
    headerText: '#ffffff',
    card: '#ffffff',
    muted: '#666666',
  },
  dark: {
    nome: 'Escuro',
    bg: '#0f1115',
    text: '#f5f7fa',
    header: '#121212',
    headerText: '#ffffff',
    card: '#181b20',
    muted: '#a9b1bb',
  },
};

export default function App() {
  /* ====== AUTENTICAÇÃO ====== */
  const [usuario, setUsuario] = React.useState(null);
  function onLogin(u) {
    setUsuario(u);
  }
  function onLogout() {
    setUsuario(null);
  }

  /* ====== TEMA (estado local) ====== */
  const [tema, setTema] = React.useState('light');
  const theme = TEMAS[tema];

  /* ====== CARRINHO ====== */
  const [carrinho, setCarrinho] = React.useState([]);
  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => {
      const idx = prev.findIndex((p) => p.id === produto.id);
      if (idx >= 0) {
        const novo = [...prev];
        novo[idx] = { ...novo[idx], qty: novo[idx].qty + 1 };
        return novo;
      }
      return [...prev, { ...produto, qty: 1 }];
    });
  };
  const alterarQtde = (id, delta) => {
    setCarrinho((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );
  };
  const removerDoCarrinho = (id) =>
    setCarrinho((prev) => prev.filter((p) => p.id !== id));
  const limparCarrinho = () => setCarrinho([]);
  const totalItens = carrinho.reduce((s, i) => s + i.qty, 0);

  /* ====== Helpers de header ====== */
  const baseScreenOptions = {
    headerStyle: { backgroundColor: theme.header },
    headerTintColor: theme.headerText,
    headerTitleStyle: { fontWeight: '600' },
    contentStyle: { backgroundColor: theme.bg },
  };
  const withCart = (navigation) => ({
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('Carrinho')}>
        <Text style={{ color: theme.headerText, fontWeight: '700' }}>
          Carrinho ({totalItens})
        </Text>
      </TouchableOpacity>
    ),
  });

  // notificaçoes
  React.useEffect(() => {
    configurar(); // pede permissão logo de cara
    const off = instalarLogs(); // logs no console
    return () => off && off();
  }, []);

  return (
    <NavigationContainer>
      {!usuario ? (
        <AuthStack.Navigator screenOptions={baseScreenOptions}>
          <AuthStack.Screen name="Login">
            {(props) => <LoginTela {...props} onLogin={onLogin} />}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      ) : (
        <AppStack.Navigator
          initialRouteName="Home"
          screenOptions={baseScreenOptions}>
          <AppStack.Screen
            name="Home"
            options={({ navigation }) => ({
              title: 'Início',
              ...withCart(navigation),
            })}>
            {(props) => (
              <HomeTela
                {...props}
                usuario={usuario}
                onLogout={onLogout}
                theme={theme}
              />
            )}
          </AppStack.Screen>

          <AppStack.Screen
            name="Produtos"
            options={({ route, navigation }) => ({
              title: route?.params?.categoria?.titulo || 'Produtos',
              ...withCart(navigation),
            })}>
            {(props) => <ProdutosTela {...props} onAdd={adicionarAoCarrinho} />}
          </AppStack.Screen>

          <AppStack.Screen name="Carrinho" options={{ title: 'Seu carrinho' }}>
            {(props) => (
              <CarrinhoTela
                {...props}
                carrinho={carrinho}
                onAlterarQtde={alterarQtde}
                onRemover={removerDoCarrinho}
                onLimpar={limparCarrinho}
              />
            )}
          </AppStack.Screen>

          <AppStack.Screen
            name="Pedidos"
            options={({ navigation }) => ({
              title: 'Pedidos',
              ...withCart(navigation),
            })}
            component={PedidosTela}
          />

          <AppStack.Screen
            name="Perfil"
            options={({ navigation }) => ({
              title: 'Meu Perfil',
              ...withCart(navigation),
            })}
            component={PerfilTela}
          />

          <AppStack.Screen
            name="Mapa"
            options={({ navigation }) => ({
              title: 'Mapa',
              ...withCart(navigation),
            })}
            component={MapaTela}
          />

          <AppStack.Screen
            name="Restaurante"
            options={({ navigation }) => ({
              title: 'Restaurante',
              ...withCart(navigation),
            })}>
            {(props) => (
              <RestauranteTela {...props} onAdd={adicionarAoCarrinho} />
            )}
          </AppStack.Screen>

          <AppStack.Screen
            name="Checkout"
            options={({ navigation }) => ({
              title: 'Checkout',
              ...withCart(navigation),
            })}>
            {(props) => (
              <CheckoutTela
                {...props}
                carrinho={carrinho}
                onConfirm={(dadosPedido) => {
                  const pedidoId = `P-${Date.now()}`;
                  sequenciaStatusPedido(pedidoId); // agenda 0s / 5s / 10s / 20s
                  setCarrinho([]);
                  props.navigation.navigate('Pedidos');
                }}
              />
            )}
          </AppStack.Screen>

          <AppStack.Screen
            name="Configurações"
            options={({ navigation }) => ({
              title: 'Configurações',
              ...withCart(navigation),
            })}>
            {(props) => (
              <ConfiguracoesTela
                {...props}
                tema={tema}
                setTema={setTema}
                theme={theme}
              />
            )}
          </AppStack.Screen>
        </AppStack.Navigator>
      )}
    </NavigationContainer>
  );
}

import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { PEDIDOS_MOCK } from '../dados/mocks';
import notificacoes from '../servicos/notificacoes';

const formatarPreco = (n) =>
  Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function statusStyle(status) {
  switch (status) {
    case 'Em preparo':
      return { backgroundColor: '#FFF3CD', color: '#8A6D3B' }; // amarelo suave
    case 'Saiu para entrega':
      return { backgroundColor: '#DDEEFF', color: '#1F4A8A' }; // azul suave
    case 'Entregue':
      return { backgroundColor: '#E6FFED', color: '#1F7A4C' }; // verde suave
    default:
      return { backgroundColor: '#eee', color: '#333' };
  }
}

function calcularTotal(itens) {
  return itens.reduce((s, it) => s + it.preco * it.qty, 0);
}

function LinhaPedido({ pedido }) {
  const total = calcularTotal(pedido.itens);
  const itensCount = pedido.itens.reduce((s, it) => s + it.qty, 0);
  const dataFmt = new Date(pedido.dataISO).toLocaleString('pt-BR');

  const s = statusStyle(pedido.status);

  return (
    <View style={estilos.card}>
      <View style={estilos.topo}>
        <Text style={estilos.pedidoId}>{pedido.id}</Text>
        <Text style={estilos.data}>{dataFmt}</Text>
      </View>

      <Text style={estilos.restaurante}>{pedido.restaurante}</Text>
      <Text style={estilos.resumo}>
        {itensCount} item(ns) • Total {formatarPreco(total)}
      </Text>

      <View style={estilos.rodape}>
        <View
          style={[estilos.statusPill, { backgroundColor: s.backgroundColor }]}>
          <Text style={[estilos.statusTxt, { color: s.color }]}>
            {pedido.status}
          </Text>
        </View>

        <TouchableOpacity
          style={estilos.btnVer}
          onPress={() => {
            /* Detalhes entram no Ex. 9 (Restaurante) ou Ex. 10 (Checkout) */
          }}>
          <Text style={estilos.btnVerTxt}>Detalhes (mock)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PedidosTela() {
  const [lista, setLista] = React.useState(PEDIDOS_MOCK);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // simula avanço de status do primeiro pedido "Em preparo" -> "Saiu para entrega"
      setLista((prev) =>
        prev.map((p) =>
          p.status === 'Em preparo' ? { ...p, status: 'Saiu para entrega' } : p
        )
      );
      setRefreshing(false);
    }, 900);
  }, []);

  return (
    <View style={[estilos.container, { alignItems: 'stretch' }]}>
      <Text style={estilos.titulo}>Meus Pedidos</Text>

      <TouchableOpacity
        onPress={() => notificarAgora('Teste', 'Notificação local OK!')}
        style={{
          alignSelf: 'center',
          backgroundColor: '#ff4d4f',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          marginBottom: 8,
        }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>
          Testar notificação
        </Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <LinhaPedido pedido={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, backgroundColor: '#fff' },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between' },
  pedidoId: { fontWeight: '800' },
  data: { fontSize: 12, opacity: 0.7 },
  restaurante: { fontSize: 16, fontWeight: '700' },
  resumo: { fontSize: 12, opacity: 0.8 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusTxt: { fontWeight: '800', fontSize: 12 },
  btnVer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  btnVerTxt: { fontWeight: '800', color: '#333' },
});

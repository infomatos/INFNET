import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { RESTAURANTES_CENTRO } from '../dados/mocks';

// imagem “mapa”
const MAPA_URI =
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=60&auto=format&fit=crop';

function Marcador({ ativo, x, y, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        estilos.marcador,
        { left: `${x}%`, top: `${y}%` },
        ativo && estilos.marcadorAtivo,
      ]}>
      <View style={[estilos.pino, ativo && estilos.pinoAtivo]} />
    </TouchableOpacity>
  );
}

export default function MapaTela({ navigation }) {
  const [selecionado, setSelecionado] = React.useState(null);

  function renderItem({ item }) {
    const ativo = selecionado?.id === item.id;
    return (
      
      <TouchableOpacity
        onPress={() => setSelecionado(item)}
        style={[estilos.card, ativo && estilos.cardAtivo]}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.nome}>{item.nome}</Text>
          <Text style={estilos.linha2}>
            {item.categoria} • Nota {item.nota.toFixed(1)} • {item.tempo}
          </Text>
          <Text style={estilos.endereco}>{item.endereco}</Text>
        </View>
        
        <TouchableOpacity
          style={estilos.btnDetalhes}
          onPress={() =>
            navigation.navigate('Restaurante', { restaurante: item })
          }>
          <Text style={estilos.btnDetalhesTxt}>Detalhes</Text>
        </TouchableOpacity>
        
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Restaurantes — Centro (simulado)</Text>

      <View style={estilos.mapaBox}>
        <ImageBackground source={{ uri: MAPA_URI }} style={estilos.mapaImg}>
          {RESTAURANTES_CENTRO.map((r) => (
            <Marcador
              key={r.id}
              x={r.pos.x}
              y={r.pos.y}
              ativo={selecionado?.id === r.id}
              onPress={() => setSelecionado(r)}
            />
          ))}
        </ImageBackground>
      </View>

      <FlatList
        data={RESTAURANTES_CENTRO}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titulo: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  mapaBox: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 230,
    marginBottom: 8,
    backgroundColor: '#e9eef5',
  },
  mapaImg: { flex: 1 },

  marcador: {
    position: 'absolute',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    padding: 6,
    borderRadius: 999,
  },
  marcadorAtivo: { backgroundColor: 'rgba(255,77,79,0.15)' },
  pino: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff4d4f',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinoAtivo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#d9363e',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardAtivo: { borderWidth: 1, borderColor: '#ff4d4f44' },
  nome: { fontSize: 15, fontWeight: '800' },
  linha2: { fontSize: 12, opacity: 0.8, marginTop: 2 },
  endereco: { fontSize: 12, opacity: 0.7, marginTop: 2 },
  btnDetalhes: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  btnDetalhesTxt: { fontWeight: '800', color: '#333' },
});

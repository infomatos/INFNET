import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { RESTAURANTES_CENTRO, PRODUTOS_POR_CATEGORIA } from '../dados/mocks';

const formatarPreco = (n) =>
  Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function categoriaParaId(categoria) {
  const c = String(categoria || '').toLowerCase();
  if (c.startsWith('lan')) return 'lan';
  if (c.startsWith('beb')) return 'beb';
  if (c.startsWith('sob')) return 'sob';
  if (c.startsWith('mas')) return 'mas';
  if (c.startsWith('saud')) return 'sal';
  if (c.startsWith('jap')) return 'jap';
  return null;
}

export default function RestauranteTela({ route, onAdd, navigation }) {
  // fallback caso entrem sem params
  const restauranteParam = route?.params?.restaurante;
  const restaurante = restauranteParam ||
    RESTAURANTES_CENTRO?.[0] || {
      nome: 'Restaurante',
      categoria: 'Lanches',
      endereco: 'Centro - Rio de Janeiro',
      nota: 4.5,
      tempo: '30–40 min',
    };

  const catId = categoriaParaId(restaurante.categoria);
  const exemplo = catId ? PRODUTOS_POR_CATEGORIA[catId]?.[0] || null : null;

  return (
    <View style={[estilos.container, { alignItems: 'stretch' }]}>
      {/* Cabeçalho do restaurante */}
      <View style={estilos.card}>
        <Text style={estilos.nome}>{restaurante.nome}</Text>
        <Text style={estilos.linha2}>
          {restaurante.categoria} • Nota{' '}
          {Number(restaurante.nota || 0).toFixed(1)} • {restaurante.tempo}
        </Text>
        <Text style={estilos.endereco}>{restaurante.endereco}</Text>

        <View style={estilos.acoesLinha}>
          <TouchableOpacity
            style={[estilos.btn, { backgroundColor: '#1f4a8a' }]}
            onPress={() => navigation.navigate('Mapa')}>
            <Text style={estilos.btnTxt}>Ver no mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[estilos.btn, { backgroundColor: '#ff4d4f' }]}
            onPress={() =>
              navigation.navigate('Produtos', {
                categoria: { id: catId, titulo: restaurante.categoria },
              })
            }>
            <Text style={estilos.btnTxt}>Ver cardápio</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Item exemplo do cardápio */}
      <Text style={estilos.secao}>Exemplo do cardápio</Text>
      {exemplo ? (
        <View style={estilos.itemCard}>
          <Image source={{ uri: exemplo.img }} style={estilos.img} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.itemNome}>{exemplo.nome}</Text>
            <Text style={estilos.itemDesc} numberOfLines={2}>
              {exemplo.desc}
            </Text>
            <Text style={estilos.itemPreco}>
              {formatarPreco(exemplo.preco)}
            </Text>
          </View>
          <TouchableOpacity
            style={estilos.btnAdd}
            onPress={() => onAdd && onAdd(exemplo)}>
            <Text style={estilos.btnAddTxt}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={estilos.itemCard}>
          <Text style={{ fontSize: 14, opacity: 0.7 }}>
            Sem item de exemplo disponível para esta categoria.
          </Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  nome: { fontSize: 20, fontWeight: '800' },
  linha2: { fontSize: 12, opacity: 0.8 },
  endereco: { fontSize: 12, opacity: 0.7 },
  acoesLinha: { flexDirection: 'row', gap: 12, marginTop: 6 },
  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: { color: '#fff', fontWeight: '800' },

  secao: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  itemCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  img: { width: 84, height: 84, borderRadius: 10 },
  itemNome: { fontSize: 16, fontWeight: '700' },
  itemDesc: { fontSize: 12, opacity: 0.7, marginTop: 2, marginBottom: 4 },
  itemPreco: { fontSize: 14, fontWeight: '700' },
  btnAdd: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnAddTxt: { color: '#fff', fontWeight: '800' },
});

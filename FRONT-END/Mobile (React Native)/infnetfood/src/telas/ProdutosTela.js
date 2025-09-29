import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { PRODUTOS_POR_CATEGORIA } from '../dados/mocks';
import FeedbackBanner from '../componentes/FeedbackBanner';

const formatarPreco = (n) =>
  Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function ItemProduto({ produto, onAdd }) {
  return (
    <View style={estilos.produtoLinha}>
      <Image source={{ uri: produto.img }} style={estilos.produtoImg} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.produtoNome}>{produto.nome}</Text>
        <Text style={estilos.produtoDesc} numberOfLines={2}>
          {produto.desc}
        </Text>
        <Text style={estilos.produtoPreco}>{formatarPreco(produto.preco)}</Text>
      </View>
      <TouchableOpacity style={estilos.btnAdd} onPress={() => onAdd(produto)}>
        <Text style={estilos.btnAddTxt}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ProdutosTela({ route, onAdd }) {
  const categoria = route?.params?.categoria;
  const produtos = React.useMemo(() => {
    if (!categoria) return [];
    return PRODUTOS_POR_CATEGORIA[categoria.id] ?? [];
  }, [categoria]);

  // Feedback visual
  const [bannerMsg, setBannerMsg] = React.useState('');
  const [bannerVisivel, setBannerVisivel] = React.useState(false);

  function handleAdd(produto) {
    onAdd && onAdd(produto);
    setBannerMsg(`Adicionado: ${produto.nome}`);
    setBannerVisivel(true);
  }

  return (
    <View style={[estilos.container, { alignItems: 'stretch' }]}>
      {/* Banner animado */}
      <FeedbackBanner
        visivel={bannerVisivel}
        mensagem={bannerMsg}
        onFim={() => setBannerVisivel(false)}
        bg="#1f7a4c"
      />

      <Text style={estilos.titulo}>{categoria?.titulo ?? 'Produtos'}</Text>
      <Text style={[estilos.subtitulo, { marginBottom: 10 }]}>
        {produtos.length
          ? `Listando ${produtos.length} item(ns)`
          : 'Nenhum produto disponível'}
      </Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemProduto produto={item} onAdd={handleAdd} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 4 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  titulo: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  subtitulo: { fontSize: 14, opacity: 0.7, textAlign: 'center' },
  produtoLinha: {
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
  produtoImg: { width: 84, height: 84, borderRadius: 10 },
  produtoNome: { fontSize: 16, fontWeight: '700' },
  produtoDesc: { fontSize: 12, opacity: 0.7, marginTop: 2, marginBottom: 4 },
  produtoPreco: { fontSize: 14, fontWeight: '700' },
  btnAdd: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnAddTxt: { color: '#fff', fontWeight: '700' },
});

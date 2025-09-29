import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

const formatarPreco = (n) =>
  Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function LinhaCarrinho({ item, onAlterarQtde, onRemover }) {
  return (
    <View style={estilos.item}>
      <Image source={{ uri: item.img }} style={estilos.img} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.nome}>{item.nome}</Text>
        <Text style={estilos.precoUni}>{formatarPreco(item.preco)} / un</Text>

        <View style={estilos.controles}>
          <TouchableOpacity
            style={estilos.btnMenos}
            onPress={() => onAlterarQtde(item.id, -1)}>
            <Text style={estilos.btnTxt}>−</Text>
          </TouchableOpacity>

          <Text style={estilos.qty}>{item.qty}</Text>

          <TouchableOpacity
            style={estilos.btnMais}
            onPress={() => onAlterarQtde(item.id, +1)}>
            <Text style={estilos.btnTxt}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.btnRemover}
            onPress={() => onRemover(item.id)}>
            <Text style={estilos.btnRemoverTxt}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={estilos.subtotal}>
        {formatarPreco(item.preco * item.qty)}
      </Text>
    </View>
  );
}

export default function CarrinhoTela({
  carrinho,
  onAlterarQtde,
  onRemover,
  onLimpar,
  navigation,
}) {
  const total = carrinho.reduce((s, i) => s + i.preco * i.qty, 0);

  return (
    <View style={[estilos.container, { alignItems: 'stretch' }]}>
      {carrinho.length === 0 ? (
        <View style={estilos.vazio}>
          <Text style={estilos.vazioTxt}>Seu carrinho está vazio.</Text>
          <TouchableOpacity
            style={estilos.btnPrim}
            onPress={() => navigation.goBack()}>
            <Text style={estilos.btnPrimTxt}>Voltar às compras</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={carrinho}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <LinhaCarrinho
                item={item}
                onAlterarQtde={onAlterarQtde}
                onRemover={onRemover}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={estilos.footer}>
            <Text style={estilos.total}>Total: {formatarPreco(total)}</Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[estilos.btnSec, { flex: 1 }]}
                onPress={() =>
                  Alert.alert(
                    'Limpar carrinho',
                    'Deseja remover todos os itens?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Limpar',
                        style: 'destructive',
                        onPress: onLimpar,
                      },
                    ]
                  )
                }>
                <Text style={estilos.btnSecTxt}>Limpar carrinho</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[estilos.btnPrim, { flex: 1 }]}
                onPress={() => navigation.navigate('Checkout')} // vamos criar no Ex. 10
                disabled={carrinho.length === 0}>
                <Text style={estilos.btnPrimTxt}>Ir para checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  img: { width: 70, height: 70, borderRadius: 10 },
  nome: { fontSize: 16, fontWeight: '700' },
  precoUni: { fontSize: 12, opacity: 0.7, marginBottom: 6 },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  btnMenos: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMais: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: { fontSize: 18, fontWeight: '900' },
  qty: { minWidth: 26, textAlign: 'center', fontSize: 16, fontWeight: '700' },
  btnRemover: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffe7e7',
  },
  btnRemoverTxt: { color: '#b00020', fontWeight: '700' },
  subtotal: { alignSelf: 'center', fontWeight: '700' },

  footer: { gap: 12, marginTop: 8 },
  total: { fontSize: 18, fontWeight: '800', textAlign: 'right' },

  btnPrim: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimTxt: { color: '#fff', fontWeight: '800' },
  btnSec: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecTxt: { color: '#333', fontWeight: '800' },

  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  vazioTxt: { fontSize: 16, opacity: 0.8 },
});

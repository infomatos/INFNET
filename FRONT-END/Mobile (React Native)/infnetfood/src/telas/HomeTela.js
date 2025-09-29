import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { CATEGORIAS } from '../dados/mocks';

export default function HomeTela({ navigation, usuario, onLogout, theme }) {
  function renderCategoria({ item }) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[estilos.card, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('Produtos', { categoria: item })}>
        <Image source={{ uri: item.capa }} style={estilos.cardImagem} />
        <Text style={[estilos.cardTitulo, { color: theme.text }]}>
          {item.titulo}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[estilos.container, { backgroundColor: theme.bg }]}>
      <Text style={[estilos.titulo, { color: theme.text }]}>
        Bem-vindo ao InfnetFood
      </Text>
      {usuario && (
        <Text
          style={[estilos.subtitulo, { color: theme.muted, marginBottom: 12 }]}>
          Logado como: {usuario.nome} ({usuario.email})
        </Text>
      )}

      <Text style={[estilos.secaoTitulo, { color: theme.text }]}>
        Categorias
      </Text>

      <FlatList
        data={CATEGORIAS}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoria}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('Perfil', { usuario })}
        style={[estilos.botao, { marginTop: 8, backgroundColor: '#333' }]}>
        <Text style={estilos.botaoTexto}>Meu Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Pedidos')}
        style={[estilos.botao, { marginTop: 8, backgroundColor: '#0f9d58' }]}>
        <Text style={estilos.botaoTexto}>Meus Pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Mapa')}
        style={[estilos.botao, { marginTop: 8, backgroundColor: '#1f4a8a' }]}>
        <Text style={estilos.botaoTexto}>Mapa (Simulado)</Text>
      </TouchableOpacity>

      {/* NOVO: atalho para Configurações */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Configurações')}
        style={[estilos.botao, { marginTop: 8, backgroundColor: '#555' }]}>
        <Text style={estilos.botaoTexto}>Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLogout}
        style={[estilos.botao, { marginTop: 16 }]}>
        <Text style={estilos.botaoTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'flex-start' },
  titulo: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  subtitulo: { fontSize: 14, textAlign: 'center' },
  secaoTitulo: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 4,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardImagem: { width: '100%', height: 100, borderRadius: 10, marginBottom: 8 },
  cardTitulo: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  botao: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4d4f',
    alignSelf: 'stretch',
  },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

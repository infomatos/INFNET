import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

export default function PerfilTela({ route }) {
  const usuarioParam = route?.params?.usuario;
  const usuario = usuarioParam ?? {
    id: "u1",
    nome: "Cliente Infnet",
    email: "cliente@infnetfood.com"
  };

  // campos adicionais mockados
  const perfilExtra = {
    telefone: "(21) 99999-0000",
    endereco: "Rua Exemplo, 123 - Centro, Rio de Janeiro/RJ"
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    usuario.nome || "Cliente Infnet"
  )}&background=FF4D4F&color=fff&size=256`;

  return (
    <View style={estilos.container}>
      <View style={estilos.card}>
        <Image source={{ uri: avatarUrl }} style={estilos.avatar} />

        <Text style={estilos.nome}>{usuario.nome}</Text>
        <Text style={estilos.email}>{usuario.email}</Text>

        <View style={estilos.linhaInfo}>
          <Text style={estilos.rotulo}>Telefone</Text>
          <Text style={estilos.valor}>{perfilExtra.telefone}</Text>
        </View>

        <View style={estilos.linhaInfo}>
          <Text style={estilos.rotulo}>Endereço</Text>
          <Text style={estilos.valor}>{perfilExtra.endereco}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <TouchableOpacity
            style={[estilos.btn, { backgroundColor: "#ff4d4f" }]}
            onPress={() => Alert.alert("Perfil", "Funcionalidade mockada.")}
          >
            <Text style={estilos.btnTxt}>Editar (mock)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[estilos.btn, { backgroundColor: "#f0f0f0" }]}
            onPress={() => Alert.alert("Sair", "Use o botão Sair na Home.")}
          >
            <Text style={[estilos.btnTxt, { color: "#333" }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  card: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 6 },
  nome: { fontSize: 20, fontWeight: "800" },
  email: { fontSize: 14, opacity: 0.7, marginBottom: 8 },

  linhaInfo: {
    width: "100%",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6
  },
  rotulo: { fontSize: 12, opacity: 0.7, marginBottom: 2 },
  valor: { fontSize: 14, fontWeight: "600" },

  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  btnTxt: { color: "#fff", fontWeight: "800" }
});

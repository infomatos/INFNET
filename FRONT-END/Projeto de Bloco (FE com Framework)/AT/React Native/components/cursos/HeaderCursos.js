import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../../theme";

export default function HeaderCursos({ isAdmin, isVisitor, onNovo }) {
  return (
    <View style={st.container}>
      <Text style={st.title}>{isAdmin ? "Gerenciar cursos" : "Cursos"}</Text>

      {isAdmin && (
        <Pressable style={[st.btnPrimary, { marginTop: 8 }]} onPress={onNovo}>
          <Text style={st.btnPrimaryTxt}>Novo curso</Text>
        </Pressable>
      )}

      {isVisitor && (
        <Text style={[st.aviso, { marginTop: 8 }]}>
          Disponível para membros. Fale com seu líder.
        </Text>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: { padding: 16, paddingBottom: 8 },
  title: { color: "#111827", fontWeight: "800", fontSize: 18 },
  btnPrimary: {
    backgroundColor: COLORS.azul, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", alignItems: "center",
  },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },
  aviso: { color: "#EF4444", fontWeight: "600" },
});

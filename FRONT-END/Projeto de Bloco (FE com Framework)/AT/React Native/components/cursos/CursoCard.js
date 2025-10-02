import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { COLORS } from "../../theme";
import ProgressBar from "./ProgressBar";

export default function CursoCard({
  item,
  matricula,
  isAdmin,
  isMember,
  onEditar,
  onExcluir,
  onInscrever,
  onProgresso,
}) {
  const inscrito = !!matricula;
  const prog = matricula?.progresso ?? 0;
  const done = matricula?.status === "Concluido";

  return (
    <View style={st.card}>
      <Text style={st.titulo}>{item.titulo}</Text>
      <Text style={st.meta}>
        Prof.: <Text style={st.bold}>{item.professor || "-"}</Text> • Carga:{" "}
        <Text style={st.bold}>{item.carga_horaria || "-"}</Text>
      </Text>
      {!!item.descricao && <Text style={st.desc}>{item.descricao}</Text>}

      {isAdmin && (
        <View style={st.row}>
          <Pressable style={st.btnGhost} onPress={() => onEditar(item)}>
            <Text style={st.btnGhostTxt}>Editar</Text>
          </Pressable>
          <Pressable
            style={[st.btnGhost, { borderColor: "#ef4444" }]}
            onPress={() =>
              Alert.alert("Excluir", "Deseja excluir este curso?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => onExcluir(item.id) },
              ])
            }
          >
            <Text style={[st.btnGhostTxt, { color: "#ef4444" }]}>Excluir</Text>
          </Pressable>
        </View>
      )}

      {isMember && (
        !inscrito ? (
          <Pressable style={st.btnPrimary} onPress={() => onInscrever(item)}>
            <Text style={st.btnPrimaryTxt}>Inscrever-se</Text>
          </Pressable>
        ) : (
          <View style={{ gap: 8 }}>
            <ProgressBar value={prog} done={done} />
            <View style={st.sliderRow}>
              <Pressable style={st.sliderBtn} onPress={() => onProgresso(item, Math.max(0, prog - 10))}>
                <Text style={st.sliderBtnTxt}>-10%</Text>
              </Pressable>
              <Pressable style={st.sliderBtn} onPress={() => onProgresso(item, Math.min(100, prog + 10))}>
                <Text style={st.sliderBtnTxt}>+10%</Text>
              </Pressable>
              <Pressable style={st.sliderBtn} onPress={() => onProgresso(item, 100)}>
                <Text style={st.sliderBtnTxt}>100%</Text>
              </Pressable>
            </View>
          </View>
        )
      )}
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", borderRadius: 14, padding: 14, marginBottom: 12 },
  titulo: { fontSize: 16, fontWeight: "800", color: "#111827" },
  meta: { fontSize: 12, color: "#475569", marginTop: 4 },
  desc: { fontSize: 13, color: "#111827", marginTop: 8, lineHeight: 18 },
  bold: { fontWeight: "800" },

  row: { flexDirection: "row", gap: 8, marginTop: 10 },
  btnPrimary: {
    backgroundColor: COLORS.azul, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", alignItems: "center", marginTop: 10,
  },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },
  btnGhost: {
    backgroundColor: "#F3F4F6", paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
  },
  btnGhostTxt: { color: "#111827", fontWeight: "800" },

  sliderRow: { flexDirection: "row", gap: 8 },
  sliderBtn: {
    flex: 1, backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 10, paddingVertical: 8, alignItems: "center",
  },
  sliderBtnTxt: { color: "#111827", fontWeight: "800" },
});

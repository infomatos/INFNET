// components/CursoDetalhe.js
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Botao from "./Botao";
import { COLORS } from "../theme";

export default function CursoDetalhe({ visible, curso, onClose, onEditar, canEdit = false }) {
  if (!curso) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessible accessibilityLabel={`Detalhes do curso ${curso.titulo}`}>
          <Text style={styles.titulo}>{curso.titulo}</Text>
          <Text style={styles.sub}>
            Professor: <Text style={styles.val}>{curso.professor || "—"}</Text>
          </Text>
          <Text style={styles.sub}>
            Carga horária: <Text style={styles.val}>{curso.carga_horaria ?? 0} h</Text>
          </Text>
          <Text style={styles.sub}>
            Status: <Text style={styles.val}>{curso.status}</Text>
          </Text>
          <Text style={styles.sub}>
            Progresso: <Text style={styles.val}>{curso.progresso}%</Text>
          </Text>

          <Text style={[styles.sub, { marginTop: 8 }]}>Descrição</Text>
          <Text style={styles.desc}>{curso.descricao || "Sem descrição."}</Text>

          <View style={styles.acoes}>
            {canEdit && <Botao titulo="Editar" onPress={() => onEditar?.(curso)} />}
            <Botao titulo="Fechar" variante="secundario" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0D0D0D", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  titulo: { color: COLORS.texto, fontSize: 18, fontWeight: "800" },
  sub: { color: COLORS.textoSuave, marginTop: 6 },
  val: { color: COLORS.texto, fontWeight: "700" },
  desc: { color: COLORS.texto, marginTop: 6, lineHeight: 18 },
  acoes: { flexDirection: "row", gap: 10, marginTop: 14, justifyContent: "flex-end" },
});

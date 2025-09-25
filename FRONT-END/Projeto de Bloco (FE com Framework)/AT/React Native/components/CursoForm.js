// components/CursoForm.js
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import Botao from "./Botao";
import { COLORS } from "../theme";

export default function CursoForm({ visible, inicial, onClose, onSave }) {
  const [v, setV] = useState(inicial || {});
  const [salvando, setSalvando] = useState(false);
  const set = (k, val) => setV(s => ({ ...s, [k]: val }));

  useEffect(() => { setV(inicial || { status: "Ativo", progresso: 0 }); }, [inicial]);

  async function salvar() {
    if (!v.titulo || v.titulo.length < 2) return alert("Informe o título.");
    setSalvando(true);
    await onSave({ ...v, carga_horaria: v.carga_horaria ? Number(v.carga_horaria) : 0, progresso: v.progresso ? Number(v.progresso) : 0 });
    setSalvando(false);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessible accessibilityLabel="Formulário de curso">
          <Text style={styles.titulo}>{v.id ? "Editar curso" : "Novo curso"}</Text>

          {[
            { k: "titulo", label: "Título", placeholder: "Ex.: Discipulado 101" },
            { k: "descricao", label: "Descrição", placeholder: "Resumo do conteúdo" },
            { k: "professor", label: "Professor", placeholder: "Nome do professor" },
            { k: "carga_horaria", label: "Carga horária (h)", placeholder: "0", props: { keyboardType: "numeric" } },
            { k: "progresso", label: "Progresso (0-100%)", placeholder: "0", props: { keyboardType: "numeric", maxLength: 3 } },
          ].map(f => (
            <View key={f.k} style={styles.campo}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                value={String(v[f.k] ?? "")}
                onChangeText={(t) => set(f.k, t)}
                placeholder={f.placeholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                accessibilityLabel={f.label}
                {...(f.props || {})}
              />
            </View>
          ))}

          <View style={styles.row}>
            <Pressable onPress={() => set("status", v.status === "Ativo" ? "Inativo" : "Ativo")} style={styles.badge}>
              <Text style={styles.badgeTxt}>Status: {v.status || "Ativo"}</Text>
            </Pressable>
          </View>

          <View style={styles.acoes}>
            <Botao titulo={salvando ? "Salvando..." : "Salvar"} onPress={salvar} style={{ flex: 1 }} icone={salvando ? <ActivityIndicator /> : null} />
            <Botao titulo="Cancelar" variante="secundario" onPress={onClose} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0D0D0D", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  titulo: { color: COLORS.texto, fontSize: 18, fontWeight: "800", marginBottom: 8 },
  campo: { marginBottom: 10 },
  label: { color: COLORS.textoSuave, marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: "#111111", color: COLORS.texto, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  row: { flexDirection: "row", gap: 8, marginTop: 2 },
  badge: { backgroundColor: "rgba(37,99,235,0.25)", borderColor: "rgba(37,99,235,0.5)", borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  badgeTxt: { color: COLORS.texto, fontWeight: "700", fontSize: 12 },
  acoes: { flexDirection: "row", gap: 10, marginTop: 12 },
});

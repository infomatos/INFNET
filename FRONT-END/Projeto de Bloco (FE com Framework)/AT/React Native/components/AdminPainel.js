import React, { useEffect, useState, useMemo } from "react";
import { Modal, View, Text, StyleSheet, TextInput, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import Botao from "./Botao";
import { COLORS } from "../theme";
import { listarPerfis, promoverParaMembro } from "../services/perfis";

export default function AdminPanel({ visible, onClose }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  async function carregar() {
    try {
      setLoading(true);
      const data = await listarPerfis();
      setRows(data);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar perfis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (visible) carregar(); }, [visible]);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>
      (r.nome || "").toLowerCase().includes(t) ||
      (r.email || "").toLowerCase().includes(t) ||
      (r.telefone || "").toLowerCase().includes(t) ||
      (r.perfil || "").toLowerCase().includes(t)
    );
  }, [q, rows]);

  async function promover(id) {
    try {
      await promoverParaMembro(id);
      await carregar();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Não foi possível promover.");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Painel Admin — Perfis</Text>

          <View style={styles.topbar}>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Buscar por nome, e-mail, telefone..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
            />
            <Botao titulo="Recarregar" variante="secundario" onPress={carregar} />
          </View>

          {loading ? (
            <View style={{ padding: 20, alignItems: "center" }}><ActivityIndicator /></View>
          ) : (
            <FlatList
              data={filtrados}
              keyExtractor={(it) => it.id}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nome}>{item.nome || "—"}</Text>
                    <Text style={styles.sub}>{item.email}</Text>
                    <Text style={styles.sub}>{item.telefone || "—"}</Text>
                    <Text style={styles.sub}>Idade: {item.idade ?? "—"} • {item.endereco || "—"}</Text>
                  </View>
                  <View style={styles.perfilWrap}>
                    <Text style={[styles.perfil, item.perfil === "Admin" ? styles.badgeAdmin : item.perfil === "Membro" ? styles.badgeMembro : styles.badgeVisitante]}>
                      {item.perfil}
                    </Text>

                    {item.perfil === "Visitante" && (
                      <Pressable onPress={() => promover(item.id)} style={({ pressed }) => [styles.btnPromo, pressed && { opacity: 0.85 }]}>
                        <Text style={styles.btnPromoTxt}>Promover a Membro</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.vazio}>Nenhum perfil encontrado.</Text>}
              contentContainerStyle={{ paddingTop: 10 }}
            />
          )}

          <View style={{ height: 10 }} />
          <Botao titulo="Fechar" variante="secundario" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0D0D0D", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", maxHeight: "85%" },
  titulo: { color: COLORS.texto, fontSize: 18, fontWeight: "800" },
  topbar: { flexDirection: "row", gap: 10, marginTop: 10, marginBottom: 10, alignItems: "center" },
  input: { flex: 1, backgroundColor: "#111111", color: COLORS.texto, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  row: { flexDirection: "row", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", padding: 10, borderRadius: 10, alignItems: "flex-start" },
  nome: { color: COLORS.texto, fontSize: 14, fontWeight: "800" },
  sub: { color: COLORS.textoSuave, fontSize: 12, marginTop: 2 },
  perfilWrap: { alignItems: "flex-end", gap: 8 },
  perfil: { color: COLORS.texto, fontSize: 12, fontWeight: "800", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999 },
  badgeAdmin: { backgroundColor: "rgba(16,185,129,0.25)", borderWidth: 1, borderColor: "rgba(16,185,129,0.5)" },
  badgeMembro: { backgroundColor: "rgba(37,99,235,0.25)", borderWidth: 1, borderColor: "rgba(37,99,235,0.5)" },
  badgeVisitante: { backgroundColor: "rgba(107,114,128,0.25)", borderWidth: 1, borderColor: "rgba(107,114,128,0.5)" },
  btnPromo: { backgroundColor: COLORS.azul, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  btnPromoTxt: { color: COLORS.texto, fontWeight: "800", fontSize: 12 },
  vazio: { color: COLORS.textoSuave, textAlign: "center", marginTop: 16 },
});

import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  Modal, Pressable, Image, ScrollView,
} from "react-native";
import { EVENTOS } from "../data/eventos";
import EventoCard from "../components/EventoCard";
import { COLORS } from "../theme";
import { Linking } from "react-native";

export default function EventosScreen({ navigation }) {
  const [rows, setRows] = useState(EVENTOS);
  const [refrescando, setRefrescando] = useState(false);
  const [detalhe, setDetalhe] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: "Eventos" });
  }, [navigation]);

  const recarregar = useCallback(async () => {
    setRefrescando(true);
    // futuro: buscar do Supabase
    await new Promise(r => setTimeout(r, 500));
    setRows(EVENTOS);
    setRefrescando(false);
  }, []);

  return (
    <View style={styles.wrap}>
      <FlatList
        data={rows}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <EventoCard item={item} onPress={setDetalhe} />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={recarregar} />
        }
        ListHeaderComponent={
          <Text style={styles.header}>Próximos eventos</Text>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum evento por enquanto.</Text>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />

      {/* Modal de Detalhes */}
      <Modal
        visible={!!detalhe}
        animationType="slide"
        transparent
        onRequestClose={() => setDetalhe(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            {detalhe && (
              <ScrollView>
                <Image source={{ uri: detalhe.imagem }} style={styles.capa} />
                <Text style={styles.titulo}>{detalhe.titulo}</Text>
                <Text style={styles.meta}>
                  {new Date(detalhe.dataISO).toLocaleDateString("pt-BR", {
                    weekday: "long", day: "2-digit", month: "long",
                  })} • {detalhe.hora}
                </Text>
                <Text style={styles.local}>{detalhe.local}</Text>

                <Text style={styles.desc}>{detalhe.descricao}</Text>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() => Linking.openURL("https://wa.me/55")}
                    style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={styles.btnPrimaryTxt}>Quero participar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDetalhe(null)}
                    style={({ pressed }) => [styles.btnGhost, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={styles.btnGhostTxt}>Fechar</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" }, // fundo branco
  header: {
    fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 10,
  },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 20 },

  // modal
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    maxHeight: "85%",
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  capa: { width: "100%", height: 180, backgroundColor: "#eee", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  titulo: { fontSize: 20, fontWeight: "800", color: "#111827", padding: 16, paddingBottom: 0 },
  meta: { fontSize: 13, color: "#475569", paddingHorizontal: 16, marginTop: 6, textTransform: "capitalize" },
  local: { fontSize: 13, color: "#111827", paddingHorizontal: 16, marginTop: 4 },

  desc: { fontSize: 14, color: "#111827", paddingHorizontal: 16, marginTop: 12, lineHeight: 20 },

  actions: { flexDirection: "row", gap: 10, padding: 16, paddingTop: 12 },
  btnPrimary: {
    backgroundColor: COLORS.azul, paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", flex: 1, alignItems: "center",
  },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },
  btnGhost: {
    backgroundColor: "#F3F4F6", paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  btnGhostTxt: { color: "#111827", fontWeight: "800" },
});

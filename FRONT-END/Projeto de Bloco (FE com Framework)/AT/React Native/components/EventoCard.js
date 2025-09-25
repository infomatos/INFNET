// components/EventoCard.js
import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { COLORS } from "../theme";

export default function EventoCard({ item, onPress }) {
  const dataFmt = new Date(item.dataISO).toLocaleDateString("pt-BR", {
    weekday: "short", day: "2-digit", month: "short",
  });

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes do evento ${item.titulo}`}
    >
      <Image source={{ uri: item.imagem }} style={styles.capa} />
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>{item.titulo}</Text>
        <Text style={styles.meta}>{dataFmt} • {item.hora}</Text>
        <Text style={styles.local} numberOfLines={1}>{item.local}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  capa: { width: "100%", height: 140, backgroundColor: "#eee" },
  info: { padding: 12, gap: 4 },
  titulo: { fontSize: 16, fontWeight: "800", color: "#111827" },
  meta: { fontSize: 12, color: "#475569" },
  local: { fontSize: 12, color: "#111827" },
});

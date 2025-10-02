// components/CartaoVideo.js
import React from "react";
import { Pressable, View, Text, StyleSheet, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";

function urlThumbYouTube(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function CartaoVideo({ item }) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${item.videoId}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Assistir ${item.titulo} no YouTube`}
      onPress={() => Linking.openURL(youtubeUrl)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <Image source={{ uri: urlThumbYouTube(item.videoId) }} style={styles.cardThumb} />
      <View style={styles.cardInfo}>
        <Text numberOfLines={2} style={styles.cardTitulo}>
          {item.titulo}
        </Text>
        <View style={styles.cardAcao}>
          <Ionicons name="logo-youtube" size={16} />
          <Text style={styles.cardAcaoTexto}>Assistir</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: COLORS.card,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  cardThumb: { width: "100%", height: 90 },
  cardInfo: { padding: 10 },
  cardTitulo: { color: COLORS.texto, fontSize: 13, fontWeight: "700", marginBottom: 8, minHeight: 32 },
  cardAcao: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardAcaoTexto: { color: COLORS.azul, fontSize: 12, fontWeight: "700" },
});

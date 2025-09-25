// components/Footer.js
import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../theme";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitulo}>Nos encontre</Text>
      <Text style={styles.footerTexto}>Rua Pera de Itaúna, 534 — Barra da Tijuca</Text>
      <Text style={styles.footerTexto}>Rio de Janeiro — RJ</Text>
      <Text style={[styles.footerTexto, { marginTop: 6 }]}>Domingos • 10h</Text>

      <View style={styles.redes}>
        <Pressable onPress={() => Linking.openURL("https://www.instagram.com/guiachurch/?igsh=MXRwYjZvanNuOHhnbQ%3D%3D")} style={styles.redeItem}>
          <Ionicons name="logo-instagram" size={20} color={COLORS.texto} />
          <Text style={styles.redeTexto}>Instagram</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL("https://www.youtube.com/@guiachurch")} style={styles.redeItem}>
          <Ionicons name="logo-youtube" size={20} color={COLORS.texto} />
          <Text style={styles.redeTexto}>YouTube</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL("https://wa.me/5521999999999")} style={styles.redeItem}>
          <FontAwesome name="whatsapp" size={20} color={COLORS.texto} />
          <Text style={styles.redeTexto}>WhatsApp</Text>
        </Pressable>
      </View>

      <Text style={styles.copy}>© {new Date().getFullYear()} GUIA Church — Todos os direitos reservados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.borda,
    backgroundColor: COLORS.fundoEscuro,
  },
  footerTitulo: { color: COLORS.texto, fontSize: 16, fontWeight: "800", marginBottom: 6 },
  footerTexto: { color: COLORS.textoSuave, fontSize: 13, lineHeight: 18 },
  redes: { flexDirection: "row", gap: 16, marginTop: 14, marginBottom: 8 },
  redeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  redeTexto: { color: COLORS.texto, fontSize: 13, fontWeight: "600" },
  copy: { marginTop: 12, color: COLORS.textoFraco, fontSize: 12 },
});

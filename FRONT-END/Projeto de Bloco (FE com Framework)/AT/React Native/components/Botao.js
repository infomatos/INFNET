// components/Botao.js
import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme";

export default function Botao({ titulo, onPress, variante = "primario", icone, style }) {
  const estilo = variante === "primario" ? styles.botaoPrimario : styles.botaoSecundario;
  const corTexto = variante === "primario" ? COLORS.texto : COLORS.azul;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [estilo, style, pressed && { opacity: 0.85 }]}>
      <View style={styles.botaoConteudo}>
        {icone}
        <Text style={[styles.botaoTexto, { color: corTexto }]}>{titulo}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botaoPrimario: {
    backgroundColor: COLORS.azul,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  botaoSecundario: {
    backgroundColor: "transparent",
    borderColor: COLORS.azul,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  botaoConteudo: { flexDirection: "row", alignItems: "center" },
  botaoTexto: { fontSize: 14, fontWeight: "700" },
});

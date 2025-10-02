import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme";

export default function ProgressBar({ value = 0, done }) {
  return (
    <View style={st.wrap} accessible accessibilityLabel={`Progresso ${value}%`}>
      <View style={[st.fill, { width: `${value}%`, backgroundColor: done ? "#16a34a" : COLORS.azul }]} />
      <Text style={st.text}>{value}%</Text>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { height: 16, backgroundColor: "#E5E7EB", borderRadius: 999, overflow: "hidden", justifyContent: "center" },
  fill: { height: "100%" },
  text: { position: "absolute", width: "100%", textAlign: "center", fontSize: 10, color: "#111827", fontWeight: "800" },
});

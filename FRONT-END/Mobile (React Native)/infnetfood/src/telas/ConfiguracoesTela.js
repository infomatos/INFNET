import * as React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";

export default function ConfiguracoesTela({ tema, setTema, theme, navigation }) {
  const dark = tema === "dark";

  return (
    <View style={[estilos.container, { backgroundColor: theme.bg }]}>
      <Text style={[estilos.titulo, { color: theme.text }]}>Aparência</Text>

      <View style={[estilos.card, { backgroundColor: theme.card }]}>
        <View style={estilos.linha}>
          <Text style={[estilos.rotulo, { color: theme.text }]}>Tema escuro</Text>
          <Switch
            value={dark}
            onValueChange={(v) => setTema(v ? "dark" : "light")}
          />
        </View>

        <View style={[estilos.preview, { backgroundColor: theme.bg }]}>
          <View style={[estilos.previewHeader, { backgroundColor: theme.header }]}>
            <Text style={{ color: theme.headerText, fontWeight: "700" }}>Header</Text>
          </View>
          <View style={[estilos.previewCard, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text }}>Texto de exemplo</Text>
            <Text style={{ color: theme.muted, fontSize: 12 }}>Muted/legenda</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[estilos.btn, { backgroundColor: "#ff4d4f" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={estilos.btnTxt}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  titulo: { fontSize: 18, fontWeight: "800" },
  card: {
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  linha: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rotulo: { fontSize: 16, fontWeight: "700" },
  preview: { borderRadius: 10, padding: 10, gap: 8 },
  previewHeader: { height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  previewCard: { padding: 12, borderRadius: 10 },
  btn: { height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 8 },
  btnTxt: { color: "#fff", fontWeight: "800" }
});

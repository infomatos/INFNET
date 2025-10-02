// components/VideoGrid.js
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import CartaoVideo from "./CartaoVideo";
import { COLORS } from "../theme";

export default function VideoGrid({ videos }) {
  return (
    <View style={styles.main}>
      <Text style={styles.secaoTitulo}>Mensagens & Louvor</Text>
      <FlatList
        data={videos}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <CartaoVideo item={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        scrollEnabled={false}
        contentContainerStyle={{ paddingTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: { paddingHorizontal: 20, paddingTop: 18 },
  secaoTitulo: { color: COLORS.texto, fontSize: 18, fontWeight: "700", marginBottom: 6 },
});

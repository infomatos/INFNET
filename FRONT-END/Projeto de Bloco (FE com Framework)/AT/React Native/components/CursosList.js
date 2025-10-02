// components/CursosList.js
import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { COLORS } from "../theme";
import Botao from "./Botao";
import {
  listarCursos,
  alternarStatus,
  arquivarCurso,
  agregados,
} from "../services/cursos";
import { useRefreshListener } from "../utils/refreshBus";

export default function CursosList({
  onNovo,
  onOpen,
  onExportCSV,
  onStats,
  canEdit = false,
  showEnroll = false,
  onEnroll,
}) {
  const [rows, setRows] = useState([]);
  const [refrescando, setRefrescando] = useState(false);

  const carregar = useCallback(async () => {
    setRefrescando(true);
    const data = await listarCursos();
    setRows(data);
    onStats && onStats(agregados(data));
    setRefrescando(false);
  }, [onStats]);

  useEffect(() => {
    carregar();
  }, [carregar]);
  useRefreshListener(() => carregar());

  async function toggleStatus(item) {
    try {
      const novo = await alternarStatus(item.id, item.status);
      await carregar();
      // notificação local (iOS/Android)
      if (Platform.OS !== "web") {
        await Notifications.scheduleNotificationAsync({
          content: { title: "Status do curso", body: `${item.titulo}: agora está ${novo}.` },
          trigger: null,
        });
      }
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao alterar status.");
    }
  }

  async function arquivar(item) {
    try {
      await arquivarCurso(item.id, true);
      await carregar();
      if (Platform.OS !== "web") {
        await Notifications.scheduleNotificationAsync({
          content: { title: "Curso arquivado", body: item.titulo },
          trigger: null,
        });
      }
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao arquivar.");
    }
  }

  function RightActions({ item }) {
    if (!canEdit) return null;
    return (
      <View style={styles.swipeRight}>
        <Pressable
          onPress={() => toggleStatus(item)}
          style={[styles.swipeBtn, { backgroundColor: "#2563EB" }]}
          accessibilityLabel={item.status === "Ativo" ? "Inativar curso" : "Ativar curso"}
        >
          <Text style={styles.swipeTxt}>{item.status === "Ativo" ? "Inativar" : "Ativar"}</Text>
        </Pressable>
        <Pressable
          onPress={() => arquivar(item)}
          style={[styles.swipeBtn, { backgroundColor: "#6B7280" }]}
          accessibilityLabel="Arquivar curso"
        >
          <Text style={styles.swipeTxt}>Arquivar</Text>
        </Pressable>
      </View>
    );
  }

  function Item({ item }) {
    const content = (
      <Pressable
        onPress={() => onOpen(item)}
        style={({ pressed }) => [styles.item, pressed && { opacity: 0.9 }]}
        accessibilityRole="button"
        accessibilityLabel={`Abrir curso ${item.titulo}`}
        accessibilityHint="Mostra detalhes do curso"
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.meta}>
            Prof: {item.professor || "—"} • Carga: {item.carga_horaria ?? 0}h
          </Text>
          <View
            style={styles.progressWrap}
            accessible
            accessibilityLabel={`Progresso ${item.progresso}%`}
          >
            <View
              style={[
                styles.progressBar,
                { width: `${Math.max(0, Math.min(100, item.progresso))}%` },
              ]}
            />
          </View>
        </View>

        <View style={{ alignItems: "flex-end", gap: 8 }}>
          <Text
            style={[
              styles.status,
              item.status === "Ativo" ? styles.badgeAtivo : styles.badgeInativo,
            ]}
          >
            {item.status}
          </Text>

          {showEnroll && (
            <Pressable
              onPress={() => onEnroll?.(item)}
              style={[styles.enrollBtn]}
              accessibilityRole="button"
              accessibilityLabel={`Inscrever-se no curso ${item.titulo}`}
            >
              <Text style={styles.enrollTxt}>Inscrever-se</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );

    // Swipe apenas para quem pode editar
    return canEdit ? (
      <Swipeable renderRightActions={() => <RightActions item={item} />} friction={2}>
        {content}
      </Swipeable>
    ) : (
      content
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Cursos</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {canEdit && (
            <Botao
              titulo="Exportar CSV"
              variante="secundario"
              onPress={() => onExportCSV(rows)}
              accessibilityLabel="Exportar cursos em CSV"
            />
          )}
          {canEdit && (
            <Botao
              titulo="Novo"
              onPress={onNovo}
              accessibilityLabel="Criar novo curso"
            />
          )}
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <Item item={item} />}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.texto}
            refreshing={refrescando}
            onRefresh={carregar}
          />
        }
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum curso ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 12 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { color: COLORS.texto, fontSize: 18, fontWeight: "800" },

  item: {
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titulo: { color: COLORS.texto, fontWeight: "800" },
  meta: { color: COLORS.textoSuave, fontSize: 12, marginTop: 2 },

  status: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "800",
    fontSize: 12,
  },
  badgeAtivo: {
    backgroundColor: "rgba(16,185,129,0.25)",
    borderColor: "rgba(16,185,129,0.5)",
    borderWidth: 1,
    color: COLORS.texto,
  },
  badgeInativo: {
    backgroundColor: "rgba(239,68,68,0.25)",
    borderColor: "rgba(239,68,68,0.5)",
    borderWidth: 1,
    color: COLORS.texto,
  },

  progressWrap: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBar: { height: 8, backgroundColor: COLORS.azul },

  swipeRight: { flexDirection: "row", alignItems: "center" },
  swipeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  swipeTxt: { color: "white", fontWeight: "800" },

  enrollBtn: {
    backgroundColor: COLORS.azul,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  enrollTxt: { color: COLORS.texto, fontWeight: "800", fontSize: 12 },

  empty: { color: COLORS.textoSuave, textAlign: "center", marginTop: 20 },
});

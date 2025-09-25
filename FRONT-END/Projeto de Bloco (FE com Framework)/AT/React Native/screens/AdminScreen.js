// screens/AdminScreen.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, FlatList, Pressable,
  ActivityIndicator, Alert, RefreshControl, useWindowDimensions,
  Platform, SafeAreaView,
} from "react-native";
import { COLORS } from "../theme";
import { supabase } from "../supabase";
import {
  listarPerfis, promoverParaMembro, alterarPapel,
  excluirPerfil,
} from "../services/perfis";
import AdminUserForm from "../components/AdminUserForm";

export default function AdminScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const { width } = useWindowDimensions();
  const isWide = width >= 900;     // 2 colunas em tablet/web
  const isVeryWide = width >= 1280;// padding maior em telas bem largas

  useEffect(() => { navigation.setOptions({ title: "Admin" }); }, [navigation]);

  // exige admin
  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getUser();
      if (!sess?.user) {
        Alert.alert("Acesso restrito", "Faça login.");
        navigation.goBack(); return;
      }
      const { data } = await supabase.from("perfis").select("perfil").eq("auth_user_id", sess.user.id).single();
      if (data?.perfil !== "Admin") {
        Alert.alert("Acesso negado", "Apenas administradores.");
        navigation.goBack();
      }
    })();
  }, [navigation]);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarPerfis();
      setRows(data);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar perfis.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }, [carregar]);

  // busca com memo
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) =>
      (r.nome || "").toLowerCase().includes(t) ||
      (r.email || "").toLowerCase().includes(t) ||
      (r.telefone || "").toLowerCase().includes(t) ||
      (r.perfil || "").toLowerCase().includes(t)
    );
  }, [q, rows]);

  // ações
  async function promover(id) {
    try { await promoverParaMembro(id); await carregar(); }
    catch (e) { Alert.alert("Erro", e?.message || "Não foi possível promover."); }
  }
  async function tornarAdmin(id) {
    try { await alterarPapel(id, "Admin"); await carregar(); }
    catch (e) { Alert.alert("Erro", e?.message || "Não foi possível alterar."); }
  }
  async function tornarVisitante(id) {
    try { await alterarPapel(id, "Visitante"); await carregar(); }
    catch (e) { Alert.alert("Erro", e?.message || "Não foi possível alterar."); }
  }
  async function remover(id) {
    Alert.alert("Excluir", "Deseja excluir este perfil?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        try { await excluirPerfil(id); await carregar(); }
        catch(e){ Alert.alert("Erro", e?.message || "Falha ao excluir."); }
      }},
    ]);
  }

  // header “pegajoso” da lista
  const ListHeader = () => (
    <View style={[
      s.topbar,
      isVeryWide && { paddingHorizontal: 32 },
      Platform.OS !== "web" ? s.topbarStickyNative : s.topbarStickyWeb
    ]}>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Buscar por nome, e-mail, telefone..."
        placeholderTextColor="#9CA3AF"
        style={[s.input, isWide && { maxWidth: 520 }]}
        accessibilityLabel="Campo de busca"
      />
      <Pressable style={s.btnGhost} onPress={carregar} accessibilityLabel="Recarregar lista">
        <Text style={s.btnGhostTxt}>Recarregar</Text>
      </Pressable>
      <Pressable
        style={s.btnPrimary}
        onPress={() => { setEditando(null); setFormOpen(true); }}
        accessibilityLabel="Criar novo perfil"
      >
        <Text style={s.btnPrimaryTxt}>Novo</Text>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        s.card,
        isWide && { width: "48%" }, // 2 colunas
      ]}
    >
      <View style={s.cardHeader}>
        <Text style={s.nome} numberOfLines={1}>{item.nome || "—"}</Text>
        <Text
          style={[
            s.badge,
            item.perfil === "Admin"
              ? s.badgeAdmin
              : item.perfil === "Membro"
              ? s.badgeMembro
              : s.badgeVisitante,
          ]}
        >
          {item.perfil}
        </Text>
      </View>

      <View style={s.metaBlock}>
        <Text style={s.sub} numberOfLines={1}>{item.email || "—"}</Text>
        <Text style={s.sub} numberOfLines={1}>{item.telefone || "—"}</Text>
        <Text style={s.sub} numberOfLines={2}>
          Idade: {item.idade ?? "—"} • {item.endereco || "—"}
        </Text>
      </View>

      <View style={s.actionsRow}>
        {item.perfil !== "Membro" && (
          <Pressable style={s.btnPrimarySm} onPress={() => promover(item.id)}>
            <Text style={s.btnPrimarySmTxt}>Membro</Text>
          </Pressable>
        )}
        {item.perfil !== "Admin" && (
          <Pressable style={s.btnPrimarySm} onPress={() => tornarAdmin(item.id)}>
            <Text style={s.btnPrimarySmTxt}>Admin</Text>
          </Pressable>
        )}
        {item.perfil !== "Visitante" && (
          <Pressable style={s.btnGhostSm} onPress={() => tornarVisitante(item.id)}>
            <Text style={s.btnGhostSmTxt}>Visitante</Text>
          </Pressable>
        )}
        <Pressable style={s.btnGhostSm} onPress={() => { setEditando(item); setFormOpen(true); }}>
          <Text style={s.btnGhostSmTxt}>Editar</Text>
        </Pressable>
        <Pressable style={[s.btnGhostSm, { borderColor: "#ef4444" }]} onPress={() => remover(item.id)}>
          <Text style={[s.btnGhostSmTxt, { color: "#ef4444" }]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[s.page, isVeryWide && { paddingHorizontal: 16 }]}>
      {/* Topbar “fixa” acima da lista */}
      <ListHeader />

      {loading ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          numColumns={isWide ? 2 : 1}
          columnWrapperStyle={isWide ? { justifyContent: "space-between" } : undefined}
          contentContainerStyle={[
            s.listContent,
            isVeryWide && { paddingHorizontal: 16 },
          ]}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={s.vazio}>Nenhum perfil encontrado.</Text>}
        />
      )}

      {/* Form */}
      <AdminUserForm
        visible={formOpen}
        inicial={editando}
        onClose={() => setFormOpen(false)}
        onSaved={carregar}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },

  // Topbar
  topbar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8, paddingBottom: 10,
    borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.06)",
    flexDirection: "row", alignItems: "center", gap: 8,
    zIndex: 5,
  },
  topbarStickyNative: { }, // SafeAreaView já resolve em mobile
  topbarStickyWeb: { position: "sticky", top: 0 }, // fixa no topo (web)
  input: {
    flex: 1,
    backgroundColor: "#fff", color: "#111827",
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
  },

  listContent: { padding: 16, paddingTop: 12, paddingBottom: 24 },

  // Card
  card: {
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 14, padding: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  nome: { color: "#111827", fontSize: 15, fontWeight: "800", flexShrink: 1 },

  metaBlock: { marginTop: 6, gap: 2 },
  sub: { color: "#475569", fontSize: 12 },

  badge: {
    color: "#111827", fontSize: 12, fontWeight: "800",
    paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1,
  },
  badgeAdmin: { backgroundColor: "rgba(16,185,129,0.10)", borderColor: "rgba(16,185,129,0.35)" },
  badgeMembro: { backgroundColor: "rgba(37,99,235,0.10)", borderColor: "rgba(37,99,235,0.35)" },
  badgeVisitante: { backgroundColor: "rgba(107,114,128,0.10)", borderColor: "rgba(107,114,128,0.35)" },

  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },

  // botões
  btnPrimary: {
    backgroundColor: COLORS.azul, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },

  btnGhost: {
    backgroundColor: "#F3F4F6", paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
  },
  btnGhostTxt: { color: "#111827", fontWeight: "800" },

  btnPrimarySm: {
    backgroundColor: COLORS.azul, paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  btnPrimarySmTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  btnGhostSm: {
    backgroundColor: "#F3F4F6", paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
  },
  btnGhostSmTxt: { color: "#111827", fontWeight: "800", fontSize: 12 },

  vazio: { color: "#6B7280", textAlign: "center", marginTop: 16 },
});

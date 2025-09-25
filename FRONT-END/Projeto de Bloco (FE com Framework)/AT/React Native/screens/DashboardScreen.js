// screens/DashboardScreen.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator, Alert,
  ScrollView, RefreshControl, Pressable,
} from "react-native";
import { COLORS } from "../theme";
import { supabase } from "../supabase";
import * as Haptics from "expo-haptics";
import { exportCsv } from "../utils/exportCsv";

/* ===== helpers ===== */
function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function lastMonths(n) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    out.push({
      key: monthKey(d),
      label: d.toLocaleString("pt-BR", { month: "short" }).replace(".", ""),
      date: d,
    });
  }
  return out;
}
function yearWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - start) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}
function lastWeeks(n) {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - (i * 7));
    out.push({ key: yearWeekKey(d), label: `S${String(i + 1).padStart(2, "0")}`, date: d });
  }
  return out;
}
function brl(v) {
  try { return Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v||0); }
  catch { return `R$ ${Number(v||0).toFixed(2)}`; }
}

/* ===== UI atômicos ===== */
function Section({ title, right, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle} numberOfLines={1}>{title}</Text>
        {/* ações SEM quebra de linha, com scroll horizontal se faltar espaço */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.actionsRow}
          style={s.actionsScroller}
        >
          {right}
        </ScrollView>
      </View>
      {children}
    </View>
  );
}
function CardsRow({ items }) {
  return (
    <View style={s.cardsRow}>
      {items.map((it, idx) => (
        <View key={idx} style={s.card} accessibilityLabel={`${it.title}: ${it.value}`}>
          <Text style={s.cardTitle}>{it.title}</Text>
          <Text style={s.cardValue}>{it.value}</Text>
        </View>
      ))}
    </View>
  );
}
function MiniBarChart({ title, series = [], format = (x)=>x }) {
  const max = Math.max(1, ...series.map(s => s.value));
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={s.chartTitle}>{title}</Text>
      <View style={s.chartCard}>
        <View style={s.chartRow} accessible accessibilityLabel={title}>
          {series.map((sData, i) => {
            const isZero = !sData.value || Number(sData.value) === 0;
            return (
              <View key={i} style={s.barWrap} accessibilityLabel={`${sData.label}: ${format(sData.value)}`}>
                <View
                  style={[
                    s.bar,
                    {
                      height: 10 + (70 * sData.value) / max,
                      backgroundColor: isZero ? "#ef4444" : COLORS.azul,
                    },
                  ]}
                />
                <Text numberOfLines={1} style={s.barLabel}>
                  {sData.label} • {format(sData.value)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.chip,
        selected ? { backgroundColor: COLORS.azul, borderColor: COLORS.azul } : null,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[s.chipTxt, selected ? { color: "#fff" } : null]}>{label}</Text>
    </Pressable>
  );
}
function BtnGhost({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={s.btnGhost}>
      <Text style={s.btnGhostTxt}>{title}</Text>
    </Pressable>
  );
}
function BtnPrimary({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={s.btnPrimary}>
      <Text style={s.btnPrimaryTxt}>{title}</Text>
    </Pressable>
  );
}

/* ===== Tela ===== */
export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState("");

  // Filtros
  const [membrosMeses, setMembrosMeses] = useState(6);
  const [cursosMeses, setCursosMeses] = useState(6);
  const [entradasSemanas, setEntradasSemanas] = useState(8);

  // fontes de dados
  const [membrosRows, setMembrosRows] = useState([]);
  const [matriculasRows, setMatriculasRows] = useState([]);
  const [entradasRows, setEntradasRows] = useState([]);

  useEffect(() => { navigation.setOptions({ title: "Painel Dashboard" }); }, [navigation]);

  // exige admin
  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getUser();
      if (!sess?.user) { Alert.alert("Acesso restrito", "Faça login."); navigation.goBack(); return; }
      const { data, error } = await supabase.from("perfis").select("perfil").eq("auth_user_id", sess.user.id).single();
      if (error || data?.perfil !== "Admin") { Alert.alert("Acesso negado", "Apenas administradores."); navigation.goBack(); }
    })();
  }, [navigation]);

  const carregar = useCallback(async () => {
    setErr(""); setLoading(true);
    try {
      const now = new Date();

      // Membros
      const mAgo = new Date(now.getFullYear(), now.getMonth() - (membrosMeses - 1), 1).toISOString();
      let mem = [];
      const r1 = await supabase.from("membros").select("is_active, joined_at, last_status_change").gte("joined_at", mAgo);
      if (!r1.error && r1.data) mem = r1.data;
      else {
        const rAlt = await supabase.from("perfis").select("id, created_at");
        mem = (rAlt.data || []).map(x => ({ is_active: true, joined_at: x.created_at }));
      }
      setMembrosRows(mem);

      // Cursos — matriculas no período
      const cAgo = new Date(now.getFullYear(), now.getMonth() - (cursosMeses - 1), 1).toISOString();
      const r2 = await supabase
        .from("matriculas")
        .select("curso_id, status, created_at, updated_at")
        .gte("created_at", cAgo);
      setMatriculasRows(r2.data || []);

      // Entradas
      const weeksAgo = new Date(now); weeksAgo.setDate(now.getDate() - (7 * entradasSemanas));
      const r3 = await supabase.from("entradas").select("valor, tipo, data").gte("data", weeksAgo.toISOString());
      setEntradasRows(r3.data || []);
    } catch (e) {
      setErr(e?.message || "Falha ao carregar o dashboard.");
    } finally {
      setLoading(false);
    }
  }, [membrosMeses, cursosMeses, entradasSemanas]);

  useEffect(() => { carregar(); }, [carregar]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await carregar();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(()=>{});
      setToast("Atualizado");
      setTimeout(()=>setToast(""), 1200);
    } finally {
      setRefreshing(false);
    }
  }, [carregar]);

  // transformar dados em cartões + séries
  const dados = useMemo(() => {
    const mesesM = lastMonths(membrosMeses);
    const mesesC = lastMonths(cursosMeses);
    const semanas = lastWeeks(entradasSemanas);

    // Membros
    const totalMembros = membrosRows.length;
    const ativos = membrosRows.filter(m => m.is_active !== false).length;
    const inativos = totalMembros - ativos;
    const memMap = new Map(mesesM.map(m => [m.key, 0]));
    membrosRows.forEach(m => {
      const k = monthKey(new Date(m.joined_at || m.last_status_change || Date.now()));
      if (memMap.has(k)) memMap.set(k, memMap.get(k) + 1);
    });
    const membrosMes = mesesM.map(m => ({ label: m.label, value: memMap.get(m.key) || 0 }));

    // Cursos finalizados
    const concluidos = (matriculasRows || []).filter(m => m.status === "Concluido");
    const curMap = new Map(mesesC.map(m => [m.key, 0]));
    concluidos.forEach(m => {
      const k = monthKey(new Date(m.updated_at || m.created_at || Date.now()));
      if (curMap.has(k)) curMap.set(k, (curMap.get(k) || 0) + 1);
    });
    const cursosMes = mesesC.map(m => ({ label: m.label, value: curMap.get(m.key) || 0 }));

    // Entradas
    const wkMap = new Map(semanas.map(w => [w.key, 0]));
    (entradasRows || []).forEach(e => {
      const k = yearWeekKey(new Date(e.data));
      if (wkMap.has(k)) wkMap.set(k, (wkMap.get(k) || 0) + Number(e.valor || 0));
    });
    const entradasSem = semanas.map(w => ({ label: w.label, value: wkMap.get(w.key) || 0 }));
    const somaPeriodo = entradasSem.reduce((a, c) => a + c.value, 0);
    const mediaSem = somaPeriodo / Math.max(1, entradasSem.length);

    return {
      membros: {
        cards: [
          { title: "Total", value: totalMembros },
          { title: "Ativos", value: ativos },
          { title: "Inativos", value: inativos },
        ],
        series: membrosMes,
        csv: membrosMes.map(r => ({ mes: r.label, novos: r.value })),
      },
      cursos: {
        cards: [
          { title: `Concluídos (${cursosMeses}m)`, value: concluidos.length },
          { title: "No mês atual", value: cursosMes.at(-1)?.value || 0 },
        ],
        series: cursosMes,
        csv: cursosMes.map(r => ({ mes: r.label, concluidos: r.value })),
      },
      entradas: {
        cards: [
          { title: `Total (${entradasSemanas}s)`, value: brl(somaPeriodo) },
          { title: "Média semanal", value: brl(mediaSem) },
        ],
        series: entradasSem,
        csv: entradasSem.map(r => ({ semana: r.label, valor: r.value })),
      },
    };
  }, [membrosRows, matriculasRows, entradasRows, membrosMeses, cursosMeses, entradasSemanas]);

  if (loading) {
    return <View style={[s.page, s.center]}><ActivityIndicator /></View>;
  }

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {toast ? <View style={s.toast}><Text style={s.toastTxt}>{toast}</Text></View> : null}
      {err ? <Text style={s.err}>{err}</Text> : null}

      {/* Membros */}
      <Section
        title="Membros"
        right={
          <>
            <Chip label="3m" selected={membrosMeses===3} onPress={()=>setMembrosMeses(3)} />
            <Chip label="6m" selected={membrosMeses===6} onPress={()=>setMembrosMeses(6)} />
            <Chip label="12m" selected={membrosMeses===12} onPress={()=>setMembrosMeses(12)} />
            <BtnGhost title="Exportar CSV" onPress={()=>exportCsv(`membros_${membrosMeses}m.csv`, dados.membros.csv).catch(e=>Alert.alert("Exportar", e.message))} />
          </>
        }
      >
        <CardsRow items={dados.membros.cards} />
        <MiniBarChart title="Novos por mês" series={dados.membros.series} />
      </Section>

      {/* Cursos */}
      <Section
        title="Cursos finalizados"
        right={
          <>
            <Chip label="3m" selected={cursosMeses===3} onPress={()=>setCursosMeses(3)} />
            <Chip label="6m" selected={cursosMeses===6} onPress={()=>setCursosMeses(6)} />
            <Chip label="12m" selected={cursosMeses===12} onPress={()=>setCursosMeses(12)} />
            <BtnGhost title="Exportar CSV" onPress={()=>exportCsv(`cursos_${cursosMeses}m.csv`, dados.cursos.csv).catch(e=>Alert.alert("Exportar", e.message))} />
          </>
        }
      >
        <CardsRow items={dados.cursos.cards} />
        <MiniBarChart title="Concluídos por mês" series={dados.cursos.series} />
      </Section>

      {/* Entradas */}
      <Section
        title="Entradas (Dízimos e Ofertas)"
        right={
          <>
            <Chip label="4s" selected={entradasSemanas===4} onPress={()=>setEntradasSemanas(4)} />
            <Chip label="8s" selected={entradasSemanas===8} onPress={()=>setEntradasSemanas(8)} />
            <Chip label="12s" selected={entradasSemanas===12} onPress={()=>setEntradasSemanas(12)} />
            <BtnGhost title="Exportar CSV" onPress={()=>exportCsv(`entradas_${entradasSemanas}s.csv`, dados.entradas.csv).catch(e=>Alert.alert("Exportar", e.message))} />
          </>
        }
      >
        <CardsRow items={dados.entradas.cards} />
        <MiniBarChart title="Semanas recentes" series={dados.entradas.series} format={brl} />
      </Section>
    </ScrollView>
  );
}

/* ===== estilos ===== */
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", paddingTop: 12, paddingHorizontal: 16 },
  center: { alignItems: "center", justifyContent: "center" },
  err: { color: "#ef4444", marginBottom: 10 },

  toast: {
    alignSelf: "center", backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginBottom: 8,
  },
  toastTxt: { color: "#fff", fontWeight: "700", fontSize: 12 },

  section: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 14,
    overflow: "hidden",
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: { color: "#111827", fontSize: 12, fontWeight: "800", maxWidth: "40%" },
  actionsScroller: { maxWidth: "60%" }, // impede que as ações ultrapassem a seção
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  cardsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  card: {
    flexGrow: 1, flexBasis: "30%", minWidth: 120,
    backgroundColor: "#fff",
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  cardTitle: { color: "#475569", fontSize: 12 },
  cardValue: { color: "#111827", fontSize: 22, fontWeight: "800", marginTop: 4 },

  chartTitle: { color: "#111827", fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 6 },
  chartCard: {
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, backgroundColor: "#fff",
  },
  chartRow: { flexDirection: "row", gap: 12, alignItems: "flex-end", minHeight: 90 },
  barWrap: { alignItems: "center", flex: 1, maxWidth: "100%" },
  bar: { width: "100%", borderRadius: 8 },
  barLabel: { color: "#475569", fontSize: 11, marginTop: 6, textAlign: "center" },

  chip: {
    borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
  },
  chipTxt: { color: "#111827", fontWeight: "800", fontSize: 12 },

  btnPrimary: {
    backgroundColor: COLORS.azul, paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },
  btnGhost: {
    backgroundColor: "#F3F4F6", paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
  },
  btnGhostTxt: { color: "#111827", fontWeight: "800" },
});

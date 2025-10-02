import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { COLORS } from "../theme";
import { supabase } from "../supabase";

const screenW = Dimensions.get("window").width;

export default function DashboardResumo() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [membrosRows, setMembrosRows] = useState([]);
  const [cursosRows, setCursosRows] = useState([]);
  const [entradasRows, setEntradasRows] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const now = new Date();
      const seisMesesAtras = new Date(now); seisMesesAtras.setMonth(now.getMonth() - 5); seisMesesAtras.setDate(1);
      const oitoSemanasAtras = new Date(now); oitoSemanasAtras.setDate(now.getDate() - 7 * 7);

      const { data: membros, error: eM } = await supabase
        .from("membros")
        .select("is_active, joined_at, last_status_change")
        .gte("joined_at", seisMesesAtras.toISOString());
      if (eM && eM.code !== "PGRST116") throw eM;
      setMembrosRows(membros || []);

      const { data: cursos, error: eC } = await supabase
        .from("cursos")
        .select("progresso, created_at, updated_at, status, is_arquivado")
        .gte("created_at", seisMesesAtras.toISOString());
      if (eC && eC.code !== "PGRST116") throw eC;
      setCursosRows(cursos || []);

      const { data: entradas, error: eE } = await supabase
        .from("entradas")
        .select("valor, tipo, data")
        .gte("data", oitoSemanasAtras.toISOString());
      if (eE && eE.code !== "PGRST116") throw eE;
      setEntradasRows(entradas || []);
    } catch (e) {
      setErr(e?.message || "Falha ao carregar o dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const dados = useMemo(() => {
    const now = new Date();
    const mesesLabels = getUltimosMesesLabels(6);
    const chaveMes = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;

    // Membros
    const total = membrosRows.length;
    const ativos = membrosRows.filter(m => m.is_active).length;
    const inativos = total - ativos;
    const membrosMesMap = new Map(mesesLabels.map(({key}) => [key, 0]));
    membrosRows.forEach(m => {
      const dt = new Date(m.joined_at || m.last_status_change || now);
      const key = chaveMes(dt);
      if (membrosMesMap.has(key)) membrosMesMap.set(key, (membrosMesMap.get(key) || 0) + 1);
    });
    const membrosMes = mesesLabels.map(({key, label}) => ({ label, total: membrosMesMap.get(key) || 0 }));

    // Cursos (concluídos = 100)
    const concluidosRows = cursosRows.filter(c => Number(c.progresso) >= 100 && !c.is_arquivado);
    const cursosMesMap = new Map(mesesLabels.map(({key}) => [key, 0]));
    concluidosRows.forEach(c => {
      const dt = new Date(c.updated_at || c.created_at || now);
      const key = chaveMes(dt);
      if (cursosMesMap.has(key)) cursosMesMap.set(key, (cursosMesMap.get(key) || 0) + 1);
    });
    const cursosMes = mesesLabels.map(({key, label}) => ({ label, concluidos: cursosMesMap.get(key) || 0 }));
    const cursosTotalConcl = concluidosRows.length;
    const cursosMesAtual = cursosMes.at(-1)?.concluidos || 0;
    const taxaMes = Math.round(100 * (cursosMesAtual / Math.max(1, cursosRows.length)));

    // Entradas (8 semanas)
    const semanasLabels = getUltimasSemanasLabels(8);
    const entradasMap = new Map(semanasLabels.map(s => [s.key, 0]));
    entradasRows.forEach(e => {
      const key = yearWeekKey(new Date(e.data || now));
      if (entradasMap.has(key)) entradasMap.set(key, (entradasMap.get(key) || 0) + Number(e.valor || 0));
    });
    const entradasSem = semanasLabels.map(s => ({ label: s.label, valor: entradasMap.get(s.key) || 0 }));
    const somaPeriodo = entradasSem.reduce((a, c) => a + c.valor, 0);
    const mediaSem = Math.round(somaPeriodo / Math.max(1, entradasSem.length));
    const ultima = entradasSem.at(-1)?.valor || 0;

    return {
      membrosMes,
      cursosMes,
      entradasSem,
      cards: {
        membros: [
          { titulo: "Membros (janela)", valor: total },
          { titulo: "Ativos", valor: ativos },
          { titulo: "Inativos", valor: inativos },
        ],
        cursos: [
          { titulo: "Finalizados (6m)", valor: cursosTotalConcl },
          { titulo: "No mês", valor: cursosMesAtual },
          { titulo: "Taxa no mês", valor: `${taxaMes}%` },
        ],
        entradas: [
          { titulo: "Total do período", valor: formatBRL(somaPeriodo) },
          { titulo: "Média semanal", valor: formatBRL(mediaSem) },
          { titulo: "Última semana", valor: formatBRL(ultima) },
        ],
      },
    };
  }, [membrosRows, cursosRows, entradasRows]);

  if (loading) {
    return (
      <View style={[styles.wrap, { alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {err ? <Text style={styles.err}>{err}</Text> : null}

      {/* ===== Membros ===== */}
      <Section title="Membros">
        <CardsRow items={dados.cards.membros} />
        <ChartBlock
          title="Evolução (últimos meses)"
          data={dados.membrosMes.map(m => ({ value: m.total, label: m.label }))}
          formatYLabel={(v) => String(Math.round(Number(v)))}
        />
      </Section>

      {/* ===== Cursos finalizados ===== */}
      <Section title="Cursos finalizados">
        <CardsRow items={dados.cards.cursos} />
        <ChartBlock
          title="Concluídos por mês"
          data={dados.cursosMes.map(c => ({ value: c.concluidos, label: c.label }))}
          formatYLabel={(v) => String(Math.round(Number(v)))}
        />
      </Section>

      {/* ===== Entradas ===== */}
      <Section title="Entradas (Dízimos e Ofertas)">
        <CardsRow items={dados.cards.entradas} />
        <ChartBlock
          title="Semanas recentes"
          data={dados.entradasSem.map(e => ({ value: e.valor, label: e.label }))}
          formatYLabel={(v) => formatBRL(Number(v))}
        />
      </Section>
    </View>
  );
}

/* ---------- Helpers de data ---------- */

function getUltimosMesesLabels(n) {
  const arr = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const label = dt.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
    arr.push({ key, label: capitalize(label) });
  }
  return arr;
}
function getUltimasSemanasLabels(n) {
  const arr = [];
  const now = new Date();
  for (let i = n; i >= 1; i--) {
    const dt = new Date(now);
    dt.setDate(now.getDate() - 7 * i);
    const key = yearWeekKey(dt);
    arr.push({ key, label: `S-${i}` });
  }
  return arr;
}
function yearWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatBRL(v) {
  try {
    return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v || 0);
  } catch {
    return `R$ ${Number(v || 0).toFixed(0)}`;
  }
}

/* ---------- Subcomponentes visuais ---------- */

function Section({ title, children }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.tituloSecao}>{title}</Text>
      {children}
    </View>
  );
}
function CardsRow({ items = [] }) {
  return (
    <View style={styles.row}>
      {items.map((it, idx) => <Card key={idx} titulo={it.titulo} valor={it.valor} />)}
    </View>
  );
}
function Card({ titulo, valor }) {
  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`${titulo}: ${typeof valor === "number" ? String(valor) : valor}`}>
      <Text style={styles.cardTitulo}>{titulo}</Text>
      <Text style={styles.cardValor}>{valor}</Text>
    </View>
  );
}

function ChartBlock({ title, data, formatYLabel }) {
  const maxValue = Math.max(1, ...data.map(d => d.value));
  const width = screenW - 40; // padding horizontal (20+20)
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.subtitulo}>{title}</Text>
      <BarChart
        data={data}
        width={width}
        height={180}
        maxValue={maxValue}
        noOfSections={4}
        stepValue={Math.ceil(maxValue / 4)}
        isAnimated
        animationDuration={600}
        barWidth={22}
        initialSpacing={12}
        spacing={14}
        barBorderRadius={8}
        frontColor={COLORS.azul}
        xAxisColor={"transparent"}
        yAxisColor={"transparent"}
        yAxisTextStyle={{ color: COLORS.textoSuave, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: COLORS.textoSuave, fontSize: 10 }}
        formatYLabel={formatYLabel}
        backgroundColor={"transparent"}
        rulesType="none"
      />
    </View>
  );
}

/* ---------- Estilos ---------- */

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 16 },
  err: { color: "#ef4444", marginBottom: 10 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  tituloSecao: { color: COLORS.texto, fontSize: 16, fontWeight: "800", marginBottom: 8 },

  card: {
    flexGrow: 1,
    flexBasis: "30%",
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    minWidth: 120,
  },
  cardTitulo: { color: COLORS.textoSuave, fontSize: 12 },
  cardValor: { color: COLORS.texto, fontSize: 22, fontWeight: "800", marginTop: 4 },

  subtitulo: { color: COLORS.texto, fontSize: 14, fontWeight: "700", marginTop: 6, marginBottom: 6 },
});

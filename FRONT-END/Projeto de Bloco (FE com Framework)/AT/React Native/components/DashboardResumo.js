// components/DashboardResumo.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../theme";
import { supabase } from "../supabase";

/**
 * Busca dados reais do Supabase:
 * - membros: totais/ativos/inativos + evolução 6 meses
 * - cursos: concluídos (= progresso 100) por mês (6 meses) + totais
 * - entradas: somas semanais (8 semanas) e agregados
 *
 * Observação:
 * - Para 'membros', este dashboard assume que o usuário é Admin (como definimos na rota Dashboard).
 *   Se não for, a policy pode limitar a leitura; o componente trata erros e exibe zeros.
 */

export default function DashboardResumo() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ----- ESTADO DOS DADOS -----
  const [membrosRows, setMembrosRows] = useState([]); // {is_active, joined_at}
  const [cursosRows, setCursosRows] = useState([]);   // {progresso, created_at, updated_at, status, is_arquivado}
  const [entradasRows, setEntradasRows] = useState([]); // {valor, tipo, data}

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      // janelas de tempo
      const now = new Date();
      const seisMesesAtras = new Date(now); seisMesesAtras.setMonth(now.getMonth() - 5); seisMesesAtras.setDate(1);
      const oitoSemanasAtras = new Date(now); oitoSemanasAtras.setDate(now.getDate() - 7 * 7);

      // --- MEMBROS (precisa RLS permitindo admin ler todos) ---
      // Traz poucos campos para agregar no cliente (últimos 6 meses para a evolução)
      const { data: membros, error: eM } = await supabase
        .from("membros")
        .select("is_active, joined_at, last_status_change")
        .gte("joined_at", seisMesesAtras.toISOString());
      if (eM && eM.code !== "PGRST116") throw eM; // PGRST116 = relation missing
      setMembrosRows(membros || []);

      // --- CURSOS ---
      const { data: cursos, error: eC } = await supabase
        .from("cursos")
        .select("progresso, created_at, updated_at, status, is_arquivado")
        .gte("created_at", seisMesesAtras.toISOString());
      if (eC && eC.code !== "PGRST116") throw eC;
      setCursosRows(cursos || []);

      // --- ENTRADAS (dízimos/ofertas) ---
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

  // ======== AGREGAÇÕES ========
  const dados = useMemo(() => {
    // Helpers de tempo
    const now = new Date();
    const mesesLabels = getUltimosMesesLabels(6); // ex: ["Abr","Mai",...]
    const chaveMes = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;

    // --- Membros ---
    const total = membrosRows.length; // dentro da janela; para total geral, faria outra query (head+count) se quiser
    const ativos = membrosRows.filter(m => m.is_active).length;
    const inativos = total - ativos;

    const membrosMesMap = new Map(mesesLabels.map(({key}) => [key, 0]));
    membrosRows.forEach(m => {
      const dt = new Date(m.joined_at || m.last_status_change || now);
      const key = chaveMes(dt);
      if (membrosMesMap.has(key)) {
        membrosMesMap.set(key, (membrosMesMap.get(key) || 0) + 1);
      }
    });
    const membrosMes = mesesLabels.map(({key, label}) => ({ label, total: membrosMesMap.get(key) || 0 }));

    // --- Cursos (concluídos = progresso 100) ---
    const concluidosRows = cursosRows.filter(c => Number(c.progresso) >= 100 && !c.is_arquivado);
    const cursosMesMap = new Map(mesesLabels.map(({key}) => [key, 0]));
    concluidosRows.forEach(c => {
      const dt = new Date(c.updated_at || c.created_at || now);
      const key = chaveMes(dt);
      if (cursosMesMap.has(key)) {
        cursosMesMap.set(key, (cursosMesMap.get(key) || 0) + 1);
      }
    });
    const cursosMes = mesesLabels.map(({key, label}) => ({ label, concluidos: cursosMesMap.get(key) || 0 }));
    const cursosTotalConcl = concluidosRows.length;
    const cursosMesAtual = cursosMes.at(-1)?.concluidos || 0;
    // taxa no mês: concluidos no mês / total cursos na janela (bem simplificado)
    const taxaMes = Math.round(100 * (cursosMesAtual / Math.max(1, cursosRows.length)));

    // --- Entradas (últimas 8 semanas) ---
    const semanasLabels = getUltimasSemanasLabels(8); // {key: "YYYY-WW", label:"S-8..S-1"}
    const entradasMap = new Map(semanasLabels.map(s => [s.key, 0]));
    entradasRows.forEach(e => {
      const key = yearWeekKey(new Date(e.data || now));
      if (entradasMap.has(key)) {
        entradasMap.set(key, (entradasMap.get(key) || 0) + Number(e.valor || 0));
      }
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
        <MiniBarChart
          title="Evolução (últimos meses)"
          series={dados.membrosMes.map(m => ({ label: m.label, value: m.total }))}
          accessibilityLabel="Gráfico de barras com evolução do total de membros nos últimos meses"
        />
      </Section>

      {/* ===== Cursos finalizados ===== */}
      <Section title="Cursos finalizados">
        <CardsRow items={dados.cards.cursos} />
        <MiniBarChart
          title="Concluídos por mês"
          series={dados.cursosMes.map(c => ({ label: c.label, value: c.concluidos }))}
          accessibilityLabel="Gráfico de barras com cursos finalizados por mês"
        />
      </Section>

      {/* ===== Entradas ===== */}
      <Section title="Entradas (Dízimos e Ofertas)">
        <CardsRow items={dados.cards.entradas} />
        <MiniBarChart
          title="Semanas recentes"
          series={dados.entradasSem.map(e => ({ label: e.label, value: e.valor }))}
          accessibilityLabel="Gráfico de barras com valores semanais de entradas"
          valueFormatter={formatBRL}
        />
      </Section>
    </View>
  );
}

/* ---------- Helpers de data/agregação ---------- */

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
  // ISO Week
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

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
      {items.map((it, idx) => (
        <Card key={idx} titulo={it.titulo} valor={it.valor} />
      ))}
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

function MiniBarChart({ title, series = [], accessibilityLabel, valueFormatter }) {
  const max = Math.max(1, ...series.map(s => s.value));
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.subtitulo}>{title}</Text>
      <View style={styles.chartRow} accessible accessibilityLabel={accessibilityLabel || "Gráfico de barras"}>
        {series.map((s, i) => (
          <View key={i} style={styles.barWrap} accessibilityLabel={`${s.label}: ${fmt(valueFormatter, s.value)}`}>
            <View style={[styles.bar, { height: 6 + (60 * s.value) / max }]} />
            <Text style={styles.barLabel}>
              {s.label} • {fmt(valueFormatter, s.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function fmt(formatter, value) {
  return typeof formatter === "function" ? formatter(value) : String(value);
}
function formatBRL(v) {
  try {
    return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v || 0);
  } catch {
    return `R$ ${Number(v || 0).toFixed(0)}`;
  }
}

/* ---------- Estilos ---------- */

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 16 },
  err: { color: "#ef4444", marginBottom: 10 },

  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  tituloSecao: {
    color: COLORS.texto,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

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

  chartRow: { flexDirection: "row", gap: 12, alignItems: "flex-end" },
  barWrap: { alignItems: "center", flex: 1 },
  bar: { width: "100%", backgroundColor: COLORS.azul, borderRadius: 8 },
  barLabel: { color: COLORS.textoSuave, fontSize: 11, marginTop: 6, textAlign: "center" },
});

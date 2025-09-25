
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { COLORS } from "../theme";
import DashboardResumo from "../components/DashboardResumo";
import { listarCursos, agregados } from "../services/cursos";

export default function DashboardAdmin({ navigation }) {
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0, mediaProg: 0 });

  const carregar = useCallback(async () => {
    const cursos = await listarCursos({ incluirArquivados: true });
    setStats(agregados(cursos));
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: "Dashboard" });
    carregar();
  }, [carregar, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DashboardResumo stats={stats} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24, backgroundColor: COLORS.fundo },
});

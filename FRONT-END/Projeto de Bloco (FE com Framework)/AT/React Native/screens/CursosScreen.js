import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable, LongPressGestureHandler } from 'react-native-gesture-handler';

import { useAuth } from '../hooks/useAuth';
import { listarCursos, excluirCurso } from '../services/cursos';
import {
  minhasMatriculas,
  inscreverNoCurso,
  atualizarProgresso,
} from '../services/matriculas';
import CursoFormModal from '../components/cursos/CursoFormModal';
import HeaderCursos from '../components/cursos/HeaderCursos';
import CursoCard from '../components/cursos/CursoCard';

export default function CursosScreen({ navigation }) {
  const { usuario, carregandoSessao, perfil, isAdmin } = useAuth();

  const papel = perfil?.perfil ?? 'Visitante';
  const admin = !!isAdmin;
  const isMember = !admin && papel === 'Membro';
  const isVisitor = !admin && !isMember;

  const [rows, setRows] = useState([]);
  const [matriculas, setMatriculas] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  // título e gate de login
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title: admin ? 'Gerenciar cursos' : 'Cursos' });
      if (!carregandoSessao && !usuario) {
        Alert.alert('Acesso restrito', 'Faça login para acessar os cursos.');
        navigation.goBack();
      }
    }, [navigation, admin, carregandoSessao, usuario])
  );

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [cursos, mats] = await Promise.all([
        listarCursos(),
        usuario ? minhasMatriculas() : Promise.resolve([]),
      ]);
      setRows(cursos || []);
      const map = {};
      (mats || []).forEach((m) => (map[m.curso_id] = m));
      setMatriculas(map);
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Falha ao carregar cursos.');
    } finally {
      setRefreshing(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  /* Ações */
  const handleInscrever = useCallback(
    async (curso) => {
      try {
        await inscreverNoCurso(curso.id);
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        Alert.alert('Inscrição', `Você foi inscrito em: ${curso.titulo}`);
        load();
      } catch (e) {
        Alert.alert('Erro', e?.message || 'Não foi possível inscrever.');
      }
    },
    [load]
  );

  const handleProgresso = useCallback(async (curso, novoValor) => {
    // otimista simples
    setMatriculas((prev) => {
      const cur = prev[curso.id] || {
        curso_id: curso.id,
        progresso: 0,
        status: 'Novo',
      };
      return {
        ...prev,
        [curso.id]: {
          ...cur,
          progresso: novoValor,
          status: novoValor === 100 ? 'Concluido' : 'Em andamento',
        },
      };
    });

    try {
      const { status } = await atualizarProgresso(curso.id, novoValor);
      if (status === 'Concluido') {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        Alert.alert('Parabéns!', 'Curso concluído!');
      } else {
        await Haptics.selectionAsync();
      }
    } catch (e) {
      // reverte
      setMatriculas((prev) => {
        const cur = prev[curso.id];
        return {
          ...prev,
          [curso.id]: { ...cur, progresso: cur?.progresso ?? 0 },
        };
      });
      Alert.alert('Erro', e?.message || 'Falha ao atualizar progresso.');
    }
  }, []);

  const handleExcluir = useCallback(
    async (id) => {
      try {
        await excluirCurso(id);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        load();
      } catch (e) {
        Alert.alert('Erro', e?.message || 'Falha ao excluir curso.');
      }
    },
    [load]
  );

  const abrirNovo = useCallback(() => {
    setEditando(null);
    setFormOpen(true);
  }, []);
  const onSaved = useCallback(() => {
    setFormOpen(false);
    load();
  }, [load]);

  /* Swipe action (apenas admin) */
  const renderRightActions = useCallback(
    (onDeletePress) => (
      <Pressable
        onPress={onDeletePress}
        style={({ pressed }) => [st.swipeDel, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel="Excluir curso">
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={st.swipeText}>Excluir</Text>
      </Pressable>
    ),
    []
  );

  /* FlatList */
  const keyExtractor = useCallback((it) => String(it.id), []);

  const renderItem = useCallback(
    ({ item }) => {
      const swipeRef = { current: null };

      

      const confirmDelete = () => {
        if (!admin) return;
        Alert.alert('Excluir', 'Deseja excluir este curso?', [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => swipeRef.current?.close?.(),
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              swipeRef.current?.close?.();
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleExcluir(item.id);
            },
          },
        ]);
      };

      const onCardLongPress = async () => {
      if (!admin) return; // só admin edita
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setEditando(item);
      setFormOpen(true);
    };

      const content = (
        <Pressable
        onLongPress={onCardLongPress}
        delayLongPress={450}            // ~450ms p/ evitar toques acidentais
        android_disableSound={false}    // mantém haptic/som nativo no Android
        style={({ pressed }) => pressed && { opacity: 0.96 }}
      >
          <CursoCard
            item={item}
            matricula={matriculas[item.id]}
            isAdmin={admin}
            isMember={isMember}
            onEditar={() => {}}
            onExcluir={handleExcluir}
            onInscrever={handleInscrever}
            onProgresso={handleProgresso}
          />
        </Pressable>
      );

      if (!admin) return content;

      return (
        <Swipeable
          ref={(r) => (swipeRef.current = r)}
          renderRightActions={() => renderRightActions(confirmDelete)}
          overshootRight={false}
          friction={2}
          rightThreshold={36}>
          {content}
        </Swipeable>
      );
    },
    [
      admin,
      matriculas,
      isMember,
      handleExcluir,
      handleInscrever,
      handleProgresso,
      renderRightActions,
    ]
  );

  const header = useMemo(
    () => (
      <HeaderCursos isAdmin={admin} isVisitor={isVisitor} onNovo={abrirNovo} />
    ),
    [admin, isVisitor, abrirNovo]
  );

  return (
    <View style={st.page}>
      <FlatList
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text
            style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>
            Nenhum curso cadastrado.
          </Text>
        }
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={7}
      />

      <CursoFormModal
        visible={formOpen}
        inicial={editando}
        onClose={() => setFormOpen(false)}
        onSaved={onSaved}
      />
    </View>
  );
}

const st = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },

  // Swipe action (direita → excluir)
  swipeDel: {
    width: 96,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 6,
    marginLeft: 8,
  },
  swipeText: { color: '#fff', fontWeight: '800', marginTop: 4, fontSize: 12 },
});

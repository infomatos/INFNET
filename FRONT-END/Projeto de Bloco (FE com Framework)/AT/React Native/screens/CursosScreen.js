import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { COLORS } from "../theme";
import { supabase } from "../supabase";
import { listarCursos, excluirCurso } from "../services/cursos";
import { minhasMatriculas, inscreverNoCurso, atualizarProgresso } from "../services/matriculas";
import CursoFormModal from "../components/CursoFormModal";

function ProgressBar({ value=0, done }) {
  return (
    <View style={st.progressWrap}>
      <View style={[st.progressFill, { width: `${value}%`, backgroundColor: done ? "#16a34a" : COLORS.azul }]} />
      <Text style={st.progressText}>{value}%</Text>
    </View>
  );
}

export default function CursosScreen({ navigation }) {
  const [perfil, setPerfil] = useState(null);        // 'Admin' | 'Membro' | 'Visitante'
  const [rows, setRows] = useState([]);
  const [matriculas, setMatriculas] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(()=>{ navigation.setOptions({ title: "Cursos" }); },[navigation]);

  // exige login
  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getUser();
      if (!sess?.user) { Alert.alert("Acesso restrito","Faça login para acessar os cursos."); navigation.goBack(); }
    })();
  }, [navigation]);

  // descobre perfil
  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getUser();
      if (!sess?.user) return;
      const { data } = await supabase.from("perfis").select("perfil").eq("auth_user_id", sess.user.id).single();
      setPerfil(data?.perfil || "Visitante");
    })();
  }, []);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const cursos = await listarCursos();
      setRows(cursos);
      const { data: sess } = await supabase.auth.getUser();
      if (sess?.user) {
        const list = await minhasMatriculas();
        const map = {}; list.forEach(m => map[m.curso_id] = m);
        setMatriculas(map);
      } else setMatriculas({});
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar cursos.");
    } finally { setRefreshing(false); }
  }, []);
  useEffect(()=>{ load(); },[load]);

  const isAdmin = perfil === "Admin";
  const isMember = perfil === "Membro";
  const isVisitor = perfil === "Visitante";

  const handleInscrever = async (curso) => {
    await inscreverNoCurso(curso.id);
    Alert.alert("Inscrição", `Você foi inscrito em: ${curso.titulo}`);
    load();
  };
  const handleProgresso = async (curso, novoValor) => {
    const { status } = await atualizarProgresso(curso.id, novoValor);
    if (status === "Concluido") Alert.alert("Parabéns!","Curso concluído!");
    load();
  };

  const renderCard = ({ item }) => {
    const reg = matriculas[item.id];
    const inscrito = !!reg;
    const prog = reg?.progresso ?? 0;
    const done = reg?.status === "Concluido";

    return (
      <View style={st.card}>
        <Text style={st.titulo}>{item.titulo}</Text>
        <Text style={st.meta}>
          Prof.: <Text style={st.bold}>{item.professor || "-"}</Text> • Carga: <Text style={st.bold}>{item.carga_horaria || "-"}</Text>
        </Text>
        {item.descricao ? <Text style={st.desc}>{item.descricao}</Text> : null}

        {isAdmin && (
          <View style={st.row}>
            <Pressable style={st.btnGhost} onPress={()=>{ setEditando(item); setFormOpen(true); }}>
              <Text style={st.btnGhostTxt}>Editar</Text>
            </Pressable>
            <Pressable
              style={[st.btnGhost, { borderColor: "#ef4444" }]}
              onPress={()=>Alert.alert("Excluir","Deseja excluir este curso?",[
                {text:"Cancelar",style:"cancel"},
                {text:"Excluir",style:"destructive",onPress: async()=>{ await excluirCurso(item.id); load(); }}
              ])}
            >
              <Text style={[st.btnGhostTxt, { color:"#ef4444" }]}>Excluir</Text>
            </Pressable>
          </View>
        )}

        {isMember && (
          <>
            {!inscrito ? (
              <Pressable style={st.btnPrimary} onPress={()=>handleInscrever(item)}>
                <Text style={st.btnPrimaryTxt}>Inscrever-se</Text>
              </Pressable>
            ) : (
              <View style={{ gap:8 }}>
                <ProgressBar value={prog} done={done} />
                <View style={st.sliderRow}>
                  <Pressable style={st.sliderBtn} onPress={()=>handleProgresso(item, Math.max(0, prog-10))}><Text style={st.sliderBtnTxt}>-10%</Text></Pressable>
                  <Pressable style={st.sliderBtn} onPress={()=>handleProgresso(item, Math.min(100, prog+10))}><Text style={st.sliderBtnTxt}>+10%</Text></Pressable>
                  <Pressable style={st.sliderBtn} onPress={()=>handleProgresso(item, 100)}><Text style={st.sliderBtnTxt}>100%</Text></Pressable>
                </View>
              </View>
            )}
          </>
        )}

        {isVisitor && <Text style={st.aviso}>Disponível para membros. Fale com seu líder.</Text>}
      </View>
    );
  };

  return (
    <View style={st.page}>
      <FlatList
        data={rows}
        keyExtractor={(it)=>it.id}
        renderItem={renderCard}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListHeaderComponent={
          <View style={{ padding:16, paddingBottom:8 }}>
            <Text style={st.header}>{isAdmin ? "Gerenciar cursos" : "Cursos"}</Text>
            {isAdmin && (
              <Pressable style={[st.btnPrimary,{marginTop:8}]}
                onPress={()=>{ setEditando(null); setFormOpen(true); }}>
                <Text style={st.btnPrimaryTxt}>Novo curso</Text>
              </Pressable>
            )}
          </View>
        }
        contentContainerStyle={{ paddingHorizontal:16, paddingBottom:24 }}
        ListEmptyComponent={<Text style={{ textAlign:"center", color:"#6B7280", marginTop:20 }}>Nenhum curso cadastrado.</Text>}
      />

      <CursoFormModal
        visible={formOpen}
        inicial={editando}
        onClose={()=>setFormOpen(false)}
        onSaved={load}
      />
    </View>
  );
}

const st = StyleSheet.create({
  page:{ flex:1, backgroundColor:"#fff" },
  header:{ color:"#111827", fontWeight:"800", fontSize:18 },

  card:{ backgroundColor:"#fff", borderWidth:1, borderColor:"rgba(0,0,0,0.08)", borderRadius:14, padding:14, marginBottom:12 },
  titulo:{ fontSize:16, fontWeight:"800", color:"#111827" },
  meta:{ fontSize:12, color:"#475569", marginTop:4 },
  desc:{ fontSize:13, color:"#111827", marginTop:8, lineHeight:18 },
  bold:{ fontWeight:"800" },

  row:{ flexDirection:"row", gap:8, marginTop:10 },
  btnPrimary:{ backgroundColor:COLORS.azul, paddingVertical:10, paddingHorizontal:12, borderRadius:12, borderWidth:1, borderColor:"rgba(0,0,0,0.08)", alignItems:"center", marginTop:10 },
  btnPrimaryTxt:{ color:"#fff", fontWeight:"800" },
  btnGhost:{ backgroundColor:"#F3F4F6", paddingVertical:10, paddingHorizontal:12, borderRadius:12, borderWidth:1, borderColor:"rgba(0,0,0,0.12)" },
  btnGhostTxt:{ color:"#111827", fontWeight:"800" },

  aviso:{ marginTop:10, color:"#EF4444", fontWeight:"600" },

  progressWrap:{ height:16, backgroundColor:"#E5E7EB", borderRadius:999, overflow:"hidden", justifyContent:"center" },
  progressFill:{ height:"100%" },
  progressText:{ position:"absolute", width:"100%", textAlign:"center", fontSize:10, color:"#111827", fontWeight:"800" },

  sliderRow:{ flexDirection:"row", gap:8 },
  sliderBtn:{ flex:1, backgroundColor:"#F3F4F6", borderWidth:1, borderColor:"rgba(0,0,0,0.12)", borderRadius:10, paddingVertical:8, alignItems:"center" },
  sliderBtnTxt:{ color:"#111827", fontWeight:"800" },
});

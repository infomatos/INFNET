import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { salvarCurso } from "../services/cursos";
import { COLORS } from "../theme";

export default function CursoFormModal({ visible, inicial, onClose, onSaved }) {
  const [v, setV] = useState({
    titulo: "", descricao: "", professor: "", carga_horaria: "", status: "Ativo",
  });

  useEffect(() => {
    if (inicial) {
      setV({
        id: inicial.id,
        titulo: inicial.titulo || "",
        descricao: inicial.descricao || "",
        professor: inicial.professor || "",
        carga_horaria: String(inicial.carga_horaria ?? ""),
        status: inicial.status || "Ativo",
      });
    } else {
      setV({ titulo: "", descricao: "", professor: "", carga_horaria: "", status: "Ativo" });
    }
  }, [inicial, visible]);

  async function salvar() {
    if (!v.titulo?.trim()) return alert("Informe o título.");
    const payload = {
      id: v.id,
      titulo: v.titulo.trim(),
      descricao: v.descricao.trim(),
      professor: v.professor.trim(),
      carga_horaria: v.carga_horaria ? Number(v.carga_horaria) : null,
      status: v.status,
    };
    await salvarCurso(payload);
    onSaved?.();
    onClose?.();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.modal}>
        <Text style={s.title}>{v.id ? "Editar curso" : "Novo curso"}</Text>

        <Label> Título </Label>
        <Input value={v.titulo} onChangeText={(t)=>setV(o=>({...o,titulo:t}))} />

        <Label> Descrição </Label>
        <Input value={v.descricao} onChangeText={(t)=>setV(o=>({...o,descricao:t}))} multiline />

        <Label> Professor </Label>
        <Input value={v.professor} onChangeText={(t)=>setV(o=>({...o,professor:t}))} />

        <Label> Carga horária (h) </Label>
        <Input value={v.carga_horaria} onChangeText={(t)=>setV(o=>({...o,carga_horaria:t}))} keyboardType="numeric" />

        <View style={s.row}>
          <Pressable style={s.btnGhost} onPress={onClose}><Text style={s.btnGhostTxt}>Cancelar</Text></Pressable>
          <Pressable style={s.btnPrimary} onPress={salvar}><Text style={s.btnPrimaryTxt}>Salvar</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Label({ children }) { return <Text style={s.label}>{children}</Text>; }
function Input(props) { return <TextInput {...props} style={[s.input, props.style]} placeholderTextColor="#9CA3AF" />; }

const s = StyleSheet.create({
  backdrop:{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.45)"},
  modal:{position:"absolute",left:12,right:12,top:60,backgroundColor:"#fff",borderRadius:16,borderWidth:1,borderColor:"rgba(0,0,0,0.08)",padding:16},
  title:{color:"#111827",fontWeight:"800",fontSize:18,marginBottom:8},
  label:{color:"#111827",fontWeight:"700",marginTop:8,marginBottom:6},
  input:{borderWidth:1,borderColor:"rgba(0,0,0,0.12)",borderRadius:12,paddingHorizontal:12,paddingVertical:10,color:"#111827"},
  row:{flexDirection:"row",gap:10,justifyContent:"flex-end",marginTop:12},
  btnPrimary:{backgroundColor:COLORS.azul,paddingVertical:10,paddingHorizontal:12,borderRadius:12,borderWidth:1,borderColor:"rgba(0,0,0,0.08)"},
  btnPrimaryTxt:{color:"#fff",fontWeight:"800"},
  btnGhost:{backgroundColor:"#F3F4F6",paddingVertical:10,paddingHorizontal:12,borderRadius:12,borderWidth:1,borderColor:"rgba(0,0,0,0.12)"},
  btnGhostTxt:{color:"#111827",fontWeight:"800"},
});

// components/AdminUserForm.js
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { COLORS } from "../theme";
import { criarPerfil, atualizarPerfil } from "../services/perfis";

export default function AdminUserForm({ visible, inicial, onClose, onSaved }) {
  const [v, setV] = useState({
    nome: "", email: "", telefone: "", idade: "", endereco: "",
  });

  useEffect(() => {
    if (inicial) {
      setV({
        nome: inicial.nome || "",
        email: inicial.email || "",
        telefone: inicial.telefone || "",
        idade: String(inicial.idade ?? ""),
        endereco: inicial.endereco || "",
      });
    } else {
      setV({ nome: "", email: "", telefone: "", idade: "", endereco: "" });
    }
  }, [inicial, visible]);

  async function handleSave() {
    if (!v.nome?.trim()) return alert("Informe o nome.");
    if (!/\S+@\S+\.\S+/.test(v.email)) return alert("Informe um e-mail válido.");
    const payload = {
      nome: v.nome.trim(),
      email: v.email.trim(),
      telefone: v.telefone.trim(),
      idade: v.idade ? Number(v.idade) : null,
      endereco: v.endereco.trim(),
    };
    if (inicial?.id) {
      await atualizarPerfil(inicial.id, payload);
    } else {
      // por padrão, novos entram como Visitante
      await criarPerfil({ ...payload, perfil: "Visitante" });
    }
    onSaved?.();
    onClose?.();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.modal}>
        <Text style={s.title}>{inicial?.id ? "Editar perfil" : "Novo perfil"}</Text>

        <Label>Nome</Label>
        <Input value={v.nome} onChangeText={(t)=>setV(o=>({...o, nome:t}))} />

        <Label>E-mail</Label>
        <Input value={v.email} onChangeText={(t)=>setV(o=>({...o, email:t}))} keyboardType="email-address" autoCapitalize="none" />

        <Label>Telefone</Label>
        <Input value={v.telefone} onChangeText={(t)=>setV(o=>({...o, telefone:t}))} keyboardType="phone-pad" />

        <Label>Idade</Label>
        <Input value={v.idade} onChangeText={(t)=>setV(o=>({...o, idade:t}))} keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"} />

        <Label>Endereço</Label>
        <Input value={v.endereco} onChangeText={(t)=>setV(o=>({...o, endereco:t}))} />

        <View style={s.row}>
          <Pressable style={s.btnGhost} onPress={onClose}>
            <Text style={s.btnGhostTxt}>Cancelar</Text>
          </Pressable>
          <Pressable style={s.btnPrimary} onPress={handleSave}>
            <Text style={s.btnPrimaryTxt}>Salvar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Label({ children }) { return <Text style={s.label}>{children}</Text>; }
function Input(props) { return <TextInput {...props} style={[s.input, props.style]} placeholderTextColor="#9CA3AF" />; }

const s = StyleSheet.create({
  backdrop:{ position:"absolute", inset:0, backgroundColor:"rgba(0,0,0,0.45)" },
  modal:{ position:"absolute", left:12, right:12, top:60, backgroundColor:"#fff", borderRadius:16, borderWidth:1, borderColor:"rgba(0,0,0,0.08)", padding:16 },
  title:{ color:"#111827", fontWeight:"800", fontSize:18, marginBottom:8 },
  label:{ color:"#111827", fontWeight:"700", marginTop:8, marginBottom:6 },
  input:{ borderWidth:1, borderColor:"rgba(0,0,0,0.12)", borderRadius:12, paddingHorizontal:12, paddingVertical:10, color:"#111827" },
  row:{ flexDirection:"row", gap:10, justifyContent:"flex-end", marginTop:12 },
  btnPrimary:{ backgroundColor:COLORS.azul, paddingVertical:10, paddingHorizontal:12, borderRadius:12, borderWidth:1, borderColor:"rgba(0,0,0,0.08)" },
  btnPrimaryTxt:{ color:"#fff", fontWeight:"800" },
  btnGhost:{ backgroundColor:"#F3F4F6", paddingVertical:10, paddingHorizontal:12, borderRadius:12, borderWidth:1, borderColor:"rgba(0,0,0,0.12)" },
  btnGhostTxt:{ color:"#111827", fontWeight:"800" },
});

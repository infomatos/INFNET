// components/SignupModal.js
import React from "react";
import {
  Modal, View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable
} from "react-native";
import Botao from "./Botao";
import { COLORS } from "../theme";

export default function SignupModal({
  visible,
  values,                  // { nome, email, telefone, idade, endereco, senha }
  setValues,               // (v) => setValues({ ...values, ...v })
  loading,
  error,
  onSubmit,                // cria auth + perfil Visitante
  onCancel,
}) {
  const set = (k, v) => setValues({ [k]: v });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.sub}>Preencha seus dados — você entra como Visitante.</Text>
          {!!error && <Text style={styles.msgErro}>{error}</Text>}

          {[
            { k: "nome", label: "Nome completo", placeholder: "Seu nome" },
            { k: "email", label: "E-mail", placeholder: "seuemail@exemplo.com", props: { keyboardType: "email-address", autoCapitalize: "none" } },
            { k: "telefone", label: "Telefone", placeholder: "(11) 99999-9999" },
            { k: "idade", label: "Idade", placeholder: "18", props: { keyboardType: "numeric" } },
            { k: "endereco", label: "Endereço", placeholder: "Rua, número, bairro, cidade" },
            { k: "senha", label: "Senha", placeholder: "••••••••", props: { secureTextEntry: true } },
          ].map((f) => (
            <View key={f.k} style={styles.campo}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                value={values[f.k] ?? ""}
                onChangeText={(t) => set(f.k, t)}
                placeholder={f.placeholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                {...(f.props || {})}
              />
            </View>
          ))}

          <View style={styles.acoes}>
            <Botao
              titulo={loading ? "Cadastrando..." : "Cadastrar"}
              onPress={onSubmit}
              style={{ flex: 1 }}
              icone={loading ? <ActivityIndicator /> : null}
            />
            <Botao titulo="Cancelar" variante="secundario" onPress={onCancel} style={{ flex: 1 }} />
          </View>

          <Pressable onPress={onCancel}><Text style={styles.link}>Já tenho conta — Voltar</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0D0D0D", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  titulo: { color: COLORS.texto, fontSize: 18, fontWeight: "800" },
  sub: { color: COLORS.textoSuave, marginBottom: 10, marginTop: 4 },
  msgErro: { color: "#F87171", backgroundColor: "rgba(248,113,113,0.15)", borderColor: "rgba(248,113,113,0.35)", borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, marginBottom: 10, fontSize: 12 },
  campo: { marginBottom: 10 },
  label: { color: COLORS.textoSuave, marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: "#111111", color: COLORS.texto, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  acoes: { flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 6 },
  link: { color: COLORS.azul, textAlign: "center", marginTop: 4, fontWeight: "700" },
});

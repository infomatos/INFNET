import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Botao from "./Botao";
import { COLORS } from "../theme";

export default function LoginModal({
  visible,
  email,
  senha,
  setEmail,
  setSenha,
  loading,
  error,
  onSubmit,
  onCancel,
  onResetSenha,
  onWantSignUp,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitulo}>Entrar</Text>
          <Text style={styles.modalSub}>Acesse sua conta para continuar</Text>

          {!!error && <Text style={styles.modalErro}>{error}</Text>}

          <View style={styles.campo}>
            <Text style={styles.campoLabel}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.campoLabel}>Senha</Text>
            <TextInput
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
            />
          </View>

          <View style={styles.modalAcoes}>
            <Botao
              titulo={loading ? "Entrando..." : "Entrar"}
              onPress={onSubmit}
              icone={
                loading ? (
                  <ActivityIndicator size="small" color={COLORS.texto} style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="log-in" size={18} color={COLORS.texto} style={{ marginRight: 8 }} />
                )
              }
              style={{ flex: 1 }}
            />
            <Botao
              titulo="Cancelar"
              onPress={onCancel}
              variante="secundario"
              style={{ flex: 1 }}
              icone={<Ionicons name="close" size={18} style={{ marginRight: 8 }} />}
            />
          </View>

          <Pressable onPress={onResetSenha}>
            <Text style={styles.linkAjuda}>Esqueci minha senha</Text>
          </Pressable>

          <View style={{ height: 8 }} />

          <Pressable onPress={onWantSignUp}>
            <Text style={[styles.linkAjuda, { opacity: 0.9 }]}>Não tenho conta — Cadastrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  modalTitulo: { color: COLORS.texto, fontSize: 18, fontWeight: "800" },
  modalSub: { color: "rgba(255,255,255,0.8)", marginTop: 4, marginBottom: 12 },
  modalErro: {
    color: "#F87171",
    backgroundColor: "rgba(248,113,113,0.15)",
    borderColor: "rgba(248,113,113,0.35)",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 12,
  },
  campo: { marginBottom: 10 },
  campoLabel: { color: "rgba(255,255,255,0.85)", marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: "#111111",
    color: COLORS.texto,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalAcoes: { flexDirection: "row", gap: 10, marginTop: 10, marginBottom: 8 },
  linkAjuda: { color: COLORS.azul, textAlign: "center", marginTop: 4, fontWeight: "700" },
});

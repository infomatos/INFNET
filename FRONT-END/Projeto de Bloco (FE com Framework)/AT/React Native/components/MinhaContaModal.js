import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme';

export default function MinhaContaModal({
  visible,
  onClose,
  user,
  perfil,
  isAdmin,
  onLogout,
  onOpenCursos,
  onOpenDashboard,
  onEdit,
}) {
  const nome =
    perfil?.nome ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    '-';
  const email = user?.email || '-';
  const papel = isAdmin ? 'Admin' : perfil?.perfil || 'Visitante';

  const avatar = perfil?.avatar_url || user?.user_metadata?.avatar_url || null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={st.backdrop}>
        <View style={st.card}>
          <Text style={st.title}>Minha conta</Text>

          <View style={st.headerRow}>
            <View style={st.avatarCircle}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={st.avatarImg} />
              ) : (
                <Text style={{ color: '#9CA3AF', fontWeight: '700' }}>
                  Sem foto
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.name}>{nome}</Text>
              <Text style={st.email}>{email}</Text>
              <Text style={st.badge}>{papel}</Text>
            </View>
          </View>

          <View style={{ gap: 8, marginTop: 16 }}>
            <Pressable
              style={st.btnPrimary}
              onPress={() => {
                onClose?.();
                onEdit?.();
              }}>
              <Text style={st.btnPrimaryTxt}>Editar perfil</Text>
            </Pressable>

            <Pressable
              style={st.btnGhost}
              onPress={() => {
                onClose?.();
                onOpenCursos?.();
              }}>
              <Text style={st.btnGhostTxt}>Meus cursos</Text>
            </Pressable>

            {isAdmin && (
              <Pressable
                style={st.btnGhost}
                onPress={() => {
                  onClose?.();
                  onOpenDashboard?.();
                }}>
                <Text style={st.btnGhostTxt}>Abrir Dashboard</Text>
              </Pressable>
            )}

            <Pressable
              style={[st.btnGhost, { borderColor: '#ef4444' }]}
              onPress={async () => {
                await onLogout?.();
                onClose?.();
              }}>
              <Text style={[st.btnGhostTxt, { color: '#ef4444' }]}>Sair</Text>
            </Pressable>

            <Pressable style={st.link} onPress={onClose}>
              <Text style={st.linkTxt}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  email: {
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    marginTop: 2,
    color: '#111827',
    fontWeight: '700',
  },

  btnPrimary: {
    backgroundColor: COLORS.azul,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  btnPrimaryTxt: {
    color: '#fff',
    fontWeight: '800',
  },
  btnGhost: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
  },
  btnGhostTxt: {
    color: '#111827',
    fontWeight: '800',
  },

  link: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkTxt: {
    color: '#6B7280',
    fontWeight: '700',
  },
});

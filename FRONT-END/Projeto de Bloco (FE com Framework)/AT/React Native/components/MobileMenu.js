
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useNavigation } from "@react-navigation/native";

export default function MobileMenu({ user, isAdmin=false, onPressLogin, onLogout, onOpenAdmin }) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const close = () => setOpen(false);
  const openLink = (url) => Linking.openURL(url);

  return (
    <>
      {/* Botão hamburger no topo direito */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.menuBtn,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu">
        <Ionicons name="menu" size={22} color={COLORS.texto} />
      </Pressable>

      {/* Modal/Sheet */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} />

        <View style={styles.sheet} accessibilityLabel="Menu">
          {/* Itens fixos */}
          {!user && (
            <Item
              label="Entrar"
              icon="log-in-outline"
              onPress={() => {
                close();
                onPressLogin?.();
              }}
            />
          )}
          <Item
            label="Eventos"
            icon="calendar-outline"
            onPress={() => { close(); navigation.navigate("Eventos"); }}
          />
          <Item
            label="Ofertas"
            icon="heart-outline"
            onPress={() => { close(); navigation.navigate("Ofertas"); }}
          />

          {/* Itens pós-login */}
          {user && (
            <Item
              label="Cursos"
              icon="school-outline"
              onPress={() => { close(); navigation.navigate("Cursos"); }}
            />
          )}

          {user && isAdmin && (
            <Item
              label="Painel Dashboard"
              icon="speedometer-outline"
              onPress={() => {
                close();
                navigation.navigate("Dashboard");
              }}
            />
          )}
          {user && isAdmin && (
            <Item
              label="Admin"
              icon="settings-outline"
             onPress={() => { close(); navigation.navigate("Admin"); }}
            />
          )}

          {user && (
            <Item
              label="Sair"
              icon="exit-outline"
              danger
              onPress={() => {
                close();
                onLogout?.();
              }}
            />
          )}

          <Text style={styles.hint}>
            {Platform.select({
              ios: 'GUIA Church • iOS',
              android: 'GUIA Church • Android',
              default: 'GUIA Church • Web',
            })}
          </Text>
        </View>
      </Modal>
    </>
  );
}

function Item({ label, icon, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View style={styles.itemLeft}>
        <Ionicons
          name={icon}
          size={18}
          color={danger ? '#ef4444' : COLORS.texto}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.itemText, danger && { color: '#ef4444' }]}>
          {label}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color="rgba(255,255,255,0.5)"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    zIndex: 20,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    top: 56,
    right: 12,
    minWidth: 220,
    backgroundColor: '#0D0D0D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 6,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { color: COLORS.texto, fontSize: 14, fontWeight: '700' },
  hint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});

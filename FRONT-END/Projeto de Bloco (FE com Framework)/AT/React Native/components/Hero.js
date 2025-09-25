import MobileMenu from './MobileMenu';

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import Botao from './Botao';
import { Linking } from 'react-native';
import logo from '../assets/logo1.png';

// assinatura:
export default function Hero({
  onPressLogin,
  user,
  onLogout,
  onOpenAccount,
  onOpenCursos,
  onOpenDashboard,
  onOpenAdmin,
  isAdmin,
}) {
  return (
    <View style={styles.hero}>
      {/* Header no canto direito */}
      <MobileMenu
        user={user}
        isAdmin={isAdmin}
        onPressLogin={onPressLogin}
        onLogout={onLogout}
        onOpenCursos={onOpenCursos}
        onOpenDashboard={onOpenDashboard}
        onOpenAdmin={onOpenAdmin}
      />

      <View style={styles.heroIconeWrap}>
        <MaterialCommunityIcons name="church" size={56} color={COLORS.texto} />
      </View>
      <Text style={styles.heroTitulo}>GUIA Church</Text>
      <Text style={styles.heroSubtitulo}>
        Uma igreja para amar a Deus, servir pessoas e transformar nossa cidade.
      </Text>

      <View style={styles.heroAcoes}>
        <Botao
          titulo="Assistir ao vivo"
          onPress={() => Linking.openURL('https://www.youtube.com/@guiachurch')}
          icone={
            <Ionicons
              name="play"
              size={18}
              color={COLORS.texto}
              style={{ marginRight: 8 }}
            />
          }
        />
        <Botao
          titulo="Como chegar"
          variante="secundario"
          onPress={() =>
            Linking.openURL('https://maps.app.goo.gl/hFJrXuPLEi7Q2AX3A')
          }
          icone={
            <Ionicons
              name="location"
              size={18}
              color={COLORS.azul}
              style={{ marginRight: 8 }}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: COLORS.fundoEscuro,
  },
  topoDireitoWrap: {
    position: 'absolute',
    top: 16,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: 180,
  },
  userBadgeTxt: { color: COLORS.texto, fontSize: 12, fontWeight: '700' },
  entrarBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    backgroundColor: COLORS.azul,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  sairBtn: {
    backgroundColor: COLORS.azul,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerBtn: {
    backgroundColor: COLORS.azul,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  headerBtnTxt: {
    color: COLORS.texto,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  heroIconeWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  heroTitulo: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.texto,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  heroSubtitulo: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
  heroLogo: {
    width: 72,
    height: 72,
    backgroundColor: 'white',
  },

  heroAcoes: { flexDirection: 'row', gap: 10, marginTop: 16 },
});

import MobileMenu from './MobileMenu';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import Botao from './Botao';
import { Linking } from 'react-native';

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
  displayName, //  nome para exibir quando logado
  avatarUrl,
}) {
  // usa só o primeiro nome, se houver espaço
  const shortName = displayName?.trim()?.split(' ')?.[0] || displayName;

  return (
    <View style={styles.hero}>
      {/* badge de boas-vindas quando estiver logado */}
      {!!shortName && (
        <Pressable
          onPress={onOpenAccount}
          accessibilityRole="button"
          accessibilityLabel={`Abrir Minha conta de ${displayName}`}
          style={({ pressed }) => [
            styles.welcomeBadge,
            pressed && { opacity: 0.85 },
          ]}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarSm} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={COLORS.texto}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={styles.welcomeTxt}>
            Olá, <Text style={styles.welcomeName}>{shortName}</Text> 👋
          </Text>
        </Pressable>
      )}

      {/* Header (menu no canto) */}
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

  // ⬇️ estilos do badge de usuário
  welcomeBadge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSm: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  welcomeTxt: {
    color: COLORS.texto,
    fontSize: 12,
    fontWeight: '600',
  },
  welcomeName: {
    fontWeight: '800',
  },

  heroSubtitulo: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
  heroAcoes: { flexDirection: 'row', gap: 10, marginTop: 16 },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../theme';
import { registrarEntrada } from '../services/entradas';

export default function OfertasScreen({ navigation }) {
  const [openModal, setOpenModal] = useState(false);
  const [tipo, setTipo] = useState('Oferta'); // "Dizimo" | "Oferta"
  const [valor, setValor] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: 'Ofertas' });
  }, [navigation]);

  const parseValor = (txt) => {
    // aceita "10,50" ou "10.50"
    const clean = String(txt)
      .replace(/[^\d,\.]/g, '')
      .replace(',', '.');
    const n = Number(clean);
    return isNaN(n) ? 0 : n;
  };

  const handleContribuir = async () => {
    const v = parseValor(valor);
    if (!v || v <= 0) {
      return Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
    }
    try {
      const row = await registrarEntrada({ tipo, valor: v });
      setOpenModal(false);
      setValor('');
      Alert.alert(
        'Obrigado!',
        `Sua ${tipo.toLowerCase()} de ${formatBRL(
          v
        )} foi registrada. Deus abençoe!`
      );
    } catch (e) {
      Alert.alert('Falha ao registrar', e?.message || 'Tente novamente.');
    }
  };

  const copy = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copiado', 'Chave copiada para a área de transferência.');
    } catch {}
  };

  return (
    <ScrollView
      style={{ backgroundColor: '#fff' }}
      contentContainerStyle={styles.wrap}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800&auto=format&fit=crop',
          }}
          style={styles.heroImg}
        />
        <Text style={styles.verso}>
          “Honra ao Senhor com os teus bens e com as primícias de toda a tua
          renda.” <Text style={styles.versoRef}>Provérbios 3:9</Text>
        </Text>
      </View>

      {/* CONTAS / PIX */}
      <Text style={styles.sectionTitle}>Como contribuir</Text>

      {/* Itaú */}
      <View style={[styles.cardConta, { borderColor: '#EC7000' }]}>
        <View style={styles.bankHeader}>
          <View style={[styles.bankBadge, { backgroundColor: '#EC7000' }]}>
            <Text style={styles.bankBadgeTxt}>itaú</Text>
          </View>
          <Text style={[styles.bankName, { color: '#EC7000' }]}>Itaú</Text>
        </View>
        <Text style={styles.contaLinha}>
          Agência: <Text style={styles.bold}>1234</Text>
        </Text>
        <Text style={styles.contaLinha}>
          Conta: <Text style={styles.bold}>56789-0</Text>
        </Text>
        <Text style={styles.contaLinha}>
          Titular: <Text style={styles.bold}>Associação GUIA Church</Text>
        </Text>
        <Text style={styles.contaPix}>
          PIX (CNPJ): <Text style={styles.bold}>12.345.678/0001-90</Text>
        </Text>

        <View style={styles.contaActions}>
          <Pressable
            style={[styles.btnGhost, { borderColor: '#EC7000' }]}
            onPress={() => copy('12.345.678/0001-90')}>
            <Text style={[styles.btnGhostTxt, { color: '#EC7000' }]}>
              Copiar Pix
            </Text>
          </Pressable>
        </View>
      </View>

      {/* PicPay */}
      <View style={[styles.cardConta, { borderColor: '#21C25E' }]}>
        <View style={styles.bankHeader}>
          <View style={[styles.bankBadge, { backgroundColor: '#21C25E' }]}>
            <Text style={styles.bankBadgeTxt}>picpay</Text>
          </View>
          <Text style={[styles.bankName, { color: '#21C25E' }]}>PicPay</Text>
        </View>
        <Text style={styles.contaLinha}>
          Usuário: <Text style={styles.bold}>@guiachurch</Text>
        </Text>
        <Text style={styles.contaPix}>
          Chave Pix: <Text style={styles.bold}>ofertas@guiachurch.com</Text>
        </Text>

        <View style={styles.contaActions}>
          <Pressable
            style={[styles.btnGhost, { borderColor: '#21C25E' }]}
            onPress={() => copy('ofertas@guiachurch.com')}>
            <Text style={[styles.btnGhostTxt, { color: '#21C25E' }]}>
              Copiar chave
            </Text>
          </Pressable>
        </View>
      </View>

      {/* CTA */}
      <Pressable style={styles.btnPrimary} onPress={() => setOpenModal(true)}>
        <Text style={styles.btnPrimaryTxt}>Contribuir agora</Text>
      </Pressable>

      {/* MODAL CONTRIBUIR */}
      <Modal
        visible={openModal}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModal(false)}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpenModal(false)}
        />
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Nova contribuição</Text>

          <Text style={styles.modalLabel}>Tipo</Text>
          <View style={styles.tipoRow}>
            <Chip
              selected={tipo === 'Dizimo'}
              onPress={() => setTipo('Dizimo')}
              label="Dízimo"
            />
            <Chip
              selected={tipo === 'Oferta'}
              onPress={() => setTipo('Oferta')}
              label="Oferta"
            />
          </View>

          <Text style={styles.modalLabel}>Valor (R$)</Text>
          <TextInput
            value={valor}
            onChangeText={setValor}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Pressable
              style={styles.btnGhost}
              onPress={() => setOpenModal(false)}>
              <Text style={styles.btnGhostTxt}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.btnPrimary} onPress={handleContribuir}>
              <Text style={styles.btnPrimaryTxt}>Registrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Chip({ selected, onPress, label }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: COLORS.azul, borderColor: COLORS.azul }
          : null,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}>
      <Text style={[styles.chipTxt, selected ? { color: '#fff' } : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function formatBRL(v) {
  try {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(v || 0);
  } catch {
    return `R$ ${Number(v || 0).toFixed(2)}`;
  }
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 24,
  },
  hero: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  heroImg: { width: '100%', height: 160, backgroundColor: '#eee' },
  verso: {
    padding: 16,
    paddingTop: 12,
    color: '#111827',
    lineHeight: 20,
    fontSize: 14,
  },
  versoRef: { fontWeight: '800' },

  sectionTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  cardConta: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  bankBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  bankBadgeTxt: {
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 0.3,
    textTransform: 'lowercase',
  },
  bankName: { fontWeight: '900', fontSize: 14 },
  contaLinha: { color: '#111827', fontSize: 14, marginTop: 2 },
  contaPix: { color: '#111827', fontSize: 14, marginTop: 6 },
  bold: { fontWeight: '800' },
  contaActions: { flexDirection: 'row', gap: 8, marginTop: 12 },

  btnPrimary: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: COLORS.azul,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  btnPrimaryTxt: { color: '#fff', fontWeight: '800' },

  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: '#F3F4F6',
  },
  btnGhostTxt: { color: '#111827', fontWeight: '800' },

  // modal
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modal: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 16,
  },
  modalTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 12,
  },
  modalLabel: {
    color: '#111827',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  tipoRow: { flexDirection: 'row', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipTxt: { color: '#111827', fontWeight: '800' },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    justifyContent: 'flex-end',
  },
});

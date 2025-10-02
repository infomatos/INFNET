import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme';
import { supabase } from '../supabase';
import { atualizarPerfil } from '../services/perfis';

/** base64 -> ArrayBuffer (puro JS, sem libs) */
function base64ToArrayBuffer(base64) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let bufferLength = (base64.length * 3) / 4;
  if (base64.endsWith('==')) bufferLength -= 2;
  else if (base64.endsWith('=')) bufferLength -= 1;
  const bytes = new Uint8Array(bufferLength);
  let p = 0;

  // remove caracteres fora da base64
  base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');

  for (let i = 0; i < base64.length; i += 4) {
    const enc1 = chars.indexOf(base64[i]);
    const enc2 = chars.indexOf(base64[i + 1]);
    const enc3 = chars.indexOf(base64[i + 2]);
    const enc4 = chars.indexOf(base64[i + 3]);

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    bytes[p++] = chr1;

    if (enc3 !== 64 && base64[i + 2] !== '=') {
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      bytes[p++] = chr2;
    }
    if (enc4 !== 64 && base64[i + 3] !== '=') {
      const chr3 = ((enc3 & 3) << 6) | enc4;
      bytes[p++] = chr3;
    }
  }
  return bytes.buffer.slice(0, p);
}

export default function EditarPerfilModal({
  visible,
  onClose,
  perfil, // { id, auth_user_id, nome, telefone, endereco, ... }
  user, // supabase user
  onSaved, // callback(novoPerfil)
}) {
  const inicialNome = perfil?.nome ?? '';
  const inicialTelefone = perfil?.telefone ?? '';
  const inicialEndereco = perfil?.endereco ?? '';
  const inicialAvatar =
    perfil?.avatar_url || user?.user_metadata?.avatar_url || null;

  const [nome, setNome] = useState(inicialNome);
  const [telefone, setTelefone] = useState(inicialTelefone);
  const [endereco, setEndereco] = useState(inicialEndereco);
  const [avatarLocal, setAvatarLocal] = useState(inicialAvatar); // para preview
  const [avatarBase64, setAvatarBase64] = useState(null); // para upload
  const [salvando, setSalvando] = useState(false);

  // reseta ao abrir
  useEffect(() => {
    if (visible) {
      setNome(inicialNome);
      setTelefone(inicialTelefone);
      setEndereco(inicialEndereco);
      setAvatarLocal(inicialAvatar);
      setAvatarBase64(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, perfil?.id]);

  async function pedirPermissaoCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Precisamos da câmera para tirar a foto do avatar.'
      );
      return false;
    }
    return true;
  }
  async function pedirPermissaoMidia() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Precisamos da galeria para escolher uma imagem.'
      );
      return false;
    }
    return true;
  }

  async function abrirCamera() {
    const ok = await pedirPermissaoCamera();
    if (!ok) return;
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    const asset = res?.assets?.[0];
    if (!res.canceled && asset?.uri) {
      setAvatarLocal(asset.uri);
      setAvatarBase64(asset.base64 || null);
    }
  }

  async function abrirGaleria() {
    const ok = await pedirPermissaoMidia();
    if (!ok) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // ⬅️ idem
    });
    const asset = res?.assets?.[0];
    if (!res.canceled && asset?.uri) {
      setAvatarLocal(asset.uri);
      setAvatarBase64(asset.base64 || null);
    }
  }

  // Upload usando apenas base64 do ImagePicker (sem FileSystem / blob)
  async function uploadAvatarSeNecessario() {
    // não mudou a foto
    if (!avatarBase64 && (!avatarLocal || avatarLocal === inicialAvatar)) {
      return inicialAvatar || null;
    }
    // detecta extensão "por melhor esforço"
    const isPng = avatarLocal?.toLowerCase?.().endsWith('.png');
    const contentType = isPng ? 'image/png' : 'image/jpeg';
    const fileExt = isPng ? 'png' : 'jpg';

    const filePath = `${
      user?.id || perfil?.auth_user_id
    }/${Date.now()}.${fileExt}`;

    // Se por algum motivo não temos base64 (ex.: veio só uma URL remota), reaproveita a URL
    if (!avatarBase64 && avatarLocal?.startsWith('http')) return avatarLocal;

    const arrayBuffer = base64ToArrayBuffer(avatarBase64 || '');

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, { contentType, upsert: true });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    return pub?.publicUrl || null;
  }

  async function salvar() {
    if (!perfil?.id) return Alert.alert('Erro', 'Perfil não encontrado.');

    try {
      setSalvando(true);
      const avatar_url = await uploadAvatarSeNecessario();

      // monta delta (sem campos vazios)
      const delta = {
        nome: nome?.trim() || null,
        telefone: telefone?.trim() || null,
        endereco: endereco?.trim() || null,
      };
      if (avatar_url) delta.avatar_url = avatar_url;

      let novo;
      try {
        // tenta atualizar a tabela perfis incluindo avatar_url
        novo = await atualizarPerfil(perfil.id, delta);
      } catch (err) {
        // fallback se a coluna avatar_url não existir ainda
        if (
          avatar_url &&
          (err?.code === '42703' || /avatar_url/i.test(err?.message || ''))
        ) {
          const { avatar_url: _omit, ...deltaSemAvatar } = delta;
          novo = await atualizarPerfil(perfil.id, deltaSemAvatar);
          await supabase.auth.updateUser({ data: { avatar_url } });
        } else {
          throw err;
        }
      }

      // espelha (opcional) no user_metadata quando houver avatar
      try {
        if (avatar_url)
          await supabase.auth.updateUser({ data: { avatar_url } });
      } catch {}

      onSaved?.(novo);
      onClose?.();
      Alert.alert('Pronto!', 'Perfil atualizado.');
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  const avatarPreview = useMemo(() => avatarLocal, [avatarLocal]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={st.backdrop}>
            <View style={st.card}>
              <Text style={st.title}>Editar perfil</Text>

              <View style={st.avatarRow}>
                <View style={st.avatarCircle}>
                  {avatarPreview ? (
                    <Image
                      source={{ uri: avatarPreview }}
                      style={st.avatarImg}
                    />
                  ) : (
                    <Text style={{ color: '#9CA3AF', fontWeight: '700' }}>
                      Sem foto
                    </Text>
                  )}
                </View>
                <View style={{ gap: 8, flex: 1 }}>
                  <Pressable style={st.btnGhost} onPress={abrirCamera}>
                    <Text style={st.btnGhostTxt}>Tirar foto</Text>
                  </Pressable>
                  <Pressable style={st.btnGhost} onPress={abrirGaleria}>
                    <Text style={st.btnGhostTxt}>Escolher da galeria</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{ gap: 10, marginTop: 12 }}>
                <TextInput
                  style={st.input}
                  placeholder="Nome"
                  placeholderTextColor="#9CA3AF"
                  value={nome}
                  onChangeText={setNome}
                />
                <TextInput
                  style={st.input}
                  placeholder="Telefone"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={telefone}
                  onChangeText={setTelefone}
                />
                <TextInput
                  style={[st.input, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Endereço"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={endereco}
                  onChangeText={setEndereco}
                />
              </View>

              <View style={{ gap: 8, marginTop: 16 }}>
                <Pressable
                  style={[st.btnPrimary, salvando && { opacity: 0.6 }]}
                  onPress={salvar}
                  disabled={salvando}>
                  <Text style={st.btnPrimaryTxt}>
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </Text>
                </Pressable>
                <Pressable style={st.link} onPress={onClose}>
                  <Text style={st.linkTxt}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  avatarImg: { width: '100%', height: '100%' },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
  },

  btnPrimary: {
    backgroundColor: COLORS.azul,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  btnPrimaryTxt: { color: '#fff', fontWeight: '800' },

  btnGhost: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnGhostTxt: { color: '#111827', fontWeight: '800' },

  link: { alignItems: 'center', paddingVertical: 6 },
  linkTxt: { color: '#6B7280', fontWeight: '700' },
});

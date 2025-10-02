import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Obtém a localização atual (latitude/longitude) e dispara
 * uma notificação local confirmando a captura.
 * Retorna: { lat, lng, timestamp }
 */
export async function obterLocalizacaoAtual() {
  // 1) Permissão de localização
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de localização negada.');
  }

  // 2) Ler posição
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  // 3) Notificação local (se permitido; no iOS/Android do Snack funciona)
  try {
    // em alguns devices a permissão de notificação já foi pedida no App.js
    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Localização capturada 📍',
          body: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
        },
        trigger: null,
      });
    }
  } catch (_) {
    // silencioso: se falhar, seguimos sem notificar
  }

  return { lat, lng, timestamp: pos.timestamp };
}

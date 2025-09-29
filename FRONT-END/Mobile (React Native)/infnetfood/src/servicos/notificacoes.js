import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

// Mostrar alerta mesmo com app em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function configurar() {
  // Permissões
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Permissão negada", "Ative as notificações para testar.");
    return false;
  }

  // Canal (Android)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Padrão",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return true;
}

export async function notificarAgora(titulo, corpo) {
  // trigger: null => dispara imediato
  return Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo },
    trigger: null,
  });
}

export async function notificarEm(titulo, corpo, segundos) {
  return Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo },
    trigger: { seconds: Math.max(1, segundos) },
  });
}

export async function sequenciaStatusPedido(pedidoId) {
  const ok = await configurar();
  if (!ok) return;

  // Agenda uma sequência curta para facilitar o teste
  await notificarAgora("Pedido recebido", `#${pedidoId} recebido.`);
  await notificarEm("Em preparo", `#${pedidoId} em preparo.`, 5);
  await notificarEm("Saiu para entrega", `#${pedidoId} saiu para entrega.`, 10);
  await notificarEm("Entregue", `#${pedidoId} foi entregue.`, 20);
}

export async function cancelarTodas() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// (Opcional) listeners para log/diagnóstico
export function instalarLogs() {
  const sub1 = Notifications.addNotificationReceivedListener((n) =>
    console.log("📥 Recebida (foreground):", n?.request?.content?.title)
  );
  const sub2 = Notifications.addNotificationResponseReceivedListener((r) =>
    console.log("👉 Ação/Toque na notificação:", r?.notification?.request?.content?.title)
  );
  return () => { sub1.remove(); sub2.remove(); };
}

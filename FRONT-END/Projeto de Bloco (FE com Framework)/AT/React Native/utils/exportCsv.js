import { Platform } from "react-native";
import * as Sharing from "expo-sharing";


function toCsv(rows) {
  if (!rows || !rows.length) throw new Error("Sem dados para exportar.");
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  return (
    headers.join(",") +
    "\n" +
    rows.map((r) => headers.map((h) => escape(r[h])).join(",")).join("\n")
  );
}

export async function exportCsv(filename, rows) {
  const csv = toCsv(rows);
  const safeName = filename.replace(/[^a-z0-9_\-.]/gi, "_");

  // Web: baixa via Blob
  if (Platform.OS === "web") {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return safeName;
  }

  // iOS/Android: salva e compartilha
  const uri = FileSystem.cacheDirectory + safeName;
  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, { mimeType: "text/csv", dialogTitle: safeName });
  }
  return uri;
}

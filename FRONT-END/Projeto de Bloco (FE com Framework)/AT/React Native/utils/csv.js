// utils/csv.js
import { Platform } from "react-native";

function toCSV(rows) {
  if (!rows?.length) {
    return "id,titulo,descricao,professor,carga_horaria,status,progresso,arquivado,created_at\n";
  }
  const head = ["id","titulo","descricao","professor","carga_horaria","status","progresso","is_arquivado","created_at"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [head.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.titulo, r.descricao, r.professor, r.carga_horaria, r.status, r.progresso, r.is_arquivado, r.created_at]
      .map(esc).join(","));
  }
  return lines.join("\n");
}

export async function exportarCursosCSV(cursos) {
  const csv = toCSV(cursos);

  if (Platform.OS === "web") {
    // Download direto no navegador
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cursos.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  // iOS/Android: importa módulos nativos só aqui
  const FileSystem = await import("expo-file-system");
  const Sharing = await import("expo-sharing");
  const MailComposer = await import("expo-mail-composer");

  const uri = FileSystem.cacheDirectory + "cursos.csv";
  await FileSystem.writeAsStringAsync(uri, csv, { encoding: FileSystem.EncodingType.UTF8 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: "text/csv", dialogTitle: "Exportar cursos" });
  } else {
    await MailComposer.composeAsync({
      subject: "Cursos - Exportação",
      body: "Segue em anexo o CSV dos cursos.",
      attachments: [uri],
    });
  }
}

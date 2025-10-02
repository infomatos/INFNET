// services/matriculas.js
import { supabase } from "../supabase";

export async function minhasMatriculas() {
  const { data, error } = await supabase
    .from("matriculas")
    .select("id, curso_id, progresso, status");
  if (error) throw error;
  return data ?? [];
}

export async function inscreverNoCurso(curso_id) {
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error("Não autenticado.");
  const { error } = await supabase
    .from("matriculas")
    .insert({ auth_user_id: u.user.id, curso_id });
  if (error && !String(error.message).toLowerCase().includes("duplicate"))
    throw error;
}

export async function atualizarProgresso(curso_id, progresso) {
  const clamp = Math.max(0, Math.min(100, Number(progresso) || 0));
  const status = clamp >= 100 ? "Concluido" : "Em andamento";
  const { data: u } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("matriculas")
    .update({ progresso: clamp, status })
    .eq("curso_id", curso_id)
    .eq("auth_user_id", u.user.id);
  if (error) throw error;
  return { progresso: clamp, status };
}

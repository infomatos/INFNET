// services/cursos.js
import { supabase } from "../supabase";

export async function listarCursos() {
  const { data, error } = await supabase
    .from("cursos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function salvarCurso(payload) {
  if (payload.id) {
    const { data, error } = await supabase
      .from("cursos").update(payload).eq("id", payload.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("cursos").insert(payload).select().single();
    if (error) throw error;
    return data;
  }
}

export async function excluirCurso(id) {
  const { error } = await supabase.from("cursos").delete().eq("id", id);
  if (error) throw error;
}

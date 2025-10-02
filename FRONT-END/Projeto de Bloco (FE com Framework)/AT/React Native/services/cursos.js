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
  const { id, ...rest } = payload || {};

  // só os campos que existem na tabela (sem id)
  const dados = {
    titulo: rest.titulo ?? null,
    descricao: rest.descricao ?? null,
    professor: rest.professor ?? null,
    carga_horaria: rest.carga_horaria ?? null,
    status: rest.status ?? "Ativo",
  };

  if (id) {
    // UPDATE: não tente atualizar a coluna id
    const { data, error } = await supabase
      .from("cursos")
      .update(dados)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // INSERT: não envie a chave id (deixe o default do banco agir)
    const { data, error } = await supabase
      .from("cursos")
      .insert(dados)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function excluirCurso(id) {
  const { error } = await supabase.from("cursos").delete().eq("id", id);
  if (error) throw error;
}

// services/perfis.js
import { supabase } from "../supabase";

/** Retorna perfil do usuário logado */
export async function getMeuPerfil() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("perfis")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();
  if (error) return null;
  return data;
}

/** Cria (ou garante) o perfil do usuário logado como Visitante com os campos do formulário */
export async function criarPerfilVisitante({ nome, email, telefone, idade, endereco }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sem usuário autenticado.");
  // RLS permite INSERT apenas se perfil = 'Visitante'
  const { error } = await supabase.from("perfis").insert([{
    auth_user_id: user.id,
    nome,
    email,
    telefone,
    idade: idade ? Number(idade) : null,
    endereco,
    perfil: "Visitante",
    avatar_url: null,
  }]);
  if (error && error.code !== "23505") { // 23505 = unique_violation (perfil já existe)
    throw error;
  }
}

/** Checagem rápida de admin (usa função SQL is_admin()) */
export async function isAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return !!data;
}

/** Lista perfis (apenas Admin enxerga todos por causa das POLICIES) */
export async function listarPerfis() {
  const { data, error } = await supabase
    .from("perfis")
    .select("id, auth_user_id, nome, email, telefone, idade, endereco, perfil")
    .order("nome", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Cria perfil */
export async function criarPerfil(payload) {
  const { data, error } = await supabase
    .from("perfis")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Atualiza perfil por id */
export async function atualizarPerfil(id, delta) {
  const { data, error } = await supabase
    .from("perfis")
    .update(delta)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Exclui perfil por id */
export async function excluirPerfil(id) {
  const { error } = await supabase.from("perfis").delete().eq("id", id);
  if (error) throw error;
}

/** Altera o papel (Visitante | Membro | Admin) */
export async function alterarPapel(id, papel) {
  const { data, error } = await supabase
    .from("perfis")
    .update({ perfil: papel })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Conveniência legada */
export async function promoverParaMembro(id) {
  return alterarPapel(id, "Membro");
}

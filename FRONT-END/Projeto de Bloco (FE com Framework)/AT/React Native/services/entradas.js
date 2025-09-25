import { supabase } from "../supabase";

/** tipo: "Dizimo" | "Oferta" ; valor: number (em Reais) */
export async function registrarEntrada({ tipo, valor, data = new Date() }) {
  const payload = { tipo, valor, data: data.toISOString() };
  const { data: row, error } = await supabase
    .from("entradas")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return row;
}

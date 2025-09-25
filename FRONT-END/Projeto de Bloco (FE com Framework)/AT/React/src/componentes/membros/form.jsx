import { useEffect, useState } from "react";

const INITIAL = { nome: "", ministerio: "", status: "Ativo", email: "" };

export default function Form({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    if (initialData) {
      setForm({
        nome: initialData.nome || "",
        ministerio: initialData.ministerio || "",
        status: initialData.status || "Ativo",
        email: initialData.email || "",
      });
    } else {
      setForm(INITIAL);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return alert("Nome é obrigatório.");
    if (!form.email.trim()) return alert("Email é obrigatório.");
    onSubmit(form);
    if (!initialData) setForm(INITIAL);
  };

  return (
    <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 520 }}>
      <div className="field">
        <label>Nome</label>
        <input
          className="input"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div className="field">
        <label>Ministério</label>
        <input
          className="input"
          name="ministerio"
          value={form.ministerio}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label>Status</label>
        <select
          className="select"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>
      <div className="field">
        <label>Email</label>
        <input
          className="input"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {onCancel && (
          <button
            type="button"
            className="button button-outline"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="button">
          {initialData ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}

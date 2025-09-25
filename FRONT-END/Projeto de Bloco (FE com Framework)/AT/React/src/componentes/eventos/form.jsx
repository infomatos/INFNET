import { useEffect, useState } from "react";

export default function EventoForm({ initialData, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    titulo: "",
    descricao: "",
    local: "",
    data: "",
    horario: "",
  });

  useEffect(() => {
    if (initialData) {
      setValues({
        titulo: initialData.titulo || "",
        descricao: initialData.descricao || "",
        local: initialData.local || "",
        data: initialData.data || "",
        horario: initialData.horario || initialData.hora || "",
      });
    } else {
      setValues({
        titulo: "",
        descricao: "",
        local: "",
        data: "",
        horario: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12, maxWidth: 520 }}
    >
      <input
        name="titulo"
        placeholder="Título"
        value={values.titulo}
        onChange={handleChange}
        required
      />
      <input
        name="descricao"
        placeholder="Descrição"
        value={values.descricao}
        onChange={handleChange}
      />
      <input
        name="local"
        placeholder="Local"
        value={values.local}
        onChange={handleChange}
      />
      <input
        type="date"
        name="data"
        placeholder="Data"
        value={values.data}
        onChange={handleChange}
      />
      <input
        type="time"
        name="horario"
        placeholder="Horário"
        value={values.horario}
        onChange={handleChange}
      />
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

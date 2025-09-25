import { useEffect, useState } from "react";
import { Field, TextInput, TextArea, NumberInput, Select } from "../ui/FormUI";

const INITIAL = {
  titulo: "",
  descricao: "",
  professor: "",
  status: "Novo",
  progresso: 0,
  cargaHoraria: 0,
};
const STATUS_OPTIONS = ["Novo", "Em andamento", "Concluído"];

export default function CursoForm({ initialData, onSubmit, onCancel }) {
  const [v, setV] = useState(INITIAL);
  const [err, setErr] = useState({});

  useEffect(() => {
    if (initialData) {
      setV({
        titulo: initialData.titulo ?? initialData.nome ?? "",
        descricao: initialData.descricao ?? "",
        professor: initialData.professor ?? "",
        status: initialData.status ?? "Novo",
        progresso: Number(initialData.progresso ?? 0),
        cargaHoraria: Number(initialData.cargaHoraria ?? 0),
      });
    } else setV(INITIAL);
  }, [initialData]);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setV((s) => ({
      ...s,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const validate = () => {
    const e = {};
    if (!v.titulo?.trim()) e.titulo = "Informe um título.";
    if (v.progresso < 0 || v.progresso > 100) e.progresso = "De 0 a 100%";
    if (v.cargaHoraria < 0) e.cargaHoraria = "Não pode ser negativa.";
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErr(eMap);
    if (Object.keys(eMap).length) return;
    onSubmit({
      ...v,
      progresso: Number(v.progresso) || 0,
      cargaHoraria: Number(v.cargaHoraria) || 0,
    });
    if (!initialData) setV(INITIAL);
  };

  return (
    <form className="form" onSubmit={submit}>
      <Field label="Título" error={err.titulo}>
        {({ fieldId, errId }) => (
          <TextInput
            id={fieldId}
            name="titulo"
            value={v.titulo}
            onChange={onChange}
            placeholder="Ex.: Introdução a ..."
            aria-invalid={!!err.titulo}
            aria-describedby={errId}
            required
          />
        )}
      </Field>

      <Field label="Descrição">
        {({ fieldId }) => (
          <TextArea
            id={fieldId}
            name="descricao"
            value={v.descricao}
            onChange={onChange}
            placeholder="Breve resumo do curso"
          />
        )}
      </Field>

      <div className="form-grid">
        <Field label="Professor">
          {({ fieldId }) => (
            <TextInput
              id={fieldId}
              name="professor"
              value={v.professor}
              placeholder="Nome do docente"
              onChange={onChange}
            />
          )}
        </Field>

        <Field label="Carga (h)" error={err.cargaHoraria}>
          {({ fieldId, errId }) => (
            <NumberInput
              id={fieldId}
              name="cargaHoraria"
              min="0"
              step="1"
              value={v.cargaHoraria}
              onChange={onChange}
              aria-invalid={!!err.cargaHoraria}
              aria-describedby={errId}
            />
          )}
        </Field>
      </div>

      <div className="form-grid">
        <Field label="Status">
          {({ fieldId }) => (
            <Select
              id={fieldId}
              name="status"
              value={v.status}
              onChange={onChange}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Progresso (%)" error={err.progresso}>
          {({ fieldId, errId }) => (
            <NumberInput
              id={fieldId}
              name="progresso"
              min="0"
              max="100"
              step="1"
              value={v.progresso}
              onChange={onChange}
              aria-invalid={!!err.progresso}
              aria-describedby={errId}
            />
          )}
        </Field>
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

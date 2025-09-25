import { useEffect, useMemo, useState } from "react";
import {
  Field,
  TextInput,
  NumberInput,
  Select,
  PasswordInput,
} from "../ui/FormUI";

const INITIAL = {
  nome: "",
  idade: "",
  perfil: "Visitante",
  email: "",
  senha: "",
};

export default function Form({
  initialData,
  onSubmit,
  onCancel,
  lockPerfil = false,
  allowedPerfis = ["Visitante", "Membro"],
}) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        nome: initialData.nome ?? "",
        idade: initialData.idade ?? "",
        perfil: initialData.perfil ?? "Visitante",
        email: initialData.email ?? "",
        senha: initialData.senha ?? "",
      });
    } else {
      setForm(INITIAL);
    }
  }, [initialData]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.nome?.trim()) e.nome = "Informe seu nome completo.";
    if (form.idade && (Number(form.idade) < 0 || Number(form.idade) > 120))
      e.idade = "Idade inválida.";
    if (!form.email?.trim()) e.email = "Informe um e-mail válido.";
    if (!form.senha?.trim() || form.senha.length < 6)
      e.senha = "A senha deve ter ao menos 6 caracteres.";
    if (!form.perfil) e.perfil = "Selecione um perfil.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) {
      // foca no primeiro erro
      const firstKey = Object.keys(eMap)[0];
      const el = e.target.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }
    onSubmit({ ...form });
    if (!initialData) setForm(INITIAL);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <Field label="Nome" error={errors.nome}>
          {({ fieldId, errId }) => (
            <TextInput
              id={fieldId}
              name="nome"
              placeholder="Ex.: Maria Silva"
              value={form.nome}
              onChange={onChange}
              aria-invalid={!!errors.nome}
              aria-describedby={errId}
              autoComplete="name"
              required
            />
          )}
        </Field>

        <Field label="Idade" error={errors.idade} help="Opcional">
          {({ fieldId, errId }) => (
            <NumberInput
              id={fieldId}
              name="idade"
              min="0"
              max="120"
              step="1"
              placeholder="Ex.: 32"
              value={form.idade}
              onChange={onChange}
              aria-invalid={!!errors.idade}
              aria-describedby={errId}
            />
          )}
        </Field>
      </div>

      <div className="form-grid">
        <Field
          label="Perfil"
          error={errors.perfil}
          help={lockPerfil ? "Definido pela administração" : undefined}
        >
          {({ fieldId, errId }) => (
            <Select
              id={fieldId}
              name="perfil"
              value={form.perfil}
              onChange={onChange}
              disabled={lockPerfil}
              aria-invalid={!!errors.perfil}
              aria-describedby={errId}
            >
              {allowedPerfis.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="E-mail" error={errors.email}>
          {({ fieldId, errId }) => (
            <TextInput
              id={fieldId}
              type="email"
              name="email"
              placeholder="seuemail@dominio.com"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errId}
              required
            />
          )}
        </Field>
      </div>

      <Field label="Senha" error={errors.senha} help="Mínimo de 6 caracteres">
        {({ fieldId, errId }) => (
          <PasswordInput
            id={fieldId}
            name="senha"
            placeholder="••••••••"
            value={form.senha}
            onChange={onChange}
            autoComplete="new-password"
            aria-invalid={!!errors.senha}
            aria-describedby={errId}
            required
          />
        )}
      </Field>

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

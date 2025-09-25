import { useState, useEffect } from "react";

export default function CursosTable({
  data = [],
  canEdit = false,
  canDelete = false,
  canStart = false,
  onEdit,
  onDelete,
  onStart, // (fora de uso)
}) {
  const [detalhe, setDetalhe] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setDetalhe(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!data?.length) return <p>Nenhum curso cadastrado.</p>;

  const Progress = ({ pct = 0 }) => {
    const v = Math.max(0, Math.min(100, Number(pct) || 0));
    return (
      <div style={{ minWidth: 120 }}>
        <div
          style={{
            height: 8,
            background: "rgba(0,0,0,.08)",
            borderRadius: 999,
            overflow: "hidden",
          }}
          aria-label={`Progresso ${v}%`}
          title={`${v}%`}
        >
          <div
            style={{
              width: `${v}%`,
              height: "100%",
              background: "var(--primary)",
            }}
          />
        </div>
        <small style={{ opacity: 0.7 }}>{v}%</small>
      </div>
    );
  };

  // css inline para os estados do botão
  const dangerBtn = { background: "#ef4444", borderColor: "#ef4444" }; // vermelho
  const successBtn = { background: "#16a34a", borderColor: "#16a34a" }; // verde

  return (
    <>
      <div className="table-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Professor</th>
              <th>Carga (h)</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((curso) => {
              const titulo = curso.titulo || curso.nome || `Curso ${curso.id}`;
              const professor = curso.professor || curso.docente || "-";
              const carga = curso.cargaHoraria ?? curso.carga ?? "-";
              const status = curso.status || "Novo";
              const progresso =
                typeof curso.progresso === "number"
                  ? curso.progresso
                  : Number(curso.progresso) || 0;

              // --- lógica do botão principal por progresso ---
              let startLabel = "Iniciar";
              let startStyle = {};
              let startOnClick = () => {
                alert("Inscrito");
                // onStart?.(curso, "iniciar"); // descomente quando tiver ação real
              };

              if (progresso > 0 && progresso < 100) {
                startLabel = "Desistir";
                startStyle = dangerBtn;
                startOnClick = () => {
                  alert("Você desistiu do curso");
                  // onStart?.(curso, "desistir");
                };
              } else if (progresso === 100) {
                startLabel = "Concluir";
                startStyle = successBtn;
                startOnClick = () => {
                  alert("Curso concluído!");
                  // onStart?.(curso, "concluir");
                };
              }

              return (
                <tr key={curso.id}>
                  <td>{titulo}</td>
                  <td>{professor}</td>
                  <td>{carga}</td>
                  <td>{status}</td>
                  <td>
                    <Progress pct={progresso} />
                  </td>
                  <td>
                    {/* Detalhar disponível para todos os perfis */}
                    <button
                      className="button button-outline"
                      onClick={() => setDetalhe(curso)}
                    >
                      Detalhar
                    </button>

                    {canStart && (
                      <button
                        className="button"
                        style={{ marginLeft: 8, ...startStyle }}
                        onClick={startOnClick}
                      >
                        {startLabel}
                      </button>
                    )}

                    {canEdit && (
                      <button
                        className="button button-outline"
                        onClick={() => onEdit?.(curso)}
                        style={{ marginLeft: 8 }}
                      >
                        Editar
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="button button-outline"
                        onClick={() => onDelete?.(curso.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de detalhe */}
      {detalhe && (
        <div className="login-form-backdrop" onClick={() => setDetalhe(null)}>
          <div
            className="login-form"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520 }}
          >
            <h2 style={{ marginBottom: 8 }}>
              {detalhe.titulo || detalhe.nome || `Curso ${detalhe.id}`}
            </h2>

            <p style={{ marginTop: 0, color: "#6b7280" }}>
              {detalhe.descricao || detalhe.resumo || "Sem descrição."}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 12,
              }}
            >
              <div>
                <small style={{ opacity: 0.7 }}>Professor</small>
                <div>{detalhe.professor || "-"}</div>
              </div>
              <div>
                <small style={{ opacity: 0.7 }}>Carga (h)</small>
                <div>{detalhe.cargaHoraria ?? detalhe.carga ?? "-"}</div>
              </div>
              <div>
                <small style={{ opacity: 0.7 }}>Status</small>
                <div>{detalhe.status || "Novo"}</div>
              </div>
              <div>
                <small style={{ opacity: 0.7 }}>Progresso</small>
                <div>{Number(detalhe.progresso) || 0}%</div>
              </div>
            </div>

            <div className="buttons" style={{ marginTop: 16 }}>
              <button
                className="button button-outline"
                onClick={() => setDetalhe(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

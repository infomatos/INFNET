export default function MembersTable({
  data = [],
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}) {
  if (!data?.length) return <p>Nenhum membro encontrado.</p>;

  const mostrarAcoes = canEdit || canDelete;
  const th = {
    textAlign: "left",
    padding: 8,
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap",
  };
  const td = {
    padding: 8,
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className="table-wrap"
      style={{ border: "1px solid #eee", borderRadius: 8 }}
    >
      <table
        className="tabela"
        style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}
      >
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th style={th}>Nome</th>
            <th style={th}>Ministério</th>
            <th style={th}>Status</th>
            <th style={th}>Email</th>
            {mostrarAcoes && <th style={th}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m.id}>
              <td style={td}>{m.nome}</td>
              <td style={{ ...td, whiteSpace: "normal" }}>{m.ministerio}</td>
              <td style={td}>{m.status}</td>
              <td style={{ ...td, whiteSpace: "normal" }}>{m.email}</td>
              {mostrarAcoes && (
                <td style={td}>
                  {canEdit && (
                    <button
                      className="button button-outline"
                      onClick={() => onEdit?.(m)}
                    >
                      Editar
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="button button-outline"
                      style={{ marginLeft: 8 }}
                      onClick={() => onDelete?.(m.id)}
                    >
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

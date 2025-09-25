export default function UsersTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <p>Nenhum usuário encontrado.</p>;

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
            <th style={th}>Idade</th>
            <th style={th}>Perfil</th>
            <th style={th}>Email</th>
            <th style={th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m.id}>
              <td style={td}>{m.nome}</td>
              <td style={td}>{m.idade}</td>
              <td style={td}>{m.perfil}</td>
              <td style={td}>{m.email}</td>
              <td style={td}>
                <button
                  className="button button-outline"
                  onClick={() => onEdit(m)}
                >
                  Editar
                </button>
                <button
                  className="button button-outline"
                  style={{ marginLeft: 8 }}
                  onClick={() => onDelete(m.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

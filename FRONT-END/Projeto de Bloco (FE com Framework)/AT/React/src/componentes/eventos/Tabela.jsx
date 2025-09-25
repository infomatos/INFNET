export default function EventosTable({
  data = [],
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>Nenhum evento cadastrado.</p>;
  }

  const mostrarAcoes = canEdit || canDelete;

  return (
    <div style={{ overflowX: "auto" }}>
      <table width="100%" cellPadding={8} className="tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Local</th>
            <th>Data</th>
            <th>Hora</th>
            {mostrarAcoes && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e.id}>
              <td>{e.titulo}</td>
              <td style={{ whiteSpace: "normal" }}>{e.descricao}</td>
              <td style={{ whiteSpace: "normal" }}>{e.local}</td>
              <td>{e.data}</td>
              <td>{e.horario || e.hora}</td>
              {mostrarAcoes && (
                <td>
                  {canEdit && (
                    <button
                      className="button button-outline"
                      onClick={() => onEdit?.(e)}
                    >
                      Editar
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="button button-outline"
                      style={{ marginLeft: 8 }}
                      onClick={() => onDelete?.(e.id)}
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

import { useState, useEffect } from "react";
import { membrosApi } from "../services/api";

export default function TestApi() {
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    membrosApi
      .list()
      .then((res) => setMembros(res.data))
      .catch((err) => console.error("Erro ao buscar membros:", err));
  }, []);

  return (
    <div>
      <h1> Lista de membros da GUIA </h1>
      Quantidade: {membros.length}
      <p>Relação:</p>
      <ol>
        {membros.map((membro) => (
          <li key={membro.id}>
            {membro.nome} - {membro.status}
          </li>
        ))}
      </ol>
    </div>
  );
}

import { useEffect, useState } from "react";
import { cursosApi } from "../services/api";
import CursosTable from "../componentes/cursos/Tabela";
import CursoForm from "../componentes/cursos/form";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import { useAuth } from "../Hooks/useAuth";

export default function Cursos() {
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [editando, setEditando] = useState(null);

  // ---- modal ----
  const [modalOpen, setModalOpen] = useState(false);
  const openCreateModal = () => {
    setEditando(null);
    setModalOpen(true);
  };
  const openEditModal = (curso) => {
    setEditando(curso);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditando(null);
  };

  // fecha com ESC
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // Exige login para entrar na área de Cursos
  if (!usuario) {
    return (
      <div>
        <Header />
        <section className="section-light" style={{ padding: 24 }}>
          <h2>Área restrita</h2>
          <p>Faça login para acessar os cursos.</p>
        </section>
        <Footer />
      </div>
    );
  }

  // Regras por perfil
  const perfil = (usuario?.perfil || "").toLowerCase();
  const isAdmin = perfil === "admin";
  const isMembro = perfil === "membro";
  //const isVisitante = perfil === "visitante";

  const podeCRUD = isAdmin;
  const podeIniciar = isMembro; // botão "Iniciar"

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await cursosApi.list();
      setItens(res.data);
    } catch (e) {
      console.error("Erro ao carregar cursos", e);
      alert("Falha ao carregar cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleCreate = async (dados) => {
    try {
      const res = await cursosApi.create(dados);
      setItens((prev) => [res.data, ...prev]);
      closeModal();
    } catch {
      alert("Erro ao criar curso.");
    }
  };

  const handleUpdate = async (id, dados) => {
    try {
      const res = await cursosApi.update(id, dados);
      setItens((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      closeModal();
    } catch {
      alert("Erro ao salvar curso.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este curso?")) return;
    try {
      await cursosApi.remove(id);
      setItens((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Erro ao excluir curso.");
    }
  };

  const handleStart = (curso) => {
    alert(`Iniciando curso: ${curso.titulo || curso.nome || curso.id}`);
  };

  return (
    <div>
      <Header />
      <section className="section-light" style={{ padding: 24 }}>
        {/* Título + botão de cadastro (apenas Admin) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Cursos</h2>
          {podeCRUD && (
            <button className="button" onClick={openCreateModal}>
              Novo curso
            </button>
          )}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <CursosTable
            data={itens}
            canEdit={podeCRUD}
            canDelete={podeCRUD}
            canStart={podeIniciar}
            onEdit={podeCRUD ? openEditModal : undefined}
            onDelete={podeCRUD ? handleDelete : undefined}
            onStart={podeIniciar ? handleStart : undefined}
          />
        )}

        {/* Para visitante não há botões, apenas listagem – já coberto pelas flags acima */}
      </section>
      <Footer />
      {/* ===== Modal Criar/Editar (somente Admin) ===== */}
      {podeCRUD && modalOpen && (
        <div className="login-form-backdrop" onClick={closeModal}>
          <div
            className="login-form"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(520px, 92vw)" }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>
              {editando ? "Editar curso" : "Novo curso"}
            </h2>

            <CursoForm
              initialData={editando}
              onSubmit={(dados) =>
                editando
                  ? handleUpdate(editando.id, dados)
                  : handleCreate(dados)
              }
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

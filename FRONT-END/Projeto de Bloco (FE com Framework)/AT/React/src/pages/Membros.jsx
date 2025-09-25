import { useEffect, useMemo, useState } from "react";
import { usersApi } from "../services/api"; //
import UsersTable from "../componentes/usuarios/Tabela";
import UserForm from "../componentes/usuarios/form";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import { useAuth } from "../Hooks/useAuth";

export default function Membros() {
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // modal + edição
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openCreateModal = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEditModal = (u) => {
    setEditing(u);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // fecha modal com ESC
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // regras por perfil
  const perfil = (usuario?.perfil || "").toLowerCase();
  const isAdmin = perfil === "admin";
  const podeCRUD = isAdmin; // só admin cria/edita/exclui

  // carrega todos usuários e filtra membros para exibir
  const carregar = async () => {
    setLoading(true);
    try {
      const res = await usersApi.list();
      setUsers(res.data || []);
    } catch {
      alert("Falha ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    carregar();
  }, []);

  // filtra só membros
  const membros = useMemo(
    () =>
      (users || []).filter(
        (u) => String(u.perfil || "").toLowerCase() === "membro"
      ),
    [users]
  );
  const totalMembros = membros.length;

  // CRUD
  const handleCreate = async (data) => {
    try {
      const payload = { perfil: data.perfil || "Membro", ...data }; // default Membro
      const res = await usersApi.create(payload);
      setUsers((prev) => [res.data, ...prev]);
      closeModal();
    } catch {
      alert("Erro ao criar membro.");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const res = await usersApi.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      closeModal();
    } catch {
      alert("Erro ao salvar membro.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirma excluir este membro?")) return;
    try {
      await usersApi.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Erro ao excluir membro.");
    }
  };

  return (
    <div>
      <Header />
      <section className="section-light" style={{ padding: 24 }}>
        {/* título + botão + contador */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ margin: 0 }}>Membros</h2>

            {/* Contador estilizado */}
            <div
              aria-label={`Total de membros: ${totalMembros}`}
              title={`Total de membros: ${totalMembros}`}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: ".95rem",
                color: "var(--primary)",
                background: "var(--primary-10, rgba(30,102,255,.1))",
                border: "1px solid rgba(0,0,0,.06)",
              }}
            >
              {totalMembros} membros
            </div>
          </div>

          {podeCRUD && (
            <button className="button" onClick={openCreateModal}>
              Novo membro
            </button>
          )}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <UsersTable
            data={membros}
            canEdit={podeCRUD}
            canDelete={podeCRUD}
            onEdit={podeCRUD ? openEditModal : undefined}
            onDelete={podeCRUD ? handleDelete : undefined}
          />
        )}
      </section>
      <Footer />

      {/* Modal Criar/Editar (Admin) */}
      {podeCRUD && modalOpen && (
        <div className="login-form-backdrop" onClick={closeModal}>
          <div
            className="login-form"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(520px, 92vw)" }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>
              {editing ? "Editar membro" : "Novo membro"}
            </h2>

            <UserForm
              initialData={editing}
              onSubmit={(data) =>
                editing ? handleUpdate(editing.id, data) : handleCreate(data)
              }
              onCancel={closeModal}
              allowedPerfis={["Visitante", "Membro", "Admin"]} // mesmo do Users
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { eventosApi } from "../services/api";
import EventosTable from "../componentes/eventos/Tabela";
import EventoForm from "../componentes/eventos/form";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import { useAuth } from "../Hooks/useAuth";

export default function Eventos() {
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // edição/modal
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openCreateModal = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEditModal = (ev) => {
    setEditing(ev);
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

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await eventosApi.list();
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Falha ao carregar eventos.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    carregar();
  }, []);

  // regras por perfil
  const perfil = (usuario?.perfil || "").toLowerCase();
  const isAdmin = perfil === "admin";
  const podeCRUD = isAdmin;

  const handleSubmit = async (data) => {
    try {
      if (editing?.id) {
        const res = await eventosApi.update(editing.id, data);
        setItems((prev) =>
          prev.map((e) => (e.id === editing.id ? res.data : e))
        );
      } else {
        const res = await eventosApi.create(data);
        setItems((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Falha ao salvar evento.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirma excluir este evento?")) return;
    try {
      await eventosApi.remove(id);
      setItems((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error(e);
      alert("Falha ao excluir evento.");
    }
  };

  return (
    <div>
      <Header />
      <section className="section-light" style={{ padding: 24 }}>
        {/* Título + botão à direita */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Eventos</h2>
          {podeCRUD && (
            <button className="button" onClick={openCreateModal}>
              Novo evento
            </button>
          )}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <EventosTable
            data={items}
            canEdit={podeCRUD}
            canDelete={podeCRUD}
            onEdit={podeCRUD ? openEditModal : undefined}
            onDelete={podeCRUD ? handleDelete : undefined}
          />
        )}
      </section>
      <Footer />

      {/* Modal Criar/Editar (somente Admin) */}
      {podeCRUD && modalOpen && (
        <div className="login-form-backdrop" onClick={closeModal}>
          <div
            className="login-form"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(520px, 92vw)" }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>
              {editing ? "Editar evento" : "Novo evento"}
            </h2>

            <EventoForm
              initialData={editing}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

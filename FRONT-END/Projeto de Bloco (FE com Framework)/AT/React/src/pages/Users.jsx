import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi, solicitacoesApi } from "../services/api";
import UsersTable from "../componentes/usuarios/Tabela";
import UserForm from "../componentes/usuarios/form";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import { useAuth } from "../Hooks/useAuth";

export default function Users() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const isLogado = !!usuario;
  const perfil = (usuario?.perfil || "").toLowerCase();
  const isAdmin = perfil === "admin";
  const isMembroOuVisitante = perfil === "membro" || perfil === "visitante";

  /* ---------- estados CRUD (admin) ---------- */
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  /* ---------- modal (admin) ---------- */
  const [modalOpen, setModalOpen] = useState(false);

  /* ---------- estados solicitações (admin) ---------- */
  const [solics, setSolics] = useState([]);
  const [loadingSolics, setLoadingSolics] = useState(false);

  /* ---------- edição própria (membro/visitante) ---------- */
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [temSolicPendente, setTemSolicPendente] = useState(false);

  /* ====== Admin: lista de usuários ====== */
  useEffect(() => {
    if (!isAdmin) return;
    const carregar = async () => {
      setLoading(true);
      try {
        const res = await usersApi.list();
        setUsers(res.data);
      } catch {
        alert("Falha ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [isAdmin]);

  /* ====== Admin: solicitações pendentes ====== */
  const fetchSolicPendentes = async () => {
    setLoadingSolics(true);
    try {
      const res = await solicitacoesApi.list({ status: "pendente" });
      setSolics(res.data || []);
    } catch {
      alert("Falha ao carregar solicitações.");
    } finally {
      setLoadingSolics(false);
    }
  };
  useEffect(() => {
    if (isAdmin) fetchSolicPendentes();
  }, [isAdmin]);

  /* ====== Membro/Visitante: meu cadastro e status ====== */
  useEffect(() => {
    if (!(isLogado && isMembroOuVisitante)) return;
    const carregar = async () => {
      setLoadingMe(true);
      try {
        const [meRes, solRes] = await Promise.all([
          usersApi.get(usuario.id),
          solicitacoesApi.list({ userId: usuario.id, status: "pendente" }),
        ]);
        setMe(meRes.data);
        setTemSolicPendente((solRes.data || []).length > 0);
      } catch {
        alert("Falha ao carregar seu cadastro.");
      } finally {
        setLoadingMe(false);
      }
    };
    carregar();
  }, [isLogado, isMembroOuVisitante, usuario?.id]);

  /* ---------------- Ações CRUD (Admin) ---------------- */
  const handleCreate = async (data) => {
    try {
      const payload = { perfil: data.perfil || "Membro", ...data };
      const res = await usersApi.create(payload);
      setUsers((prev) => [res.data, ...prev]);
      setModalOpen(false);
      setEditing(null);
    } catch {
      alert("Erro ao criar usuário.");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const res = await usersApi.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      setEditing(null);
      setModalOpen(false);
    } catch {
      alert("Erro ao salvar usuário.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este usuário?")) return;
    try {
      await usersApi.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Erro ao excluir usuário.");
    }
  };

  /* ---------------- Cadastro público (deslogado) ---------------- */
  const handlePublicSignup = async (dados) => {
    try {
      const payload = {
        ...dados,
        senha: dados.senha ?? dados.password ?? dados.pass ?? "",
        perfil: "Visitante", // 🔒 todo mundo nasce Visitante (colocado por último)
      };
      await usersApi.create(payload);
      alert("Cadastro realizado com sucesso!");
      navigate("/", { replace: true });
    } catch {
      alert("Não foi possível concluir o cadastro.");
    }
  };

  /* ---------------- Edição própria (Membro/Visitante) ---------------- */
  const handleSelfUpdate = async (dados) => {
    try {
      const payload = { ...dados, perfil: me?.perfil || usuario.perfil }; // trava perfil
      const res = await usersApi.update(usuario.id, payload);
      localStorage.setItem("auth_user", JSON.stringify(res.data));
      alert("Dados atualizados com sucesso!");
      navigate(0);
    } catch {
      alert("Não foi possível atualizar seu cadastro.");
    }
  };

  const solicitarUpgrade = async () => {
    try {
      await solicitacoesApi.create({
        userId: usuario.id,
        nome: me?.nome || usuario.nome || "",
        email: me?.email || usuario.email || "",
        de: me?.perfil || usuario.perfil || "Visitante",
        para: "Membro",
        tipo: "upgrade-perfil",
        status: "pendente",
      });
      setTemSolicPendente(true);
      alert("Solicitação enviada! Aguarde a aprovação do administrador.");
    } catch {
      alert("Não foi possível enviar a solicitação.");
    }
  };

  /* ---------------- Admin: aprovar / rejeitar ---------------- */
  const aprovar = async (sol) => {
    try {
      const user = await usersApi.get(sol.userId);
      await usersApi.update(sol.userId, { ...user.data, perfil: "Membro" });
      await solicitacoesApi.update(sol.id, { status: "aprovado" });
      await Promise.all([
        fetchSolicPendentes(),
        (async () => {
          const res = await usersApi.list();
          setUsers(res.data);
        })(),
      ]);
      alert(`Aprovado: ${sol.nome || sol.email}`);
    } catch {
      alert("Falha ao aprovar solicitação.");
    }
  };

  const rejeitar = async (sol) => {
    try {
      await solicitacoesApi.update(sol.id, { status: "rejeitado" });
      fetchSolicPendentes();
      alert(`Solicitação rejeitada: ${sol.nome || sol.email}`);
    } catch {
      alert("Falha ao rejeitar solicitação.");
    }
  };

  /* ---------------- Modal helpers (Admin) ---------------- */
  const openCreateModal = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEditModal = (user) => {
    setEditing(user);
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

  /* ===================== RENDER ===================== */

  // 1) Deslogado -> somente cadastro (Visitante)
  if (!isLogado) {
    return (
      <div>
        <Header />
        <section className="section-light" style={{ padding: 24 }}>
          <h2>Crie sua conta</h2>
          <p style={{ marginBottom: 16, color: "#6b7280" }}>
            Seu perfil inicial será <b>Visitante</b>. Você poderá solicitar
            promoção para <b>Membro</b> depois do login.
          </p>
          <UserForm
            initialData={{ perfil: "Visitante" }}
            onSubmit={handlePublicSignup}
            lockPerfil
          />
        </section>
        <Footer />
      </div>
    );
  }

  // 2) Membro/Visitante -> edição do próprio cadastro + solicitar Membro
  if (isMembroOuVisitante) {
    return (
      <div>
        <Header />
        <section className="section-light" style={{ padding: 24 }}>
          <h2>Editar cadastro</h2>

          {loadingMe ? (
            <p>Carregando...</p>
          ) : (
            <>
              <UserForm
                initialData={me || usuario}
                onSubmit={handleSelfUpdate}
                lockPerfil
              />
              <div style={{ marginTop: 16 }}>
                {(me?.perfil || usuario.perfil) === "Visitante" && (
                  <button
                    className="button"
                    onClick={solicitarUpgrade}
                    disabled={temSolicPendente}
                  >
                    {temSolicPendente
                      ? "Solicitação enviada (aguarde)"
                      : "Solicitar upgrade para Membro"}
                  </button>
                )}
              </div>
            </>
          )}
        </section>
        <Footer />
      </div>
    );
  }

  // 3) Admin -> Dashboard + Tabela (form apenas via modal)
  return (
    <div>
      <Header />
      <section className="section-light" style={{ padding: 24 }}>
        {/* Linha de título + botão "Novo usuário" à direita */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Usuários</h2>
          <button className="button" onClick={openCreateModal}>
            Novo usuário
          </button>
        </div>

        {/* --- Solicitações pendentes --- */}
        <div style={{ margin: "8px 0 20px" }}>
          <h3>Solicitações pendentes</h3>
          {loadingSolics ? (
            <p>Carregando...</p>
          ) : !solics.length ? (
            <p>Nenhuma solicitação no momento.</p>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>De</th>
                  <th>Para</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {solics.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nome || "-"}</td>
                    <td>{s.email || "-"}</td>
                    <td>{s.de}</td>
                    <td>{s.para}</td>
                    <td>
                      <button className="button" onClick={() => aprovar(s)}>
                        Aprovar
                      </button>
                      <button
                        className="button button-outline"
                        style={{ marginLeft: 8 }}
                        onClick={() => rejeitar(s)}
                      >
                        Rejeitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- Tabela Admin --- */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <UsersTable
            data={users}
            onEdit={openEditModal} // <- abre modal ao editar
            onDelete={handleDelete}
          />
        )}
      </section>
      <Footer />

      {/* ===== Modal de Criar/Editar (Admin) ===== */}
      {isAdmin && modalOpen && (
        <div className="login-form-backdrop" onClick={closeModal}>
          <div
            className="login-form"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(520px, 92vw)" }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>
              {editing ? "Editar usuário" : "Novo usuário"}
            </h2>

            <UserForm
              initialData={editing}
              onSubmit={(data) =>
                editing ? handleUpdate(editing.id, data) : handleCreate(data)
              }
              onCancel={closeModal}
              allowedPerfis={["Visitante", "Membro", "Admin"]} // Admin pode definir
            />
          </div>
        </div>
      )}
    </div>
  );
}

// src/services/api.js
import axios from "axios";

export const API_BASE_URL = "https://6895496c039a1a2b288ed33c.mockapi.io/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ------- membros --------
export const membrosApi = {
  list: () => API.get("/membros"),
  get: (id) => API.get(`/membros/${id}`),
  create: (data) => API.post("/membros", data),
  update: (id, data) => API.put(`/membros/${id}`, data),
  remove: (id) => API.delete(`/membros/${id}`),
};

// ------- usuários --------
export const usersApi = {
  list: () => API.get("/users"),
  get: (id) => API.get(`/users/${id}`),
  create: (data) => API.post("/users", data),
  update: (id, data) => API.put(`/users/${id}`, data),
  remove: (id) => API.delete(`/users/${id}`),
  search: (params) => API.get("/users", { params }),
};

// login simples consultando o recurso users
export async function login({ email, password }) {
  const res = await usersApi.search({ email, senha: password });
  const [user] = res.data || [];
  if (!user) throw new Error("Credenciais inválidas");
  const token = `mock-${user.id}-${Date.now()}`;
  return { user, token };
}

// // -------- login (tentativa )------------
// export const login = async (credentials) => {
//   try {
//     const response = await API.post("/login", credentials);
//     return response.data;
//   } catch (error) {
//     console.error("Erro ao fazer login: ", error);
//     throw error;
//   }
// };

/* ------------------- SOLICITAÇÕES ------------------- */
export const solicitacoesApi = {
  list: (params) => API.get("/solicitacoes", { params }),
  get: (id) => API.get(`/solicitacoes/${id}`),
  create: (data) => API.post("/solicitacoes", data),
  update: (id, data) => API.put(`/solicitacoes/${id}`, data),
  remove: (id) => API.delete(`/solicitacoes/${id}`),
};

// ------- cursos ---------
export const cursosApi = {
  list: () => API.get("/cursos"),
  get: (id) => API.get(`/cursos/${id}`),
  create: (data) => API.post("/cursos", data),
  update: (id, data) => API.put(`/cursos/${id}`, data),
  remove: (id) => API.delete(`/cursos/${id}`),
};

// -------- eventos ----------
export const eventosApi = {
  list: () => API.get("/eventos"),
  get: (id) => API.get(`/eventos/${id}`),
  create: (data) => API.post("/eventos", data),
  update: (id, data) => API.put(`/eventos/${id}`, data),
  remove: (id) => API.delete(`/eventos/${id}`),
};

export default API;

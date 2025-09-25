import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Membros from "./pages/Membros";
import Cursos from "./pages/Cursos";
import Eventos from "./pages/Eventos";
import Users from "./pages/Users";
import { formToJSON } from "axios";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/membros" element={<Membros />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

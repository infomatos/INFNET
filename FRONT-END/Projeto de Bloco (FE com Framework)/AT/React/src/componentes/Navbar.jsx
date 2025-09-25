// import React, { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="navbar">
//       <button onClick={() => setMenuOpen(!menuOpen)} className="menu-btn">
//         ☰
//       </button>
//       <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
//         <li>
//           <Link to="/" onClick={() => setMenuOpen(false)}>
//             Início
//           </Link>
//         </li>
//         <li>
//           <a href="#mensagens">Mensagens</a>
//         </li>
//         <li>
//           <a href="#cursos">Cursos</a>
//         </li>
//         <li>
//           <Link to="/membros" onClick={() => setMenuOpen(false)}>
//             Membros
//           </Link>
//         </li>
//         <li>
//           <a href="#contato">Contato</a>
//         </li>
//       </ul>
//     </nav>
//   );
// }

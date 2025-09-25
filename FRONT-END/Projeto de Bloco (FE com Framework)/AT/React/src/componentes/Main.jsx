import React from "react";
import ContagemCulto from "./ContagemCulto";

export default function Main() {
  return (
    <main className="main-content">
      <section className="section-light" id="inicio">
        <h2>Uma igreja para toda familia.</h2>
        <p>
          GUIA Church é um lugar onde pessoas comuns são capacitadas para
          conhecer Jesus e crescer nEle.
        </p>
        <div className="features">
          <div className="feature">📍 Pastor Presidente: Altomir Rangel</div>
          <div className="feature">✉️ Pastor Diretor: George Franklin</div>
        </div>
        <ContagemCulto />
      </section>

      <section className="section-soft" id="mensagens">
        <h3>📍 Onde nos encontrar</h3>
        <p>Rua Pedra de Itaúna, 534 - Barra da Tijuca</p>
      </section>

      <section className="section-light" id="cursos">
        <h3>✉️ Nossas redes</h3>
        <div className="social-links">
          <a
            href="https://www.instagram.com/suaigreja"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png"
              alt="Instagram"
            />
          </a>
          <a
            href="https://www.youtube.com/@suaigreja"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <img
              src="https://img.icons8.com/ios-filled/30/000000/youtube-play.png"
              alt="YouTube"
            />
          </a>
        </div>
      </section>

      <section className="section-soft" id="contato">
        <h3>▶️ MESSAGES & MEDIA</h3>
        <p>Assista aos cultos anteriores e compartilhe com amigos.</p>
      </section>
    </main>
  );
}

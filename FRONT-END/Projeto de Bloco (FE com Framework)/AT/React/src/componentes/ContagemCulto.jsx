import React, { useState, useEffect } from "react";
import "../styles/contagemculto.css";

export default function ContagemCulto() {
  const [tempoRestante, setTempoRestante] = useState("");

  // Define o próximo culto como próximo domingo às 10h
  const calcularProximoCulto = () => {
    const agora = new Date();
    const diaAtual = agora.getDay();
    const diasParaDomingo = (7 - diaAtual) % 7;
    const proximoCulto = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate() + diasParaDomingo,
      10,
      0,
      0
    );
    return proximoCulto;
  };

  const atualizarContagem = () => {
    const agora = new Date();
    const culto = calcularProximoCulto();

    // Verifica se hoje é domingo
    const ehDomingo = agora.getDay() === 0;

    // Verifica se está entre 10h e 12h
    const horaAtual = agora.getHours();
    const minutosAtuais = agora.getMinutes();
    const cultoEmAndamento = ehDomingo && horaAtual >= 10 && horaAtual < 12;

    if (cultoEmAndamento) {
      setTempoRestante("⛪ Culto em andamento!");
      return;
    }

    const diff = culto - agora;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);

    setTempoRestante(
      `⏳ Faltam ${dias}d ${horas}h ${minutos}min para o próximo culto.`
    );
  };

  useEffect(() => {
    atualizarContagem();
    const interval = setInterval(atualizarContagem, 60000); // atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="contagem-culto">
      <p>🕒 Próximo culto: Domingo às 10h</p>
      <p>{tempoRestante}</p>
    </div>
  );
}

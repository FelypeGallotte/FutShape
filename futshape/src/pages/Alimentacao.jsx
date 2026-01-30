import React from "react";
import { Link } from "react-router-dom";
import useFetchDados from "../hooks/useFetchDados";
import '../styles/pages.css';
import "../styles/alimentacao.css"; 

export default function Alimentacao() {
  const { dados: planoAlimentar, loading, erro } = useFetchDados('/alimentacao');

  
  const renderRefeicao = (refeicao) => (
    <div key={refeicao.titulo} className="refeicao">
      <h4 className="refeicao-titulo">{refeicao.titulo}</h4>
      <ul className="refeicao-itens">
        {refeicao.itens.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );

  

  let conteudoPagina;

  if (loading) {
    conteudoPagina = <p className="mensagem-feedback">Carregando seu plano alimentar...</p>;
  } 
  else if (erro) {
    conteudoPagina = <p className="mensagem-feedback erro">Erro ao carregar: {erro}</p>;
  } 
  else if (!planoAlimentar || Object.keys(planoAlimentar).length === 0) {
    conteudoPagina = <p className="mensagem-feedback">Nenhum plano alimentar encontrado para sua posição.</p>;
  } 
  else {
    
    conteudoPagina = (
      <div className="grid-alimentacao">
        {Object.entries(planoAlimentar).map(([dia, refeicoes]) => (
          <div key={dia} className={`dia-card dia-${dia.split("-")[0].toLowerCase()}`}>
            <h3 className="dia-titulo">{dia}</h3>
            <div className="conteudo-dia">
              {refeicoes.map(renderRefeicao)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/home" className="back">← Voltar</Link>
        <h1 className="page-title">ALIMENTAÇÃO</h1>
        <div style={{ width: '120px' }}></div> 
      </header>

      <main className="alimentacao-content">
        {conteudoPagina}
      </main>
    </div>
  );
}
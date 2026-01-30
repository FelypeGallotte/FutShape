

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebar.css'; 

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  
  const nomeUsuario = localStorage.getItem("usuario") || "Usuário";
  const idade = localStorage.getItem("idade") || "Não Informada";
  const posicao = localStorage.getItem("posicaoOriginal") || "Não Informada";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">INFORMAÇÕES</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="sidebar-content">
          <h3 className="user-title">{nomeUsuario}</h3>
          
          <div className="info-item">
            <span className="info-label">IDADE:</span>
            <span className="info-value">{idade} anos</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">POSIÇÃO:</span>
            <span className="info-value">{posicao}</span>
          </div>
          
        </div>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>SAIR</button>
        </div>
      </div>
    </>
  );
}
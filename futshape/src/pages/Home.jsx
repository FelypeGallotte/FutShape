

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; 
import "../styles/home.css";

export default function Home() {
  const nomeUsuario = localStorage.getItem("usuario") || "USUÁRIO";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-container">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <header className="header">
        
        <div className="user-box">
          <div className="user-circle"></div>
          <span className="user-name">{nomeUsuario}</span>
        </div>
        
        <h1 className="title">FUTSHAPE</h1>
        
        
        <div className="menu-icon" onClick={toggleSidebar}>☰</div>
      </header>
      
      <main className="main">
        
        
        <h2 className="subtitle">TORNE-SE UM MELHOR VOCÊ</h2>
        <p className="description">
          Transforme seu jogo dentro e fora de campo.
          <br />
          Aqui, você encontra treinos específicos de futebol,
          <br />
          planejados para elevar seu desempenho técnico, físico e mental.
        </p>

        <div className="button-container">
          <Link to="/musculacao" className="main-button">
            
            MUSCULAÇÃO
          </Link>
          <Link to="/alimentacao" className="main-button">
            
            ALIMENTAÇÃO
          </Link>
          <Link to="/treino" className="main-button">
            
            TREINO ESPECÍFICO
          </Link>
        </div>
      </main>
    </div>
  );
}
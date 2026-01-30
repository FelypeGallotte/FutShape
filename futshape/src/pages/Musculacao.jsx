import React from "react";
import { Link } from "react-router-dom";
import useFetchDados from "../hooks/useFetchDados"; 
import "../styles/musculacao.css"; 
import '../styles/pages.css';

export default function Musculacao() {
    
    const { dados: treinos, loading, erro } = useFetchDados('/musculacao');

    
    if (loading) return <div className="page-container"><p className="mensagem-feedback">Carregando treinos...</p></div>;
    if (erro) return <div className="page-container"><p className="mensagem-feedback erro">Erro: {erro}</p></div>;

    return (
        <div className="page-container">
            <header className="page-header">
                <Link to="/home" className="back">← Voltar</Link>
                <h1 className="page-title">MUSCULAÇÃO</h1>
                <div style={{ width: '120px' }}></div> 
            </header>

            <main className="musculacao-content">
                
                {treinos && treinos.length > 0 ? (
                    <div className="grid-treino">
                        {treinos.map((treino) => (
                            <div key={treino.dia} className={`dia-card dia-${treino.dia.toLowerCase()}`}>
                                <h3 className="dia-titulo">{treino.dia} - {treino.foco}</h3>
                                <ul className="lista-exercicios">
                                    {treino.exercicios.map((exercicio, index) => (
                                        <li key={index}>{exercicio}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mensagem-feedback">Nenhum treino encontrado.</p>
                )}
            </main>
        </div>
    );
}
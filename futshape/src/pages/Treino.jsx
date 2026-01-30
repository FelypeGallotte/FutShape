import React from "react";
import { Link } from "react-router-dom";
import useFetchDados from "../hooks/useFetchDados";
import "../styles/treino.css";
import "../styles/pages.css";
import "../styles/musculacao.css"; 

export default function Treino() {
    
    const posicaoSalva = localStorage.getItem("posicao"); 
    
    
    const posicaoOriginal = localStorage.getItem("posicaoOriginal"); 
    
    
    const nomeChave = posicaoSalva ? posicaoSalva.toUpperCase() : "POSIÇÃO";
    const nomeEspecifico = posicaoOriginal ? posicaoOriginal.charAt(0).toUpperCase() + posicaoOriginal.slice(1).toLowerCase() : "";

    
    const tituloPrincipal = "TREINO ESPECÍFICO"; 
    
    
    const tituloSecundarioFormatado =  `TREINO ESPECÍFICO - ${nomeChave}${nomeEspecifico ? ` (${nomeEspecifico})` : ''}`;

    
    const bodyTreino = { posicao: posicaoSalva, posicaoOriginal: posicaoOriginal };

    
    const { dados: treinoEspecifico, loading, erro } = useFetchDados('/treino-especifico', bodyTreino);

    if (loading) return <div className="page-container"><p className="mensagem-feedback">Carregando treino específico...</p></div>;
    
    
    if (erro || !treinoEspecifico) {
        return (
            <div className="page-container">
                <header className="page-header">
                    <Link to="/home" className="back">← Voltar</Link>
                    <h1 className="page-title">{tituloPrincipal}</h1>
                    <div style={{ width: '120px' }}></div>
                </header>
                <main className="treino-content">
                    <p className="mensagem-feedback erro">
                        {erro ? `Erro: ${erro}` : `Não encontramos treino específico para a posição: ${posicaoSalva || 'NÃO DEFINIDA'}`}
                    </p>
                </main>
            </div>
        );
    }
    
    const { videoUrl, fundamentos, semanal } = treinoEspecifico;

    
    const diasOrdenados = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    const treinosSemanais = diasOrdenados
        .filter(dia => semanal && semanal[dia]) 
        .map(dia => ({
            dia: dia,
            foco: semanal[dia].foco,
            exercicios: semanal[dia].exercicios
        }));

    return (
        <div className="page-container">
            <header className="page-header">
                <Link to="/home" className="back">← Voltar</Link>
                
                <h1 className="page-title">{tituloPrincipal}</h1>
                <div style={{ width: '120px' }}></div> 
            </header>

            <main className="treino-content">
                
                <h2 className="treino-subtitle">{tituloSecundarioFormatado}</h2>
                
                <div className="treino-container">
                    
                    {videoUrl && (
                        <div className="video-player-box">
                            <iframe
                                src={videoUrl}
                                
                                title={`Treino para ${posicaoOriginal || posicaoSalva}`} 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                frameBorder="0"
                            ></iframe>
                        </div>
                    )}
                    
                    
                    <div className="fundamentos-box">
                        <h3 className="fundamentos-titulo">FUNDAMENTOS E PRIORIDADES</h3>
                        {fundamentos && fundamentos.map((item, index) => (
                            <div key={index} className="fundamento-item">
                                <h4 className="item-titulo">{item.titulo}</h4>
                                <p className="item-texto">{item.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                
                {treinosSemanais.length > 0 && (
                    <section className="treino-card-abaixo detalhe-semanal">
                        <h2 className="treino-card-abaixo-titulo">PLANO DE TREINO SEMANAL DETALHADO</h2>
                        <div className="grid-treino">
                            {treinosSemanais.map((treino) => (
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
                    </section>
                )}
            </main>
        </div>
    );
}
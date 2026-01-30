import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "../index.css";


const mapPosicaoToChave = (posicaoSelecionada) => {
    if (!posicaoSelecionada) return null;
    
    
    const chave = posicaoSelecionada.toUpperCase();

    const mapa = {
        
        "GOLEIRO": "GOLEIRO",
        "ZAGUEIRO": "DEFESA",
        "LATERAL": "DEFESA",
        "VOLANTE": "MEIO-CAMPO", 
        "MEIA CENTRAL": "MEIO-CAMPO", 
        "PONTA": "ATAQUE",
        "CENTROAVANTE": "ATAQUE",
    };
    
     
    return mapa[chave] || chave; 
};


export default function Cadastro() {
    const [formData, setFormData] = useState({
        nome: "",
        idade: "",
        email: "",
        senha: "",
        posicao: "",
    });
    const [mensagem, setMensagem] = useState(""); 

    const navigate = useNavigate();

    const posicoes = [
        "Goleiro",
        "Zagueiro",
        "Lateral",
        "Volante",
        "Meia Central",
        "Ponta",
        "Centroavante",
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("Cadastrando...");

        const urlBackend = "http://localhost:3001/cadastro";

        
        const posicaoChave = mapPosicaoToChave(formData.posicao);

        if (!posicaoChave) {
            setMensagem("Erro: Por favor, selecione uma posição válida.");
            return;
        }

        try {
            const response = await fetch(urlBackend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({
                    email: formData.email,
                    senha: formData.senha,
                    nome: formData.nome,
                    posicao: posicaoChave, 
                    posicaoOriginal: formData.posicao, 
                    idade: formData.idade 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem(data.mensagem + " Redirecionando...");
                
                localStorage.setItem("usuario", data.nome);
                localStorage.setItem("posicao", data.posicao);
                localStorage.setItem("posicaoOriginal", data.posicaoOriginal);
                localStorage.setItem("idade", data.idade);
                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            } else {
                setMensagem("Erro: " + data.erro);
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            setMensagem("Erro: Não foi possível conectar ao servidor. Tente mais tarde.");
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">FUTSHAPE</h1>

            <form className="card" onSubmit={handleSubmit}>
                <h2>CADASTRO</h2>

                <label>Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                />

                <label>Idade:</label>
                <input
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Senha:</label>
                <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                />

                <label>Posição:</label>
                <select
                    name="posicao"
                    value={formData.posicao}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione uma posição</option>
                    {posicoes.map((p, index) => (
                        <option key={index} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <button type="submit">ENVIAR</button>
                
                
                {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
                
                
                <p className="link-redirecionamento">
                    Já tem cadastro? <Link to="/login">Faça Login</Link>
                </p>
            </form>
        </div>
    );
}
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; 

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        senha: "",
    });
    const [mensagem, setMensagem] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("Acessando...");

        const urlBackend = "http://localhost:3001/login";

        try {
            const response = await fetch(urlBackend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
            setMensagem("Erro: Não foi possível conectar ao servidor. Verifique o servidor.");
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">FUTSHAPE</h1>

            <form className="card" onSubmit={handleSubmit}>
                <h2>LOGIN</h2>

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

                <button type="submit">ENTRAR</button>
                
                {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
                
                <p className="link-redirecionamento">
                    Não tem cadastro? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </form>
        </div>
    );
}


import { useState, useEffect } from 'react';


const useFetchDados = (endpoint, bodyContent = {}) => { 
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true); 
            setErro(null);

            try {
                
                const response = await fetch(`http://localhost:3001${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    
                    body: JSON.stringify(bodyContent) 
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ erro: 'Erro desconhecido' }));
                    throw new Error(errorData.erro || `Falha na resposta do servidor (Status: ${response.status})`);
                }
                
                const data = await response.json();
                setDados(data);
            } catch (err) {
                setErro(err.message);
            } finally {
                setLoading(false);
            }
        };

        
        if (endpoint === '/treino-especifico' && (!bodyContent || !bodyContent.posicao)) {
             setLoading(false);
             setErro("Posição do usuário não encontrada. Faça login ou selecione uma posição.");
             return;
        }

        carregarDados();

    }, [endpoint, JSON.stringify(bodyContent)]); 

    return { dados, loading, erro };
};

export default useFetchDados;
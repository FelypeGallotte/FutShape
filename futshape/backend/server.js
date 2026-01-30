
const express = require('express');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let db;
const custoHash = 10;


// 1. DADOS DO SISTEMA (COMPLETOS)


const musculacaoGeral = [
    { dia: "SEGUNDA-FEIRA", foco: "FORÇA DE MEMBROS INFERIORES", exercicios: ["AGACHAMENTO LIVRE – 4X8", "LEG PRESS – 4X10", "CADEIRA EXTENSORA – 3X12", "MESA FLEXORA – 3X12", "STIFF (PESO MORTO ROMENO) – 3X10", "PANTURRILHA EM PÉ – 4X15", "PRANCHA LATERAL – 3X40 SEG"] },
    { dia: "TERÇA-FEIRA", foco: "POTÊNCIA E EXPLOSÃO", exercicios: ["AGACHAMENTO COM SALTO (PLIOMETRIA) – 4X10", "CADEIRA EXTENSORA EXPLOSIVA – 3X12", "STEP LATERAL COM IMPULSO – 3X12 POR PERNA", "SPRINT CURTO (20 M) – 6 REPETIÇÕES", "CORRIDA COM RESISTÊNCIA (ELÁSTICO OU COLETE) – 6X15 M", "SALTO VERTICAL - MUDANÇA DE DIREÇÃO – 4X8", "ABDOMINAIS COM BOLA MEDICINAL – 3X15"] },
    { dia: "QUARTA-FEIRA", foco: "FORÇA DE MEMBROS SUPERIORES E CORE", exercicios: ["SUPINO RETO – 4X8", "REMADA CURVADA – 4X10", "DESENVOLVIMENTO MILITAR (OMBROS) – 3X10", "TRÍCEPS CORDA – 3X12", "ROSCA DIRETA – 3X12", "PRANCHA FRONTAL – 3X1 MIN", "ELEVAÇÃO DE PERNAS (CORE INFERIOR) – 3X15"] },
    { dia: "QUINTA-FEIRA", foco: "RESISTÊNCIA E ESTABILIDADE", exercicios: ["AGACHAMENTO COM BARRA LEVE – 3X15", "PASSADA (AVANÇO) – 3X12 POR PERNA", "CADEIRA FLEXORA LEVE – 3X15", "ABDUÇÃO DE QUADRIL (COM ELÁSTICO) – 3X20", "PRANCHA COM INSTABILIDADE (BOLA OU BOSU) – 3X40 SEG", "PONTE DE GLÚTEO UNILATERAL – 3X12 POR PERNA", "CORRIDA LEVE (TROTE REGENERATIVO 20 MIN)"] },
    { dia: "SEXTA-FEIRA", foco: "TREINO COMBINADO", exercicios: ["AGACHAMENTO + SALTO (8 REP)", "CORRIDA LATERAL COM CONE (20 M)", "FLEXÃO DE BRAÇO (15 REP)", "SPRINT 15 M", "ABDOMINAIS + BOLA (20 REP)"] },
    { dia: "SÁBADO", foco: "RECUPERAÇÃO ATIVA", exercicios: ["NATAÇÃO, PEDAL OU TROTE LEVE (30 MIN)", "ALONGAMENTO COMPLETO (20-30 MIN)", "MOBILIDADE DE QUADRIL, JOELHOS E TORNOZELOS", "LIBERAÇÃO MIOFASCIAL (ROLO OU MASSAGEM)"] },
    { dia: "DOMINGO", foco: "DESCANSO TOTAL", exercicios: ["PRIORIZE SONO, HIDRATAÇÃO E ALIMENTAÇÃO LIMPA.", "PODE INCLUIR UMA CAMINHADA LEVE"] }
];

const alimentacaoGeral = [
    { dia: "SEGUNDA-FEIRA", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["OMELETE COM 3 OVOS", "AVEIA COM BANANA E MEL"] },
        { titulo: "LANCHE", itens: ["CAFÉ PRETO OU SUCO NATURAL"] },
        { titulo: "ALMOÇO", itens: ["ARROZ INTEGRAL", "FRANGO GRELHADO", "LEGUMES", "AZEITE EXTRA VIRGEM (1 COLHER)"] },
        { titulo: "PRÉ-TREINO", itens: ["PÃO INTEGRAL", "PASTA DE AMENDOIM", "BANANA"] },
        { titulo: "JANTAR", itens: ["PEIXE GRELHADO", "PURÊ DE BATATA DOCE", "SALADA"] }
    ]},
    { dia: "TERÇA-FEIRA", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["TAPIOCA COM OVO", "FRUTAS VERMELHAS"] },
        { titulo: "LANCHE", itens: ["BARRA PROTEICA OU IOGURTE GREGO"] },
        { titulo: "ALMOÇO", itens: ["ARROZ", "FEIJÃO", "CARNE MAGRA (PATINHO OU ALCATRA)", "LEGUMES COZIDOS"] },
        { titulo: "PRÉ-TREINO", itens: ["BANANA", "AVEIA", "MEL"] },
        { titulo: "PÓS-TREINO", itens: ["SHAKE PROTEICO", "FRUTA"] },
        { titulo: "JANTAR", itens: ["FRANGO", "LEGUMES", "BATATA INGLESA"] }
    ]},
    { dia: "QUARTA-FEIRA", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["PÃO INTEGRAL", "OVOS MEXIDOS", "SUCO VERDE"] },
        { titulo: "LANCHE", itens: ["MAÇÃ", "CASTANHAS"] },
        { titulo: "ALMOÇO", itens: ["QUINOA", "FILÉ DE PEIXE", "SALADA DE FOLHAS E BETERRABA"] },
        { titulo: "PRÉ-TREINO", itens: ["TAPIOCA COM PASTA DE AMENDOIM"] },
        { titulo: "JANTAR", itens: ["OMELETE", "ARROZ INTEGRAL", "SALADA LEVE"] }
    ]},
    { dia: "QUINTA-FEIRA", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["PANQUECA DE AVEIA COM BANANA E MEL"] },
        { titulo: "LANCHE", itens: ["SUCO DE LARANJA"] },
        { titulo: "ALMOÇO", itens: ["IOGURTE", "GRANOLA", "MACARRÃO INTEGRAL", "CARNE MAGRA", "LEGUMES"] },
        { titulo: "PRÉ-TREINO", itens: ["FRUTA CÍTRICA"] },
        { titulo: "PÓS-TREINO", itens: ["BATATA DOCE", "OVO COZIDO"] },
        { titulo: "JANTAR", itens: ["SHAKE PROTEICO", "FRUTA", "FRANGO", "PURÊ DE MANDIOQUINHA", "SALADA"] }
    ]},
    { dia: "SEXTA-FEIRA", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["OVOS MEXIDOS", "PÃO INTEGRAL", "SUCO DE MELANCIA"] },
        { titulo: "LANCHE", itens: ["BANANA", "AVEIA"] },
        { titulo: "ALMOÇO", itens: ["ARROZ INTEGRAL", "FEIJÃO", "CARNE MOÍDA", "SALADA COLORIDA"] },
        { titulo: "PRÉ-TREINO", itens: ["PÃO INTEGRAL", "PASTA DE AMENDOIM"] },
        { titulo: "PÓS-TREINO", itens: ["SHAKE PROTEICO", "MAÇÃ"] },
        { titulo: "JANTAR", itens: ["OMELETE", "LEGUMES REFOGADOS", "ARROZ INTEGRAL"] }
    ]},
    { dia: "SÁBADO", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["AVEIA", "FRUTAS", "OVOS MEXIDOS"] },
        { titulo: "LANCHE", itens: ["IOGURTE NATURAL", "FRUTA"] },
        { titulo: "ALMOÇO", itens: ["MACARRÃO", "PEITO DE FRANGO", "LEGUMES LEVES"] },
        { titulo: "PÓS-TREINO", itens: ["SHAKE PROTEICO", "BANANA"] },
        { titulo: "JANTAR", itens: ["ESCOLHA O QUE QUISER: PIZZA, HAMBÚRGUER, MASSA, SUSHI, CHURRASCO ETC."] }
    ]},
    { dia: "DOMINGO", refeicoes: [
        { titulo: "CAFÉ DA MANHÃ", itens: ["PÃO INTEGRAL", "OVOS", "FRUTAS"] },
        { titulo: "LANCHE", itens: ["IOGURTE", "AVEIA"] },
        { titulo: "ALMOÇO", itens: ["ARROZ INTEGRAL", "PEIXE", "LEGUMES", "FRUTA DE SOBREMESA"] },
        { titulo: "JANTAR", itens: ["SOPA LEVE OU SALADA", "PROTEÍNA MAGRA"] }
    ]}
];


const dadosEspecificos = {
    
    "GOLEIRO": {
        videoUrl: "https://www.youtube.com/embed/eJAgAOj8Q2I", // Exemplo para Goleiros
        fundamentos: [
            { titulo: "Prioridade: Reação e Reflexo", texto: "Treinar a capacidade de resposta explosiva a estímulos visuais e sonoros para defesas em curta distância." },
            { titulo: "Especialização: Jogo Aéreo", texto: "Foco no tempo de bola e na segurança na saída do gol em cruzamentos e bolas paradas." },
            { titulo: "Foco Tático: Jogo com os Pés", texto: "Desenvolver precisão e visão de jogo para iniciar a construção das jogadas (passes curtos e lançamentos)." },
            { titulo: "Físico: Força de Impulsão", texto: "Trabalho específico em potência de membros inferiores para saltos e defesas mais altas." }
        ],
        semanal: [
            { dia: "SEGUNDA", foco: "Técnica Individual", exercicios: ["Aquecimento: deslocamentos laterais, quedas baixas (10 min)", "Defesa de bolas rasteiras e meia altura (6×8 rep)", "Saída do gol com bolas aéreas (5×6 rep)", "Jogo com os pés (passes curtos e longos, 15 min)"] },
            { dia: "TERÇA", foco: "Reação e Reflexo", exercicios: ["Reação curta: quedas rápidas após estímulo (10 min)", "Defesas em curta distância (6×5 rep)", "1x1 com finalizadores (8 rep)", "Lançamento + reposição com precisão (10 min)"] },
            { dia: "QUARTA", foco: "Força e Potência", exercicios: ["Plyometria: saltos laterais e frontais (4×10)", "Agilidade com escada (6 séries)", "Defesas após salto (6×5 rep)"] },
            { dia: "QUINTA", foco: "Situações de Jogo", exercicios: ["Saídas em bolas cruzadas em movimento (10 rep)", "Construção desde trás (20 min)", "Finalizações variadas com defesa (15 min)"] },
            { dia: "SEXTA", foco: "Jogo Reduzido", exercicios: ["5x5 com restrição: goleiro inicia todas as jogadas", "Treino de reposição rápida + transição"] },
            { dia: "SÁBADO", foco: "Recuperação", exercicios: ["Leve: mobilidade, alongamentos, 20 min de corrida leve"] },
            { dia: "DOMINGO", foco: "DESCANSO TOTAL", exercicios: ["Foco na regeneração e descanso muscular e mental."] }
        ]
    },
    "DEFESA": { 
        fundamentos: [
            { titulo: "Prioridade: Marcação e Bote", texto: "Foco na postura defensiva, timing do bote e recuperação rápida após o erro." },
            { titulo: "Especialização: Cobertura", texto: "Trabalho tático para realizar dobras e cobrir o companheiro que sai para o combate." },
            { titulo: "Foco Técnico: Saída de Bola", texto: "Aperfeiçoar o passe longo e curto, garantindo a qualidade da construção desde o campo de defesa." },
            { titulo: "Físico: Velocidade de Reação", texto: "Desenvolver a capacidade de virar e acelerar rapidamente em transições defensivas." }
        ],
        semanal: [
            { dia: "SEGUNDA", foco: "Técnica Defensiva", exercicios: ["Desarmes e botes controlados (6×8 rep)", "Marcação 1x1 (zagueiros fazem frontal, laterais fazem lateralizando)", "Saída de bola curta e longa (15 min)"] },
            { dia: "TERÇA", foco: "Velocidade e Agilidade", exercicios: ["Tiros de velocidade curta (8×20 m)", "Mudança de direção com cones (5 séries)", "Recuperação defensiva em sprint (6 rep)"] },
            { dia: "QUARTA", foco: "Jogo Aéreo", exercicios: ["Disputa de bolas aéreas defensivas (6×6 rep)", "Saída de pressão + passe vertical (15 min)", "Laterais: cruzamentos + recomposição (10 rep)"] },
            { dia: "QUINTA", foco: "Sistema Defensivo", exercicios: ["Linha defensiva: subir e descer (15 min)", "Coberturas e dobras defensivas (20 min)", "Encaixes de marcação em jogo reduzido 6×6"] },
            { dia: "SEXTA", foco: "Jogo Reduzido Temático", exercicios: ["7×7 com foco em transição defensiva e antecipação", "Laterais só podem atacar em ultrapassagem"] },
            { dia: "SÁBADO", foco: "Recuperação", exercicios: ["Alongamentos e corrida leve"] },
            { dia: "DOMINGO", foco: "DESCANSO TOTAL", exercicios: ["Foco na regeneração e descanso muscular e mental."] }
        ]
    },
    "MEIO-CAMPO": { 
        fundamentos: [
            { titulo: "Prioridade: Visão e Passe", texto: "Aprimorar a visão periférica e a precisão do passe de curta, média e longa distância, especialmente o passe vertical." },
            { titulo: "Especialização: Recepção Orientada", texto: "Dominar a bola e já girar o corpo na direção do ataque para acelerar a transição ofensiva." },
            { titulo: "Foco Físico: Resistência de Intensidade", texto: "Manter o ritmo alto de marcação e construção por toda a partida (caixa a caixa)." },
            { titulo: "Foco Tático: Encaixe e Cobertura", texto: "Entender os espaços para realizar o encaixe de marcação e cobrir os laterais e zagueiros quando necessário." }
        ],
        semanal: [
            { dia: "SEGUNDA", foco: "Técnica com Bola", exercicios: ["Recepção orientada + giro (6×8 rep)", "Passes de curta/média distância (15 min)", "Condução em espaço reduzido (10 min)"] },
            { dia: "TERÇA", foco: "Intensidade e Resistência", exercicios: ["Circuito de alta intensidade com bola (4×6 min)", "Pressão pós-perda 3×1 (6 rep)", "Volantes: coberturas laterais (10 min)"] },
            { dia: "QUARTA", foco: "Construção e Criatividade", exercicios: ["Triangulações e tabelas (15 min)", "Passes verticais entre linhas (20 min)", "Finalizações de média distância (10 rep)"] },
            { dia: "QUINTA", foco: "Situações de Jogo", exercicios: ["Encaixe no meio-campo", "Jogo posicional 6×6 (20 min)", "Volantes: saída de bola em três", "Meias: infiltrações e passes decisivos"] },
            { dia: "SEXTA", foco: "Jogo Reduzido", exercicios: ["4×4 com 2 coringas (30 min)", "Objetivo: manter posse e acelerar quando possível"] },
            { dia: "SÁBADO", foco: "Recuperação", exercicios: ["Trote + mobilidade"] },
            { dia: "DOMINGO", foco: "DESCANSO TOTAL", exercicios: ["Foco na regeneração e descanso muscular e mental."] }
        ]
    },
    "ATAQUE": { 
        fundamentos: [
            { titulo: "Prioridade: Finalização", texto: "Aperfeiçoar chutes de primeira, voleios e finalizações rápidas após recepção." },
            { titulo: "Especialização: Velocidade e Drible", texto: "Otimizar o drible em velocidade e a aceleração em sprints curtos e longos." },
            { titulo: "Foco Tático: Movimentação de Ruptura", texto: "Treinar o timing dos movimentos para quebrar as linhas de defesa e receber em profundidade." },
            { titulo: "Físico: Potência Explosiva", texto: "Desenvolver força para duelos individuais, proteção de bola e saltos para cabeceio." }
        ],
        semanal: [
            { dia: "SEGUNDA", foco: "Finalização", exercicios: ["Chutes de primeira (8 rep)", "Receber e finalizar (6×6 rep)", "Pontas: cortes para dentro + finalização (10 rep)"] },
            { dia: "TERÇA", foco: "Velocidade e Drible", exercicios: ["Tiros de 30–40 m (6 rep)", "1x1 ofensivo (8 rep)", "Dribles curtos com cones (5 séries)"] },
            { dia: "QUARTA", foco: "Movimentações Ofensivas", exercicios: ["Movimentos de ruptura (10 rep)", "Centroavante: pivô + giro (12 rep)", "Pontas: ultrapassagem + cruzamento"] },
            { dia: "QUINTA", foco: "Situações de Jogo", exercicios: ["Finalização em transição (10 rep)", "Ataque contra defesa (6×6)", "Pressão alta coordenada (15 min)"] },
            { dia: "SEXTA", foco: "Jogo Reduzido", exercicios: ["Restrição: atacante deve finalizar antes de 10 segundos", "Pontas: disputar duelos constantes contra laterais"] },
            { dia: "SÁBADO", foco: "Recuperação", exercicios: ["Corrida leve + alongamentos"] },
            { dia: "DOMINGO", foco: "DESCANSO TOTAL", exercicios: ["Foco na regeneração e descanso muscular e mental."] }
        ]
    },
    

    "ZAGUEIRO": {
        videoUrl: "https://www.youtube.com/embed/827dmOYBX4U",
        fundamentos: [{ titulo: "Prioridade: Marcação e Bote", texto: "Foco na postura defensiva, timing do bote e recuperação rápida após o erro." },
            { titulo: "Especialização: Cobertura", texto: "Trabalho tático para realizar dobras e cobrir o companheiro que sai para o combate." },
            { titulo: "Foco Técnico: Saída de Bola", texto: "Aperfeiçoar o passe longo e curto, garantindo a qualidade da construção desde o campo de defesa." },
            { titulo: "Físico: Velocidade de Reação", texto: "Desenvolver a capacidade de virar e acelerar rapidamente em transições defensivas." }],
        semanal: [] 
    },
    "LATERAL": {
        videoUrl: "https://www.youtube.com/embed/Y7D4FTqnTp0",
        fundamentos: [ { titulo: "Prioridade: Marcação e Bote", texto: "Foco na postura defensiva, timing do bote e recuperação rápida após o erro." },
            { titulo: "Especialização: Cobertura", texto: "Trabalho tático para realizar dobras e cobrir o companheiro que sai para o combate." },
            { titulo: "Foco Técnico: Saída de Bola", texto: "Aperfeiçoar o passe longo e curto, garantindo a qualidade da construção desde o campo de defesa." },
            { titulo: "Físico: Velocidade de Reação", texto: "Desenvolver a capacidade de virar e acelerar rapidamente em transições defensivas." }],
        semanal: [] 
    },
    "VOLANTE": { 
        videoUrl: "https://www.youtube.com/embed/KXH3V3ee_lA",
        fundamentos: [{ titulo: "Prioridade: Visão e Passe", texto: "Aprimorar a visão periférica e a precisão do passe de curta, média e longa distância, especialmente o passe vertical." },
            { titulo: "Especialização: Recepção Orientada", texto: "Dominar a bola e já girar o corpo na direção do ataque para acelerar a transição ofensiva." },
            { titulo: "Foco Físico: Resistência de Intensidade", texto: "Manter o ritmo alto de marcação e construção por toda a partida (caixa a caixa)." },
            { titulo: "Foco Tático: Encaixe e Cobertura", texto: "Entender os espaços para realizar o encaixe de marcação e cobrir os laterais e zagueiros quando necessário." } ],
        semanal: [] 
    },
    
    "MEIA-CENTRAL": { 
        videoUrl: "https://www.youtube.com/embed/Y27R5LobwJ4",
        fundamentos: [ { titulo: "Prioridade: Visão e Passe", texto: "Aprimorar a visão periférica e a precisão do passe de curta, média e longa distância, especialmente o passe vertical." },
            { titulo: "Especialização: Recepção Orientada", texto: "Dominar a bola e já girar o corpo na direção do ataque para acelerar a transição ofensiva." },
            { titulo: "Foco Físico: Resistência de Intensidade", texto: "Manter o ritmo alto de marcação e construção por toda a partida (caixa a caixa)." },
            { titulo: "Foco Tático: Encaixe e Cobertura", texto: "Entender os espaços para realizar o encaixe de marcação e cobrir os laterais e zagueiros quando necessário." }],
        semanal: [] 
    },
    "PONTA": {
        videoUrl: "https://www.youtube.com/embed/MKYWEKSilvM",
        fundamentos: [{ titulo: "Prioridade: Finalização", texto: "Aperfeiçoar chutes de primeira, voleios e finalizações rápidas após recepção." },
            { titulo: "Especialização: Velocidade e Drible", texto: "Otimizar o drible em velocidade e a aceleração em sprints curtos e longos." },
            { titulo: "Foco Tático: Movimentação de Ruptura", texto: "Treinar o timing dos movimentos para quebrar as linhas de defesa e receber em profundidade." },
            { titulo: "Físico: Potência Explosiva", texto: "Desenvolver força para duelos individuais, proteção de bola e saltos para cabeceio." } ],
        semanal: [] 
    },
    "CENTROAVANTE": {
        videoUrl: "https://www.youtube.com/embed/lrgujJl80sE",
        fundamentos: [{ titulo: "Prioridade: Finalização", texto: "Aperfeiçoar chutes de primeira, voleios e finalizações rápidas após recepção." },
            { titulo: "Especialização: Velocidade e Drible", texto: "Otimizar o drible em velocidade e a aceleração em sprints curtos e longos." },
            { titulo: "Foco Tático: Movimentação de Ruptura", texto: "Treinar o timing dos movimentos para quebrar as linhas de defesa e receber em profundidade." },
            { titulo: "Físico: Potência Explosiva", texto: "Desenvolver força para duelos individuais, proteção de bola e saltos para cabeceio." }],
        semanal: [] 
    }
};


// 1.5 Mapeamento de Posições 

// Mapeando a Posição Original (como vem do formulário) para a Posição Mãe (chave do treino semanal)
const mapaPosicoes = {
    "GOLEIRO": "GOLEIRO",
    "ZAGUEIRO": "DEFESA",
    "LATERAL": "DEFESA",
    "VOLANTE": "MEIO-CAMPO",
    "MEIA CENTRAL": "MEIO-CAMPO", 
    "PONTA": "ATAQUE",
    "CENTROAVANTE": "ATAQUE",
};



// 2. BANCO DE DADOS


async function setupDatabase() {
    db = await sqlite.open({ filename: './futshape.db', driver: sqlite3.Database });
    
    // Tabelas
    await db.exec(`CREATE TABLE IF NOT EXISTS USUARIO (ID_Usuario INTEGER PRIMARY KEY AUTOINCREMENT, Email TEXT UNIQUE, Senha TEXT NOT NULL, Nome TEXT, Posicao TEXT, Posicao_Original TEXT, Idade INTEGER);`);
    await db.exec(`CREATE TABLE IF NOT EXISTS TREINO_MUSCULACAO (ID INTEGER PRIMARY KEY AUTOINCREMENT, Posicao TEXT, Dia TEXT, Foco TEXT, Exercicios TEXT);`);
    await db.exec(`CREATE TABLE IF NOT EXISTS DIETA (ID INTEGER PRIMARY KEY AUTOINCREMENT, Posicao TEXT, Dia TEXT, Refeicao TEXT, Itens TEXT);`);
    await db.exec(`CREATE TABLE IF NOT EXISTS TREINO_ESPECIFICO_INFO (Posicao TEXT PRIMARY KEY, VideoURL TEXT, Fundamentos TEXT);`);
    await db.exec(`CREATE TABLE IF NOT EXISTS TREINO_ESPECIFICO_SEMANAL (ID INTEGER PRIMARY KEY AUTOINCREMENT, Posicao TEXT, Dia TEXT, Foco TEXT, Exercicios TEXT);`);
    
    
    await popularBanco(); 
}

async function popularBanco() {
    // Verifica se o banco já foi populado. Se sim, ignora para evitar duplicidade.
    const check = await db.get("SELECT count(*) as count FROM TREINO_MUSCULACAO");
    if (check.count > 0) {
        console.log("Banco de dados já populado. Para recarregar os novos dados, apagar o ficheiro futshape.db e reinicie o servidor.");
        return; 
    }

    console.log("Populando banco de dados com dados completos...");

    // 1. Musculação (GERAL)
    for (const item of musculacaoGeral) {
        await db.run(`INSERT INTO TREINO_MUSCULACAO (Posicao, Dia, Foco, Exercicios) VALUES (?, ?, ?, ?)`, 
            ['GERAL', item.dia, item.foco, JSON.stringify(item.exercicios)]);
    }

    // 2. Dieta (GERAL)
    for (const diaObj of alimentacaoGeral) {
        for (const ref of diaObj.refeicoes) {
            await db.run(`INSERT INTO DIETA (Posicao, Dia, Refeicao, Itens) VALUES (?, ?, ?, ?)`, 
                ['GERAL', diaObj.dia, ref.titulo, JSON.stringify(ref.itens)]);
        }
    }

    // 3. Específicos 
    for (const [posicao, dados] of Object.entries(dadosEspecificos)) {
        
        await db.run(`INSERT INTO TREINO_ESPECIFICO_INFO (Posicao, VideoURL, Fundamentos) VALUES (?, ?, ?)`, [posicao, dados.videoUrl, JSON.stringify(dados.fundamentos)]);
        
        
        if (dados.semanal && dados.semanal.length > 0) { 
            await db.run(`DELETE FROM TREINO_ESPECIFICO_SEMANAL WHERE Posicao = ?`, [posicao]); 
            for (const diaObj of dados.semanal) { 
                await db.run(`INSERT INTO TREINO_ESPECIFICO_SEMANAL (Posicao, Dia, Foco, Exercicios) VALUES (?, ?, ?, ?)`, [posicao, diaObj.dia, diaObj.foco, JSON.stringify(diaObj.exercicios)]);
            }
        }
    }
    console.log("Banco populado com sucesso!");
}

setupDatabase().then(() => {
    app.listen(PORT, () => { console.log(`Servidor rodando em http://localhost:${PORT}`); });
});


// 3. ROTAS

// CADASTRO
app.post('/cadastro', async (req, res) => {
    // Recebendo a posição específica (Ex: Lateral, Meia Central)
    const { email, senha, nome, posicaoOriginal, idade } = req.body; 
    
    
    const posicaoPadronizada = posicaoOriginal ? posicaoOriginal.toUpperCase() : null;
    const posicaoMae = mapaPosicoes[posicaoPadronizada];

    if (!posicaoMae) return res.status(400).json({ erro: "Posição original inválida ou não mapeada." });

    try {
        const existe = await db.get('SELECT * FROM USUARIO WHERE Email = ?', [email]);
        if (existe) return res.status(409).json({ erro: "Email já existe" });
        const hash = await bcrypt.hash(senha, custoHash);
        
        
        await db.run('INSERT INTO USUARIO (Email, Senha, Nome, Posicao, Posicao_Original, Idade) VALUES (?, ?, ?, ?, ?, ?)', 
            [email, hash, nome, posicaoMae, posicaoOriginal, idade]); 
            
        res.status(201).json({ mensagem: "Sucesso!", nome, posicao: posicaoMae, posicaoOriginal, idade }); 
    } catch (e) { res.status(500).json({ erro: "Erro ao cadastrar usuário." }); }
});
// LOGIN
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await db.get('SELECT * FROM USUARIO WHERE Email = ?', [email]);
        if (!user || !(await bcrypt.compare(senha, user.Senha))) return res.status(401).json({ erro: "Email ou senha incorretos" });
        
        res.status(200).json({ mensagem: "Logado!", nome: user.Nome, posicao: user.Posicao, posicaoOriginal: user.Posicao_Original,
        idade: user.Idade });
    } catch (e) { res.status(500).json({ erro: "Erro ao fazer login." }); }
});

// MUSCULAÇÃO 
app.post('/musculacao', async (req, res) => {
    try {
        const treinos = await db.all('SELECT Dia, Foco, Exercicios FROM TREINO_MUSCULACAO WHERE Posicao = ?', ['GERAL']);
        const formatado = treinos.map(t => ({ dia: t.Dia, foco: t.Foco, exercicios: JSON.parse(t.Exercicios) }));
        res.json(formatado);
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar musculação" }); }
});

// ALIMENTAÇÃO 
app.post('/alimentacao', async (req, res) => {
    try {
        const dietaRaw = await db.all('SELECT Dia, Refeicao, Itens FROM DIETA WHERE Posicao = ?', ['GERAL']);
        const dietaAgrupada = {};
        
        
        const ordemDias = ["SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO", "DOMINGO"];
        
        
        dietaRaw.sort((a, b) => ordemDias.indexOf(a.Dia) - ordemDias.indexOf(b.Dia));

        dietaRaw.forEach(row => {
            if (!dietaAgrupada[row.Dia]) dietaAgrupada[row.Dia] = [];
            dietaAgrupada[row.Dia].push({ titulo: row.Refeicao, itens: JSON.parse(row.Itens) });
        });
        res.json(dietaAgrupada);
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar dieta" }); }
});

// TREINO ESPECÍFICO 
app.post('/treino-especifico', async (req, res) => {
    
    let { posicao, posicaoOriginal } = req.body; 
    
    if (!posicao || !posicaoOriginal) {
         return res.status(400).json({ erro: "Posição e Posição Original são obrigatórias na requisição." });
    }
    
    
    const posicaoPadraoDB = posicao.toUpperCase().replace(/\s/g, '-');
    
    
    const posicaoDetalhadaDB = posicaoOriginal.toUpperCase().replace(/\s/g, '-');
    
    try {
        
        let info = await db.get('SELECT VideoURL, Fundamentos FROM TREINO_ESPECIFICO_INFO WHERE Posicao = ?', [posicaoDetalhadaDB]);
        
        
        if (!info || (!info.VideoURL && (!info.Fundamentos || JSON.parse(info.Fundamentos).length === 0))) {
             info = await db.get('SELECT VideoURL, Fundamentos FROM TREINO_ESPECIFICO_INFO WHERE Posicao = ?', [posicaoPadraoDB]);
        }
        
        
        const rotinaRaw = await db.all('SELECT Dia, Foco, Exercicios FROM TREINO_ESPECIFICO_SEMANAL WHERE Posicao = ?', [posicaoPadraoDB]);
        const rotinaObjeto = {};
        rotinaRaw.forEach(row => {
            rotinaObjeto[row.Dia] = { foco: row.Foco, exercicios: JSON.parse(row.Exercicios) };
        });

        if (info && rotinaRaw.length > 0) {
            res.json({
                
                titulo: `TREINO ESPECÍFICO - ${posicaoDetalhadaDB}`, 
                videoUrl: info.VideoURL,
                fundamentos: JSON.parse(info.Fundamentos),
                semanal: rotinaObjeto
            });
        } else {
            
            res.status(404).json({ erro: `Treino não encontrado para a posição ${posicaoDetalhadaDB}.` });
        }
    } catch (e) { 
        console.error("Erro no processamento da rota /treino-especifico:", e);
        res.status(500).json({ erro: "Erro interno no servidor ao buscar treino" }); 
    }
});
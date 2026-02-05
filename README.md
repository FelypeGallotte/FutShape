# FutShape ⚽🏋️‍♂️

O **FutShape** é uma plataforma esportiva desenvolvida especificamente para atletas e entusiastas do futebol. O objetivo principal é oferecer suporte físico e nutricional, fornecendo treinos personalizados com base na posição do jogador em campo e orientações dietéticas.

Este projeto foi desenvolvido com fins comerciais e de aprendizado, servindo como uma peça chave em meu portfólio de desenvolvimento Full Stack.

---

## 🚀 Funcionalidades

* **Autenticação de Usuários:** Sistema completo de cadastro e login com criptografia de senhas.
* **Treinos Específicos:** Lógica dinâmica que exibe treinos baseados na posição escolhida (Ex: Atacante, Zagueiro, Meio-campo).
* **Treinos Gerais:** Acesso a rotinas de musculação e condicionamento para todos os usuários.
* **Orientação Nutricional:** Tela de dieta padrão disponibilizada após o login.
* **Conteúdo em Vídeo:** Integração de vídeos do YouTube para demonstração técnica dos exercícios.
* **Banco de Dados Relacional:** Estrutura SQLite modelada do zero para gerenciar usuários, posições e rotinas.

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
* **React.js:** Biblioteca principal para construção da interface SPA.
* **@fontsource/poppins:** Padronização tipográfica para melhor experiência de usuário.

### **Back-end**
* **Node.js & Express:** Servidor robusto e gerenciamento de rotas API.
* **SQLite & SQLite3:** Banco de dados relacional leve para persistência de dados.
* **Bcrypt:** Implementação de hash para segurança de credenciais.
* **CORS:** Controle de acesso HTTP entre diferentes origens.

---

## 📦 Como rodar o projeto

Este projeto é dividido entre **Frontend** e **Backend**. Para executá-lo localmente, siga os passos:

### 1. Pré-requisitos
* Ter o **Node.js** instalado (versão 18+).
* Ter um gerenciador de pacotes como **NPM** ou **Yarn**.

### 2. Configurando o Backend
```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor
npm start
```
### 3. Configurando o Frontend
```bash
# Navegue até o diretório do frontend
cd frontend

# Instale as dependências do projeto
npm install

# Inicie a aplicação em modo de desenvolvimento
npm start
```
A aplicação abrirá automaticamente em `http://localhost:3000`.

## 🗄️ Estrutura e Modelagem do Banco de Dados

A arquitetura de dados foi projetada utilizando **SQLite** para garantir uma persistência leve e eficiente. O modelo relacional baseia-se em uma estratégia de **chave estrangeira (Foreign Key)** que vincula a tabela de `Usuarios` à tabela de `Treinos` por meio do atributo `posicao`.



Tecnicamente, a modelagem foi estruturada para que, no momento do login, o backend execute uma query filtrada (ex: `SELECT * FROM treinos WHERE categoria_posicao = ?`), permitindo que a aplicação entregue um conteúdo personalizado sem a necessidade de múltiplas requisições complexas. Isso garante a integridade referencial dos dados e facilita a escalabilidade para a inclusão de novas categorias de treinos ou dietas específicas.

## ✒️ Autor

Projeto desenvolvido por **Felype Gallotte**.

* **GitHub:** [FelypeGallotte](https://github.com/FelypeGallotte)

---
*Este projeto está sob a licença ISC.*
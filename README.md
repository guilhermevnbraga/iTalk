# iTalk

<div>
    <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/t/guilhermevnbraga/iTalk">
    <img alt="Último commit" src="https://img.shields.io/github/last-commit/guilhermevnbraga/iTalk">
    <img alt="Tamanho do repositório" src="https://img.shields.io/github/repo-size/guilhermevnbraga/iTalk">
    <img alt="Github contributors" src="https://img.shields.io/github/contributors/guilhermevnbraga/iTalk">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/guilhermevnbraga/iTalk">
    <img alt="License" src="https://img.shields.io/github/license/guilhermevnbraga/iTalk">
</div>

## Sobre

**iTalk** é uma rede social fullstack moderna, desenvolvida com **Next.js** no frontend e **Node.js/Express** + **Prisma** no backend. Permite que usuários criem perfis, postem mensagens com anexos, adicionem amigos, conversem em tempo real e compartilhem experiências de forma simples e intuitiva.

## Especificação inicial

O projeto nasceu com o objetivo de criar uma rede social simples, mas robusta, com foco em experiência do usuário e comunicação em tempo real. O backlog evoluiu conforme as necessidades e feedbacks:

- Cadastro e autenticação de usuários
- Criação de perfil com foto e banner
- Postagens com anexos e imagens
- Lista de amigos e busca de usuários
- Chat em tempo real entre amigos
- Feed paginado e responsivo
- Upload de arquivos e imagens
- Status online/offline

## Tecnologias Utilizadas

- **Frontend:** Next.js 14, React 18, TailwindCSS, NextAuth, TypeScript
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, Multer, Bcrypt, Zod
- **Outros:** Vercel (deploy), Docker (opcional), ESLint


## Funcionalidades

### Cadastro e Autenticação

- Cadastro e login de usuários com senha criptografada (Bcrypt)
- Autenticação via NextAuth (JWT)
- Logout e status online/offline

### Perfil de Usuário

- Edição de perfil, foto e banner
- Sobre mim editável
- Visualização de perfis de outros usuários

### Feed e Postagens

- Feed paginado com posts de amigos e do usuário
- Postagens com texto, imagens e anexos
- Localização e humor nas postagens

### Amigos e Busca

- Adição e remoção de amigos
- Busca de usuários por nome
- Listagem de amigos

### Chat em Tempo Real

- Chat privado entre amigos
- Histórico de mensagens
- Status online dos amigos

## Deploy

- **Frontend:** Deploy no Vercel ([https://italk-zeta.vercel.app](https://italk-zeta.vercel.app))
- **Backend:** Deploy no Vercel (serverless) ou servidor Node tradicional

## Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou Docker)
- Yarn ou npm

### Passos para Configuração

1. Clone o repositório:

    ```bash
    git clone https://github.com/guilhermevnbraga/iTalk.git
    cd iTalk
    ```

2. Configure o banco de dados:

    - Crie um banco PostgreSQL local ou use Docker.
    - Copie `.env.example` para `.env` em `italkserver/` e preencha as variáveis.

3. Instale as dependências:

    ```bash
    cd italkserver
    npm install
    npx prisma generate
    npx prisma migrate dev
    cd ../italk
    npm install
    ```

4. Rode o backend:

    ```bash
    cd ../italkserver
    npm run server
    ```

5. Rode o frontend:

    ```bash
    cd ../italk
    npm run dev
    ```

6. Acesse no navegador:

    ```
    http://localhost:3000
    ```

## Rotas Principais

### Backend (`italkserver`)

- `/user` - Cadastro, login, logout, perfil, busca, edição
- `/post` - Criar post, listar posts
- `/friend` - Adicionar, remover, listar amigos
- `/message` - Enviar e buscar mensagens

### Frontend (`italk`)

- `/` - Landing page
- `/account/login` - Login
- `/account/register` - Cadastro
- `/home` - Feed principal
- `/[username]` - Perfil do usuário
- `/[username]/chat` - Chat com usuário
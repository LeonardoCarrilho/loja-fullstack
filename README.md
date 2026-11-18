# 🛒 Loja Full Stack — Cadastro de Produtos

Aplicação **full stack** de cadastro de produtos: front-end em **React** e API REST em **Node.js + Express** com **MySQL**.

## Estrutura
```
server/  API REST (Express) — MySQL, PostgreSQL ou SQLite
api/     Entrada da função serverless na Vercel
web/     Front-end (React + Vite + styled-components + react-toastify)
```

## Funcionalidades
- CRUD de produtos (nome, preço, estoque e telefone do fornecedor)
- API REST: `GET/POST /produtos`, `PUT/DELETE /produtos/:id`
- Consultas parametrizadas (protegidas contra SQL injection) e validação no servidor
- Formulário com `useRef`, edição na mesma tela e mensagens de retorno (toasts)
- Tabela responsiva com styled-components
- Testes da API com `node:test` (`cd server && npm test`), inclusive com Postgres em memória

## Banco de dados
Com `DB_HOST` configurado (veja `server/.env.example`), a API usa **MySQL** e cria a tabela `produtos` automaticamente.
Sem configuração, usa o SQLite embutido do Node.js (arquivo `loja.db`) para rodar sem instalar nada.

## Como rodar
```bash
cd server && npm install && npm start     # http://localhost:8800
cd web && npm install && npm run dev   # http://localhost:5173
```
Requer Node.js 22.5 ou mais recente.

Projeto do módulo 37 do curso Full Stack Turbo (TipsCode).

## Deploy na Vercel
O arquivo `vercel.json` e a pasta `api/` fazem o projeto rodar como função serverless na Vercel. Na Vercel, a API usa PostgreSQL pela variável `DATABASE_URL`.

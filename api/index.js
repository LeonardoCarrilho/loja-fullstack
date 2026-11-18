// Função serverless da Vercel: expõe a API Express em /api/*.
import express from "express";
import { conectar } from "../server/db.js";
import { criarApp } from "../server/app.js";

const db = await conectar();
const app = express();
app.use("/api", criarApp(db));

export default app;

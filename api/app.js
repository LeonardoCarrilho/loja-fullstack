import express from "express";
import cors from "cors";

function validar({ nome, preco, estoque, fone }) {
  const erros = [];
  if (typeof nome !== "string" || nome.trim().length < 2) erros.push("nome deve ter ao menos 2 caracteres");
  if (!Number.isFinite(Number(preco)) || Number(preco) < 0) erros.push("preço inválido");
  if (!Number.isInteger(Number(estoque)) || Number(estoque) < 0) erros.push("estoque deve ser inteiro e não negativo");
  if (typeof fone !== "string" || fone.replace(/\D/g, "").length < 10) erros.push("telefone deve ter DDD");
  if (erros.length) return { erros };
  return { dados: [nome.trim(), Number(Number(preco).toFixed(2)), Number(estoque), fone.trim()] };
}

export function criarApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const rota = (fn) => (req, res, next) => fn(req, res).catch(next);

  app.get("/produtos", rota(async (req, res) => {
    res.json(await db.consultar("SELECT id, nome, preco, estoque, fone FROM produtos ORDER BY id DESC"));
  }));

  app.post("/produtos", rota(async (req, res) => {
    const { erros, dados } = validar(req.body);
    if (erros) return res.status(400).json({ erro: erros.join("; ") });
    const r = await db.consultar("INSERT INTO produtos (nome, preco, estoque, fone) VALUES (?, ?, ?, ?)", dados);
    res.status(201).json({ id: r.insertId, mensagem: "Produto cadastrado." });
  }));

  app.put("/produtos/:id", rota(async (req, res) => {
    const { erros, dados } = validar(req.body);
    if (erros) return res.status(400).json({ erro: erros.join("; ") });
    const r = await db.consultar("UPDATE produtos SET nome = ?, preco = ?, estoque = ?, fone = ? WHERE id = ?", [...dados, Number(req.params.id)]);
    if (!r.affectedRows) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json({ mensagem: "Produto atualizado." });
  }));

  app.delete("/produtos/:id", rota(async (req, res) => {
    const r = await db.consultar("DELETE FROM produtos WHERE id = ?", [Number(req.params.id)]);
    if (!r.affectedRows) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json({ mensagem: "Produto excluído." });
  }));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erro: "Erro interno no servidor." });
  });
  return app;
}

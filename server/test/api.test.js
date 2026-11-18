import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { conectar } from "../db.js";
import { criarApp } from "../app.js";

let db, servidor, base;

before(async () => {
  db = await conectar({}); // SQLite em memória
  await new Promise((ok) => (servidor = criarApp(db).listen(0, ok)));
  base = `http://127.0.0.1:${servidor.address().port}`;
});
after(() => {
  servidor.close();
  db.fechar();
});

const pedir = async (metodo, caminho, corpo) => {
  const r = await fetch(base + caminho, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo && JSON.stringify(corpo),
  });
  return { status: r.status, json: await r.json() };
};

const caneta = { nome: "Caneta", preco: 2.5, estoque: 30, fone: "(11) 99999-0000" };

test("CRUD completo de produtos", async () => {
  const criado = await pedir("POST", "/produtos", caneta);
  assert.equal(criado.status, 201);
  const id = criado.json.id;

  let lista = await pedir("GET", "/produtos");
  assert.deepEqual(lista.json[0], { id, ...caneta });

  const atualizado = await pedir("PUT", `/produtos/${id}`, { ...caneta, preco: 3, estoque: 25 });
  assert.equal(atualizado.status, 200);
  lista = await pedir("GET", "/produtos");
  assert.equal(lista.json[0].preco, 3);
  assert.equal(lista.json[0].estoque, 25);

  assert.equal((await pedir("DELETE", `/produtos/${id}`)).status, 200);
  assert.equal((await pedir("GET", "/produtos")).json.length, 0);
});

test("validação e 404", async () => {
  const r = await pedir("POST", "/produtos", { nome: "x", preco: -1, estoque: 1.5, fone: "123" });
  assert.equal(r.status, 400);
  assert.match(r.json.erro, /nome/);
  assert.equal((await pedir("PUT", "/produtos/999", caneta)).status, 404);
  assert.equal((await pedir("DELETE", "/produtos/999")).status, 404);
});

test("SQL injection não afeta a tabela", async () => {
  await pedir("POST", "/produtos", { ...caneta, nome: "x'); DROP TABLE produtos; --" });
  const lista = await pedir("GET", "/produtos");
  assert.equal(lista.status, 200);
  assert.equal(lista.json[0].nome, "x'); DROP TABLE produtos; --");
});

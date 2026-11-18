import { test } from "node:test";
import assert from "node:assert/strict";
import { newDb } from "pg-mem";
import { adaptadorPostgres, paraPostgres } from "../db.js";

test("converte placeholders para a sintaxe do Postgres", () => {
  assert.equal(paraPostgres("UPDATE t SET a = ?, b = ? WHERE id = ?"), "UPDATE t SET a = $1, b = $2 WHERE id = $3");
});

test("CRUD com o adaptador Postgres (banco em memória)", async () => {
  const { Pool } = newDb().adapters.createPg();
  const pool = new Pool();
  await pool.query(`CREATE TABLE produtos (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL,
    preco NUMERIC(10,2) NOT NULL, estoque INTEGER NOT NULL DEFAULT 0, fone VARCHAR(20) NOT NULL)`);
  const consultar = adaptadorPostgres(pool);

  const r = await consultar("INSERT INTO produtos (nome, preco, estoque, fone) VALUES (?, ?, ?, ?)", ["Caneta", 2.5, 30, "11999990000"]);
  assert.equal(r.insertId, 1);
  assert.equal(r.affectedRows, 1);

  let lista = await consultar("SELECT id, nome, preco, estoque, fone FROM produtos ORDER BY id DESC");
  assert.deepEqual(lista, [{ id: 1, nome: "Caneta", preco: 2.5, estoque: 30, fone: "11999990000" }]);

  assert.equal((await consultar("UPDATE produtos SET estoque = ? WHERE id = ?", [10, 1])).affectedRows, 1);
  assert.equal((await consultar("DELETE FROM produtos WHERE id = ?", [99])).affectedRows, 0);
  assert.equal((await consultar("DELETE FROM produtos WHERE id = ?", [1])).affectedRows, 1);
  lista = await consultar("SELECT id FROM produtos");
  assert.equal(lista.length, 0);
});

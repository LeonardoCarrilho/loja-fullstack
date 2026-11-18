// Conexão com o banco. Todas as opções expõem a mesma função:
//   consultar(sql, parametros) -> linhas (SELECT) ou { insertId, affectedRows }
// - DATABASE_URL/POSTGRES_URL: PostgreSQL (usado na Vercel)
// - DB_HOST: MySQL (como no curso)
// - nenhuma: SQLite embutido do Node (demonstração local)

const TABELA = {
  postgres: `CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, preco NUMERIC(10,2) NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0, fone VARCHAR(20) NOT NULL)`,
  mysql: `CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100) NOT NULL, preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0, fone VARCHAR(20) NOT NULL)`,
  sqlite: `CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, preco REAL NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0, fone TEXT NOT NULL)`,
};

const ehSelect = (sql) => /^\s*select/i.test(sql);

// Converte "?" para "$1, $2..." (sintaxe do PostgreSQL).
export const paraPostgres = (sql) => {
  let n = 0;
  return sql.replace(/\?/g, () => `$${++n}`);
};

export function adaptadorPostgres(pool) {
  return async (sql, params = []) => {
    let texto = paraPostgres(sql);
    const insercao = /^\s*insert/i.test(texto);
    if (insercao) texto += " RETURNING id";
    const r = await pool.query(texto, params);
    if (ehSelect(sql)) return r.rows.map((l) => ({ ...l, preco: Number(l.preco) }));
    return { insertId: insercao ? r.rows[0].id : undefined, affectedRows: r.rowCount };
  };
}

export async function conectar(env = process.env) {
  const urlPostgres = env.DATABASE_URL || env.POSTGRES_URL;
  if (urlPostgres) {
    const { default: pg } = await import("pg");
    // Reaproveita o pool entre execuções da função serverless.
    globalThis.__lojaPool ??= new pg.Pool({ connectionString: urlPostgres, max: 3 });
    const pool = globalThis.__lojaPool;
    await pool.query(TABELA.postgres);
    return { tipo: "postgres", consultar: adaptadorPostgres(pool), fechar: () => pool.end() };
  }

  if (env.DB_HOST) {
    const mysql = await import("mysql2/promise");
    const pool = mysql.createPool({
      host: env.DB_HOST,
      port: Number(env.DB_PORT || 3306),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME || "loja",
      decimalNumbers: true,
    });
    await pool.query(TABELA.mysql);
    return {
      tipo: "mysql",
      consultar: async (sql, params = []) => (await pool.query(sql, params))[0],
      fechar: () => pool.end(),
    };
  }

  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(env.SQLITE_FILE || ":memory:");
  db.exec(TABELA.sqlite);
  return {
    tipo: "sqlite",
    consultar: async (sql, params = []) => {
      const stmt = db.prepare(sql);
      if (ehSelect(sql)) return stmt.all(...params);
      const r = stmt.run(...params);
      return { insertId: Number(r.lastInsertRowid), affectedRows: r.changes };
    },
    fechar: () => db.close(),
  };
}

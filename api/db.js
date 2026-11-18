// Conexão com o banco: MySQL quando DB_HOST está definido; senão SQLite embutido do Node (modo demonstração).
// As duas opções expõem a mesma função: consultar(sql, parametros) -> linhas / resultado.

const CRIAR_TABELA_MYSQL = `CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  fone VARCHAR(20) NOT NULL
)`;

const CRIAR_TABELA_SQLITE = `CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,
  fone TEXT NOT NULL
)`;

export async function conectar(env = process.env) {
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
    await pool.query(CRIAR_TABELA_MYSQL);
    return {
      tipo: "mysql",
      consultar: async (sql, params = []) => (await pool.query(sql, params))[0],
      fechar: () => pool.end(),
    };
  }

  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(env.SQLITE_FILE || ":memory:");
  db.exec(CRIAR_TABELA_SQLITE);
  return {
    tipo: "sqlite",
    consultar: async (sql, params = []) => {
      const stmt = db.prepare(sql);
      if (/^\s*select/i.test(sql)) return stmt.all(...params);
      const r = stmt.run(...params);
      return { insertId: Number(r.lastInsertRowid), affectedRows: r.changes };
    },
    fechar: () => db.close(),
  };
}

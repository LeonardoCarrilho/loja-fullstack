import { conectar } from "./db.js";
import { criarApp } from "./app.js";

const db = await conectar({ SQLITE_FILE: "loja.db", ...process.env });
const porta = process.env.PORT || 8800;
criarApp(db).listen(porta, () => console.log(`API (${db.tipo}) em http://localhost:${porta}`));

const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8800" : "/api");

async function pedir(metodo, caminho, corpo) {
  const r = await fetch(BASE + caminho, {
    method: metodo,
    headers: corpo ? { "Content-Type": "application/json" } : undefined,
    body: corpo && JSON.stringify(corpo),
  });
  const dados = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(dados.erro || "Falha na comunicação com a API.");
  return dados;
}

export const api = {
  listar: () => pedir("GET", "/produtos"),
  criar: (p) => pedir("POST", "/produtos", p),
  atualizar: (id, p) => pedir("PUT", `/produtos/${id}`, p),
  excluir: (id) => pedir("DELETE", `/produtos/${id}`),
};

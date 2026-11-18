import { toast } from "react-toastify";
import { api } from "../api.js";
import { Cartao, Icone, Tabela as T } from "../estilos.js";

const reais = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Tabela({ produtos, editando, aoEditar, aoExcluir }) {
  const excluir = async (p) => {
    if (!window.confirm(`Excluir "${p.nome}"?`)) return;
    try {
      const r = await api.excluir(p.id);
      toast.success(r.mensagem);
      aoExcluir(p.id);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Cartao>
      <T>
        <thead>
          <tr>
            <th>Nome</th><th>Preço</th><th>Estoque</th><th className="opcional">Telefone</th><th />
          </tr>
        </thead>
        <tbody>
          {produtos.length === 0 && (
            <tr><td colSpan={5}>Nenhum produto cadastrado.</td></tr>
          )}
          {produtos.map((p) => (
            <tr key={p.id} className={editando?.id === p.id ? "editando" : ""}>
              <td>{p.nome}</td>
              <td>{reais(p.preco)}</td>
              <td>{p.estoque}</td>
              <td className="opcional">{p.fone}</td>
              <td className="acoes">
                <Icone aria-label={`Editar ${p.nome}`} onClick={() => aoEditar(p)}>✏️</Icone>
                <Icone aria-label={`Excluir ${p.nome}`} onClick={() => excluir(p)}>🗑️</Icone>
              </td>
            </tr>
          ))}
        </tbody>
      </T>
    </Cartao>
  );
}

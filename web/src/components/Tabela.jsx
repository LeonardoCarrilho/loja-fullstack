import { toast } from "react-toastify";
import { api } from "../api.js";
import { Acao, Etiqueta, Vazio, Vitrine } from "../estilos.js";

const reais = (v) => Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const ESTOQUE_BAIXO = 3;

// Mostra os produtos como etiquetas de preço numa vitrine.
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

  if (produtos.length === 0) {
    return <Vazio>Nenhum produto cadastrado. Preencha o formulário acima para cadastrar o primeiro.</Vazio>;
  }

  return (
    <Vitrine aria-label="Produtos cadastrados">
      {produtos.map((p) => (
        <Etiqueta key={p.id} $editando={editando?.id === p.id}>
          <span className="nome">{p.nome}</span>
          <span className="preco"><small>R$</small>{reais(p.preco)}</span>
          <div className="meta">
            <span className={p.estoque <= ESTOQUE_BAIXO ? "baixo" : ""}>
              {p.estoque <= ESTOQUE_BAIXO ? `Restam ${p.estoque}` : `${p.estoque} em estoque`}
            </span>
            <span>{p.fone}</span>
          </div>
          <div className="acoes">
            <Acao type="button" aria-label={`Editar ${p.nome}`} onClick={() => aoEditar(p)}>Editar</Acao>
            <Acao type="button" $perigo aria-label={`Excluir ${p.nome}`} onClick={() => excluir(p)}>Excluir</Acao>
          </div>
        </Etiqueta>
      ))}
    </Vitrine>
  );
}

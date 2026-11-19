import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "./api.js";
import { Cabecalho, Contador, Container, Global, Rodape, Titulo } from "./estilos.js";
import Formulario from "./components/Formulario.jsx";
import Tabela from "./components/Tabela.jsx";

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setProdutos(await api.listar());
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const unidades = produtos.reduce((soma, p) => soma + Number(p.estoque || 0), 0);

  return (
    <>
      <Global />
      <Container>
        <Cabecalho>
          <Titulo>Cadastro<br />de produtos</Titulo>
          <Contador>
            <strong>{produtos.length}</strong> {produtos.length === 1 ? "produto" : "produtos"} · <strong>{unidades}</strong> em estoque
          </Contador>
        </Cabecalho>
        <Formulario
          editando={editando}
          aoSalvar={() => { setEditando(null); carregar(); }}
          aoCancelar={() => setEditando(null)}
        />
        <Tabela
          produtos={produtos}
          editando={editando}
          aoEditar={setEditando}
          aoExcluir={(id) => {
            setProdutos((ps) => ps.filter((p) => p.id !== id));
            if (editando?.id === id) setEditando(null);
          }}
        />
        <Rodape>Feito por Leonardo Carrilho com React, Node.js, Express e PostgreSQL.</Rodape>
      </Container>
      <ToastContainer position="bottom-left" autoClose={2500} />
    </>
  );
}

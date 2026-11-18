import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "./api.js";
import { Container, Global, Titulo } from "./estilos.js";
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

  return (
    <>
      <Global />
      <Container>
        <Titulo>🛒 Loja <span>· Cadastro de Produtos</span></Titulo>
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
        <small style={{ textAlign: "center", color: "#6b7280" }}>Feito por Leonardo Carrilho · React, Node.js, Express e MySQL</small>
      </Container>
      <ToastContainer position="bottom-left" autoClose={2500} />
    </>
  );
}

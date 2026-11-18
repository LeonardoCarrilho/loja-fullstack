import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api.js";
import { Botao, Campo, Cartao, FormArea } from "../estilos.js";

const CAMPOS = ["nome", "preco", "estoque", "fone"];

// Usa useRef para ler os campos (formulário não controlado), como visto no curso.
export default function Formulario({ editando, aoSalvar, aoCancelar }) {
  const ref = useRef(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const form = ref.current;
    CAMPOS.forEach((c) => (form[c].value = editando ? editando[c] : ""));
    if (editando) form.nome.focus();
  }, [editando]);

  const enviar = async (e) => {
    e.preventDefault();
    const form = ref.current;
    if (CAMPOS.some((c) => !form[c].value.trim())) {
      toast.warn("Preencha todos os campos.");
      return;
    }
    const produto = {
      nome: form.nome.value,
      preco: Number(form.preco.value.replace(",", ".")),
      estoque: Number(form.estoque.value),
      fone: form.fone.value,
    };
    setEnviando(true);
    try {
      const r = editando ? await api.atualizar(editando.id, produto) : await api.criar(produto);
      toast.success(r.mensagem);
      form.reset();
      aoSalvar();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Cartao>
      <FormArea ref={ref} onSubmit={enviar}>
        <Campo>Nome<input name="nome" maxLength={100} /></Campo>
        <Campo>Preço (R$)<input name="preco" inputMode="decimal" placeholder="0,00" /></Campo>
        <Campo>Estoque<input name="estoque" type="number" min={0} step={1} /></Campo>
        <Campo>Telefone<input name="fone" inputMode="tel" placeholder="(11) 99999-0000" /></Campo>
        <Botao type="submit" disabled={enviando}>{editando ? "Atualizar" : "Salvar"}</Botao>
        {editando && <Botao type="button" $variante="secundario" onClick={aoCancelar}>Cancelar</Botao>}
      </FormArea>
    </Cartao>
  );
}

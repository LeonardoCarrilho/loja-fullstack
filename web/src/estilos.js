import styled, { createGlobalStyle } from "styled-components";

// Identidade "balcão de loja": etiquetas de preço em amarelo suave sobre papel claro.
const cor = {
  papel: "#fafaf7",
  tinta: "#27272a",
  suave: "#5f5f66",
  fio: "#d9d9de",
  etiqueta: "#fbefb4",
  etiquetaForte: "#f5dc6e",
  alerta: "#c2410c",
};

export const Global = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${cor.papel}; color: ${cor.tinta};
    font-family: "Archivo", system-ui, sans-serif; font-size: 1.0625rem; line-height: 1.5;
  }
  :focus-visible { outline: 3px solid ${cor.tinta}; outline-offset: 2px; }
  .Toastify__toast { font-family: "Archivo", system-ui, sans-serif; border-radius: 4px; }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 16px 56px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

export const Cabecalho = styled.header`
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  border-bottom: 3px solid ${cor.tinta}; padding-bottom: 14px;
`;

export const Titulo = styled.h1`
  font-size: clamp(2.4rem, 7vw, 4.2rem);
  font-weight: 900; line-height: .95; letter-spacing: -.02em;
  font-variation-settings: "wdth" 70;
`;

export const Contador = styled.p`
  color: ${cor.suave}; font-weight: 600;
  strong { color: ${cor.tinta}; font-size: 1.4rem; font-variation-settings: "wdth" 70; }
`;

export const Cartao = styled.section`
  border: 2px solid ${cor.tinta};
  background: #fff;
  padding: 22px;
  h2 { font-size: 1.15rem; font-weight: 800; margin-bottom: 14px; }
`;

export const FormArea = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
`;

export const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 150px;
  font-size: .95rem;
  font-weight: 700;

  input {
    font: inherit; font-weight: 400;
    padding: 11px 12px;
    border: 2px solid ${cor.fio};
    border-radius: 2px;
    background: ${cor.papel};
  }
  input:focus { border-color: ${cor.tinta}; outline: none; background: #fff; }
`;

export const Botao = styled.button`
  font: inherit; font-weight: 800;
  padding: 12px 22px;
  border: 2px solid ${cor.tinta};
  border-radius: 2px;
  cursor: pointer;
  color: ${cor.tinta};
  background: ${({ $variante }) => ($variante === "secundario" ? "transparent" : cor.etiquetaForte)};
  box-shadow: ${({ $variante }) => ($variante === "secundario" ? "none" : `3px 3px 0 ${cor.tinta}`)};
  &:hover { transform: translate(1px, 1px); box-shadow: ${({ $variante }) => ($variante === "secundario" ? "none" : `2px 2px 0 ${cor.tinta}`)}; }
  &:disabled { opacity: .6; cursor: wait; }
`;

// Vitrine: cada produto é uma etiqueta de preço.
export const Vitrine = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 22px;
`;

export const Etiqueta = styled.li`
  position: relative;
  background: ${cor.etiqueta};
  padding: 20px 20px 16px 34px;
  border-radius: 2px 14px 14px 2px;
  clip-path: polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%);
  display: flex; flex-direction: column; gap: 6px;
  outline: ${({ $editando }) => ($editando ? `3px dashed ${cor.tinta}` : "none")};
  outline-offset: -8px;

  &::before {
    content: ""; position: absolute; left: 16px; top: 50%; width: 10px; height: 10px; margin-top: -5px;
    border-radius: 50%; background: ${cor.papel}; box-shadow: inset 0 0 0 2px ${cor.suave};
  }

  .nome { font-weight: 700; font-size: 1.05rem; line-height: 1.25; word-break: break-word; }
  .preco { font-size: 2.2rem; font-weight: 900; line-height: 1; letter-spacing: -.02em; font-variation-settings: "wdth" 70; }
  .preco small { font-size: 1rem; vertical-align: .9em; margin-right: 3px; }
  .meta { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: .9rem; border-top: 2px dotted ${cor.suave}; padding-top: 8px; margin-top: 4px; color: ${cor.suave}; }
  .baixo { color: ${cor.alerta}; font-weight: 800; }
  .acoes { display: flex; gap: 8px; margin-top: 6px; }
`;

export const Acao = styled.button`
  font: inherit; font-size: .9rem; font-weight: 700;
  padding: 5px 12px; border-radius: 2px; cursor: pointer;
  border: 2px solid ${cor.tinta};
  background: ${({ $perigo }) => ($perigo ? "transparent" : cor.tinta)};
  color: ${({ $perigo }) => ($perigo ? cor.tinta : cor.etiqueta)};
  &:hover { background: ${({ $perigo }) => ($perigo ? cor.alerta : cor.tinta)}; color: #fff; border-color: ${({ $perigo }) => ($perigo ? cor.alerta : cor.tinta)}; }
`;

export const Vazio = styled.p`
  border: 2px dashed ${cor.fio}; padding: 32px; text-align: center; color: ${cor.suave};
`;

export const Rodape = styled.footer`
  color: ${cor.suave}; font-size: .9rem; border-top: 2px solid ${cor.fio}; padding-top: 14px;
`;

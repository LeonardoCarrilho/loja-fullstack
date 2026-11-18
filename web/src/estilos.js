import styled, { createGlobalStyle } from "styled-components";

export const Global = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
  body { background: #f2f2f2; color: #1f2937; }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Titulo = styled.h1`
  font-size: 1.8rem;
  span { color: #2c73d2; }
`;

export const Cartao = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0000001a;
  padding: 20px;
`;

export const FormArea = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
`;

export const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 140px;
  font-size: .9rem;
  font-weight: 600;

  input {
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 400;
  }
`;

export const Botao = styled.button`
  padding: 11px 20px;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: #fff;
  background: ${({ $variante }) => ($variante === "secundario" ? "#6b7280" : "#2c73d2")};
  &:disabled { opacity: .6; cursor: wait; }
`;

export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  word-break: break-word;

  th, td { padding: 10px 8px; text-align: left; border-bottom: 1px solid #eef0f3; }
  th { font-size: .85rem; text-transform: uppercase; color: #6b7280; }
  td.acoes { text-align: right; white-space: nowrap; }
  tr.editando { background: #eaf2fd; }

  @media (max-width: 560px) {
    .opcional { display: none; }
  }
`;

export const Icone = styled.button`
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px 8px;
  border-radius: 6px;
  &:hover { background: #f1f5f9; }
`;

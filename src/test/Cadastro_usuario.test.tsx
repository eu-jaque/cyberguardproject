import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Auth from "@/pages/Auth"; // Assumindo que o componente de cadastro/login seja o Auth.tsx

describe("cadastro usuario", () => {
  /*
  objetivo do teste: Verificar se o login esta funcionando
  pre-condição: fazer o cadastro
  pós-condição: entra no perfil do usuario
  criterio de aceitação: O usuario cadastrado com sucesso
  risco: Não cadastrar o usuario
  estrategias: Dinâmico caixa branca
  metodo: step by Step
  tipo: integração
  */

  it("Apos o cadastrado consiga ver a dashboard", async () => {
    // Renderiza a página dentro do router
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    // TODO: Adicionar os passos do teste (Step by Step)
    // Exemplo:
    // 1. Preencher os dados de cadastro (Nome, Email, Senha)
    // 2. Clicar no botão de cadastrar
    // 3. Aguardar a navegação e o componente do Dashboard/Perfil aparecer
    // 
    // expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});

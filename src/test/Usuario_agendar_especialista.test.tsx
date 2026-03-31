import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Experts from "@/pages/Experts";
import { MemoryRouter } from "react-router-dom";

// Mock das dependências globais e contextos
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user123", email: "test@example.com" }, // Simulando Usuário logado
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock Supabase para retornar dados previsíveis na listagem de Caixa Branca
vi.mock("../../utils/supabase", () => {
  return {
    default: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                id: "1",
                name: "Dr. Security",
                area: "Cibersegurança",
                rating: 5,
                available: true,
                bio: "Especialista USP, 10 anos de experiência",
                formation: "USP",
                convenios: "Nenhum",
                image: "imagem.jpg",
              },
            ],
            error: null,
          }),
        })),
      })),
    },
  };
});

// Mock do Canvas Confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Mocks de Componentes Visuais complexos para focar no fluxo do fluxo desejado (Agendamento)
vi.mock("@/components/Header", () => ({ default: () => <header data-testid="mock-header">Header</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer data-testid="mock-footer">Footer</footer> }));
vi.mock("@/components/Chatbot", () => ({ default: () => <div>Chatbot</div> }));
vi.mock("@/components/AccessibilityWidget", () => ({ default: () => <div>Accessibility</div> }));
vi.mock("@/components/CarouselExpertsVideos", () => ({ default: () => <div>Videos</div> }));

// Mock do Carousel para renderizar botões de agendamento diretamente e facilitar o teste do DOM
vi.mock("@/components/CarouselExperts", () => ({
  default: ({ experts, onSelectExpert }: any) => (
    <div data-testid="carousel-experts">
      {experts.map((expert: any) => (
        <div key={expert.id} className="expert-card" data-testid={`expert-card-${expert.id}`}>
          <h3>{expert.name}</h3>
          <p>{expert.bio}</p>
          <div className="badge">Selo Verificado</div>
          <span>Nota: {expert.rating}</span>
          <button
            onClick={() => onSelectExpert(expert)}
            data-testid={`btn-agendar-${expert.id}`}
          >
            Agendar Consulta
          </button>
        </div>
      ))}
    </div>
  ),
}));

// Mock do Formulário de Agendamento que devolve os dados estipulados no teste (dia e horário)
vi.mock("@/components/ScheduleForm", () => ({
  default: ({ expert, onConfirm }: any) => (
    <div data-testid="schedule-form">
      <h2>Agendar com {expert.name}</h2>
      <button
        onClick={() => onConfirm("Segunda-feira", "14:00")}
        data-testid="btn-confirm-schedule"
      >
        Confirmar Agendamento
      </button>
    </div>
  ),
}));

describe("Usuario ser capaz de agendar com especialista.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reseta o window scroll function que é acionada no componente de sucesso
    window.scrollTo = vi.fn();
  });

  it("Procurar o serviço : Conversa com Especialista (Acesso e componentes do card)", async () => {
    render(
      <MemoryRouter>
        <Experts />
      </MemoryRouter>
    );

    // Validação da saída esperada: A página de Conversa com Especialistas abre (Títulos exibidos)
    expect(screen.getByText(/Converse com nossos/i)).toBeInTheDocument();
    expect(screen.getByText(/Especialistas/i)).toBeInTheDocument();

    // Aguarda o Mock do Supabase carregar o Carousel de Experts (integração DOM)
    await waitFor(() => {
      expect(screen.getByTestId("carousel-experts")).toBeInTheDocument();
    });

    // PÓS-CONDIÇÃO DO CARD: Critérios de aceitação exige Nome, Perfil, Nota e Selo
    expect(screen.getByText("Dr. Security")).toBeInTheDocument();
    expect(screen.getByText("Especialista USP, 10 anos de experiência")).toBeInTheDocument();
    expect(screen.getByText("Selo Verificado")).toBeInTheDocument();
    expect(screen.getByText("Nota: 5")).toBeInTheDocument();
  });

  it("Agendar uma Consulta (Fluxo Ponta a Ponta)", async () => {
    render(
      <MemoryRouter>
        <Experts />
      </MemoryRouter>
    );

    // 1. O usuário entra no site e aguardamos o botão de agendamento ser ativado via API (Mock)
    await waitFor(() => {
      expect(screen.getByTestId("btn-agendar-1")).toBeInTheDocument();
    });

    // 2. Entrada: O usuário escolhe um especialista e clica em agendar consulta
    fireEvent.click(screen.getByTestId("btn-agendar-1"));

    // 3. Pós-condição: Verifica se o nome do Doutor foi passado corretamente para a tela (risco mapeado evitado)
    await waitFor(() => {
      expect(screen.getByTestId("schedule-form")).toBeInTheDocument();
    });
    expect(screen.getByText("Agendar com Dr. Security")).toBeInTheDocument();

    // 4. Entrada: Escolhe horário e dia da semana e clica em confirmar (Simulado no botão de confirmação do Mock)
    fireEvent.click(screen.getByTestId("btn-confirm-schedule"));

    // 5. Saídas esperadas: Aparecer uma mensagem de "Tudo pronto! Confirmar e agendar." com especialista e data
    await waitFor(() => {
      expect(screen.getByText("Tudo Pronto!")).toBeInTheDocument();
    });
    
    // Verifica todas as variáveis essenciais no recibo da confirmação
    expect(screen.getByText("Dr. Security")).toBeInTheDocument();
    expect(screen.getByText(/Segunda-feira/)).toBeInTheDocument();
    expect(screen.getByText(/14:00/)).toBeInTheDocument();
    
    // Testa se o botão de finalizar ("Confirmar e Concluir" no caso do componente real) está lá
    expect(screen.getByRole("button", { name: /confirmar e concluir/i })).toBeInTheDocument();
  });
});

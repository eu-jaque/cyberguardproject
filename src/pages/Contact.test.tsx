import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from './Contact';
import { BrowserRouter } from 'react-router-dom';
import supabase from '../../utils/supabase';
import { toast } from 'sonner';

// Mocking dependencies
vi.mock('../../utils/supabase', () => ({
  default: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null })
    }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe("Tela de Contato", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderContact = () => {
        return render(
            <BrowserRouter>
                <Contact />
            </BrowserRouter>
        );
    };

    it("Acessar a página de contato", () => {
        renderContact();
        
        expect(screen.getByText(/Envie uma/i)).toBeInTheDocument();
        expect(screen.getByText(/Mensagem/i, { selector: 'span' })).toBeInTheDocument();
        expect(screen.getByText(/Estamos prontos para/i)).toBeInTheDocument();
    });

    it("Preencher os campos do formulário", () => {
        renderContact();

        const nameInput = screen.getByPlaceholderText("Como prefere ser chamado?");
        const emailInput = screen.getByPlaceholderText("seu@email.com");
        const phoneInput = screen.getByPlaceholderText("(00) 00000-0000");
        const messageInput = screen.getByPlaceholderText("Descreva como podemos ajudar...");

        fireEvent.change(nameInput, { target: { value: 'João Silva' } });
        fireEvent.change(emailInput, { target: { value: 'joao@b.com' } });
        fireEvent.change(phoneInput, { target: { value: '11999999999' } });
        fireEvent.change(messageInput, { target: { value: 'Preciso de ajuda com a segurança do meu site.' } });

        expect(nameInput).toHaveValue('João Silva');
        expect(emailInput).toHaveValue('joao@b.com');
        expect(phoneInput).toHaveValue('(11) 99999-9999'); 
        expect(messageInput).toHaveValue('Preciso de ajuda com a segurança do meu site.');
    });

    it("Enviar mensagem", async () => {
        renderContact();

        const nameInput = screen.getByPlaceholderText("Como prefere ser chamado?");
        const emailInput = screen.getByPlaceholderText("seu@email.com");
        const phoneInput = screen.getByPlaceholderText("(00) 00000-0000");
        const messageInput = screen.getByPlaceholderText("Descreva como podemos ajudar...");

        fireEvent.change(nameInput, { target: { value: 'Maria Souza' } });
        fireEvent.change(emailInput, { target: { value: 'maria@teste.com' } });
        fireEvent.change(phoneInput, { target: { value: '11988887777' } });
        fireEvent.change(messageInput, { target: { value: 'Gostaria de consultoria de segurança.' } });

        // Simulando o submit do form
        const submitButton = screen.getByRole('button', { name: /Enviar Mensagem/i });
        fireEvent.submit(submitButton.closest('form') as HTMLFormElement);

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('tickets');
            expect(toast.success).toHaveBeenCalledWith("Mensagem enviada!", expect.any(Object));
        });
    });
});

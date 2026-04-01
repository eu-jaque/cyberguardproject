import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Contact from '@/pages/Contact';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../../utils/supabase', () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi.fn(() => ({ insert: insertMock }));
    return {
        default: {
            from: fromMock
        }
    };
});

vi.mock('@/components/Header', () => ({
    default: () => <div data-testid="mock-header">Mock Header</div>
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}));

describe('Contact Form', () => {
    const renderComponent = () => {
        render(
            <BrowserRouter>
                <Contact />
            </BrowserRouter>
        );
    };

    it('deve renderizar o formulário com todos os campos principais', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Como prefere ser chamado?')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('(00) 00000-0000')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Descreva como podemos ajudar...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeInTheDocument();
    });

    it('deve apontar erro caso o número de telefone tenha sequência repetida inválida', async () => {
        renderComponent();
        const phoneInput = screen.getByPlaceholderText('(00) 00000-0000');
        
        fireEvent.change(phoneInput, { target: { value: '99999999999' } });
        
        expect(await screen.findByText('Número inválido (sequência repetida)')).toBeInTheDocument();
    });

    it('deve validar formatação aplicada de máscara ao inserir o telefone', async () => {
        renderComponent();
        const phoneInput = screen.getByPlaceholderText('(00) 00000-0000');
        
        fireEvent.change(phoneInput, { target: { value: '11987654321' } });
        
        expect(phoneInput).toHaveValue('(11) 98765-4321');
    });

    it('deve prosseguir com a requisição de submit quando preenchido com dados íntegros', async () => {
        const supabase = await import('../../utils/supabase');
        
        renderComponent();
        
        fireEvent.change(screen.getByPlaceholderText('Como prefere ser chamado?'), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'joao@email.com' } });
        fireEvent.change(screen.getByPlaceholderText('(00) 00000-0000'), { target: { value: '11987654321' } });
        fireEvent.change(screen.getByPlaceholderText('Descreva como podemos ajudar...'), { target: { value: 'Queria tirar algumas dúvidas.' } });
        
        const formObj = screen.getByRole('button', { name: /enviar mensagem/i }).closest('form');
        
        if(formObj) fireEvent.submit(formObj);
        
        await waitFor(() => {
            expect(supabase.default.from).toHaveBeenCalledWith('tickets');
        });
    });
});

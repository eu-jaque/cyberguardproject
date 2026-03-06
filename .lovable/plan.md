

# Plano de Modificacoes - CyberGuard (Grande Atualizacao)

## Resumo

Criar pagina de antivirus, pagina de servicos, pagina de blog, pagina de politicas, pagina de "conversar com especialistas" (mockup visual), redesign do chatbot como "Cyntia", mover acessibilidade para lateral, atualizar cores para dourado premium, atualizar footer, trocar fonte para Montserrat, limpar dropdown de servicos.

---

## 1. Cor dourada premium (referencia: imagens anexadas)

**Arquivo:** `src/index.css`
- Alterar `--primary` para um dourado mais premium/brilhante: `40 76% 55%` (tom dourado mais quente e rico, similar ao das imagens - ~#D4A535)
- Adicionar variavel `--gold-gradient` para efeitos 3D premium nos botoes

**Arquivo:** `tailwind.config.ts` + `src/index.css`
- Adicionar classes utilitarias para gradiente dourado: `bg-gradient-gold` com `linear-gradient(135deg, #D4A535, #F5D77A, #D4A535)`
- Botoes primarios terao efeito de brilho/shimmer sutil

## 2. Fonte Montserrat

**Arquivo:** `src/index.css`
- Trocar importacao de `Inter` para `Montserrat`
- Trocar `font-family` do body para `'Montserrat', sans-serif`

**Arquivo:** `tailwind.config.ts`
- Alterar `font-body` para `['Montserrat', 'sans-serif']`

## 3. Header - Ajustes

**Arquivo:** `src/components/Header.tsx`
- Remover do dropdown de Servicos: "Testa PIX", "Verificador de Link", "Verificador de E-mail"
- Remover do dropdown de Servicos: "Guia de Informacoes", "Teste de Vulnerabilidades", "LGPD", "Vazamento de Dados", "Dicas de Protecao"
- O dropdown de Servicos ficara com: "Verificador de Seguranca", "Conversa com Especialistas", e um link "Servicos" que leva para `/servicos`
- Mover botao de acessibilidade para fora do header: componente flutuante fixo no meio-direito da tela

## 4. Botao de Acessibilidade flutuante

**Arquivo:** Novo componente `src/components/AccessibilityWidget.tsx`
- Botao fixo no meio-direito da tela (`fixed right-0 top-1/2 -translate-y-1/2`)
- Ao clicar, abre painel lateral com as opcoes de acessibilidade
- Mover toda a logica de acessibilidade (highContrast, grayscale, fontSize, highlightLinks) para este componente
- Incluir no `Index.tsx` e demais paginas

## 5. FlipCards - Cores douradas

**Arquivo:** `src/components/FlipCardsSection.tsx`
- Trocar as cores individuais dos cards (vermelho, azul, verde, etc.) para variações do dourado premium: tons de ouro claro, ouro escuro, ouro rosado, bronze, champagne, cobre
- Manter icones diferentes para diferenciacao

## 6. Footer - Atualizacoes

**Arquivo:** `src/components/Footer.tsx`
- Coluna "Sobre" renomear para "Sobre a CyberGuard", link "Sobre a CyberGuard" renomear para "Sobre nos"
- Adicionar link "Blog" abaixo apontando para `/blog`
- Adicionar link "Politicas" abaixo apontando para `/politicas`
- Alterar copyright para: "Copyright (c) 2026 CyberGuard. Todos os direitos reservados."

## 7. Nova pagina: Antivirus (`/antivirus`)

**Arquivo:** `src/pages/Antivirus.tsx`
- Pagina "Defenda seu PC contra ciberameacas com nosso premiado antivirus gratuito CyberGuard"
- Design premium com parallax, secoes informativas sobre recursos do antivirus, cards com funcionalidades, CTA de download
- Header e Footer compartilhados

## 8. Nova pagina: Servicos (`/servicos`)

**Arquivo:** `src/pages/Services.tsx`
- **Secao 1 - Guia de Informacoes:** Cards com glassmorphism (backdrop-filter blur, gradientes sutis, bordas) para "Dicas para Redes Sociais", "Seguranca em Pagamentos", "E-mails Fraudulentos"
- **Secao 2 - Teste de Vulnerabilidade:** Secao explicativa sobre analise de seguranca com design moderno
- **Secao 3 - LGPD e Vazamento de Dados:** Cards com efeitos de flutuacao (`@keyframes animate`), pseudo-elementos com gradiente, glassmorphism. Conteudo sobre LGPD e vazamento de dados

## 9. Nova pagina: Conversar com Especialistas (`/especialistas`)

**Arquivo:** `src/pages/Experts.tsx`
- **Mockup visual** (sem backend real):
  - Lista de especialistas com avatars, areas de expertise, disponibilidade visual
  - Calendario interativo mockup para agendamento
  - Area de chat mockup
  - Galeria de videos de instrucao (placeholders)
  - Design moderno com Tailwind, mobile-friendly
- Adicionar ao dropdown de Servicos no Header

## 10. Nova pagina: Blog (`/blog`)

**Arquivo:** `src/pages/Blog.tsx`
- Pagina placeholder com grid de artigos sobre ciberseguranca
- Cards com titulo, resumo, data, imagem placeholder

## 11. Nova pagina: Politicas (`/politicas`)

**Arquivo:** `src/pages/Policies.tsx`
- Pagina com Termos de Uso, Politica de Privacidade, informacoes sobre LGPD

## 12. Chatbot "Cyntia"

**Arquivo:** `src/components/Chatbot.tsx` (reescrever)
- Renomear de "Tsio" para "Cyntia"
- Nome: "CYNTIA ASSISTENTE" no header, "@CYNTIA" como subtitulo
- Design inspirado no CSS fornecido: fundo semi-transparente com blur, bordas arredondadas, sombra
- Paleta de cores do site (dourado/azul escuro) em vez de verde
- Avatar com icone Shield
- Mensagens do bot com estilo bolha arredondada e timestamp
- Mensagens do usuario com gradiente dourado
- Animacao de "digitando..." com 3 bolinhas pulsantes
- Animacao de entrada (bounce) nas novas mensagens
- Manter logica de palavras-chave expandida
- Fallback: "Para mais informacoes, entre em contato: contato@cyberguard.com.br"
- Botao fixo no canto inferior direito

## 13. Rotas

**Arquivo:** `src/App.tsx`
- Adicionar rotas: `/antivirus`, `/servicos`, `/especialistas`, `/blog`, `/politicas`

## 14. Traducoes

**Arquivo:** `src/contexts/LanguageContext.tsx`
- Adicionar chaves para todas as novas paginas e componentes
- Atualizar chaves do footer, chatbot (Cyntia), servicos
- Remover chaves obsoletas dos servicos removidos do dropdown

---

## Arquivos novos:
- `src/components/AccessibilityWidget.tsx`
- `src/pages/Antivirus.tsx`
- `src/pages/Services.tsx`
- `src/pages/Experts.tsx`
- `src/pages/Blog.tsx`
- `src/pages/Policies.tsx`

## Arquivos modificados:
- `src/index.css` - cor, fonte Montserrat
- `tailwind.config.ts` - fonte body
- `src/components/Header.tsx` - dropdown servicos, remover acessibilidade
- `src/components/Footer.tsx` - sobre, blog, politicas, copyright
- `src/components/FlipCardsSection.tsx` - cores douradas
- `src/components/Chatbot.tsx` - redesign completo como Cyntia
- `src/pages/Index.tsx` - incluir AccessibilityWidget
- `src/App.tsx` - novas rotas
- `src/contexts/LanguageContext.tsx` - novas traducoes
- Todas as paginas existentes - incluir AccessibilityWidget


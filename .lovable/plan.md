

# Plano de Modificacoes - CyberGuard

## Resumo

Este plano cobre: ajustes no Header (texto "Acessibilidade"), Header compartilhado em todas as paginas, logica do botao "Inicio", remocao de 3 secoes (ScamResponse, Quiz, FAQ), cor golden 500, footer com "Sobre", pagina de perfil do usuario logado, e chatbot com IA via Lovable AI.

---

## 1. Header - Ajustes menores

**Arquivo:** `src/components/Header.tsx`
- Adicionar texto "Acessibilidade" ao lado do icone no botao do dropdown de acessibilidade
- Alterar o botao "Inicio" para usar `useNavigate` + `useLocation`: se ja esta em `/`, faz `scrollTo("inicio")`; senao, navega para `/`

## 2. Header em todas as paginas

**Arquivos:** `src/pages/Article.tsx`, `src/pages/Auth.tsx`, `src/pages/Dash.tsx`, `src/pages/NotFound.tsx`
- Substituir navs locais pelo componente `<Header />` importado
- O Header ja usa `<Link>` para login, funciona em qualquer rota

## 3. Remover secoes da Index

**Arquivo:** `src/pages/Index.tsx`
- Remover: `ScamResponseSection`, `QuizSection`, `FAQSection`, `ParallaxSection2`
- Nova ordem: HeroCarousel > StatsSection > ParallaxSection > FlipCardsSection > TestimonialsSection > Footer > Chatbot

**Arquivos a manter mas nao usar:** `ScamResponseSection.tsx`, `QuizSection.tsx`, `FAQSection.tsx`, `ParallaxSection2.tsx` (podem ser removidos)

## 4. Cor golden 500

**Arquivo:** `src/index.css`
- Alterar a variavel `--primary` de `43 70% 49%` para um tom golden 500 mais rico: `43 96% 56%` (equivalente a ~#EAB308, golden-500 do Tailwind)
- Isso afeta automaticamente todos os botoes e textos que usam `text-primary`, `bg-primary`, etc.

## 5. Footer - Coluna "Sobre"

**Arquivo:** `src/components/Footer.tsx`
- Adicionar uma coluna "Sobre" ao lado de "Contato" com um link "Sobre a CyberGuard" apontando para `/sobre`
- Adicionar traducoes no LanguageContext

**Arquivo:** `src/pages/About.tsx` (novo)
- Pagina placeholder "Sobre a CyberGuard" com Header e Footer

**Arquivo:** `src/App.tsx`
- Adicionar rota `/sobre` para a pagina About

## 6. Pagina de Perfil do Usuario (Dash)

**Arquivo:** `src/pages/Dash.tsx` (reescrever completamente)

Pagina rica e interativa com design moderno (fundo escuro, parallax, animacoes) contendo:

- **Cabecalho do perfil:** Nome do usuario, avatar placeholder, dados basicos
- **Abas/Tabs navegaveis:**
  - **Assinaturas:** Cards de apps de ciberseguranca (Norton, Kaspersky, etc.) com status ativo/inativo
  - **Cursos:** Carrossel de cursos organizados por nivel (Iniciante, Intermediario, Avancado, Especialista) com cards interativos
  - **Verificadores:** Ferramentas de verificacao de links, emails, chaves Pix (inputs com feedback visual)
  - **Quiz e Jogos:** Quiz antigolpe (reaproveitado da logica existente) + mini game interativo tipo "Identifique o Golpe" com cards que o usuario classifica como golpe/legitimo
- **Design:** Parallax de fundo, cards com hover/flip, carrosseis, transicoes CSS (opacity, visibility, transition), sem emojis
- **Secoes informativas/educacionais** entre as abas com dicas rapidas

## 7. Chatbot com IA (Lovable AI)

O usuario pediu que o chatbot use NLP real em vez de apenas palavras-chave. Usaremos Lovable AI (gateway) via edge function.

**Passo 1:** Ativar Lovable Cloud (necessario para edge functions)

**Arquivo:** `supabase/functions/chat/index.ts` (nova edge function)
- Recebe mensagens do usuario
- System prompt: "Voce e o Tsio, assistente de seguranca digital do CyberGuard. Responda em linguagem simples sobre golpes, fraudes, phishing, Pix, senhas e protecao digital. Suporte PT/EN/ES."
- Usa streaming SSE via Lovable AI gateway
- Trata erros 429/402

**Arquivo:** `src/components/Chatbot.tsx` (reescrever)
- Nome do bot: "Tsio"
- Header mostra nome e papel
- Streaming token-by-token com SSE
- Mantem historico de conversa na sessao
- Mantém suporte multi-idioma
- Remove base de conhecimento local (knowledgeBase), usa IA real
- Renderiza respostas com markdown (react-markdown)

**Dependencia:** Instalar `react-markdown`

## 8. Traducoes

**Arquivo:** `src/contexts/LanguageContext.tsx`
- Adicionar chaves: `footer.sobre`, `footer.sobre_link`, `about.title`, `about.desc`, `dash.*` (tabs, titulos)
- Remover chaves nao usadas (quiz, faq, scam)

---

## Detalhes Tecnicos

### Arquivos novos:
- `src/pages/About.tsx`
- `supabase/functions/chat/index.ts`

### Arquivos modificados:
- `src/components/Header.tsx` - texto "Acessibilidade", logica do botao Inicio
- `src/pages/Index.tsx` - remover 4 secoes
- `src/pages/Dash.tsx` - reescrever como pagina de perfil completa
- `src/pages/Article.tsx` - usar Header compartilhado
- `src/pages/Auth.tsx` - usar Header compartilhado
- `src/pages/NotFound.tsx` - usar Header compartilhado
- `src/components/Footer.tsx` - coluna Sobre
- `src/components/Chatbot.tsx` - integrar Lovable AI com streaming
- `src/contexts/LanguageContext.tsx` - novas traducoes, remover obsoletas
- `src/index.css` - cor primary para golden 500
- `src/App.tsx` - rota /sobre

### Dependencias:
- `react-markdown` (para renderizar respostas do chatbot)

### Requisito:
- Ativar Lovable Cloud para a edge function do chatbot


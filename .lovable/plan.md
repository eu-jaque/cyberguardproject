# Modificacoes na Landing Page CyberGuard

## Resumo

Atualizacao completa do cabecalho com novos botoes de navegacao, dropdown de servicos, seletor de idiomas, acessibilidade e campo de email. Reorganizacao de secoes, nova secao "Cai em um golpe" com flip cards, novo parallax, e ajustes no rodape e na secao de estatisticas.

---

## 1. Cabecalho (Header) - Reestruturacao completa

### Novos botoes de navegacao (esquerda para direita):

Inicio, Blog, Cursos, Servicos (dropdown), Sobre, Contato

### Dropdown "Servicos"

Menu com fundo solido (nao transparente), z-index alto, contendo:

- Testa PIX
- Verificador de Link
- Verificador de E-mail
- Verificador de Seguranca
- Guia de Informacoes
- Teste de Vulnerabilidades
- LGPD
- Vazamento de Dados
- Dicas de Protecao
- Conversa com Especialistas

### Seletor de Idiomas

Dropdown com opcoes: PT (Portugues), EN (Ingles), ES (Espanhol). Ao trocar o idioma, todos os textos da pagina serao alterados. Sera implementado um contexto React (LanguageContext) com um dicionario de traducoes para os tres idiomas, cobrindo todos os componentes.

### Botao de Acessibilidade

Dropdown com as opcoes:

- Leitor de Tela (ativa aria-live e atributos de acessibilidade)
- Alto Contraste (aplica filtro CSS de alto contraste)
- Tela P&B (aplica filtro CSS grayscale)
- Tamanho da Fonte (permite aumentar/diminuir)
- Modo Escuro/Claro (alterna tema)
- Destacar Links (adiciona sublinhado e borda em todos os links)

### Campo de email + Botao Login/Cadastrar

Input type="email" ao lado do botao, com estilo de sombra interna, borda e fundo customizados. Validacao: ao clicar em Login/Cadastrar sem email valido, exibe toast fixo no canto superior direito (vermelho para erro, verde para sucesso) que desaparece apos 5 segundos.

---

## 2. Secao de Estatisticas (StatsSection)

- Remover a div "Os golpes mais comuns no Brasil" e todo seu conteudo (linhas 73-89 do componente atual)

---

## 3. Nova organizacao das secoes na pagina

Ordem atualizada:

1. Header
2. HeroCarousel
3. StatsSection (sem a div "golpes mais comuns")
4. FlipCardsSection (como identificar golpes)
5. **Novo Parallax** (nova imagem tematica)
6. **Nova secao: "Cai em um golpe. O que fazer?"** - 6 flip cards (3x2) com titulo provocativo
7. QuizSection
8. FAQSection
9. Footer
10. Chatbot

- A secao CoursesSection sera **removida** da pagina.
- O parallax existente sera movido/reaproveitado.

---

## 4. Nova secao "Cai em um golpe. O que fazer?"

Componente `ScamResponseSection.tsx` com:

- Titulo chamativo e frase provocativa
- 6 flip cards (grid 3x2) com dicas de acao pos-golpe:
  1. Bloqueie suas contas bancarias
  2. Registre um Boletim de Ocorrencia
  3. Avise seus contatos
  4. Troque todas as suas senhas
  5. Denuncie nos orgaos competentes
  6. Monitore seus dados

---

## 5. Rodape (Footer)

- Remover coluna "Links Uteis" inteira
- Alterar email para [contato@cyberguard.com.br](mailto:contato@cyberguard.com.br)
- Remover linhas de telefone (181 e 0800)
- Manter apenas o email no contato

---

## Detalhes Tecnicos

### Arquivos a criar:

- `src/contexts/LanguageContext.tsx` - Contexto de idiomas com dicionario PT/EN/ES
- `src/components/ScamResponseSection.tsx` - Nova secao com flip cards
- `src/assets/parallax-bg-2.jpg` - Nova imagem de parallax (gerada)

### Arquivos a modificar:

- `src/components/Header.tsx` - Reestruturacao completa (navegacao, dropdown servicos, idiomas, acessibilidade, email input, toast)
- `src/components/StatsSection.tsx` - Remover div "golpes mais comuns"
- `src/components/Footer.tsx` - Simplificar rodape
- `src/components/ParallaxSection.tsx` - Possivel duplicar para segundo parallax
- `src/pages/Index.tsx` - Reorganizar secoes, remover CoursesSection, adicionar novas
- `src/index.css` - Adicionar estilos para input, toast, acessibilidade
- Todos os componentes com texto - envolver com sistema de traducao

### Sistema de Idiomas:

Um LanguageProvider envolvera o App. Cada componente usara um hook `useLanguage()` que retorna a funcao `t(key)` para buscar o texto traduzido. O dicionario tera todas as strings organizadas por chave.

### Acessibilidade:

Sera implementada via classes CSS aplicadas ao `<body>` ou ao container raiz, controladas por estado no contexto. Exemplo: classe `high-contrast` aplica `filter: contrast(1.5)`, classe `grayscale` aplica `filter: grayscale(1)`, classe `large-font` aumenta o tamanho base.
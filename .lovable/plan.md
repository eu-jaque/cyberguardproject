# Plano de Implementação — 4 Áreas Principais

Este é um projeto massivo com 4 grandes áreas. Devido à complexidade, o plano será executado em etapas sequenciais.

---

## ETAPA 1: Página Auth (Login/Cadastro)

Reestruturar `src/pages/Auth.tsx` com um layout de formulário flip/slide inspirado no exemplo.zip (CSS de card que gira entre login e cadastro), mantendo o `ParallaxAuth` como fundo.

**Arquivos modificados:**

- `src/pages/Auth.tsx` — Layout completo com card animado (frente: login, verso: cadastro), inputs estilizados com ícones Lucide, botões dourados 3D, transição CSS entre modos
- `src/index.css` — Keyframes para flip animation do card auth

**Detalhes técnicos:**

- Card central com `perspective` e `rotateY` para transição entre login/cadastro
- Wrapper com fundo parallax existente, overlay escuro
- Inputs com borda dourada no focus, ícones (Mail, Lock, User) integrados
- Manter lógica Supabase existente (signInWithPassword, signUp)

---

## ETAPA 2: Página Blog — Sistema Completo de Abas

Reescrever `src/pages/Blog.tsx` com 6 abas e comportamentos distintos por tipo de conteúdo.

**Novos arquivos:**

- `src/components/blog/PostCard.tsx` — Card estilo Facebook (avatar, nome, cargo, imagem 16:9, curtidas/comentários)
- `src/components/blog/PostModal.tsx` — Modal de post completo com comentários interativos
- `src/components/blog/ArticlePage.tsx` — Página dedicada de leitura com renderização markdown (react-markdown)
- `src/components/blog/VideoModal.tsx` — Modal de player com thumbnail, info do vídeo, botão play
- `src/components/blog/CyberLabSection.tsx` — Quizzes/desafios com filtro por nível, QuizPlayer funcional (4 alternativas, feedback, barra de progresso, resultado final com troféu)

**Arquivos modificados:**

- `src/pages/Blog.tsx` — 6 abas: Todos, Posts, Artigos, Vídeos, Notícias, CyberLab
- `src/App.tsx` — Rota `/blog/:slug` para artigos/notícias em página dedicada

&nbsp;

**Detalhes técnicos:**

- Aba "Posts": cards com avatar, reactions sociais (Like, Love, Wow, etc.), modal com comentários(o usuário só poderá reagir com os posts se ele tiver logado, se não ele será redirecionado para se cadastrar/logar, depois de cadastrar/logar, ele será redirecionado para a publicação que ele queria interagir
- Aba "Artigos"/"Notícias": sem curtidas, ao clicar navega para `/blog/:slug` com markdown renderizado
- Aba "Vídeos": thumbnail com duração overlay, modal com player simulado
- Aba "CyberLab": dados mock de quizzes, QuizPlayer com estado (pergunta atual, score, explicações)(o usuário só verá a resposta no final e se ele estiver logado, se não ele será redirecionado para se cadastrar/logar, depois de cadastrar/logar, ele será redirecionado para o resultado do quizz que ele terminou
- Framer Motion: fade-up no scroll com `motion.div` e `whileInView`
- Estatísticas do CyberLab: total desafios, participantes, questões

---

## ETAPA 3: Página Cursos + Painel do Aluno

Reestruturar a experiência de cursos em duas partes: vitrine pública e painel autenticado.

**Novos arquivos:**

- `src/pages/StudentDashboard.tsx` — Painel do aluno com sidebar retrátil glassmorphism
- `src/components/courses/CourseSidebar.tsx` — Sidebar fixa com ícones Lucide (Dashboard, Meus Cursos, Certificados, Comunidade), efeito glassmorphism, ícones brilham dourado no hover
- `src/components/courses/CoursePlayer.tsx` — Grade de 6 vídeos por módulo + player + seção de comentários com reactions
- `src/components/courses/ProgressBar.tsx` — Barras de progresso douradas vibrantes
- `src/components/courses/CertificateSection.tsx` — Download de certificado com selo brilhante + confetti (canvas-confetti)
- `src/components/courses/CommunityFeed.tsx` — Feed de dúvidas com status (respondida/pendente)

**Arquivos modificados:**

- `src/pages/Courses.tsx` — CSS alinhado à identidade visual (azul marinho + dourado)
- `src/App.tsx` — Rota `/student-dashboard` protegida

**Detalhes técnicos:**

- Sidebar com `backdrop-blur-xl bg-[#001f3f]/80`, borda lateral dourada no item ativo
- Player de vídeo: grid 2x3 de thumbnails de módulo, ao clicar expande o player
- Progresso salvo em localStorage (ou Supabase se disponível)
- Ao 100%: canvas-confetti dispara, botão vira "Baixar Certificado" com selo dourado animado
- Modal de logout com confirmação e fade-out
- Comentários com reactions sociais (👍❤️🔥💡)

---

## ETAPA 4: Página Especialistas — Perfil com Sidebar

Criar componente de perfil do especialista com sidebar de gestão.

**Novos arquivos:**

- `src/components/experts/ExpertProfile.tsx` — Sidebar premium com glassmorphism (#00215E), itens: Dashboard, Agendamentos, Notificações, Relatórios, Inbox
- Item ativo: fundo azul suave + borda esquerda 3px dourada
- Hover dourado nos ícones e textos, fade-in nos itens

**Funcionalidades:**

- **Agendamentos (Sheet):** Gaveta lateral com tabs Próximos/Histórico. Se role=especialista, aba extra "Minha Agenda" com botões Confirmar/Concluir/Reagendar
- **Badges:** Verde (Confirmado), Vermelho (Cancelado), Cinza (Concluído)
- **Regras 24h:** Botões bloqueados com Tooltip explicativo se faltam <24h
- **Perfil:** Modal para atualizar Nome e Foto, avatar com borda dourada
- **Logout:** Botão "Sair" no rodapé, signOut Supabase, redirect `/auth`

**Arquivos modificados:**

- `src/App.tsx` — Rota para perfil do especialista
- Migração SQL: `CREATE UNIQUE INDEX unique_active_appointment ON appointments (specialist_id, date) WHERE (status != 'Cancelado')`

**Detalhes técnicos:**

- Usar shadcn Sheet para gaveta de agendamentos
- Skeleton loaders para estados de carregamento
- Nunca deletar registros — apenas alterar status para 'Cancelado'
- Validação de conflito de horário no frontend antes de confirmar

---

## Dependências a Instalar

- `framer-motion` — animações de scroll e transições
- `react-markdown` + `remark-gfm` — renderização de markdown nos artigos
- `canvas-confetti` — já instalado (usado em Experts.tsx)

## Ordem de Execução Sugerida

1. Auth (menor escopo, desbloqueia testes das outras áreas)
2. Blog (independente, muitos componentes novos)
3. Cursos + Painel do Aluno (depende de auth funcional)
4. Especialistas Perfil (depende de auth + tabelas Supabase)
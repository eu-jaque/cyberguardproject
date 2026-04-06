

## Plan: Redesign Unificado das Dashboards + Expert Profile

This is a large-scope request with multiple interconnected features. Here's the structured plan:

---

### Overview

Merge the Student Dashboard and User Dashboard into a single unified dashboard (`/dash`) with a tech-circuit background, gradient metric cards, timeline/CRM, edit profile modal with avatar suggestions, and multiple tabs (Blog, Cursos, Certificados, Comunidade, Quiz/Jogos, Verificadores). Also update ExpertProfile with dynamic patient list, same circuit background, and gradient cards. Connect Experts page to ExpertProfile.

---

### Part 1: Unified Dashboard (`/dash` + `/student-dashboard` merged)

**1.1 — Circuit Board Background (shared component)**
- Create `src/components/CircuitBackground.tsx` — a fixed SVG/CSS overlay with:
  - Radial gradient base: `#0a0e17` center to black edges
  - Amber/orange neon circuit lines at low opacity, converging from edges
  - `drop-shadow` glow on line endpoints
  - `bg-fixed` positioning so content scrolls over it

**1.2 — Top Header Bar**
- User avatar + name on the right side (fetched from `profiles` table or auth)
- Sidebar with tabs: Blog, Cursos, Certificados, Comunidade, Quiz & Jogos, Verificadores, Editar Perfil, Sair

**1.3 — Gradient Metric Cards (3 horizontal)**
- Card 1 (cyan→teal): Courses enrolled count + Clock icon
- Card 2 (pink→orange): Completed courses + Lightbulb icon
- Card 3 (navy→green): Certificates count + LineChart icon
- All cards: `bg-slate-900/60 backdrop-blur-md` translucent style

**1.4 — Blog Tab (first/highlighted tab)**
- Show posts liked by the user from the Blog page
- Sub-tabs: "Mais Recentes" / "Mais Antigas"
- Post cards with author avatar, name, date, 3-dot menu
- Action bar: Like, Comment, Share

**1.5 — Cursos Tab**
- List enrolled courses (in-progress + completed)
- Completed courses show: course image, title, final grade, completion date, hours, 100% progress bar
- CTA buttons: View Certificate, Download PDF, Share on LinkedIn
- Click on in-progress course → redirect to course player

**1.6 — Certificados Tab**
- Blue-to-yellow gradient card design
- List completed courses only
- "Emitir Certificado" button per course

**1.7 — Comunidade Tab**
- Interactive feed with messages from students/professors
- Message input field + reactions (thumbs up, heart, fire, lightbulb)
- Comments display with author avatars

**1.8 — Quiz & Jogos Tab**
- Pull quiz data from CyberLab section
- Show started vs completed challenges
- Progress indicators

**1.9 — Verificadores Tab**
- Keep existing link/email/pix checkers from current Dash

---

### Part 2: Edit Profile Modal

- Animated modal (`modal-in` keyframe: opacity 0→1, scale 0.95→1, translateY 20px→0, 0.3s ease-out)
- Overlay: `backdrop-blur-sm bg-black/60`
- Golden-bordered avatar circle with "Alterar foto" text
- Grid of 20 DiceBear avatar suggestions (4 columns, scrollable `max-h-40 overflow-y-auto`)
  - `backgroundColor=facc15` parameter
  - `ring-2 ring-yellow-500` on selected
  - Hover: `drop-shadow(0 0 8px rgba(250,204,21,0.5))` + `scale(1.1)`
- Name input field (dark bg, "NOME" label)
- Save button: `bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold`
- Upload validation: max 2MB, only .jpg/.png/.webp, spinner during upload
- Supabase integration: upload to `avatars` bucket, upsert `profiles` table (full_name, avatar_url)
- Toast notifications on save

---

### Part 3: Expert Profile Updates

**3.1 — Circuit Background**
- Apply same `CircuitBackground` component

**3.2 — Gradient Metric Cards**
- Card 1 (cyan→teal): "Agendamentos para Hoje" + Clock icon
- Card 2 (pink→orange): "Agendamentos para Amanhã" + Lightbulb icon  
- Card 3 (navy→green): "Agendas" + LineChart icon

**3.3 — Activity Timeline/CRM**
- Vertical feed with left connection line + colored category icons
- Top action input: "Discutir no bate-papo" with blue "+" icon
- Highlight card (scheduling): yellow bg, calendar icon, "Confirmado" (green badge) + "Hoje" (blue badge), action buttons (Visualizar, Enviar Mensagem, Cancelar)
- Activity list: white cards with title, client name, time
- Section dividers: "Coisas a fazer" (green), "Hoje" (blue)
- Timeline line hides on mobile

**3.4 — Dynamic Patient List**
- "Próximos Agendamentos" shows real patient cards with actions

**3.5 — Edit Profile**
- Same modal as Part 2, connected to Supabase profiles table

---

### Part 4: Experts → ExpertProfile Connection

- On Experts page, add navigation to `/expert-profile` for authenticated experts
- Check user role to determine if they should see the expert dashboard

---

### Technical Details

**Files to create:**
- `src/components/CircuitBackground.tsx` — shared tech background
- `src/components/EditProfileModal.tsx` — shared edit profile modal
- `src/components/ActivityTimeline.tsx` — timeline/CRM component

**Files to heavily modify:**
- `src/pages/Dash.tsx` — complete rewrite merging StudentDashboard features
- `src/pages/StudentDashboard.tsx` — redirect to `/dash` or remove
- `src/components/experts/ExpertProfile.tsx` — add circuit bg, gradient cards, timeline
- `src/pages/Experts.tsx` — add link to expert-profile for experts
- `src/App.tsx` — update routes (possibly merge `/student-dashboard` into `/dash`)
- `src/index.css` — add `modal-in` keyframe, avatar hover effects

**Database:**
- Uses existing `profiles` table (full_name, avatar_url)
- Uses existing `courses` table
- Supabase `avatars` storage bucket for uploads

**Dependencies:**
- `browser-image-compression` for avatar upload optimization (compress to 200KB, 500px, WebP)


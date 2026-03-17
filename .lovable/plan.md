

---

## 2. Blog Page — Redesign Inspired by iProTech

Completely rewrite `Blog.tsx` with:

- **Hero banner** with title "Blog CyberGuard" and search bar
- **Search functionality**: filter posts by title/keyword in real-time (useState + filter)
- **Content tabs**: "Todos", "Artigos", "Vídeos", "Notícias"
- **Rich post cards** with:
  - Real images (using Unsplash URLs for cybersecurity-themed images)
  - Category badges (Fraude, Tecnologia, Segurança, etc.)
  - Date, reading time, author
  - Excerpt text
  - "Ler mais" link routing to `/artigo/:slug`
- **Video section** with embedded YouTube thumbnails linking to videos about cybersecurity
- **Sidebar** with categories, popular posts, newsletter signup
- Fully functional search bar filtering the displayed posts
- ~12 posts with actual content covering: golpes PIX, phishing, LGPD, ransomware, engenharia social, senhas, Wi-Fi seguro, antivírus, vazamento de dados, WhatsApp, cartão clonado, deepfake

**Files:** `src/pages/Blog.tsx` (rewrite), `src/contexts/LanguageContext.tsx` (new blog keys)

---

## 3. SaibaMais Page — Plans Comparison Table

Below the "Por que escolher o CyberGuard?" section, add a new section matching the uploaded `telanossosplanos.JPG`:

- **Title**: "CONHEÇA NOSSOS PLANOS"
- **Left column**: "ENTENDA OS NOSSOS SERVIÇOS" with expandable/collapsible service items (accordion with chevron arrows):
  - Testes de vulnerabilidades
  - Selo de proteção
  - Dashboard Site Defender
  - Relatórios de vulnerabilidades
  - Consultoria especializada
  - Certificado SSL
  - Monitoramento 24/7
  - Extended detection and response (XDR)
  - Inventário detalhado dos ativos
  - Relatório de ataques e eventos de segurança
  - Relatórios de CVE's
  - Pentest — Testes de Intrusão
  - Hands-on
  - Perícia forense digital
- **Right columns**: 4 plan tiers (Básico R$220, Avançado R$268, Profissional R$640, Enterprise Contate-nos)
- Each row shows check/X/text per plan
- "Profissional" has a "FEATURED" badge
- Clicking a chevron expands a description paragraph for that service
- "ESCOLHER PLANO" buttons at the bottom (gold style), Enterprise gets "CONTATE-NOS"

**File:** `src/pages/SaibaMais.tsx` (add section after "Why CyberGuard"), also fill in the placeholder 4th card

---

## 4. Logo Swap

Copy `user-uploads://logo.png` to `src/assets/cyberguard-logo.png`, replacing the existing logo. This will automatically update Header and Footer since they both import from that path.

**Files:** Copy asset

---

## 5. Translation Updates

Add new keys to `LanguageContext.tsx` for:

- Blog search placeholder, category labels, new post titles/summaries
- SaibaMais plans section labels
- Any missing accent corrections

---

## Technical Summary


| File                               | Action                                               | &nbsp; |
| ---------------------------------- | ---------------------------------------------------- | ------ |
| `src/assets/cyberguard-logo.png`   | Replace with uploaded logo                           | &nbsp; |
| `src/pages/Blog.tsx`               | Full rewrite with search, categories, images, videos | &nbsp; |
| `src/pages/SaibaMais.tsx`          | Add plans comparison table section                   | &nbsp; |
| &nbsp;                             | &nbsp;                                               | &nbsp; |
| `src/contexts/LanguageContext.tsx` | Add new translation keys                             | &nbsp; |

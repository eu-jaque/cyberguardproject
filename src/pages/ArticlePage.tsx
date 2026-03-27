import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

// Mock article content in markdown
const articleContents: Record<string, { title: string; author: string; date: string; readTime: string; image: string; markdown: string }> = {
  "golpes-pix": {
    title: "Os 5 golpes via Pix mais perigosos de 2026",
    author: "Dr. Carlos Silva",
    date: "2026-03-15",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop",
    markdown: `
## Introdução

O Pix revolucionou as transações financeiras no Brasil, mas também abriu portas para novos tipos de golpes. Em 2026, os criminosos estão cada vez mais sofisticados.

## 1. Falso QR Code

Criminosos substituem QR Codes legítimos em estabelecimentos comerciais por códigos que redirecionam o pagamento para contas de laranjas.

**Como se proteger:**
- Sempre confirme o nome do destinatário antes de confirmar
- Desconfie de QR Codes colados sobre outros

## 2. Golpe do Pix Agendado

O golpista envia um comprovante falso de Pix agendado e pressiona a vítima a enviar o produto antes da confirmação.

> "Nunca entregue produtos ou serviços antes de confirmar o recebimento na sua conta." — Banco Central

## 3. Engenharia Social via WhatsApp

Criminosos se passam por funcionários de bancos e convencem vítimas a fazer transferências "de teste".

### Sinais de alerta:
1. Ligações pedindo confirmação de dados
2. Mensagens com senso de urgência
3. Links para "atualizar cadastro"

## 4. Falso Funcionário do Banco

O criminoso liga informando sobre uma "transação suspeita" e pede que a vítima transfira para uma "conta segura".

## 5. Bug do Pix

Prometem que existe uma falha no sistema que permite receber dinheiro em dobro. **Não existe tal bug.**

## Conclusão

A melhor proteção é a **informação**. Compartilhe este artigo com amigos e familiares para que todos fiquem alertas contra esses golpes.

---

*Fontes: Banco Central do Brasil, CERT.br, Polícia Federal*
    `,
  },
  "phishing-2026": {
    title: "Phishing em 2026: como identificar e-mails falsos",
    author: "Ana Rodrigues",
    date: "2026-03-10",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop",
    markdown: `
## O que é Phishing?

Phishing é uma técnica de engenharia social usada por cibercriminosos para **enganar vítimas** e obter informações confidenciais como senhas, números de cartão de crédito e dados bancários.

## Como funciona em 2026?

Com o avanço da **Inteligência Artificial**, os ataques de phishing se tornaram mais sofisticados:

- E-mails com gramática perfeita gerados por IA
- Sites clonados com certificados SSL válidos
- Deepfakes de voz em ligações telefônicas

## Checklist de Verificação

Antes de clicar em qualquer link, verifique:

1. **Remetente**: O endereço de e-mail é legítimo?
2. **URL**: Passe o mouse sobre o link sem clicar
3. **Urgência**: Mensagens criando pânico são suspeitas
4. **Anexos**: Nunca abra anexos inesperados
5. **Erros**: Procure por inconsistências visuais

## Ferramentas de Proteção

| Ferramenta | Tipo | Preço |
|---|---|---|
| CyberGuard Scanner | Verificação de links | Gratuito |
| PhishGuard Pro | Extensão de navegador | R$ 9,90/mês |
| EmailShield | Filtro de e-mail | R$ 14,90/mês |

## Conclusão

A conscientização é sua melhor defesa. **Pense antes de clicar!**
    `,
  },
};

// Default markdown for articles without specific content
const defaultMarkdown = (title: string) => `
## ${title}

Este artigo está sendo preparado por nossa equipe de especialistas em cibersegurança.

Em breve, você encontrará aqui um conteúdo completo e detalhado sobre este tema.

### Enquanto isso...

Confira nossos outros artigos no **Blog CyberGuard** e fique por dentro das últimas novidades em segurança digital.

---

*Equipe CyberGuard*
`;

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = slug ? articleContents[slug] : null;
  const title = article?.title || "Artigo";
  const content = article?.markdown || defaultMarkdown(title);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-24 pb-16">
        {/* Hero */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={article?.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop"}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h1>

          {article && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{article.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{article.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTime}</span>
            </div>
          )}

          {/* Markdown content */}
          <div className="prose prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:text-primary prose-code:bg-secondary/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
}

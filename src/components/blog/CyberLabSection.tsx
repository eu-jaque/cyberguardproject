import { useState } from "react";
import { Shield, Trophy, Clock, Users, Star, CheckCircle, XCircle, ArrowRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Quiz {
  id: string;
  title: string;
  description: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  rating: number;
  completions: number;
  time: string;
  icon: string;
  questions: Question[];
}

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizzes: Quiz[] = [
  {
    id: "phishing-101",
    title: "Identificando Phishing",
    description: "Teste seus conhecimentos sobre como reconhecer e-mails e sites falsos.",
    level: "Iniciante",
    rating: 4.8,
    completions: 1243,
    time: "5 min",
    icon: "🎣",
    questions: [
      { q: "Qual é o principal objetivo de um ataque de phishing?", options: ["Danificar hardware", "Roubar credenciais e dados pessoais", "Melhorar a velocidade da internet", "Atualizar o sistema operacional"], correct: 1, explanation: "Phishing visa roubar informações sensíveis como senhas, dados bancários e informações pessoais." },
      { q: "Qual destes é um sinal de e-mail de phishing?", options: ["Remetente conhecido", "URL com HTTPS", "Erros gramaticais e urgência excessiva", "Assinatura digital válida"], correct: 2, explanation: "E-mails de phishing frequentemente contêm erros de escrita e criam senso de urgência para pressionar a vítima." },
      { q: "O que você deve fazer ao receber um e-mail suspeito?", options: ["Clicar no link para verificar", "Responder pedindo mais informações", "Não clicar em nada e reportar", "Encaminhar para amigos"], correct: 2, explanation: "Nunca clique em links suspeitos. Reporte o e-mail e delete-o." },
      { q: "Qual técnica os atacantes usam para disfarçar URLs?", options: ["Encurtadores de URL e domínios parecidos", "VPN", "Firewall", "Antivírus"], correct: 0, explanation: "Atacantes usam encurtadores e registram domínios similares aos legítimos para enganar vítimas." },
    ],
  },
  {
    id: "senhas-seguras",
    title: "Senhas Inquebráveis",
    description: "Descubra se você sabe criar e gerenciar senhas verdadeiramente seguras.",
    level: "Iniciante",
    rating: 4.6,
    completions: 987,
    time: "4 min",
    icon: "🔐",
    questions: [
      { q: "Qual é o comprimento mínimo recomendado para uma senha segura?", options: ["6 caracteres", "8 caracteres", "12 caracteres ou mais", "4 caracteres"], correct: 2, explanation: "Especialistas recomendam no mínimo 12 caracteres para resistir a ataques de força bruta." },
      { q: "Qual dessas senhas é a mais segura?", options: ["password123", "P@ssw0rd!", "Tr0ux3-M1nh@-C@s@-2024!", "12345678"], correct: 2, explanation: "Senhas longas com mistura de caracteres, números e símbolos são mais seguras." },
      { q: "Com que frequência deve-se trocar senhas?", options: ["Nunca", "Apenas quando houver suspeita de comprometimento", "Todo dia", "A cada hora"], correct: 1, explanation: "A recomendação moderna é trocar apenas quando houver evidência de comprometimento." },
    ],
  },
  {
    id: "ransomware",
    title: "Defesa contra Ransomware",
    description: "Aprenda a identificar e se proteger de ataques de ransomware.",
    level: "Intermediário",
    rating: 4.9,
    completions: 654,
    time: "7 min",
    icon: "💀",
    questions: [
      { q: "O que é ransomware?", options: ["Um antivírus", "Malware que criptografa arquivos e exige resgate", "Um firewall", "Um tipo de backup"], correct: 1, explanation: "Ransomware é um malware que criptografa os dados da vítima e exige pagamento para descriptografar." },
      { q: "Qual a melhor defesa contra ransomware?", options: ["Pagar o resgate rapidamente", "Backups regulares e atualizações de segurança", "Desligar o computador", "Ignorar avisos de segurança"], correct: 1, explanation: "Backups atualizados e patches de segurança são as melhores defesas." },
      { q: "Deve-se pagar o resgate em caso de ataque?", options: ["Sempre", "Nunca, pois não há garantia de recuperação", "Apenas se for barato", "Sim, é a forma mais rápida"], correct: 1, explanation: "Pagar não garante a recuperação dos dados e incentiva mais ataques." },
    ],
  },
  {
    id: "redes-wifi",
    title: "Segurança em Redes Wi-Fi",
    description: "Teste seus conhecimentos sobre proteção de redes sem fio.",
    level: "Intermediário",
    rating: 4.5,
    completions: 432,
    time: "6 min",
    icon: "📡",
    questions: [
      { q: "Qual protocolo de segurança Wi-Fi é o mais seguro atualmente?", options: ["WEP", "WPA", "WPA3", "Nenhum (rede aberta)"], correct: 2, explanation: "WPA3 é o protocolo mais recente e seguro para redes Wi-Fi." },
      { q: "É seguro usar Wi-Fi público para acessar banco online?", options: ["Sim, sempre", "Não, sem VPN é arriscado", "Apenas de madrugada", "Sim, se o site tem HTTPS"], correct: 1, explanation: "Wi-Fi público pode ser interceptado. Use VPN para proteger seus dados." },
      { q: "O que é um ataque Evil Twin?", options: ["Vírus de computador", "Rede Wi-Fi falsa que imita uma legítima", "Um tipo de firewall", "Backup malicioso"], correct: 1, explanation: "Evil Twin é uma rede falsa criada para interceptar dados de usuários desavisados." },
    ],
  },
  {
    id: "engenharia-social-adv",
    title: "Engenharia Social Avançada",
    description: "Cenários reais de ataques de engenharia social para profissionais.",
    level: "Avançado",
    rating: 4.7,
    completions: 289,
    time: "10 min",
    icon: "🧠",
    questions: [
      { q: "O que é pretexting?", options: ["Um tipo de criptografia", "Criar uma história falsa para obter informações", "Um protocolo de rede", "Um software antivírus"], correct: 1, explanation: "Pretexting é quando o atacante cria um cenário fictício para manipular a vítima." },
      { q: "Qual técnica usa urgência para pressionar vítimas?", options: ["Baiting", "Scareware", "Quid pro quo", "Tailgating"], correct: 1, explanation: "Scareware usa medo e urgência para fazer a vítima tomar ações precipitadas." },
      { q: "O que é tailgating em segurança?", options: ["Seguir alguém para entrar em área restrita", "Um tipo de vírus", "Criptografar dados", "Backup de dados"], correct: 0, explanation: "Tailgating é seguir fisicamente uma pessoa autorizada para acessar áreas restritas." },
    ],
  },
  {
    id: "golpes-pix",
    title: "Golpes no Pix",
    description: "Aprenda a identificar e evitar os golpes mais comuns envolvendo Pix.",
    level: "Iniciante",
    rating: 4.9,
    completions: 1876,
    time: "5 min",
    icon: "💸",
    questions: [
      { q: "Qual o golpe mais comum envolvendo Pix?", options: ["Clonagem de cartão", "Falso comprovante de pagamento", "Invasão de servidor bancário", "Roubo de chip"], correct: 1, explanation: "Golpistas enviam comprovantes falsos para simular que realizaram um pagamento." },
      { q: "O que fazer se receber um Pix por engano?", options: ["Gastar imediatamente", "Devolver pelo mesmo Pix e nunca por outro canal", "Ignorar", "Transferir para outra conta"], correct: 1, explanation: "Devolva pelo mecanismo de devolução do banco. Nunca transfira para contas indicadas por desconhecidos." },
      { q: "É seguro cadastrar chave Pix com CPF?", options: ["Não, nunca", "Sim, desde que apenas em bancos oficiais", "Só se for em app de terceiros", "Depende da operadora"], correct: 1, explanation: "Cadastre chaves Pix apenas em instituições financeiras autorizadas pelo Banco Central." },
      { q: "O que é o golpe do Pix agendado?", options: ["Agendar Pix para feriados", "Enviar comprovante de agendamento como se fosse pagamento realizado", "Pix automático mensal", "Transferência programada"], correct: 1, explanation: "Golpistas mostram comprovante de agendamento (que pode ser cancelado) como prova de pagamento." },
    ],
  },
  {
    id: "privacidade-redes",
    title: "Privacidade nas Redes Sociais",
    description: "Teste se você protege suas informações pessoais nas redes sociais.",
    level: "Iniciante",
    rating: 4.4,
    completions: 1102,
    time: "4 min",
    icon: "📱",
    questions: [
      { q: "Qual informação NUNCA deve ser compartilhada publicamente?", options: ["Sua comida favorita", "Endereço residencial e rotina diária", "Filme que assistiu", "Opinião sobre um livro"], correct: 1, explanation: "Informações de localização e rotina podem ser usadas por criminosos para planejar golpes ou roubos." },
      { q: "O que são perfis falsos (catfish)?", options: ["Perfis de humor", "Contas que usam identidades falsas para enganar", "Perfis de empresas", "Contas verificadas"], correct: 1, explanation: "Perfis falsos usam fotos e informações de outras pessoas para ganhar confiança e aplicar golpes." },
      { q: "Qual configuração de privacidade é mais segura?", options: ["Perfil público para todos", "Perfil privado com aprovação de seguidores", "Sem foto de perfil apenas", "Conta sem nome real"], correct: 1, explanation: "Perfil privado limita quem pode ver suas informações e publicações." },
    ],
  },
  {
    id: "compras-online",
    title: "Compras Online Seguras",
    description: "Saiba como comprar pela internet sem cair em fraudes.",
    level: "Intermediário",
    rating: 4.6,
    completions: 765,
    time: "6 min",
    icon: "🛒",
    questions: [
      { q: "Como verificar se um site de compras é confiável?", options: ["Se tem promoções muito baratas", "Verificar CNPJ, reputação no Reclame Aqui e certificado SSL", "Se aparece no Google", "Se tem muitas cores no site"], correct: 1, explanation: "Sempre verifique CNPJ, avaliações de outros clientes e se o site usa HTTPS." },
      { q: "O que é um site clone?", options: ["Site com design responsivo", "Cópia falsa de um site legítimo para roubar dados", "Site com versão mobile", "Loja que vende réplicas"], correct: 1, explanation: "Sites clone copiam a aparência de lojas legítimas para capturar dados de pagamento." },
      { q: "Qual método de pagamento é mais seguro online?", options: ["Transferência bancária direta", "Cartão virtual ou intermediadores de pagamento", "Boleto enviado por e-mail", "Depósito em conta de pessoa física"], correct: 1, explanation: "Cartões virtuais e intermediadores como PayPal oferecem camadas extras de proteção." },
      { q: "Preço muito abaixo do mercado geralmente indica:", options: ["Promoção real", "Possível golpe ou produto falsificado", "Erro do site", "Liquidação sazonal"], correct: 1, explanation: "Desconfie de preços muito abaixo do normal. É uma das principais iscas de sites fraudulentos." },
    ],
  },
  {
    id: "deepfake-ia",
    title: "Deepfakes e IA Maliciosa",
    description: "Entenda os riscos de inteligência artificial usada para fraudes.",
    level: "Avançado",
    rating: 4.8,
    completions: 198,
    time: "8 min",
    icon: "🤖",
    questions: [
      { q: "O que é um deepfake?", options: ["Um tipo de antivírus", "Mídia manipulada por IA para parecer real", "Um formato de arquivo", "Uma rede social"], correct: 1, explanation: "Deepfakes usam IA para criar vídeos, áudios ou imagens falsas extremamente convincentes." },
      { q: "Como identificar um vídeo deepfake?", options: ["Sempre é impossível identificar", "Observar movimentos labiais, piscar irregular e bordas distorcidas", "Pelo tamanho do arquivo", "Pela duração do vídeo"], correct: 1, explanation: "Detalhes como sincronização labial, frequência de piscar e artefatos visuais podem denunciar deepfakes." },
      { q: "Qual golpe usa áudio de IA para imitar vozes?", options: ["Vishing com voice cloning", "Spam de e-mail", "DDoS", "SQL Injection"], correct: 0, explanation: "Criminosos clonam vozes com IA para ligar se passando por familiares ou chefes pedindo transferências." },
      { q: "O que fazer ao receber um vídeo/áudio suspeito de alguém pedindo dinheiro?", options: ["Transferir imediatamente", "Confirmar por outro canal de comunicação", "Ignorar completamente", "Compartilhar nas redes"], correct: 1, explanation: "Sempre confirme por ligação direta ou pessoalmente antes de tomar qualquer ação financeira." },
    ],
  },
];

const levelColors: Record<string, string> = {
  Iniciante: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Intermediário: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Avançado: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function CyberLabSection() {
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const filtered = levelFilter === "Todos" ? quizzes : quizzes.filter(q => q.level === levelFilter);
  const totalCompletions = quizzes.reduce((a, q) => a + q.completions, 0);
  const totalQuestions = quizzes.reduce((a, q) => a + q.questions.length, 0);

  if (activeQuiz) {
    return <QuizPlayer quiz={activeQuiz} onBack={() => setActiveQuiz(null)} />;
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Shield, label: "Desafios", value: quizzes.length },
          { icon: Users, label: "Participantes", value: totalCompletions.toLocaleString() },
          { icon: Star, label: "Questões", value: totalQuestions },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["Todos", "Iniciante", "Intermediário", "Avançado"].map(l => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              levelFilter === l ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{quiz.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground">{quiz.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${levelColors[quiz.level]}`}>{quiz.level}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{quiz.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary" />{quiz.rating}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{quiz.completions}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{quiz.time}</span>
                </div>
                <button
                  onClick={() => setActiveQuiz(quiz)}
                  className="btn-gold-3d text-primary-foreground px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                >
                  Iniciar Desafio <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuizPlayer({ quiz, onBack }: { quiz: Quiz; onBack: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      if (!user) {
        localStorage.setItem("cyberguard_quiz_result", JSON.stringify({ quizId: quiz.id, answers }));
        navigate("/auth");
        return;
      }
      setShowResult(true);
    }
  };

  const score = answers.filter((a, i) => a === quiz.questions[i].correct).length;

  if (showResult) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto text-center py-10 space-y-6">
        <div className="text-6xl mb-4">{pct >= 70 ? "🏆" : pct >= 40 ? "🎯" : "📚"}</div>
        <h2 className="text-2xl font-bold text-foreground">Resultado: {quiz.title}</h2>
        <div className="text-5xl font-black text-gradient-gold">{pct}%</div>
        <p className="text-muted-foreground">{score} de {quiz.questions.length} corretas</p>
        <p className="text-sm text-muted-foreground">
          {pct >= 70 ? "Excelente! Você domina esse assunto!" : pct >= 40 ? "Bom trabalho! Continue estudando." : "Não desista! Revise o conteúdo e tente novamente."}
        </p>

        {/* Review answers */}
        <div className="text-left space-y-3 mt-6">
          {quiz.questions.map((q, i) => (
            <div key={i} className={`p-3 rounded-xl border ${answers[i] === q.correct ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
              <p className="text-xs font-bold text-foreground mb-1">{i + 1}. {q.q}</p>
              <p className="text-xs text-muted-foreground">{q.explanation}</p>
            </div>
          ))}
        </div>

        <button onClick={onBack} className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-lg font-bold text-sm">
          Voltar aos Desafios
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Questão {current + 1} de {quiz.questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

     
      <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">{question.q}</h3>

        <div className="space-y-3">
          {question.options.map((opt, i) => {
            let style = "border-border/50 hover:border-primary/50 bg-transparent";
            if (showFeedback && selectedOption !== null) {
              if (i === question.correct) style = "border-emerald-500 bg-emerald-500/10";
              else if (i === selectedOption) style = "border-red-500 bg-red-500/10";
            } else if (selectedOption === i) {
              style = "border-primary bg-primary/10";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center gap-3 ${style}`}
              >
                <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-foreground">{opt}</span>
                {showFeedback && i === question.correct && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
                {showFeedback && i === selectedOption && i !== question.correct && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
              </button>
            );
          })}
        </div>

       
        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/30">
            <p className="text-xs text-muted-foreground">{question.explanation}</p>
          </motion.div>
        )}

        {showFeedback && (
          <button onClick={handleNext} className="mt-4 btn-gold-3d text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 ml-auto">
            {current < quiz.questions.length - 1 ? "Próxima" : "Ver Resultado"} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </div>
  );
}

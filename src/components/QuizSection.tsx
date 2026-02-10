import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "Você recebe um SMS do seu banco pedindo para clicar em um link e atualizar seus dados. O que fazer?",
    options: [
      "Clicar no link imediatamente para não perder acesso",
      "Ignorar e entrar no app oficial do banco para verificar",
      "Responder o SMS com seus dados",
      "Encaminhar para amigos para alertá-los",
    ],
    correct: 1,
    explanation: "Bancos nunca pedem dados por SMS com links. Sempre acesse o app oficial ou ligue para a central.",
  },
  {
    question: "Qual destes é um sinal claro de golpe de phishing?",
    options: [
      "E-mail com o domínio oficial da empresa",
      "Urgência extrema e ameaças de bloqueio de conta",
      "Comunicação sem erros ortográficos",
      "Link que direciona ao site oficial",
    ],
    correct: 1,
    explanation: "Golpistas criam senso de urgência para que a vítima aja sem pensar. Desconfie de mensagens alarmistas.",
  },
  {
    question: "Um desconhecido no WhatsApp diz ser seu filho e pede um Pix urgente. O que fazer?",
    options: [
      "Fazer o Pix imediatamente, pode ser urgente",
      "Pedir o CPF para confirmar",
      "Ligar para o número antigo do seu filho para confirmar",
      "Bloquear sem verificar",
    ],
    correct: 2,
    explanation: "Sempre confirme por outro meio de contato. Golpistas usam fotos e nomes reais para enganar.",
  },
  {
    question: "Qual é a melhor prática para criar senhas seguras?",
    options: [
      "Usar a mesma senha em todos os sites para não esquecer",
      "Usar o nome do pet + data de nascimento",
      "Criar senhas longas com letras, números e símbolos únicos para cada site",
      "Anotar todas as senhas em um papel na carteira",
    ],
    correct: 2,
    explanation: "Senhas únicas e complexas para cada serviço, preferencialmente com um gerenciador de senhas.",
  },
  {
    question: "Você encontra uma vaga de emprego online que pede pagamento de R$ 50 para 'garantir sua inscrição'. O que fazer?",
    options: [
      "Pagar rapidamente antes que a vaga acabe",
      "Verificar se a empresa existe e nunca pagar para se candidatar",
      "Pedir desconto no valor",
      "Enviar seus documentos primeiro e pagar depois",
    ],
    correct: 1,
    explanation: "Empresas legítimas nunca cobram para processos seletivos. Isso é golpe.",
  },
];

const QuizSection = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === questions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  };

  const getFeedback = () => {
    if (score === 5) return { text: "Excelente! Você é um especialista em segurança digital! 🛡️", color: "text-green-400" };
    if (score >= 3) return { text: "Bom trabalho! Mas ainda há o que aprender. Fique atento! ⚠️", color: "text-primary" };
    return { text: "Cuidado! Você está vulnerável a golpes. Estude mais sobre segurança digital! 🚨", color: "text-destructive" };
  };

  if (finished) {
    const feedback = getFeedback();
    return (
      <section className="py-20 bg-card">
        <div className="max-w-2xl mx-auto px-[2%] text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">Resultado do Quiz</h2>
          <div className="bg-background border border-border rounded-lg p-8">
            <p className="font-display text-5xl font-bold text-primary mb-4">{score}/{questions.length}</p>
            <p className={`text-xl font-semibold mb-6 ${feedback.color}`}>{feedback.text}</p>
            <div className="mb-6 text-left space-y-2 text-foreground/80">
              <p>🔒 Use autenticação de dois fatores sempre que possível</p>
              <p>🔒 Nunca compartilhe senhas ou códigos de verificação</p>
              <p>🔒 Desconfie de ofertas boas demais para ser verdade</p>
              <p>🔒 Verifique a URL antes de inserir dados pessoais</p>
            </div>
            <button onClick={restart} className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Refazer Quiz
            </button>
          </div>
        </div>
      </section>
    );
  }

  const q = questions[currentQ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-2xl mx-auto px-[2%]">
        <h2 className="font-display text-3xl font-bold text-center text-foreground mb-2">
          Quiz <span className="text-primary">AntiGolpe</span>
        </h2>
        <p className="text-center text-muted-foreground mb-8">Teste seus conhecimentos sobre segurança digital</p>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Pergunta {currentQ + 1} de {questions.length}</span>
            <span className="text-sm text-primary font-semibold">Pontos: {score}</span>
          </div>

          <div className="w-full bg-secondary rounded-full h-2 mb-6">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-6">{q.question}</h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let borderClass = "border-border hover:border-primary/50";
              if (answered) {
                if (i === q.correct) borderClass = "border-green-500 bg-green-500/10";
                else if (i === selected) borderClass = "border-destructive bg-destructive/10";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors flex items-center gap-3 ${borderClass} ${!answered ? "cursor-pointer" : "cursor-default"}`}
                >
                  {answered && i === q.correct && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                  {answered && i === selected && i !== q.correct && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  {(!answered || (i !== q.correct && i !== selected)) && <span className="w-5 h-5 rounded-full border-2 border-muted-foreground shrink-0" />}
                  <span className="text-foreground/90">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-foreground/80">💡 {q.explanation}</p>
            </div>
          )}

          {answered && (
            <button onClick={handleNext} className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              {currentQ < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizSection;

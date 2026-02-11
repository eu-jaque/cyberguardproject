import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, BookOpen } from "lucide-react";

const courses = [
  {
    title: "Como identificar e-mails falsos",
    duration: "15 min",
    lessons: 4,
    description: "Aprenda a analisar remetentes, links e sinais de alerta em e-mails suspeitos.",
  },
  {
    title: "Proteja seu WhatsApp",
    duration: "10 min",
    lessons: 3,
    description: "Configure a verificacao em duas etapas e saiba o que fazer se sua conta for clonada.",
  },
  {
    title: "Seguranca no Pix",
    duration: "12 min",
    lessons: 3,
    description: "Dicas para fazer transferencias com seguranca e evitar cair em golpes com Pix.",
  },
  {
    title: "Senhas seguras e gerenciadores",
    duration: "20 min",
    lessons: 5,
    description: "Crie senhas fortes e aprenda a usar gerenciadores de senha para proteger suas contas.",
  },
  {
    title: "Compras online sem risco",
    duration: "15 min",
    lessons: 4,
    description: "Saiba como verificar se um site e confiavel antes de inserir seus dados de pagamento.",
  },
  {
    title: "Redes sociais: privacidade e golpes",
    duration: "18 min",
    lessons: 5,
    description: "Proteja suas informacoes pessoais e aprenda a identificar perfis falsos e golpes.",
  },
];

const CoursesSection = () => {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(courses.length / perPage);

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const next = () => setPage((p) => (p + 1) % totalPages);

  const visible = courses.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-20 bg-card">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Aprenda a se <span className="text-primary">proteger</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Cursos rapidos e gratuitos para voce aprender o basico de seguranca digital em poucos minutos.
        </p>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((course, i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{course.title}</h3>
                <p className="text-foreground/70 text-sm mb-4 leading-relaxed">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessons} aulas</span>
                </div>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors text-sm">
                  Comecar agora
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={prev} className="bg-secondary hover:bg-primary/20 text-foreground p-2 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
            <button onClick={next} className="bg-secondary hover:bg-primary/20 text-foreground p-2 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

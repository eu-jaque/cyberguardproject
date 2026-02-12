import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const correctAnswers = [1, 1, 2, 2, 1];

const QuizSection = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const { t } = useLanguage();

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === correctAnswers[currentQ]) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < 4) {
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

  const getFeedbackKey = () => {
    if (score === 5) return "quiz.feedback_good";
    if (score >= 3) return "quiz.feedback_medium";
    return "quiz.feedback_bad";
  };

  const getFeedbackColor = () => {
    if (score === 5) return "text-green-400";
    if (score >= 3) return "text-primary";
    return "text-destructive";
  };

  if (finished) {
    return (
      <section className="py-20 bg-card">
        <div className="max-w-2xl mx-auto px-[2%] text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">{t("quiz.result_title")}</h2>
          <div className="bg-background border border-border rounded-lg p-8">
            <p className="font-display text-5xl font-bold text-primary mb-4">{score}/5</p>
            <p className={`text-xl font-semibold mb-6 ${getFeedbackColor()}`}>{t(getFeedbackKey())}</p>
            <div className="mb-6 text-left space-y-2 text-foreground/80">
              <p>{t("quiz.tip1")}</p>
              <p>{t("quiz.tip2")}</p>
              <p>{t("quiz.tip3")}</p>
              <p>{t("quiz.tip4")}</p>
            </div>
            <button onClick={restart} className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> {t("quiz.restart")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const options = [0, 1, 2, 3].map((i) => t(`quiz.q${currentQ}.o${i}`));

  return (
    <section className="py-20 bg-card">
      <div className="max-w-2xl mx-auto px-[2%]">
        <h2 className="font-display text-3xl font-bold text-center text-foreground mb-2">
          {t("quiz.title")} <span className="text-primary">{t("quiz.title_highlight")}</span>
        </h2>
        <p className="text-center text-muted-foreground mb-8">{t("quiz.subtitle")}</p>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">{t("quiz.question_of")} {currentQ + 1} {t("quiz.of")} 5</span>
            <span className="text-sm text-primary font-semibold">{t("quiz.points")}: {score}</span>
          </div>

          <div className="w-full bg-secondary rounded-full h-2 mb-6">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / 5) * 100}%` }} />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-6">{t(`quiz.q${currentQ}`)}</h3>

          <div className="space-y-3">
            {options.map((opt, i) => {
              let borderClass = "border-border hover:border-primary/50";
              if (answered) {
                if (i === correctAnswers[currentQ]) borderClass = "border-green-500 bg-green-500/10";
                else if (i === selected) borderClass = "border-destructive bg-destructive/10";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors flex items-center gap-3 ${borderClass} ${!answered ? "cursor-pointer" : "cursor-default"}`}
                >
                  {answered && i === correctAnswers[currentQ] && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                  {answered && i === selected && i !== correctAnswers[currentQ] && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  {(!answered || (i !== correctAnswers[currentQ] && i !== selected)) && <span className="w-5 h-5 rounded-full border-2 border-muted-foreground shrink-0" />}
                  <span className="text-foreground/90">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-foreground/80">{t(`quiz.q${currentQ}.exp`)}</p>
            </div>
          )}

          {answered && (
            <button onClick={handleNext} className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              {currentQ < 4 ? t("quiz.next") : t("quiz.see_result")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizSection;

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Link2, Mail, Key, CheckCircle, XCircle, BookOpen, Gamepad2, CreditCard, ChevronRight, Lock, Wifi, Server, Eye, MonitorSmartphone, ShieldCheck } from "lucide-react";
import parallaxBg from "@/assets/parallax-bg.jpg";

const subscriptions = [
  { name: "Norton 360", icon: Shield, active: true },
  { name: "Kaspersky Premium", icon: Lock, active: false },
  { name: "Bitdefender", icon: ShieldCheck, active: true },
  { name: "NordVPN", icon: Wifi, active: false },
  { name: "1Password", icon: Key, active: true },
  { name: "Malwarebytes", icon: Server, active: false },
];

const courseLevels = [
  {
    level: "beginner",
    courses: [
      { title: "Introducao a Seguranca Digital", lessons: 12, duration: "4h" },
      { title: "Proteja suas Senhas", lessons: 8, duration: "2h" },
      { title: "Navegacao Segura na Internet", lessons: 10, duration: "3h" },
    ],
  },
  {
    level: "intermediate",
    courses: [
      { title: "Engenharia Social e Phishing", lessons: 15, duration: "6h" },
      { title: "Seguranca em Redes Wi-Fi", lessons: 10, duration: "4h" },
      { title: "Protecao de Dados Pessoais", lessons: 12, duration: "5h" },
    ],
  },
  {
    level: "advanced",
    courses: [
      { title: "Analise de Malware", lessons: 20, duration: "10h" },
      { title: "Criptografia Aplicada", lessons: 18, duration: "8h" },
      { title: "Resposta a Incidentes", lessons: 16, duration: "7h" },
    ],
  },
  {
    level: "expert",
    courses: [
      { title: "Pentest e Ethical Hacking", lessons: 25, duration: "15h" },
      { title: "Forense Digital", lessons: 22, duration: "12h" },
      { title: "Arquitetura de Seguranca", lessons: 20, duration: "10h" },
    ],
  },
];

const scamScenarios = [
  { text: "Voce recebeu um e-mail do banco pedindo para atualizar dados clicando em um link", isScam: true },
  { text: "Seu banco ligou para o numero oficial e pediu para comparecer a agencia", isScam: false },
  { text: "Um desconhecido no WhatsApp oferece investimento com retorno de 300% em 24h", isScam: true },
  { text: "Voce recebeu uma notificacao do app oficial do banco sobre uma compra que fez", isScam: false },
  { text: "Alguem pede seu codigo de verificacao por SMS dizendo ser do suporte tecnico", isScam: true },
  { text: "A empresa onde voce trabalha enviou um e-mail interno sobre treinamento de seguranca", isScam: false },
];

export default function Dash() {
  const { t } = useLanguage();
  const [linkInput, setLinkInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pixInput, setPixInput] = useState("");
  const [linkResult, setLinkResult] = useState<"safe" | "danger" | null>(null);
  const [emailResult, setEmailResult] = useState<"safe" | "danger" | null>(null);
  const [pixResult, setPixResult] = useState<"safe" | "danger" | null>(null);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameAnswer, setGameAnswer] = useState<"correct" | "wrong" | null>(null);
  const [selectedCourseLevel, setSelectedCourseLevel] = useState(0);

  const checkLink = () => {
    if (!linkInput.trim()) return;
    const suspicious = linkInput.includes("bit.ly") || linkInput.includes("encurtador") || !linkInput.startsWith("https");
    setLinkResult(suspicious ? "danger" : "safe");
  };

  const checkEmail = () => {
    if (!emailInput.trim()) return;
    const suspicious = emailInput.includes("temp") || emailInput.includes("fake") || !emailInput.includes("@");
    setEmailResult(suspicious ? "danger" : "safe");
  };

  const checkPix = () => {
    if (!pixInput.trim()) return;
    const suspicious = pixInput.length < 5;
    setPixResult(suspicious ? "danger" : "safe");
  };

  const handleGameAnswer = (answeredScam: boolean) => {
    const correct = answeredScam === scamScenarios[gameIndex].isScam;
    if (correct) setGameScore((s) => s + 1);
    setGameAnswer(correct ? "correct" : "wrong");
    setTimeout(() => {
      setGameAnswer(null);
      if (gameIndex < scamScenarios.length - 1) {
        setGameIndex((i) => i + 1);
      }
    }, 1200);
  };

  const levelKeys = ["dash.beginner", "dash.intermediate", "dash.advanced", "dash.expert"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Parallax Hero */}
      <div
        className="parallax-section relative h-[300px] flex items-center justify-center"
        style={{ backgroundImage: `url(${parallaxBg})` }}
      >
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-display">CG</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {t("dash.welcome")}, <span className="text-primary">Usuario</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("dash.member_since")} Jan 2026</p>
        </div>
      </div>

      {/* Tip Bar */}
      <div className="bg-primary/10 border-y border-primary/20 py-3">
        <div className="max-w-[1366px] mx-auto px-[2%] flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-foreground/80">
            <span className="font-bold text-primary">{t("dash.tip_title")}:</span> {t("dash.tip1")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1366px] mx-auto px-[2%] py-10">
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="w-full flex flex-wrap gap-1 h-auto bg-card border border-border p-1">
            <TabsTrigger value="subscriptions" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="w-4 h-4" /> {t("dash.subscriptions")}
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-4 h-4" /> {t("dash.courses")}
            </TabsTrigger>
            <TabsTrigger value="verifiers" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="w-4 h-4" /> {t("dash.verifiers")}
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gamepad2 className="w-4 h-4" /> {t("dash.games")}
            </TabsTrigger>
          </TabsList>

          {/* Subscriptions */}
          <TabsContent value="subscriptions">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {subscriptions.map((sub, i) => (
                <Card key={i} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <sub.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">{sub.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      sub.active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sub.active ? "bg-green-400" : "bg-muted-foreground"}`} />
                      {sub.active ? t("dash.active") : t("dash.inactive")}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses">
            <div className="mt-6">
              <div className="flex gap-2 mb-6 flex-wrap">
                {levelKeys.map((key, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCourseLevel(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCourseLevel === i
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card border border-border text-foreground/70 hover:border-primary/50"
                    }`}
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseLevels[selectedCourseLevel].courses.map((course, i) => (
                  <Card key={i} className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-base mt-3">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{course.lessons} licoes</span>
                        <span>{course.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Verifiers */}
          <TabsContent value="verifiers">
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {/* Link Checker */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{t("dash.check_link")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={linkInput}
                    onChange={(e) => { setLinkInput(e.target.value); setLinkResult(null); }}
                    placeholder={t("dash.enter_link")}
                  />
                  <button onClick={checkLink} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    {t("dash.verify")}
                  </button>
                  {linkResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-md transition-all ${
                      linkResult === "safe" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"
                    }`}>
                      {linkResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {linkResult === "safe" ? t("dash.safe") : t("dash.danger")}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Email Checker */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{t("dash.check_email")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailResult(null); }}
                    placeholder={t("dash.enter_email")}
                  />
                  <button onClick={checkEmail} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    {t("dash.verify")}
                  </button>
                  {emailResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-md transition-all ${
                      emailResult === "safe" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"
                    }`}>
                      {emailResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {emailResult === "safe" ? t("dash.safe") : t("dash.danger")}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pix Checker */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{t("dash.check_pix")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={pixInput}
                    onChange={(e) => { setPixInput(e.target.value); setPixResult(null); }}
                    placeholder={t("dash.enter_pix")}
                  />
                  <button onClick={checkPix} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    {t("dash.verify")}
                  </button>
                  {pixResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-md transition-all ${
                      pixResult === "safe" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"
                    }`}>
                      {pixResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {pixResult === "safe" ? t("dash.safe") : t("dash.danger")}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Games */}
          <TabsContent value="games">
            <div className="mt-6">
              {/* Info bar */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-foreground/80">
                  <span className="font-bold text-primary">{t("dash.tip_title")}:</span> {t("dash.tip2")}
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-primary" /> {t("dash.scam_game")}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{t("dash.scam_game_desc")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t("dash.score")}</p>
                      <p className="text-2xl font-display font-bold text-primary">{gameScore}/{scamScenarios.length}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-secondary/50 rounded-lg p-6 min-h-[100px] flex items-center justify-center text-center">
                      <p className="text-foreground text-lg">{scamScenarios[gameIndex].text}</p>
                    </div>

                    {gameAnswer && (
                      <div className={`text-center text-lg font-bold p-3 rounded-lg transition-all ${
                        gameAnswer === "correct" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"
                      }`}>
                        {gameAnswer === "correct" ? t("dash.correct") : t("dash.wrong")}
                      </div>
                    )}

                    {!gameAnswer && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleGameAnswer(true)}
                          className="flex-1 bg-destructive/10 border border-destructive/30 text-destructive py-3 rounded-lg font-medium hover:bg-destructive/20 transition-colors"
                        >
                          {t("dash.scam")}
                        </button>
                        <button
                          onClick={() => handleGameAnswer(false)}
                          className="flex-1 bg-green-500/10 border border-green-500/30 text-green-400 py-3 rounded-lg font-medium hover:bg-green-500/20 transition-colors"
                        >
                          {t("dash.legit")}
                        </button>
                      </div>
                    )}

                    <div className="flex justify-center gap-1.5 pt-2">
                      {scamScenarios.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                          i === gameIndex ? "bg-primary" : i < gameIndex ? "bg-primary/40" : "bg-muted"
                        }`} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

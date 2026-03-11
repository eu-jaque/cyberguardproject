import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Check, Monitor, Smartphone, Laptop, Shield, ChevronRight } from "lucide-react";
import logo from "@/assets/cyberguard-logo.png";

type Step = "welcome" | "plans" | "account" | "confirmation";

interface PlanType {
  id: string;
  name: string;
  price: string;
  level: string;
  devices: string;
  features: string[];
  popular?: boolean;
}

const Assinaturas = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedPlan, setSelectedPlan] = useState<string>("padrao");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const plans: PlanType[] = [
    {
      id: "basico",
      name: t("sub.plan_basic"),
      price: "R$ 19,90",
      level: t("sub.protection_essential"),
      devices: t("sub.device_1"),
      features: [
        t("sub.feat_realtime"),
        t("sub.feat_malware"),
        t("sub.feat_updates"),
      ],
    },
    {
      id: "padrao",
      name: t("sub.plan_standard"),
      price: "R$ 39,90",
      level: t("sub.protection_advanced"),
      devices: t("sub.device_3"),
      features: [
        t("sub.feat_realtime"),
        t("sub.feat_malware"),
        t("sub.feat_updates"),
        t("sub.feat_firewall"),
        t("sub.feat_antiphishing"),
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 69,90",
      level: t("sub.protection_total"),
      devices: t("sub.device_unlimited"),
      features: [
        t("sub.feat_realtime"),
        t("sub.feat_malware"),
        t("sub.feat_updates"),
        t("sub.feat_firewall"),
        t("sub.feat_antiphishing"),
        t("sub.feat_vpn"),
        t("sub.feat_vault"),
      ],
    },
  ];

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 h-[80px] flex items-center bg-background/95 backdrop-blur-md border-b border-border">
        <div className="w-full max-w-[1366px] mx-auto px-[2%] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CyberGuard" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl font-bold text-foreground">
              Cyber<span className="text-gradient-gold">Guard</span>
            </span>
          </Link>
          <Link to="/auth" className="btn-gold-3d text-primary-foreground px-5 py-1.5 rounded-[5px] text-sm font-semibold">
            {t("nav.login")}
          </Link>
        </div>
      </header>

      <main className="pt-[120px] pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {["1", "2", "3"].map((s, i) => {
              const steps: Step[] = ["welcome", "plans", "account"];
              const isActive = steps.indexOf(step) >= i || step === "confirmation";
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    isActive ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                  }`}>
                    {isActive && steps.indexOf(step) > i ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {i < 2 && <div className={`w-12 h-0.5 ${isActive ? "bg-primary" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>

          {/* Step: Welcome */}
          {step === "welcome" && (
            <div className="text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t("sub.choose_plan")}
              </h1>
              <div className="space-y-4 max-w-md mx-auto text-left">
                {[t("sub.benefit_1"), t("sub.benefit_2"), t("sub.benefit_3")].map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground/80">{b}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("plans")}
                className="btn-gold-3d text-primary-foreground px-10 py-3 rounded-[5px] font-semibold text-lg inline-flex items-center gap-2"
              >
                {t("sub.next")} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step: Plans */}
          {step === "plans" && (
            <div className="space-y-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground">
                {t("sub.select_plan")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative bg-card border-2 rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedPlan === plan.id ? "border-primary shadow-lg shadow-primary/20" : "border-border"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        {t("sub.popular")}
                      </div>
                    )}
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="font-display text-3xl font-bold text-gradient-gold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/{t("sub.month")}</span>
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">{plan.level}</p>
                    <p className="text-sm text-muted-foreground mb-4">{plan.devices}</p>
                    <ul className="space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep("welcome")}
                  className="px-6 py-3 rounded-[5px] border border-border text-foreground/80 font-semibold hover:bg-secondary transition-colors"
                >
                  {t("sub.back")}
                </button>
                <button
                  onClick={() => setStep("account")}
                  className="btn-gold-3d text-primary-foreground px-10 py-3 rounded-[5px] font-semibold inline-flex items-center gap-2"
                >
                  {t("sub.next")} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Account */}
          {step === "account" && (
            <div className="space-y-8 max-w-md mx-auto">
              <div className="flex justify-center gap-6 text-muted-foreground">
                <Monitor className="w-10 h-10" />
                <Laptop className="w-10 h-10" />
                <Smartphone className="w-10 h-10" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground">
                {t("sub.finish_setup")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">{t("sub.password")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep("plans")}
                  className="px-6 py-3 rounded-[5px] border border-border text-foreground/80 font-semibold hover:bg-secondary transition-colors"
                >
                  {t("sub.back")}
                </button>
                <button
                  onClick={() => setStep("confirmation")}
                  className="btn-gold-3d text-primary-foreground px-10 py-3 rounded-[5px] font-semibold inline-flex items-center gap-2"
                >
                  {t("sub.next")} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Confirmation */}
          {step === "confirmation" && selectedPlanData && (
            <div className="space-y-8 max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {t("sub.confirm_title")}
              </h2>
              <div className="bg-card border border-border rounded-xl p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("sub.plan_label")}</span>
                  <span className="text-foreground font-semibold">{selectedPlanData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("sub.price_label")}</span>
                  <span className="text-gradient-gold font-bold">{selectedPlanData.price}/{t("sub.month")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("sub.devices_label")}</span>
                  <span className="text-foreground">{selectedPlanData.devices}</span>
                </div>
                {email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">E-mail</span>
                    <span className="text-foreground">{email}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep("account")}
                  className="px-6 py-3 rounded-[5px] border border-border text-foreground/80 font-semibold hover:bg-secondary transition-colors"
                >
                  {t("sub.back")}
                </button>
                <button className="btn-gold-3d text-primary-foreground px-10 py-3 rounded-[5px] font-semibold text-lg">
                  {t("sub.subscribe")}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assinaturas;

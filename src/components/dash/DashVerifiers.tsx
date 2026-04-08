import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Mail, Key, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";

export default function DashVerifiers() {
  const { t } = useLanguage();
  const [linkInput, setLinkInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pixInput, setPixInput] = useState("");
  const [linkResult, setLinkResult] = useState<"safe" | "danger" | null>(null);
  const [emailResult, setEmailResult] = useState<"safe" | "danger" | null>(null);
  const [pixResult, setPixResult] = useState<"safe" | "danger" | null>(null);

  const checkLink = () => { if (!linkInput.trim()) return; setLinkResult(linkInput.includes("bit.ly") || !linkInput.startsWith("https") ? "danger" : "safe"); };
  const checkEmail = () => { if (!emailInput.trim()) return; setEmailResult(emailInput.includes("temp") || !emailInput.includes("@") ? "danger" : "safe"); };
  const checkPix = () => { if (!pixInput.trim()) return; setPixResult(pixInput.length < 5 ? "danger" : "safe"); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{t("dash.verifiers")}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Link */}
        <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2"><Link2 className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{t("dash.check_link")}</span></div>
          <Input value={linkInput} onChange={e => { setLinkInput(e.target.value); setLinkResult(null); }} placeholder={t("dash.enter_link")} />
          <button onClick={checkLink} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">{t("dash.verify")}</button>
          {linkResult && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${linkResult === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
              {linkResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {linkResult === "safe" ? "Seguro" : t("dash.danger")}
            </div>
          )}
        </div>
        {/* Email */}
        <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{t("dash.check_email")}</span></div>
          <Input value={emailInput} onChange={e => { setEmailInput(e.target.value); setEmailResult(null); }} placeholder={t("dash.enter_email")} />
          <button onClick={checkEmail} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">{t("dash.verify")}</button>
          {emailResult && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${emailResult === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
              {emailResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {emailResult === "safe" ? "Seguro" : t("dash.danger")}
            </div>
          )}
        </div>
        {/* Pix */}
        <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{t("dash.check_pix")}</span></div>
          <Input value={pixInput} onChange={e => { setPixInput(e.target.value); setPixResult(null); }} placeholder={t("dash.enter_pix")} />
          <button onClick={checkPix} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">{t("dash.verify")}</button>
          {pixResult && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${pixResult === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
              {pixResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {pixResult === "safe" ? "Seguro" : t("dash.danger")}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

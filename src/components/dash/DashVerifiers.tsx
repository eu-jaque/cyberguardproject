import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link2, Mail, Key, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import supabase from "../../../utils/supabase";

type Result = "safe" | "danger" | null;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isShortenerHost(hostname: string) {
  return [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "cutt.ly",
    "rebrand.ly",
    "goo.su",
  ].some((d) => hostname === d || hostname.endsWith(`.${d}`));
}

function validateLink(value: string): Result {
  const input = value.trim();
  if (!input) return null;

  if (!isValidUrl(input)) return "danger";

  const url = new URL(input);
  if (isShortenerHost(url.hostname)) return "danger";

  return "safe";
}

function validateEmail(value: string): Result {
  const input = value.trim();
  if (!input) return null;

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(input)) return "danger";

  const disposableDomains = [
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "mailinator.com",
  ];

  const domain = input.split("@")[1]?.toLowerCase();
  if (!domain || disposableDomains.includes(domain)) return "danger";

  return "safe";
}

export default function DashVerifiers() {
  const { t } = useLanguage();

  const [linkInput, setLinkInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [linkResult, setLinkResult] = useState<Result>(null);
  const [emailResult, setEmailResult] = useState<Result>(null);
  const [linkHistory, setLinkHistory] = useState<any[]>([]);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Link History
    const { data: lData } = await supabase
      .from('validation_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'link')
      .order('created_at', { ascending: false })
      .limit(5);

    if (lData) setLinkHistory(lData);

    // Email History
    const { data: eData } = await supabase
      .from('validation_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'email')
      .order('created_at', { ascending: false })
      .limit(5);

    if (eData) setEmailHistory(eData);
  };

  const saveToHistory = async (type: 'link' | 'email', input: string, result: Result) => {
    if (!result) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('validation_history').insert({
      user_id: user.id,
      type,
      input,
      result
    });

    fetchHistory();
  };

  const checkLink = async () => {
    const res = validateLink(linkInput);
    setLinkResult(res);
    if (res) await saveToHistory('link', linkInput, res);
  };

  const checkEmail = async () => {
    const res = validateEmail(emailInput);
    setEmailResult(res);
    if (res) await saveToHistory('email', emailInput, res);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-foreground">{t("dash.verifiers")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              {t("dash.check_link")}
            </span>
          </div>

          <Input
            value={linkInput}
            onChange={(e) => {
              setLinkInput(e.target.value);
              setLinkResult(null);
            }}
            placeholder={t("dash.enter_link")}
          />

          <button
            onClick={checkLink}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("dash.verify")}
          </button>

          {linkResult && (
            <div
              className={`flex items-center gap-2 text-sm p-2 rounded-md ${linkResult === "safe"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-destructive/10 text-destructive"
                }`}
            >
              {linkResult === "safe" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {linkResult === "safe" ? "Seguro" : t("dash.danger")}
            </div>
          )}
        </div>

        <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              {t("dash.check_email")}
            </span>
          </div>

          <Input
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setEmailResult(null);
            }}
            placeholder={t("dash.enter_email")}
          />

          <button
            onClick={checkEmail}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("dash.verify")}
          </button>

          {emailResult && (
            <div
              className={`flex items-center gap-2 text-sm p-2 rounded-md ${emailResult === "safe"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-destructive/10 text-destructive"
                }`}
            >
              {emailResult === "safe" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {emailResult === "safe" ? "Seguro" : t("dash.danger")}
            </div>
          )}
        </div>
      </div>

      {/* Histórico Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Histórico Links */}
        <div className="bg-card/40 backdrop-blur-md border border-border/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/10 bg-primary/5 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-black italic uppercase tracking-widest text-gradient-gold">Histórico Links</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-white/5">
                {linkHistory.length > 0 ? (
                  linkHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="truncate text-[10px] font-medium text-white/80 max-w-[150px]">{item.input}</div>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase italic tracking-widest ${
                          item.result === "safe" ? "text-emerald-400" : "text-destructive"
                        }`}>
                          {item.result === "safe" ? "Limpo" : "Risco"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="p-8 text-center text-[10px] opacity-30 font-bold uppercase italic">Vazio</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histórico Emails */}
        <div className="bg-card/40 backdrop-blur-md border border-border/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/10 bg-primary/5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-black italic uppercase tracking-widest text-gradient-gold">Histórico Emails</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-white/5">
                {emailHistory.length > 0 ? (
                  emailHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="truncate text-[10px] font-medium text-white/80 max-w-[150px]">{item.input}</div>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase italic tracking-widest ${
                          item.result === "safe" ? "text-emerald-400" : "text-destructive"
                        }`}>
                          {item.result === "safe" ? "Limpo" : "Risco"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="p-8 text-center text-[10px] opacity-30 font-bold uppercase italic">Vazio</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
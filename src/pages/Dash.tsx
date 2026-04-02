import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Link2, Mail, Key, CheckCircle, XCircle, BookOpen, Gamepad2, CreditCard, ChevronRight, Lock, Wifi, Server, Eye, MonitorSmartphone, ShieldCheck } from "lucide-react";
import  supabase  from '../../utils/supabase';




export default function Dash() {
  const { t } = useLanguage();
  const [linkInput, setLinkInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pixInput, setPixInput] = useState("");
  const [linkResult, setLinkResult] = useState<"safe" | "danger" | null>(null);
  const [emailResult, setEmailResult] = useState<"safe" | "danger" | null>(null);
  const [pixResult, setPixResult] = useState<"safe" | "danger" | null>(null);
  

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



  

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/*Hero da DashBoard User*/}
      <div className="relative pt-[80px]">
        <Tabs>
          <TabsList className="w-full flex flex-wrap gap-1 h-auto bg-card border border-border p-1">

            {/* Profile content */}
            <Tabs className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Avatar with border glow */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-primary/40 bg-card flex items-center justify-center shadow-lg" style={{
                  boxShadow: '0 0 30px rgba(212, 165, 53, 0.2)'
                }}>
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
              </div>
              </div>
            </Tabs>

            {/* Name */}
            <Tabs className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                nome
              </h1>
            </Tabs>

            

            

          </TabsList>
          
        </Tabs>


        
        {/* Profile Hero*/}
        
        <div>

          {/* Background with matrix-like effect */}
          <div className="relative h-[320px] overflow-hidden bg-gradient-to-b from-background via-card to-background">
            
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `linear-gradient(rgba(212, 165, 53, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 165, 53, 0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
            
      

            {/* Profile content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Avatar with border glow */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-primary/40 bg-card flex items-center justify-center shadow-lg" style={{
                  boxShadow: '0 0 30px rgba(212, 165, 53, 0.2)'
                }}>
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
              </div>

            </div>
          </div>
        </div>

      </div>


      
      
      
      {/*Conteúdo Principal DashBoard User*/}
      <div className="max-w-[1366px] mx-auto px-[2%] py-10">
        <Tabs defaultValue="subscriptions" className="w-full">

          <TabsList className="w-full flex flex-wrap gap-1 h-auto bg-card border border-border p-1">
          

            <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-4 h-4" /> {t("dash.courses")}
            </TabsTrigger>

            <TabsTrigger value="verifiers" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="w-4 h-4" /> {t("dash.verifiers")}
            </TabsTrigger>

            <TabsTrigger value="games" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gamepad2 className="w-4 h-4" /> {t("dash.games")}
            </TabsTrigger>

            <TabsTrigger value="liked" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="w-4 h-4" /> {t("dash.liked")}
            </TabsTrigger>

          </TabsList>

          

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
        </Tabs>
      </div>

      <Footer />
      <AccessibilityWidget />
    </div>
  );
}

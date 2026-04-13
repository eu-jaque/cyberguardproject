import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateGeneratorProps {
  studentName: string;
  courseName: string;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ studentName, courseName }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [editableName, setEditableName] = React.useState(studentName);

  React.useEffect(() => {
    setEditableName(studentName);
  }, [studentName]);

  console.log("CertificateGenerator rendered for:", editableName);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    toast.info("Gerando certificado...");
    
    // Show template for capture
    certificateRef.current.style.display = 'block';

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#050a14',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [850, 600],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 850, 600);
      pdf.save(`Certificado_CyberGuard_${editableName}.pdf`);
      toast.success("Certificado baixado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      toast.error("Erro ao gerar certificado.");
    } finally {
      // Hide template again
      certificateRef.current.style.display = 'none';
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-left space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome no Certificado</label>
        <Input 
          value={editableName} 
          onChange={(e) => setEditableName(e.target.value)}
          placeholder="Seu nome completo"
          className="bg-secondary/20 border-border/50 focus:border-primary/50 text-foreground"
        />
      </div>
      <Button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full h-auto py-4 px-6 text-base md:text-lg font-bold btn-gold-3d text-primary-foreground rounded-xl flex items-center justify-center gap-2 leading-tight break-words"
      >
        {isGenerating ? (
          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
        ) : (
          <Award className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="text-center">{isGenerating ? "GERANDO..." : "GERAR CERTIFICADO"}</span>
      </Button>

      {/* TEMPLATE DO CERTIFICADO (Escondido) */}
      <div 
        ref={certificateRef}
        id="certificado-template" 
        style={{
          width: '850px', 
          height: '600px', 
          background: '#050a14', 
          color: '#ffffff', 
          border: '8px solid #c9a44e', 
          padding: '0', 
          fontFamily: "'Segoe UI', sans-serif", 
          display: 'none', 
          position: 'absolute', 
          left: '-9999px'
        }}
      >
        <div style={{
          position: 'relative', 
          border: '2px solid rgba(201, 164, 78, 0.4)', 
          margin: '20px', 
          height: 'calc(100% - 40px)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          padding: '40px', 
          boxSizing: 'border-box' as const
        }}>
          {/* LOGO CYBERGUARD */}
          <div style={{ marginBottom: '20px', fontSize: '32px', fontWeight: 'bold', letterSpacing: '2px' }}>
            <span style={{ color: '#ffffff' }}>CYBER</span><span style={{ color: '#c9a44e' }}>GUARD</span>
          </div>

          <h1 style={{ color: '#c9a44e', fontSize: '34px', margin: '0', textTransform: 'uppercase', letterSpacing: '4px' }}>
            Certificado de Conclusão
          </h1>
          <div style={{ width: '80px', height: '2px', background: '#c9a44e', margin: '15px auto' }}></div>
          
          <p style={{ fontSize: '16px', color: '#cccccc', fontStyle: 'italic' }}>Certificamos que o(a) aluno(a)</p>
          
          <h2 style={{ fontSize: '40px', margin: '10px 0', color: '#ffffff' }}>
            {editableName.toUpperCase()}
          </h2>
          
          <p style={{ fontSize: '16px', maxWidth: '600px', color: '#cccccc', lineHeight: '1.5' }}>
            Concluiu com êxito o treinamento especializado de <br />
            <strong style={{ color: '#c9a44e', fontSize: '22px' }}>{courseName.toUpperCase()}</strong>
          </p>

          <div style={{ 
            marginTop: '40px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%', 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '20px' 
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: '0', fontSize: '9px', color: '#666' }}>ID DE VALIDAÇÃO</p>
              <p style={{ margin: '0', fontSize: '12px', color: '#c9a44e', fontWeight: 'bold' }}>
                CG-{Math.random().toString(36).slice(2, 11).toUpperCase()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0', fontSize: '9px', color: '#666' }}>DATA DE EMISSÃO</p>
              <p style={{ margin: '0', fontSize: '12px', color: '#ffffff' }}>
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;

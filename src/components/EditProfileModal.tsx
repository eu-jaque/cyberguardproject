import { useState, useRef } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "../../utils/supabase";
import { toast } from "sonner";


const AVATAR_STYLES = ["adventurer", "avataaars", "bottts", "fun-emoji", "lorelei"];
const AVATAR_SEEDS = ["Felix", "Aneka", "Milo", "Sasha", "Leo", "Luna", "Kai", "Zara", "Rio", "Nova",
  "Axel", "Ivy", "Orion", "Sage", "Jade", "Blaze", "Echo", "Wren", "Finn", "Aria"];

function generateAvatarUrl(seed: string, style: string) {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=facc15`;
}

const suggestions = AVATAR_SEEDS.map((seed, i) =>
  generateAvatarUrl(seed, AVATAR_STYLES[i % AVATAR_STYLES.length])
);

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar: string;
  onSaved: (name: string, avatar: string) => void;
}

export default function EditProfileModal({ open, onClose, currentName, currentAvatar, onSaved }: EditProfileModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(currentName);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 2MB.");
      return;
    }

    setUploading(true);
    try {
      const { default: imageCompression } = await import("browser-image-compression");
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: "image/webp",
      });

      const path = `${user?.id}/avatar.webp`;
      const { error } = await supabase.storage.from("avatars").upload(path, compressed, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(`${urlData.publicUrl}?t=${Date.now()}`);
      setSelectedSuggestion(null);
      toast.success("Foto enviada!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectSuggestion = (url: string) => {
    setSelectedSuggestion(url);
    setAvatarUrl(url);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        avatar_url: avatarUrl,
      });
      if (error) throw error;
      onSaved(name, avatarUrl);
      toast.success("Perfil atualizado!");
      onClose();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-[modal-overlay_0.2s_ease-out] backdrop-blur-sm bg-black/60">
      <div className="relative bg-[#161B22] border border-border rounded-2xl p-8 max-w-md w-full mx-4 space-y-6 animate-[modal-in_0.3s_ease-out]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Editar Perfil</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary/50 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar principal */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 rounded-full border-[3px] border-yellow-400 overflow-hidden bg-[#161B22]">
            {uploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <img src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <button onClick={() => fileRef.current?.click()} className="text-xs text-yellow-400 hover:underline flex items-center gap-1">
            <Upload className="w-3 h-3" /> Alterar foto
          </button>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileUpload} />
        </div>

        {/* Sugestões */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Sugestões</p>
          <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto scrollbar-hide">
            {suggestions.map((url, i) => (
              <button
                key={i}
                onClick={() => handleSelectSuggestion(url)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 avatar-suggestion ${
                  selectedSuggestion === url ? "ring-2 ring-yellow-500 border-yellow-400" : "border-border/40 hover:border-yellow-400/50"
                }`}
              >
                <img src={url} alt="" className="w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Nome */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-secondary/30 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Salvar */}
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Salvar
        </button>
      </div>
    </div>
  );
}

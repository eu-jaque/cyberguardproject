import { X, Eye, Clock, User } from "lucide-react";

export interface VideoPost {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  author: string;
  date: string;
  videoId?: string;
}

export default function VideoModal({ video, onClose }: { video: VideoPost; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground truncate pr-4">{video.title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* Player area */}
        <div className="aspect-video bg-background/50">
          {video.videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <h2 className="text-lg font-bold text-foreground">{video.title}</h2>
          <p className="text-sm text-muted-foreground">{video.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{video.author}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{video.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

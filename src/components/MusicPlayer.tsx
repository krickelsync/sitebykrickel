import { Play, Pause } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicContext';

const MusicPlayer = () => {
  const { isPlaying, togglePlay } = useMusicPlayer();

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-4 h-14 px-4 rounded-full glass border border-border shadow-2xl">
      <div 
        className={`w-10 h-10 rounded-full overflow-hidden border border-border ${isPlaying ? 'animate-spin' : ''}`}
        style={{ animationDuration: '3s' }}
        aria-hidden="true"
      >
        <img 
          src="https://pgppgdlkoblmpqdyfxfc.supabase.co/storage/v1/object/public/logo//528284001_17883276201357771_6980898582265939174_n.jpg" 
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover" 
        />
      </div>
      <button 
        onClick={togglePlay} 
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={isPlaying}
        className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors ${
          isPlaying ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">PAUSE</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">PLAY</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;

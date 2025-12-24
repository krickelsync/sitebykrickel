import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 h-14 px-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
      <div 
        className={`w-10 h-10 rounded-full overflow-hidden border border-white/20 ${playing ? 'animate-spin' : ''}`}
        style={{ animationDuration: '3s' }}
      >
        <img 
          src="https://pgppgdlkoblmpqdyfxfc.supabase.co/storage/v1/object/public/logo//528284001_17883276201357771_6980898582265939174_n.jpg" 
          alt="Album cover"
          className="w-full h-full object-cover" 
        />
      </div>
      <button 
        onClick={toggle} 
        className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors ${
          playing ? 'text-[#DFFF00]' : 'text-white/80 hover:text-white'
        }`}
      >
        {playing ? (
          <>
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">PAUSE</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">PLAY</span>
          </>
        )}
      </button>
      <audio 
        ref={audioRef} 
        src="https://pgppgdlkoblmpqdyfxfc.supabase.co/storage/v1/object/public/logo//audio_6848604906-2.mp3" 
        loop 
      />
    </div>
  );
};

export default MusicPlayer;

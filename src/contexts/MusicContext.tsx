import { createContext, useContext, useRef, useState, useEffect, ReactNode, useCallback } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

// Keep audio reference outside component to persist across re-renders
let globalAudio: HTMLAudioElement | null = null;

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio only once globally
    if (!globalAudio) {
      globalAudio = new Audio('https://pgppgdlkoblmpqdyfxfc.supabase.co/storage/v1/object/public/logo//audio_6848604906-2.mp3');
      globalAudio.loop = true;
    }
    
    audioRef.current = globalAudio;
    
    // Sync state with actual audio state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    globalAudio.addEventListener('play', handlePlay);
    globalAudio.addEventListener('pause', handlePause);
    
    // Sync initial state
    setIsPlaying(!globalAudio.paused);

    return () => {
      // Don't destroy audio on unmount - keep playing
      globalAudio?.removeEventListener('play', handlePlay);
      globalAudio?.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
    </MusicContext.Provider>
  );
};

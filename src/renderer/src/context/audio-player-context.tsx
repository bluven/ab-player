import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
  useRef,
  useCallback
} from 'react';

export interface Track {
  title: string;
  src: string;
  author: string;
  thumbnail?: string;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  setCurrentTrack: Dispatch<SetStateAction<Track | null>>;
  setCurrentTrackFromFilePath: (filePath: string) => void;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  updateProgress: (time: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const setCurrentTrackFromFilePath = (filePath: string) => {
    if (filePath) {
      const title = filePath.split('/').pop();
      const src = `file://${filePath}`;
      setCurrentTrack({
        title: title || '',
        src,
        author: ''
      });
      setIsPlaying(true);
    }
  };

  const updateProgress = useCallback((time: number) => {
    if (audioRef.current && progressBarRef.current && duration) {
      // Change current time only when they are different, otherwise it will cause infinite loop
      if(audioRef.current.currentTime != time) {
        audioRef.current.currentTime = time;
      }
      setTimeProgress(time);
      progressBarRef.current.value = time.toString();
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(time / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    setCurrentTrackFromFilePath,
    audioRef,
    progressBarRef,
    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    isPlaying,
    setIsPlaying,
    updateProgress
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);

  if (context === undefined) {
    throw new Error(
      'useAudioPlayerContext must be used within an AudioPlayerProvider'
    );
  }

  return context;
};
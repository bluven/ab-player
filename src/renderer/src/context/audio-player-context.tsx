import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
  useRef,
} from 'react'

export interface Track {
  title: string;
  src: string;
  author: string;
  thumbnail?: string;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  setCurrentTrack: Dispatch<SetStateAction<Track|null>>; 
  setCurrentTrackFromFilePath: (filePath: string) => void;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode}) => {
  const [currentTrack, setCurrentTrack] = useState<Track|null>(null);
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
        author: '',
      });
      setIsPlaying(true);
    }
  };

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
}

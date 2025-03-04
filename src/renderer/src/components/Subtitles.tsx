import { useState, useEffect, useRef, useCallback } from 'react';
import { IpcRendererEvent } from 'electron';
import { RiFileCopyLine } from "react-icons/ri";

import { useAudioPlayerContext } from '@renderer/context/audio-player-context';

// Define the Subtitle type with startTime and endTime
type Subtitle = {
  number: number;
  timestamp: string;
  text: string;
  startTime: number;
  endTime: number;
};

// Function to convert timestamp to seconds
const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2].replace(',', '.'));
  return hours * 3600 + minutes * 60 + seconds;
};

// Function to parse the subtitle content
const parseSubtitles = (content: string): Subtitle[] => {
  const lines = content.split('\n\n').filter(line => line.trim()!== '');
  return lines.map((line) => {
    const [number, timestamp, ...textLines] = line.split('\n');
    const [startTimestamp, endTimestamp] = timestamp.split(' --> ');

    const startTime = timestampToSeconds(startTimestamp);
    const endTime = timestampToSeconds(endTimestamp);
    return {
      number: parseInt(number, 10),
      timestamp,
      text: textLines.join('\n'),
      startTime,
      endTime
    };
  });
};

// Subtitle component to display a single subtitle
const SubtitleComponent = ({ subtitle, handleClick, isActive }: { subtitle: Subtitle; handleClick: (time: number) => void; isActive: boolean }) => {
  const onClickHandler = () => {
    handleClick(subtitle.startTime);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(subtitle.text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`mb-4 ${isActive ? 'bg-yellow-200' : ''} flex items-center`}>
      <p className="mr-2 cursor-pointer" onClick={onClickHandler}>
        <b>{subtitle.number}  </b>{subtitle.text}
      </p>
      <button
        className="ml-2 bg-gray-200 cursor-pointer hover:bg-gray-300 active:bg-green-500 active:text-white transition-colors duration-300"
        onClick={copyToClipboard}
      >
        <RiFileCopyLine />
      </button>
    </div>
  );
};

const Subtitles = () => {
  const { 
    currentTrack, updateProgress, 
    isPlaying, setIsPlaying, 
    isSingleRepeat, audioRef } = useAudioPlayerContext();
  const [subtitles, setSubtitles] = useState<Subtitle[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subtitlesRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleSubtitlesLoaded = (_event: IpcRendererEvent, { content, error }: { content?: string; error?: string }) => {
      if (content) {
        const parsedSubtitles = parseSubtitles(content);
        setSubtitles(parsedSubtitles);
        setError(null);
      } else if (error) {
        setError(error);
        setSubtitles(null);
      }
    };

    window.electron.ipcRenderer.on('load-subtitles-reply', handleSubtitlesLoaded);

    if (currentTrack) {
      const audioFilePath = currentTrack.src.replace('file://', '');
      window.electron.ipcRenderer.send('load-subtitles', audioFilePath);
    }

    return () => {
      window.electron.ipcRenderer.removeListener('load-subtitles-reply', handleSubtitlesLoaded);
    };
  }, [currentTrack]);

  const handleSubtitleClick = (time: number) => {
    updateProgress(time);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleSingleRepeat = () => {
    if (!subtitles || !isPlaying || !isSingleRepeat || activeIndex === -1) {
      return false;
    }
  
    const currentSubtitle = subtitles[activeIndex];
    if (audioRef.current && audioRef.current.currentTime >= currentSubtitle.endTime) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      // try use useRef to store timeoutId
      setTimeout(() => {
        updateProgress(currentSubtitle.startTime);
        audioRef!.current!.play();
        setIsPlaying(true);
      }, 500);

      return true
    }

    return false
  };
  
  const updateActiveSubtitle = () => {
    if (!subtitles ||!subtitlesRef.current) return;
  
    if (activeIndex !== -1) {
      const currentSubtitle = subtitles[activeIndex];
      if (currentSubtitle.startTime <= audioRef.current!.currentTime && currentSubtitle.endTime > audioRef.current!.currentTime) {
        return;
      }
    }
  
    const newActiveIndex = subtitles.findIndex((subtitle) => {
      return subtitle.startTime <= audioRef.current!.currentTime && subtitle.endTime > audioRef.current!.currentTime;
    });
  
    if (newActiveIndex === -1) return;
  
    setActiveIndex(newActiveIndex);
    const subtitleElements = subtitlesRef.current.children;
    const activeSubtitle = subtitleElements[newActiveIndex] as HTMLElement;
    if (activeSubtitle) {
      const container = subtitlesRef.current;
      const containerRect = container.getBoundingClientRect();
      const subtitleRect = activeSubtitle.getBoundingClientRect();
  
      const isOutOfView =
        subtitleRect.top < containerRect.top ||
        subtitleRect.bottom > containerRect.bottom;
  
      if (isOutOfView) {
        activeSubtitle.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };
  
  const handleAudioTimeUpdate = useCallback(() => {
      const paused = handleSingleRepeat();
      if (paused) {
        return
      }

      updateActiveSubtitle();
  }, [handleSingleRepeat, updateActiveSubtitle]);
  
  useEffect(() => {
      const audioElement = audioRef.current;
      if (audioElement) {
          audioElement.addEventListener('timeupdate', handleAudioTimeUpdate);
      }
      return () => {
          if (audioElement) {
              audioElement.removeEventListener('timeupdate', handleAudioTimeUpdate);
          }
      };
  }, [audioRef, handleAudioTimeUpdate]);

  return (
    <div ref={subtitlesRef} className="p-5 flex-grow border-t border-b border-gray-400 overflow-y-auto w-full h-full">
      {error && <p className="text-red-500">{error}</p>}
      {subtitles && subtitles.map((subtitle) => {
        const isActive = subtitle.startTime <= (audioRef.current?.currentTime || 0) && subtitle.endTime > (audioRef.current?.currentTime || 0);
        return (
          <SubtitleComponent key={subtitle.number} subtitle={subtitle} handleClick={handleSubtitleClick} isActive={isActive} />
        );
      })}
    </div>
  );
};

export default Subtitles;
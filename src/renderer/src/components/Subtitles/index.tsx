import { useState, useEffect, useRef, useCallback } from 'react';
import { IpcRendererEvent } from 'electron';
import { RiFileCopyLine } from "react-icons/ri";

import { useAudioPlayerContext } from '@renderer/context/audio-player-context';
import './index.css';

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
  const lines = content.replace(/\r\n|\r/g, '\n')
                  .split('\n\n')
                  .filter(line => line.trim()!== '');
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
const SubtitleComponent = ({ subtitle, handleClick, isActive }: { subtitle: Subtitle; handleClick: (subtitle: Subtitle) => void; isActive: boolean }) => {
  const onClickHandler = () => {
    handleClick(subtitle);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(subtitle.text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`subtitle-item ${isActive ? 'active-subtitle' : ''}`}>
      <span className='subtitle-number'>{subtitle.number}</span>
      <p className="subtitle-text" onClick={onClickHandler}>
        {subtitle.text}
      </p>
      <button
        className="copy-button hidden-copy-button"
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
    timeProgress, isSingleRepeat
  } = useAudioPlayerContext();
  const [subtitles, setSubtitles] = useState<Subtitle[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const subtitlesRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

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

  const playSubtitle = useCallback((subtitle: Subtitle) => {
    updateProgress(subtitle.startTime)
    setIsPlaying(true)
    setActiveIndex(subtitle.number-1)
  }, [setIsPlaying, updateProgress]);

  // handle single repeat
  useEffect(() => {
    if (!subtitles || !isPlaying || !isSingleRepeat || activeIndex === -1) {
      return ;
    }
    
    const currentSubtitle = subtitles[activeIndex];
    if (timeProgress >= currentSubtitle.endTime) {
        setIsPlaying(false)

        setTimeout(() => {
          updateProgress(currentSubtitle.startTime);
          setIsPlaying(true)
        }, 1000)
    }
  }, [subtitles, isSingleRepeat, timeProgress, isPlaying, activeIndex, updateProgress])
  
  // handle auto scroll
  useEffect(() => {
    if (!subtitles ||!subtitlesRef.current || (isSingleRepeat && activeIndex !== -1)) return;
  
    if (activeIndex !== -1) {
      const currentSubtitle = subtitles[activeIndex];
      if (currentSubtitle.startTime <= timeProgress && currentSubtitle.endTime > timeProgress) {
        return;
      }
    }
  
    const newActiveIndex = subtitles.findIndex((subtitle) => {
      return subtitle.startTime <= timeProgress && subtitle.endTime > timeProgress
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
  }, [subtitles, subtitlesRef, activeIndex, timeProgress, isSingleRepeat])
  
  return (
    <div ref={subtitlesRef} className="subtitles-container">
      {error && <p className="error-text">{error}</p>}
      {subtitles && subtitles.map((subtitle, index) => {
        return (
          <SubtitleComponent 
            isActive={index === activeIndex} 
            key={subtitle.number} 
            subtitle={subtitle} 
            handleClick={playSubtitle} 
          />
        );
      })}
    </div>
  );
};

export default Subtitles;
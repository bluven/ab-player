import { useState, useEffect } from 'react';
import { IpcRendererEvent } from 'electron';

import { useAudioPlayerContext } from '@renderer/context/audio-player-context';

// Define the Subtitle type
type Subtitle = {
  number: number;
  timestamp: string;
  text: string;
};

// Function to parse the subtitle content
const parseSubtitles = (content: string): Subtitle[] => {
  const lines = content.split('\n\n');
  return lines.map((line) => {
    const [number, timestamp, ...textLines] = line.split('\n');
    return {
      number: parseInt(number, 10),
      timestamp,
      text: textLines.join('\n')
    };
  });
};

// Function to convert timestamp to seconds
const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(' --> ')[0].split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2].replace(',', '.'));
  return hours * 3600 + minutes * 60 + seconds;
};

// Subtitle component to display a single subtitle
const SubtitleComponent = ({ subtitle, handleClick }: { subtitle: Subtitle; handleClick: (time: number) => void }) => {
  const onClickHandler = () => {
    const timeInSeconds = timestampToSeconds(subtitle.timestamp);
    handleClick(timeInSeconds);
  };

  return (
    <div className="mb-4 cursor-pointer" onClick={onClickHandler}>
      <p className="text-gray-600">{subtitle.timestamp}</p>
      <p>{subtitle.text}</p>
    </div>
  );
};

const Subtitles = () => {
  const { currentTrack, updateProgress, isPlaying, setIsPlaying } = useAudioPlayerContext();
  const [subtitles, setSubtitles] = useState<Subtitle[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSubtitlesLoaded = (event: IpcRendererEvent, { content, error }: { content?: string; error?: string }) => {
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

  return (
    <div className="p-5 flex-grow border-t border-b border-gray-400 overflow-y-auto w-full h-full">
      {error && <p className="text-red-500">{error}</p>}
      {subtitles && subtitles.map((subtitle) => (
        <SubtitleComponent key={subtitle.number} subtitle={subtitle} handleClick={handleSubtitleClick} />
      ))}
    </div>
  );
};

export default Subtitles;
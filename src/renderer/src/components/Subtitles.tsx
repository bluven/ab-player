import { useState, useEffect } from 'react';
import { IpcRendererEvent } from 'electron';

import { useAudioPlayerContext } from '@renderer/context/audio-player-context';

const Subtitles = () => {
  const { currentTrack } = useAudioPlayerContext();
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSubtitlesLoaded = (event: IpcRendererEvent, { content, error }: { content?: string; error?: string }) => {
      if (content) {
          setSubtitles(content);
          setError(null);
          console.log(content)
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

  return (
    <div className="p-5 flex-grow border-t border-b border-gray-400 overflow-y-auto w-full h-full">
      {error && <p className="text-red-500">{error}</p>}
      {subtitles && <pre>{subtitles}</pre>}
    </div>
  );
};

export default Subtitles;
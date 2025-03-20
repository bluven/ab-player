import { useEffect } from 'react';

import { Controls } from './Controls';
import { ProgressBar } from './ProgressBar';
import { Title } from './Title';
import Subtitles from './Subtitles';
import FileSelect from './FileSelect';
import { useAudioPlayerContext } from '@renderer/context/audio-player-context';
import './AudioPlayer.css'; 

export const AudioPlayer = () => {
  const { currentTrack, setCurrentTrackFromFilePath} = useAudioPlayerContext();

  useEffect(() => {
    const handleAudioFileSelected = (_event, filePath) => {
      setCurrentTrackFromFilePath(filePath);
    };
    window.electron.ipcRenderer.on('audio-file-selected', handleAudioFileSelected);
    return () => {
      window.electron.ipcRenderer.removeListener('audio-file-selected', handleAudioFileSelected);
    };
  }, []);

  return (
    <div className="audio-player">
      <Title />
      {currentTrack == null ? <FileSelect /> : <Subtitles />}
      <div className="audio-player-bottom ">
        <ProgressBar />
        <Controls />
      </div>
    </div>
  );
};

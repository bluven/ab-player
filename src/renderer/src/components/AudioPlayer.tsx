import { useEffect } from 'react';
import { RiMenuAddLine } from 'react-icons/ri';

import { Controls } from './Controls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Title } from './Title';
import Subtitles from './Subtitles';
import FileSelect from './FileSelect';
import { useAudioPlayerContext } from '@renderer/context/audio-player-context';

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
    <div className="flex flex-col w-full h-full m-0 p-0 overflow-hidden">
      <Title />
      {currentTrack == null ? <FileSelect /> : <Subtitles />}
      <div className="min-h-8 bg-[#2e2d2d] flex flex-col gap-9 lg:flex-row justify-between items-center text-white p-[0.5rem_10px] m-0">
        <div className="w-full flex flex-col items-center gap-1 m-auto flex-1">
          <Controls />
          <ProgressBar />
        </div>
      </div>
    </div>
  );
};

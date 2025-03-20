import { ChangeEvent, useEffect, useState } from 'react';
import {
  IoMdVolumeHigh,
  IoMdVolumeOff,
  IoMdVolumeLow,
} from 'react-icons/io';

import { useAudioPlayerContext } from '@renderer/context/audio-player-context';
import './VolumeControl.css';

const VolumeInput = ({ volume, onVolumeChange }: { volume: number; onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
  const inputStyle = {
    '--volume': `${volume}%`
  } as React.CSSProperties;

  return (
    <div className="volume-input-container">
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        className="volume-input"
        onChange={onVolumeChange}
        style={inputStyle}
      />
    </div>
  );
};

export const VolumeControl = () => {
  const [volume, setVolume] = useState<number>(60);
  const [muteVolume, setMuteVolume] = useState(false);
  const { audioRef } = useAudioPlayerContext();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className="volume-control">
      <button className="volume-button" onClick={() => setMuteVolume((prev) => !prev)}>
        {muteVolume || volume < 5 ? (
          <IoMdVolumeOff size={25} />
        ) : volume < 40 ? (
          <IoMdVolumeLow size={25} />
        ) : (
          <IoMdVolumeHigh size={25} />
        )}
      </button>
      <VolumeInput volume={volume} onVolumeChange={handleVolumeChange} />
    </div>
  );
};

export default VolumeControl;
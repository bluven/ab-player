import { ChangeEvent, useEffect, useState } from 'react';
import {
  IoMdVolumeHigh,
  IoMdVolumeOff,
  IoMdVolumeLow,
} from 'react-icons/io';
import { useAudioPlayerContext } from '../context/audio-player-context';

const VolumeInput = ({ volume, onVolumeChange }: { volume: number; onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 h-36 flex items-center justify-center bg-black opacity-0 group-hover:opacity-100 group-hover:visible invisible rounded-md"
    >
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        className="volumn transform rotate-[-90deg]"
        onChange={onVolumeChange}
        style={{
          background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
          width: '120px'
        }}
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
    <div className="flex items-center gap-3 relative group">
      <button onClick={() => setMuteVolume((prev) => !prev)}>
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

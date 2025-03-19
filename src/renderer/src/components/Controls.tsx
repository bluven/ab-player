import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BsFillFastForwardFill,
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillRewindFill,
  BsRepeat,
} from 'react-icons/bs';
import { SlLoop } from 'react-icons/sl';

import { useAudioPlayerContext } from '../context/audio-player-context';
import { VolumeControl } from './VolumeControl';
import { Dropdown, type DropdownItem } from './Dropdown';

const speedOptions = [2, 1.5, 1, 0.75, 0.5];
const SpeedControl = () => {
  const { audioRef } = useAudioPlayerContext();
  const handleSpeedChange = (item: DropdownItem) => {
      if (audioRef.current) {
          audioRef.current.playbackRate = item.value;
      }
  };

  return <Dropdown 
    buttonText='倍率' 
    onSelect={handleSpeedChange} 
    items={speedOptions.map(value => ({ value, label: `${value}X` }))}
  />
}

export const Controls = () => {
  const {
    currentTrack,
    audioRef,
    setDuration,
    duration,
    progressBarRef,
    isPlaying,
    setIsPlaying,
    isSingleRepeat,
    setIsSingleRepeat,
    updateProgress,
  } = useAudioPlayerContext();
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const playAnimationRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress(audioRef!.current!.currentTime)
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      // updateProgress(); // Ensure progress is updated immediately when paused
      updateProgress(audioRef!.current!.currentTime)
    }

    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      updateProgress(audioRef.current.currentTime + 15);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress(audioRef.current.currentTime - 15);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowRight':
          event.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          skipBackward();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;

    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (isRepeat) {
          currentAudioRef.currentTime = 0;
          currentAudioRef.play();
        } else {
          setIsPlaying(false);
        }
      };
    }

    return () => {
      if (currentAudioRef) {
        currentAudioRef.onended = null;
      }
    };
  }, [isRepeat, audioRef]);

  return (
    <div className="flex gap-4 items-center">
      <audio
        src={currentTrack?.src}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button onClick={skipBackward}>
        <BsFillRewindFill size={20} />
      </button>
      <button onClick={() => setIsPlaying((prev) => !prev)}>
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </button>
      <button onClick={skipForward}>
        <BsFillFastForwardFill size={20} />
      </button>
      <button onClick={() => setIsSingleRepeat((prev) => !prev)}>
        <SlLoop
          size={20}
          className={isSingleRepeat ? 'text-[#f50]' : ''}
        />
      </button>
      <button onClick={() => setIsRepeat((prev) => !prev)}>
        <BsRepeat
          size={20}
          className={isRepeat ? 'text-[#f50]' : ''}
        />
      </button>
      <SpeedControl />
      <VolumeControl />
    </div>
  );
};

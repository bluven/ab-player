import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BsFillFastForwardFill,
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillRewindFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsShuffle,
  BsRepeat,
} from 'react-icons/bs';

import { useAudioPlayerContext } from '../context/audio-player-context';

export const Controls = () => {
  const {
    currentTrack,
    audioRef,
    setDuration,
    duration,
    progressBarRef,
    isPlaying,
    setIsPlaying,
    updateProgress,
  } = useAudioPlayerContext();

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
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

  // const handlePrevious = useCallback(() => {
  //   setTrackIndex((prev) => {
  //     const newIndex = isShuffle
  //       ? Math.floor(Math.random() * tracks.length)
  //       : prev === 0
  //       ? tracks.length - 1
  //       : prev - 1;
  //     setCurrentTrack(tracks[newIndex]);
  //     return newIndex;
  //   });
  // }, [isShuffle, setCurrentTrack, setTrackIndex]);

  // const handleNext = useCallback(() => {
  //   setTrackIndex((prev) => {
  //     const newIndex = isShuffle
  //       ? Math.floor(Math.random() * tracks.length)
  //       : prev >= tracks.length - 1
  //       ? 0
  //       : prev + 1;
  //     setCurrentTrack(tracks[newIndex]);
  //     return newIndex;
  //   });
  // }, [isShuffle, setCurrentTrack, setTrackIndex]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;

    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (isRepeat) {
          currentAudioRef.play();
        } else {
          // handleNext(); // This function should handle both shuffle and non-shuffle scenarios
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
      <button>
        <BsSkipStartFill size={20} />
      </button>
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
      <button>
        <BsSkipEndFill size={20} />
      </button>
      <button onClick={() => setIsShuffle((prev) => !prev)}>
        <BsShuffle
          size={20}
          className={isShuffle ? 'text-[#f50]' : ''}
        />
      </button>
      <button onClick={() => setIsRepeat((prev) => !prev)}>
        <BsRepeat
          size={20}
          className={isRepeat ? 'text-[#f50]' : ''}
        />
      </button>
    </div>
  );
};

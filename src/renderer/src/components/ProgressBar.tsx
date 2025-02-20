import { useAudioPlayerContext } from '../context/audio-player-context';

export const ProgressBar = () => {
  const {
    progressBarRef,
    timeProgress,
    duration,
    updateProgress,
  } = useAudioPlayerContext();

  const handleProgressChange = () => {
    updateProgress(Number(progressBarRef!.current!.value));
  };

  const formatTime = (time: number | undefined): string => {
    if (typeof time === 'number' && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);

      // Convert to string and pad with leading zeros if necessary
      const formatMinutes = minutes.toString().padStart(2, '0');
      const formatSeconds = seconds.toString().padStart(2, '0');

      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  return (
    <div className="flex items-center justify-center gap-5 w-full">
      <span>{formatTime(timeProgress)}</span>
      <input
        className="max-w-[80%] bg-gray-300"
        ref={progressBarRef}
        type="range"
        defaultValue="0"
        onChange={handleProgressChange}
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
};

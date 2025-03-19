import { useAudioPlayerContext } from '../context/audio-player-context';

export const ProgressBar = () => {
  const {
    progressBarRef,
    updateProgress,
  } = useAudioPlayerContext();

  const handleProgressChange = () => {
    updateProgress(Number(progressBarRef!.current!.value));
  };

  return (
    <div className="flex items-center justify-center gap-5 w-full">
      <input
        className="max-w-[100%] bg-gray-300"
        ref={progressBarRef}
        type="range"
        defaultValue="0"
        onChange={handleProgressChange}
      />
    </div>
  );
};

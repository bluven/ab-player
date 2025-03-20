import { useAudioPlayerContext } from '../context/audio-player-context';
import './ProgressBar.css';

export const ProgressBar = () => {
  const {
    progressBarRef,
    updateProgress,
  } = useAudioPlayerContext();

  const handleProgressChange = () => {
    updateProgress(Number(progressBarRef!.current!.value));
  };

  return (
    <div className="progress-bar-container">
      <input
        className="progress-bar-input"
        ref={progressBarRef}
        type="range"
        defaultValue="0"
        onChange={handleProgressChange}
      />
    </div>
  );
};

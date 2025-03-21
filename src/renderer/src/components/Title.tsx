import { useAudioPlayerContext } from '../context/audio-player-context';
import './Title.css';

export const Title = () => {
  const { currentTrack } = useAudioPlayerContext();

  return (
    <div className="title-container">
      <p className="title-text">
        { currentTrack === null ? '' : currentTrack.title}
      </p>
    </div>
  );
};

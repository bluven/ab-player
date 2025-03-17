import { useAudioPlayerContext } from '../context/audio-player-context';

export const Title = () => {
  const { currentTrack } = useAudioPlayerContext();

  return (
    <div className="flex items-center justify-center">
      <p className="font-bold">
        { currentTrack === null ? '' : currentTrack.title}
      </p>
    </div>
  );
};

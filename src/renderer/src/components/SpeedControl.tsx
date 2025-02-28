import { useState } from 'react';
import { useAudioPlayerContext } from '../context/audio-player-context';
import './SpeedControl.css';

const speedOptions = [0.5, 0.75, 1, 1.5, 2];

export const SpeedControl = () => {
    const { audioRef } = useAudioPlayerContext();
    const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(true);

    const handleSpeedChange = (speed: number) => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
        setIsSpeedMenuOpen(false);
    };

    return (
        <div className="relative"
            onMouseEnter={() => setIsSpeedMenuOpen(true)}
            onMouseLeave={() => setIsSpeedMenuOpen(false)}
        >
            <button>
                倍率
            </button>
            {isSpeedMenuOpen && (
                <div className="absolute w-12 top-0 left-0 transform -translate-y-full bg-black border border-gray-300">
                    {speedOptions.map((speed) => (
                        <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className='speed-option-button'
                        >
                            {speed}X
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

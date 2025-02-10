
import React, { useState, useEffect, useRef } from 'react'
import './index.css'

interface PlayerProps {
  audioName: string
  subtitles: string
}

// Define SVG icons for play and pause
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
)

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const Player: React.FC<PlayerProps> = ({ audioName, subtitles }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
        setProgress((audio.currentTime / audio.duration) * 100)
      })
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      return () => {
        audio.removeEventListener('timeupdate', () => {})
        audio.removeEventListener('loadedmetadata', () => {})
      }
    }
  }, [])

  return (
    <div className="player full-height">
      <div className="player-title-bar">
        <h2>{audioName}</h2>
      </div>
      <div className="player-content">
        <p>{subtitles}</p>
      </div>
      <div className="player-control-bar">
        <button onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="progress-container">
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <progress value={progress} max="100"></progress>
        </div>
      </div>
      <audio ref={audioRef} src="your-audio-file.mp3"></audio>
    </div>
  )
}

export default Player
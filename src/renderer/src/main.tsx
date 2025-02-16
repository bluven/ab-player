import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AudioPlayerProvider } from './context/audio-player-context';

import './styles/index.css';
import './styles/customize-progress-bar.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <App />
    </AudioPlayerProvider>
  </React.StrictMode>
)

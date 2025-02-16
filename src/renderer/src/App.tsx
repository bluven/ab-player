import Player from './components/Player'
import { AudioPlayer } from './components/AudioPlayer'

export function App2(): JSX.Element {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      <Player
        audioName="示例音频名称"
        subtitles="这里是示例字幕内容"
      /> 
    </div>
  )
}

function App() {
  return (
    <div className="flex h-screen w-screen m-0 p-0 overflow-hidden justify-center items-center">
      <AudioPlayer />
    </div>
  );
}

export default App
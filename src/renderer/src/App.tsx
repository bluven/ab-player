import Player from './components/Player'
import { AudioPlayer } from './components/AudioPlayer'

function App2(): JSX.Element {
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
    <div className="mx-auto max-w-[1200px]">
      <h1 className="text-3xl font-bold mb-5">
        Audio player in React
      </h1>
      <AudioPlayer />
    </div>
  );
}

export default App
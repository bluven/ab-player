import Player from './components/Player'

function App(): JSX.Element {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      <Player
        audioName="示例音频名称"
        subtitles="这里是示例字幕内容"
      />
    </div>
  )
}

export default App
import { RiFolderAddLine } from 'react-icons/ri'
import { useAudioPlayerContext } from '@renderer/context/audio-player-context'

const FileSelect = () => {
  const { setCurrentTrackFromFilePath } = useAudioPlayerContext()
  const handleFileSelect = async () => {
    const filePath = await window.electron.ipcRenderer.invoke('select-audio-file');
    setCurrentTrackFromFilePath(filePath);
  };

  return (
    <div className="p-5 flex-grow border-t border-b border-gray-400 overflow-y-auto w-full h-full flex justify-center items-center">
      <button
        className="cursor-pointer rounded-full border border-gray-400 p-2 flex items-center justify-center"
        onClick={handleFileSelect}
      >
        <RiFolderAddLine />
        <span className="ml-2">Select File</span>
      </button>
    </div>
  );
};

export default FileSelect

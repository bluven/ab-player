import { RiMenuAddLine } from 'react-icons/ri'

import { Controls } from './Controls'
import { ProgressBar } from './ProgressBar'
import { VolumeControl } from './VolumeControl'
import { Title } from './Title'

const Subtitles = () => {
  return (
    <div className="p-5 flex-grow border-t border-b border-gray-400 overflow-y-auto w-full h-full">
      {/* Add subtitle content here */}
    </div>
  );
};


export const AudioPlayer = () => {
  return (
    <div className="flex flex-col w-full h-full m-0 p-0 overflow-hidden">
      <Title />
      <Subtitles />
      <div className="min-h-8 bg-[#2e2d2d] flex flex-col gap-9 lg:flex-row justify-between items-center text-white p-[0.5rem_10px] m-0">
        <div className="w-full flex flex-col items-center gap-1 m-auto flex-1">
          <Controls />
          <ProgressBar />
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <VolumeControl />
          <button>
            <RiMenuAddLine />
          </button>
        </div>
      </div>
    </div>
  );
};

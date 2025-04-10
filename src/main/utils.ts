import { dialog, IpcMainEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export async function selectAudioFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Audio', extensions: ['mp3', 'wma', 'wav', 'mkv', 'avi', 'mp4'] },
        ],
    });
    if (!canceled) {
        return filePaths[0];
    }
    return null;
}

export function loadSubTitles(event: IpcMainEvent, audioFilePath: string) {
    const dir = path.dirname(audioFilePath);
    const baseName = path.basename(audioFilePath, path.extname(audioFilePath));
    const subtitleFilePath = path.join(dir, `${baseName}.srt`);

    fs.readFile(subtitleFilePath, 'utf8', (err, data) => {
        if (err) {
            event.sender.send('load-subtitles-reply', { error: err.message });
        } else {
            event.sender.send('load-subtitles-reply', { content: data });
        }
    });
};
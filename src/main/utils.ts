import { dialog } from 'electron';

export async function selectAudioFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile']
    });
    if (!canceled) {
        return filePaths[0];
    }
    return null;
}

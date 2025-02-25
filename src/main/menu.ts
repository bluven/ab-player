import { Menu, app, BrowserWindow } from 'electron';
import { selectAudioFile } from './utils';

// Create the menu template
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open Audio File',
                click: async () => {
                    const filePath = await selectAudioFile();
                    if (filePath) {
                        console.log('Selected file:', filePath);
                        // Get the main window
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        if (mainWindow) {
                            // Send the selected file path to the renderer process
                            mainWindow.webContents.send('audio-file-selected', filePath);
                        }
                    }
                }
            },
            {
                label: 'Exit',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    console.log('This is an Electron application.');
                }
            }
        ]
    }
];

// Create the menu
const createMenu = () => {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
};

export default createMenu;

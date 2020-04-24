const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
let mainWindow;

//main window
function createWindow() {
    //Create the browser window.
    mainWindow = new BrowserWindow({
        width:950,
        height:630,
        minWidth: 950,
        minHeight: 630,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    });
    mainWindow.loadFile('src/main.html');
    //dev tools
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null
    });
}
app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
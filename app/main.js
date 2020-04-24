const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
let mainWindow;
let loadingWindow;
//main window
// function createWindow() {
//     //Create the browser window.
//     mainWindow = new BrowserWindow({
//         width:950,
//         height:630,
//         minWidth: 950,
//         minHeight: 630,
//         resizable: false,
//         frame: false,
//         webPreferences: {
//             nodeIntegration: true,
//             devTools: true
//         }
//     });
//     mainWindow.loadFile('src/main.html');
//     //dev tools
//     //mainWindow.webContents.openDevTools();
//     mainWindow.on('closed', () => {
//         mainWindow = null
//     });
// }
app.on('ready', () => {
    //createWindow();
    mainWindow = new BrowserWindow({
        width:950,
        height:630,
        minWidth: 950,
        minHeight: 630,
        resizable: false,
        titleBarStyle: 'hidden',
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    });
    mainWindow.loadFile('src/main.html');
    mainWindow.on('closed', () => {
        mainWindow = null
    });
    //loading window
    loadingWindow = new BrowserWindow({
        width: 500, 
        height: 300,  
        frame: false, 
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
        });
    loadingWindow.loadFile('src/loading.html');
    
    // if main window is ready to show, then destroy the splash window and show up the main window
    mainWindow.once('ready-to-show', () => {
        loadingWindow.destroy();
        mainWindow.show();
    });
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
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const process = require('process');
const fs = require('fs');
const path = require('path');
let mainWindow;
let loadingWindow;
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
            devTools: true
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
        // autoUpdater.checkForUpdatesAndNotify();
    });
    checkUpdateFiles();
    autoUpdater.checkForUpdates();
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
// autoUpdater.setFeedURL({
//     provider: 'github',
//     repo: 'the-bible',
//     owner: 'saw-jan',
//     private: true,
//     token: '8470bf6d0f4167849f4901060de66a49d32dc8f0'
// });
autoUpdater.autoDownload = false;
autoUpdater.on('update-available',(updateInfo)=>{
    mainWindow.webContents.send('update-available',updateInfo);
});
autoUpdater.on('error', (err) => {
mainWindow.webContents.send('error',err);
});
//check if previous update files exist and delete them
function checkUpdateFiles(){
    let updatePath = '';
    if (process.platform === 'darwin') {
        updatePath = 'C:/Users/KinSae/Downloads/the-bible-update.exe';
    }else if(process.platform === 'linux'){
        updatePath = 'C:/Users/KinSae/Downloads/update.exe';
    }else if(process.platform === 'win32'){
        updatePath = 'C:/Users/KinSae/Downloads/the-bible-update.exe';
    }
    try {
        fs.unlinkSync(updatePath);
    //file removed
    } catch(err) {
        console.error('No update cache')
    }
}
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update-downloaded');
// });
// ipcMain.on('install-update', () => {
//   autoUpdater.downloadUpdate();
// });
// ipcMain.on('restart-and-update', () => {
//   autoUpdater.quitAndInstall();
// });
// autoUpdater.on('download-progress', (progressObj) => {
//     mainWindow.webContents.send('downloading',progressObj.percent);
//     //console.log('downloading:'+progressObj.bytesPerSecond+', Percent: '+progressObj.percent);
// })
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const process = require('process');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const isDev = require('electron-is-dev');
const userPath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

let mainWindow;
let loadingWindow;
app.on('ready', () => {
    makeUpdateDirectory();
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
        icon: path.join(__dirname, '/src/img/icon.png'),
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
        icon: path.join(__dirname, '/src/img/icon.png'),
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
    if (process.platform === 'darwin' || process.platform === 'win32') {
        autoUpdater.checkForUpdates()
        .catch(err=>{});
    }else if(process.platform === 'linux'){
        checkLinuxUpdate();
    }
    
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
autoUpdater.autoDownload = false;
autoUpdater.on('update-available',(updateInfo)=>{
    mainWindow.webContents.send('update-available',updateInfo);
});
autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('error',err);
});
autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update-not-available');
});
autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('checking-for-update');
});
//check update for linux OS
function checkLinuxUpdate(){
    curVersion = app.getVersion();
    fetch('https://github.com/saw-jan/thebible-releases/releases/latest/download/latest.yml')
    .then(res=>{
        let ymlText = '';
        res.body.on('data',(chunk)=>{
            ymlText = chunk.toString('utf8');
            vText = ymlText.split('\n');
            version = vText[0].split(':')[1].trim();
            if(curVersion != version){
                let updateVer = {'version':version};
                mainWindow.webContents.send('update-available',updateVer);
            }
        }).catch(err=>{})
    })
    .catch(err=>{})
}
//initiate update directory
function makeUpdateDirectory(){
    let updateDir = "";
    if (process.platform === 'darwin') {
        updateDir = userPath+'/Documents/thebible';
    }else if(process.platform === 'linux'){
        updateDir = userPath+'/Documents/thebible';
    }else if(process.platform === 'win32'){
        updateDir = userPath+'\\Documents\\thebible';
    }
    if (!fs.existsSync(updateDir)){
        fs.mkdirSync(updateDir,{recursive:true}, err =>{});
    }
}
//check if previous update files exist and delete them
function checkUpdateFiles(){
    let updatePath = '';
    if (process.platform === 'darwin') {
        updatePath = userPath+'/Documents/thebible/the-bible-update.dmg';
    }else if(process.platform === 'linux'){
        updatePath = userPath+'/Documents/thebible/the-bible-update.deb';
    }else if(process.platform === 'win32'){
        updatePath = userPath+'\\Documents\\thebible\\the-bible-update.exe';
    }
    try {
        if (fs.existsSync(updatePath)){
            fs.unlinkSync(updatePath);
        }
    //file removed
    } catch(err) {
        console.error('No update cache: '+err)
    }
}
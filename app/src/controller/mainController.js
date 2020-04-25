const { remote, ipcRenderer } = require('electron');
const path = require('path');


//minimize window
document.getElementById('btn-min').addEventListener('click', () => {
        remote.getCurrentWindow().minimize();
    })
//min-max window
// let max = false;
// document.getElementById('btn-max').addEventListener('click', () => {
//         max = !max;
//         max ? $('#btn-max img').attr('src', path.join(__dirname, '../img/maxmin.png')) : $('#btn-max img').attr('src', path.join(__dirname, '../img/max.png'));

//         const window = remote.BrowserWindow.getFocusedWindow();
//         window.setFullScreen(!window.isFullScreen());
//     })
//close window
document.getElementById('btn-close').addEventListener('click', () => {
        remote.app.quit();
    })
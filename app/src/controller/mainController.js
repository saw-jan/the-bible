const { remote, ipcRenderer } = require('electron');
const path = require('path');
const $ = require('jquery');
window.jQuery = window.$ = $;

//minimize window
$('#btn-min').click(() => {
        remote.getCurrentWindow().minimize();
    })
//min-max window
let max = false;
$('#btn-max').click(() => {
        max = !max;
        max ? $('#btn-max img').attr('src', path.join(__dirname, '../img/maxmin.png')) : $('#btn-max img').attr('src', path.join(__dirname, '../img/max.png'));

        const window = remote.BrowserWindow.getFocusedWindow();
        window.setFullScreen(!window.isFullScreen());
    })
//close window
$('#btn-close').click(() => {
        remote.app.quit();
    })
document.getElementById("app-version").innerText = "v"+remote.app.getVersion();
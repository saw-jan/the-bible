const {ipcRenderer} = require('electron');
const $ = require('jquery');
window.jQuery = window.$ = $;

var updater = document.getElementById('update');
var installer = document.getElementById('d-complete');

ipcRenderer.on('update-available', function(event, text) {
  updater.style.display = 'flex';
})
ipcRenderer.on('update-downloaded', function(event, text) {
  installer.style.display = 'flex';
})
$(document).ready(function() {
    $('#btn-install').on('click',function(){
        ipcRenderer.send('install-update');
        updater.style.display = 'none';
    });
    $('#btn-later').on('click',function(){
        updater.style.display = 'none';
    });
    $('#btn-restart').on('click',function(){
        ipcRenderer.send('restart-and-update');
    });
});
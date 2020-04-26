const {ipcRenderer} = require('electron');
const $ = require('jquery');
window.jQuery = window.$ = $;

var updater = document.getElementById('update');
var installer = document.getElementById('d-complete');
var downloading = document.getElementById('downloading');
var progress = document.getElementById('progress-dot');

ipcRenderer.on('update-available', function(event, text) {
    $('#update').css('display','flex').hide().fadeIn();
});
ipcRenderer.on('update-downloaded', function(event, text) {
    $('#downloading').fadeOut();
    $('#d-complete').css('display','flex').hide().fadeIn();
});
function progressDot(){
    let count = 0;
    setInterval(function(){ 
        count++;
        if(count<4){
            progress.innerText +=".";
        }else{
            count = 0;
            progress.innerText ="";
        }
    }, 500);
}
// progressDot();
$(document).ready(function() {
    $('#btn-install').on('click',function(){
        ipcRenderer.send('install-update');
        updater.style.display = 'none';
        $('#downloading').css('display','flex').hide().fadeIn();
        progressDot();
    });
    $('#btn-later').on('click',function(){
        updater.style.display = 'none';
    });
    $('#btn-restart').on('click',function(){
        ipcRenderer.send('restart-and-update');
    });

});
const { remote, ipcRenderer } = require('electron');
const fs = require('fs');
const fetch = require('node-fetch');
const process = require('process');
var run = require('child_process').execFile;
const $ = require('jquery');
window.jQuery = window.$ = $;

var updater = document.getElementById('update');
var installer = document.getElementById('d-complete');
var downloading = document.getElementById('downloading');
var progress = document.getElementById('progress-dot');
var dPercentage = document.getElementById('d-percentage');

let isUpdate = false;
//update available for download
ipcRenderer.on('update-available', function(event,info) {
    isUpdate = true;
    $('#new-version').text(" v"+info.version);
    $('#update').css('display','flex').hide().fadeIn();
});
//download completed
// ipcRenderer.on('update-downloaded', function(event) {
//     downloading.style.display = 'none';
//     $('#d-complete').css('display','flex').hide().fadeIn();
// });
//downloading updates from server
// ipcRenderer.on('downloading', function(event, progress) {
//     isUpdate = true;
//     progress.innerText +=" ("+progress+")";
// });
//catch error
// ipcRenderer.on('error', function(event, error) {
//     if(isUpdate){
//         downloading.style.display = 'none';
//         $('#dError').css('display','flex').hide().fadeIn();
//         setTimeout(function(){
//             $('#dError').fadeOut();
//         }, 10000);
//     }
// });
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
//to download updates form server
async function downloadUpdate(){
    var received_mb = 0;
    var total_mb = 0;

    fetch("https://homepages.cae.wisc.edu/~ece533/images/fruits.png")
    .then(res=>{
        const destPath = fs.createWriteStream("C:/Users/KinSae/Downloads/the-bible-update.exe");
        res.body.pipe(destPath);
        // console.log(res.headers.get('content-length'));
        let _bytes = parseInt(res.headers.get('content-length'));
        total_mb = ((_bytes/1024)/1024);
        res.body.on('data',(chunk)=>{
            received_mb += chunk.length;
            let rec_mb = ((received_mb/1024)/1024);
            showProgress(rec_mb, total_mb);
        })
    })
}
//download progress in percentage
let percentage=0;
function showProgress(received, total){
    percentage = (received.toFixed(2) * 100) / total.toFixed(2);
    // console.log(parseInt(percentage) + "% | " + received + " MB out of " + total + " MB.");
    dPercentage.innerText = " ("+parseInt(percentage)+"%)";

    if(received===total){
        downloading.style.display = 'none';
        $('#d-complete').css('display','flex').hide().fadeIn();
    }
}
//exit and install update
function installUpdate(){
    var executablePath ='';
    if (process.platform === 'darwin') {
        executablePath = 'C:\\Users/KinSae/Downloads/the-bible-update.exe';
    }else if(process.platform === 'linux'){
        executablePath = 'C:/Users/KinSae/Downloads/update.exe';
    }else if(process.platform === 'win32'){
        executablePath = 'C:\\Users\\KinSae\\Downloads\\ProxifierSetup.exe';
    }
    run(executablePath, function(err, data) {
        if(err){
        console.error(err);
        return;
        }
    });
}
$(document).ready(function() {
    $('#btn-install').on('click',function(){
        updater.style.display = 'none';
        $('#downloading').css('display','flex').hide().fadeIn();
        progressDot();
        downloadUpdate();
    });
    $('#btn-later').on('click',function(){
        updater.style.display = 'none';
    });
    $('#btn-restart').on('click',function(){
        installUpdate();
        remote.app.quit();
    });

});
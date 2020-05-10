const { remote, ipcRenderer } = require('electron');
const fs = require('fs');
const fetch = require('node-fetch');
const process = require('process');
const { exec } = require('child_process');
const $ = require('jquery');
window.jQuery = window.$ = $;

const userPath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var updater = document.getElementById('update');
var installer = document.getElementById('d-complete');
var downloading = document.getElementById('downloading');
var progress = document.getElementById('progress-dot');
var dPercentage = document.getElementById('d-percentage');
let updateVersion='';
let isUpdate = false;
//update available for download
ipcRenderer.on('update-available', function(event,info) {
    isUpdate = true;
    updateVersion = info.version;
    $('#new-version').text(" v"+info.version);
    $('#update').css('display','flex').hide().fadeIn();
});
if (process.platform === 'darwin') {
    ipcRenderer.on('error', function(event,info) {
        alert(info);
    });
    ipcRenderer.on('update-not-available', function() {
        alert("no update");
    });
    ipcRenderer.on('checking-for-update', function() {
        alert('checking');
    });
}
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
    let updateURL="";
        if (process.platform === 'darwin') {
            updateURL = "https://github.com/saw-jan/thebible-releases/releases/latest/download/the_bible_setup_v"+updateVersion+".dmg";
        }else if(process.platform === 'linux'){
            updateURL = "https://github.com/saw-jan/thebible-releases/releases/latest/download/the_bible_setup_v"+updateVersion+".deb";
        }else if(process.platform === 'win32'){
            updateURL = "https://github.com/saw-jan/thebible-releases/releases/latest/download/the_bible_setup_v"+updateVersion+".exe";
        }
    fetch(updateURL)
    .then(res=>{
        //check OS
        let downloadDir = "";
        if (process.platform === 'darwin') {
            downloadDir = userPath+'/Documents/thebible/the-bible-update.dmg';
        }else if(process.platform === 'linux'){
            downloadDir = userPath+'/Documents/thebible/the-bible-update.deb';
        }else if(process.platform === 'win32'){
            downloadDir = userPath+'\\Documents\\thebible\\the-bible-update.exe';
        }
        const destPath = fs.createWriteStream(downloadDir);
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
//make update directories
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
//download progress in percentage
let percentage=0;
function showProgress(received, total){
    percentage = (received.toFixed(2) * 100) / total.toFixed(2);
    dPercentage.innerText = " ("+parseInt(percentage)+"%)";

    if(received===total){
        downloading.style.display = 'none';
        $('#d-complete').css('display','flex').hide().fadeIn();
    }
}
//exit and install update
function installUpdate(){
    let executablePath ='';
    if (process.platform === 'darwin') {
        executablePath = userPath+'/Documents/thebible/the-bible-update.dmg';
    }else if(process.platform === 'linux'){
        executablePath = userPath+'/Documents/thebible/the-bible-update.deb';
        try{
            exec('gnome-terminal -- sh -c "sudo dpkg -i '+executablePath+';sleep 10"', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }
        catch (ex) {}
    }else if(process.platform === 'win32'){
        executablePath = userPath+'\\Documents\\thebible\\the-bible-update.exe';
        try{
            exec('start '+executablePath, (err, stdout, stderr) => {
                if (err) {
                    return;
                }
            });
        }
        catch (ex) {}
    }
}
$(document).ready(function() {
    $('#btn-install').on('click',function(){
        updater.style.display = 'none';
        $('#downloading').css('display','flex').hide().fadeIn();
        progressDot();
        makeUpdateDirectory();
        downloadUpdate();
    });
    $('#btn-later').on('click',function(){
        updater.style.display = 'none';
    });
    $('#btn-restart').on('click',function(){
        setTimeout(function(){
            remote.app.quit();
        }, 2000)
        installUpdate();
    });

});
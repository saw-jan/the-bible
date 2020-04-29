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
    updateURL = "https://github.com/saw-jan/thebible-releases/releases/latest/download/the_bible_setup_v"+updateVersion+".exe";
    fetch(updateURL)
    .then(res=>{
        //check OS
        const destPath = fs.createWriteStream(userPath+"\\Documents\\thebible\\the-bible-update.exe");
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
    const updateDir = userPath+"\\Documents\\thebible";
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
let isOpened = false;
function installUpdate(){
    let executablePath ='';
    if (process.platform === 'darwin') {
        executablePath = userPath+'\\Documents\\thebible\\the-bible-update.exe';
    }else if(process.platform === 'linux'){
        executablePath = userPath+'\\Documents\\thebible\\the-bible-update.exe';
    }else if(process.platform === 'win32'){
        executablePath = userPath+'\\Documents\\thebible\\the-bible-update.exe';
    }
    try{
        exec('start '+executablePath, (err, stdout, stderr) => {
            isOpened = true;
            if (err) {
                console.error(err);
                return;
            }
        });
    }
    catch (ex) {
        console.log('exception: ', ex);
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
        installUpdate();
        if(isOpened){
            remote.app.quit();
        }
    });

});
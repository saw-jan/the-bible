const { remote, ipcRenderer } = require('electron');
const path = require('path');


//minimize window
document.getElementById('btn-min').addEventListener('click', () => {
        remote.getCurrentWindow().minimize();
    })
    //min-max window
let max = false;
document.getElementById('btn-max').addEventListener('click', () => {
        max = !max;
        max ? $('#btn-max img').attr('src', path.join(__dirname, '../img/maxmin.png')) : $('#btn-max img').attr('src', path.join(__dirname, '../img/max.png'));

        const window = remote.BrowserWindow.getFocusedWindow();
        window.setFullScreen(!window.isFullScreen());
    })
    //close window
document.getElementById('btn-close').addEventListener('click', () => {
        remote.app.quit();
    })
    //on old testament selection
let oldT=0;
let newT=1;
document.getElementById('old-testament').addEventListener('click', () => {
        document.getElementById("old-testament").style.background = '#2a964e';
        document.getElementById("new-testament").style.background = '#30323f';
        document.getElementById("old-testament").style.color = '#EEE';
        document.getElementById("new-testament").style.color = '#EEE';
        document.getElementById("old-books").style.display = 'block';
        document.getElementById("new-books").style.display = 'none';
        //clear cache
        let verseNumbers = document.getElementById('verse-numbers');
        let chapterNumbers = document.getElementById('chapter-numbers');
        if(oldT!=0){
            verseNumbers.innerHTML = '';
            chapterNumbers.innerHTML = '';
        }
        newT=1;
        oldT=0;
    })
    //on old testament selection
document.getElementById('new-testament').addEventListener('click', () => {
    document.getElementById("old-testament").style.background = '#30323f';
    document.getElementById("new-testament").style.background = '#2a964e';
    document.getElementById("old-testament").style.color = '#EEE';
    document.getElementById("new-testament").style.color = '#EEE';
    document.getElementById("old-books").style.display = 'none';
    document.getElementById("new-books").style.display = 'block';
    //clear all cache
    let verseNumbers = document.getElementById('verse-numbers');
    let chapterNumbers = document.getElementById('chapter-numbers');
    if(newT!=0){
        verseNumbers.innerHTML = '';
        chapterNumbers.innerHTML = '';
    }
    oldT=1;
    newT=0;
})
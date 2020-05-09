const fs = require('fs');
const path = require('path');
const app = require('electron').remote.app;
const dbPath = path.join(__dirname, '../','../','../','lib');

const dbSelect = document.getElementById('slct');
const user =  require(path.join(app.getAppPath(),'../','config','settings.json'));
const bibleCode = user.bibleVersion;

function getDbNames(dbPath) {
  if( fs.existsSync(dbPath) ) {
      fs.readdirSync(dbPath).forEach(function(file) {
        const dbFile = file.split('.');
        dbSelect.innerHTML += "<option value='"+dbFile[0]+"'>"+dbFile[0].toUpperCase()+"</option>";
        if(bibleCode.toLowerCase()===dbFile[0].toLowerCase()){
            $('select.bible-version option[value='+dbFile[0].toLowerCase()+']').attr('selected','selected');
        }
      });
    }
};
document.addEventListener('DOMContentLoaded',function(){
    getDbNames(dbPath);
}, false)

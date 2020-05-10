var sqlite = require('./sqlite-cipher');
const fs = require('fs');
const path = require('path');
sqlite.iv = "kinsae";
const pass = '!25Z#Gcs';
const dbFiles = path.join(__dirname, '../','lib');
const innerDbFiles = path.join(__dirname, '../','app','lib');
const dbs = ['ESV','KJV','NNRV','HIND','NKJV'];

function deleteFolderRecursive(libPath) {
  if( fs.existsSync(libPath) ) {
      fs.readdirSync(libPath).forEach(function(file) {
        let curPath = libPath + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(libPath); //delete directory
    }
};
function makeLibFolder(libPath){
    if (!fs.existsSync(libPath)){
        fs.mkdirSync(libPath,{recursive:true}, err =>{});
    }
}
function encryptDB(libPath){
    dbs.forEach(function(db){
        sqlite.encrypt(__dirname+'/database/'+db+'.sqlite', libPath+'/'+db.toLowerCase()+'.dll', pass,'aes-256-ctr');
    });
}
const dbFolders = [dbFiles,innerDbFiles];
function deleteCreateAndEncrypt(dbFolderPath){
    let xp;
    for(xp of dbFolderPath){
        deleteFolderRecursive(xp);
        makeLibFolder(xp);
        encryptDB(xp);
    }
}
deleteCreateAndEncrypt(dbFolders);

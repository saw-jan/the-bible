var sqlite = require('./sqlite-cipher');
const fs = require('fs');
const path = require('path');

sqlite.iv = 'kinsae';
// encryption / decryption password
const secret = '!25Z#Gcs';

// path to encrypted database
const dbFilePath = path.join(__dirname, '../', 'lib');
const innerDbFilePath = path.join(__dirname, '../', 'app', 'lib');

// get all database from database folder
function readFiles() {
  const databaseFolder = __dirname + '/database';
  var dbArray = [];
  if (fs.existsSync(databaseFolder)) {
    // read folder contents and loop though each file or folder in an array
    fs.readdirSync(databaseFolder).forEach(function (db) {
      let dbFullPath = databaseFolder + '/' + db;

      // check if current element is a folder
      if (!fs.lstatSync(dbFullPath).isDirectory()) {
        dbArray.push(dbFullPath);
      }
    });
  }
  return dbArray;
}

// deletes database folders from given paths
function deleteFolderRecursive(libPath) {
  if (fs.existsSync(libPath)) {
    // read folder contents and loop though each file or folder in an array
    fs.readdirSync(libPath).forEach(function (file) {
      let filePath = libPath + '/' + file;

      // check if current element is a folder
      if (fs.lstatSync(filePath).isDirectory()) {
        // recursive function call
        deleteFolderRecursive(filePath);
      } else {
        // if element is a file, delete file
        fs.unlinkSync(filePath);
      }
    });
    // finally delete parent folder
    fs.rmdirSync(libPath);
  }
}

// makes 'lib' folder to given path
function makeLibFolder(libPath) {
  // check if folder exists
  if (!fs.existsSync(libPath)) {
    // create new 'lib' folder
    fs.mkdirSync(libPath, { recursive: true }, (err) => {});
  }
}

//
function encryptDB(libPath) {
  const dbs = readFiles();
  dbs.forEach(function (db) {
    var db_name = (function () {
      var arr = db.split('/');
      var full_name = arr[arr.length - 1];
      full_name = full_name.replace('.sqlite', '');
      full_name = full_name.replace('.db', '');
      return full_name.toLowerCase();
    })();
    // encrypt sqlite database
    sqlite.encrypt(db, libPath + '/' + db_name + '.dll', secret, 'aes-256-ctr');
  });
}

const dbFolders = [dbFilePath, innerDbFilePath];
// runner function
function deleteCreateAndEncrypt(dbFolderPath) {
  var dbPath;
  for (dbPath of dbFolderPath) {
    // delete existing folder
    deleteFolderRecursive(dbPath);
    // make folder again
    makeLibFolder(dbPath);
    // encrypt and move encrypted files
    encryptDB(dbPath);
  }
}

// call to runner function
deleteCreateAndEncrypt(dbFolders);

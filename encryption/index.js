var sqlite = require('./sqlite-cipher');
const fs = require('fs');
const path = require('path');

sqlite.iv = 'kinsae';
// encryption / decryption password
const pass = '!25Z#Gcs';

// path to encrypted database
const dbFilePath = path.join(__dirname, '../', 'lib');
const innerDbFilePath = path.join(__dirname, '../', 'app', 'lib');

// short names for databases
const dbs = ['ESV', 'KJV', 'NNRV', 'HIND', 'NKJV'];

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
  dbs.forEach(function (db) {
    // encrypt sqlite database
    sqlite.encrypt(
      __dirname + '/database/' + db + '.sqlite',
      libPath + '/' + db.toLowerCase() + '.dll',
      pass,
      'aes-256-ctr'
    );
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

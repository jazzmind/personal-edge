const path = require('path');
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');

// get application version from package.json
const appVersion = require('../package.json').version;

// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

console.log('\nRunning post-build tasks');

// our version.json will be in the dist folder
const versionFilePath = path.join(__dirname + '/../www/version.json');
const distFilePath = path.join(__dirname + '/../www/');

// RegExp to find main.js (ionic 4, no hash required)
let mainHash = '';
const mainFile = 'main.js';
const mainFilepath = path.join(distFilePath, 'build/', mainFile);
const indexFile = 'index.html';
const indexFilePath = path.join(distFilePath, indexFile);

// get checksum from a string
function getChecksum(str) {
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
}

// read the dist folder files and find the one we're looking for
// readDir(path.join(__dirname, '../www/build/'))
readFile(mainFilepath, 'utf8')
  .then(data => {
    mainHash = getChecksum(data);
    console.log(`Writing version and hash ${mainHash} to ${versionFilePath}`);

    // write current version and hash into the version.json file
    return writeFile(versionFilePath, `{"version": "${appVersion}", "hash": "${mainHash}"}`);
  }).then(() => {
    console.log(`Replacing hash in the ${mainFilepath}`);

    // replace hash placeholder in our main.js file so the code knows it's current hash
    return readFile(mainFilepath, 'utf8');
  }).then(mainFileData => {
    const replacedFile = mainFileData.replace(/{{POST_BUILD_ENTERS_HASH_HERE}}/g, mainHash);
    return writeFile(mainFilepath, replacedFile);
  })
  .then(() => {
    console.log(`Replacing hash in the ${indexFilePath}`);
    return readFile(indexFilePath, 'utf8')
  })
  .then(indexFileData => {
    const replacedFile = indexFileData.replace(/{{TIMESTAMP}}/g, mainHash);
    return writeFile(indexFilePath, replacedFile);
  })
  .catch(err => {
    console.log('Error with post build:', err);
  });

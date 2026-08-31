const stream = require('stream');
const fs = require('fs');
const path = require('path');

function readFileAsStream(filePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let data = '';
    readStream.on('data', chunk => {
      data += chunk;
    });
    readStream.on('end', () => {
      resolve(data);
    });
    readStream.on('error', err => {
      reject(err);
    });
  });
}

async function readFileAsStreamDemo(filePath) {
  console.log(`Lettura del file come stream: ${filePath}`);
  try {
    const data = await readFileAsStream(filePath);
    console.log('Contenuto del file:');
    console.log(data);
  } catch (err) {
    console.error(`Errore durante la lettura del file: ${err.message}`);
  }
}

module.exports = { readFileAsStream, readFileAsStreamDemo };

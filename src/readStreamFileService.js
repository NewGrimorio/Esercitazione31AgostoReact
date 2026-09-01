/* 9. Stream

Questa è la parte più interessante.

Implementare:

6. Analizza file con Stream

Il programma dovrà analizzare il file utilizzando:

fs.createReadStream()

senza caricare tutto il file in memoria.

Dovrà contare almeno:

byte;
chunk ricevuti;
righe;
parole.

Esempio:

=================================
 STREAM ANALYZER
=================================

File: grande.txt

Lettura in corso...

Chunk ricevuti: 128
Byte letti:     52428800
Righe:          845321
Parole:         6234190

Analisi completata.
Obiettivo didattico

Far capire la differenza tra:

fs.readFile()

e:

fs.createReadStream()

Gli studenti dovrebbero verificare che un file molto grande può essere elaborato con un consumo di memoria molto più contenuto utilizzando gli stream.
*/

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
    const receivedChunks = data.split('\n');
    const byteCount = Buffer.byteLength(data, 'utf8');
    const lineCount = receivedChunks.length;
    const wordCount = data.split(/\s+/).filter(Boolean).length;
    console.log(`Chunk ricevuti: ${receivedChunks.length}`);
    console.log(`Byte letti:     ${byteCount}`);
    console.log(`Righe:          ${lineCount}`);
    console.log(`Parole:         ${wordCount}`);
  } catch (err) {
    console.error(`Errore durante la lettura del file: ${err.message}`);
  }
}

module.exports = { readFileAsStream, readFileAsStreamDemo };

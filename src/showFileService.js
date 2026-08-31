/*
2. Elenco dei file

Creare una cartella:

files/

Il programma dovrà utilizzare fs per recuperare i file presenti nella cartella.

Esempio:

File disponibili:

1. testo.txt
2. dati.csv
3. documento.json
4. foto.jpg
5. archivio.bin

Utilizzare:

fs.readdir()

oppure:

fs.promises.readdir()
Requisito

Devono essere mostrati solamente i file, non le directory.

Per distinguere file e cartelle è possibile utilizzare:

fs.stat()

o:

fs.promises.stat()
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function listFilesInDirectory(directoryPath) {
  try{
    const files = fs.readdirSync(directoryPath);
    const fileList = files.filter(file => {
      const filePath = path.join(directoryPath, file);
      return fs.statSync(filePath).isFile();
    });
    return fileList;
  }catch(err){
    console.error(`Errore durante la lettura della cartella: ${err.message}`);
    return [];
  }
}

module.exports = {
  listFilesInDirectory
};

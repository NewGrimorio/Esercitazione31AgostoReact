/*

    Seleziona file

deve comparire:

Quale file vuoi selezionare?
1. testo.txt
2. dati.csv
3. documento.json

Inserisci il numero:

Il programma dovrà memorizzare il file selezionato.

Esempio:

File selezionato: dati.csv
Vincolo

Non deve essere possibile analizzare o copiare un file se prima non ne è stato selezionato uno.

*/
const { listFilesInDirectory } = require('./showFileService');
const path = require('path');

const FILES_DIR = path.join(__dirname, '..', 'input', 'files');

function showFileSelectionMenu(files) {
  console.log('Quale file vuoi selezionare?');
  files.forEach((file, index) => console.log(`${index + 1}. ${file}`));
}


async function selectFileDemo(ask) {
  const files = listFilesInDirectory(FILES_DIR);
  if (files.length === 0) {
    console.log('Nessun file disponibile nella cartella files.');
    return null;
  }

  showFileSelectionMenu(files);
  const answer = (await ask('Inserisci il numero: ')).trim();
  const index = parseInt(answer, 10) - 1;

  if (Number.isNaN(index) || index < 0 || index >= files.length) {
    console.log(`Scelta non valida: "${answer}"`);
    return null;
  }

  const selectedFile = files[index];
  console.log(`File selezionato: ${selectedFile}`);
  return path.join(FILES_DIR, selectedFile);
}

module.exports = {
  FILES_DIR,
  showFileSelectionMenu,
  selectFileDemo,
};

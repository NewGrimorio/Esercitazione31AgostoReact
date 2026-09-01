// File Analizer CLI

//OBIETTIVO:
/**
 * visualizzare i file presenti in una cartella;
 * selezionare un file tramite readline;
 * leggerne il contenuto;
 * analizzarlo utilizzando Buffer;
 * calcolare statistiche sul contenuto;
 * creare una copia del file;
 * calcolare l'hash del file;
 * leggere file di grandi dimensioni tramite Stream;
 * visualizzare informazioni sul sistema operativo.
 *
 * L'applicazione dovrà funzionare esclusivamente da terminale, senza interfaccia grafica
 */

//1)
// File Analizer CLI

//OBIETTIVO:
/**
 * visualizzare i file presenti in una cartella;
 * selezionare un file tramite readline;
 * leggerne il contenuto;
 * analizzarlo utilizzando Buffer;
 * calcolare statistiche sul contenuto;
 * creare una copia del file;
 * calcolare l'hash del file;
 * leggere file di grandi dimensioni tramite Stream;
 * visualizzare informazioni sul sistema operativo.
 *
 * L'applicazione dovrà funzionare esclusivamente da terminale, senza interfaccia grafica
 */
/*
Bonus: modalità HTTP

Per gli studenti più avanzati, aggiungerei una parte finale.

Creare un piccolo server:

GET /files

che restituisca la lista dei file.

GET /file?name=testo.txt

che restituisca le informazioni sul file.

Esempio:

http://localhost:3000/files

Risposta:

[
    "testo.txt",
    "dati.csv",
    "documento.json"
]

E:

http://localhost:3000/file?name=testo.txt
{
    "name": "testo.txt",
    "size": 1842,
    "extension": ".txt",
    "lines": 45,
    "words": 312
}

Qui entrerebbero in gioco anche:

http
url
*/

const { listFilesInDirectory } = require('./src/showFileService');
const readFileService = require('./src/readFileService');
const selectFileService = require('./src/selectFileService');
const copyFileService = require('./src/copyFileService');
const hashFileService = require('./src/hashFileService');
const readStreamService = require('./src/readStreamFileService');
const osInfoService = require('./src/osInfoService');
const httpServerService = require('./src/HttpServerService');
const readline = require('readline');
const path = require('path');

const FILES_DIR = path.join(__dirname, 'input', 'files');
const OUTPUT_DIR = path.join(__dirname, 'output');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function showMenu() {
    console.log('\n========== MENU ==========');
    console.log("1) Elenca i file presenti nella cartella files");
    console.log("2) Seleziona un file presente nella cartella files");
    console.log("3) Analizza il contenuto del file selezionato");
    console.log("4) Crea una copia del file selezionato nella cartella output");
    console.log("5) Calcola l'hash del file selezionato");
    console.log("6) Leggi il file con il modulo stream");
    console.log("7) Visualizza informazioni sul sistema operativo");
    console.log("8) Avvia un server HTTP per visualizzare i file e le informazioni sui file");
    console.log("0) Esci dal programma");
}

async function main() {
    let selectedFilePath = null;
    console.log("Benvenuto nell'applicazione File Analyzer CLI!");
    let menu = true;
    while (menu) {
        showMenu();
        const choice = (await ask("Seleziona un'opzione: ")).trim();
        switch (choice) {
      case '1': {
        const files = listFilesInDirectory(FILES_DIR);
        console.log('File disponibili:');
        files.forEach((file, index) => console.log(`${index + 1}. ${file}`));
        break;
      }
      case '2':
        selectedFilePath = await selectFileService.selectFileDemo(ask);
        break;
      case '3':
        if (!selectedFilePath) {
          console.log('Nessun file selezionato. Seleziona un file prima di analizzarlo.');
          break;
        }
        await readFileService.analyzeFileDemo(selectedFilePath);
        break;
      case '4':
        if (!selectedFilePath) {
          console.log('Nessun file selezionato. Seleziona un file prima di copiarlo.');
          break;
        }
        await copyFileService.copyFileDemo(selectedFilePath, OUTPUT_DIR, ask);
        break;
      case '5':
        if (!selectedFilePath) {
          console.log('Nessun file selezionato. Seleziona un file prima di calcolarne l\'hash.');
          break;
        }
        await hashFileService.calculateFileHashDemo(selectedFilePath,ask);
        break;
      case '6':
        if (!selectedFilePath) {
          console.log('Nessun file selezionato. Seleziona un file prima di leggerlo.');
          break;
        }
        await readStreamService.readFileAsStreamDemo(selectedFilePath);
        break;
      case '7':
        const osInfo = osInfoService.getSystemInfo();
        break;
      case '8':
        await httpServerService.serverDemo(FILES_DIR, ask);
        break;
      case '0':
        console.log('Arrivederci!');
        menu = false;
        break;
      default:
        console.log(`Scelta non valida: "${choice}"`);
        }
    }
    rl.close();
}

main();



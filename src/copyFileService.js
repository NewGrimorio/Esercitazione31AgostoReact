/* 7. Copia del file

Implementare:

4. Copia file

Il programma deve chiedere:

Nome della copia:

Esempio:

Nome della copia: backup.txt

File copiato correttamente.

Utilizzare:

fs.copyFile()

oppure:

fs.promises.copyFile()
Bonus

Se il file esiste già:

Il file backup.txt esiste già.

1. Sovrascrivi
2. Scegli un altro nome
3. Annulla


*/

const fs = require('fs');
const path = require('path');


async function copyFile(sourcePath, destinationPath) {
    await fs.promises.copyFile(sourcePath, destinationPath);
}

async function copyFileDemo(sourcePath, destinationDir, ask) {
    if (!fs.existsSync(sourcePath)) {
        console.log(`Il file sorgente ${sourcePath} non esiste. Impossibile copiare.`);
        return;
    }
    fs.mkdirSync(destinationDir, { recursive: true });

    let destinationPath = null;

    while (destinationPath === null) {
        const name = (await ask('Nome della copia: ')).trim();
        if (!name) {
            console.log('Il nome non può essere vuoto.');
            continue;
        }
        const candidate = path.join(destinationDir, name);

        if (!fs.existsSync(candidate)) {
            destinationPath = candidate;
            break;
        }

        console.log(`Il file ${name} esiste già.`);
        console.log('1. Sovrascrivi');
        console.log('2. Scegli un altro nome');
        console.log('3. Annulla');
        const choice = (await ask('Scelta: ')).trim();

        if (choice === '1') {
            destinationPath = candidate;          
        } else if (choice === '3') {
            console.log('Copia annullata.');
            return;
        }
    }

    try {
        await copyFile(sourcePath, destinationPath);
        console.log('File copiato correttamente.');
    } catch (err) {
        console.error(`Errore durante la copia del file: ${err.message}`);
    }
}

module.exports = { copyFile, copyFileDemo };

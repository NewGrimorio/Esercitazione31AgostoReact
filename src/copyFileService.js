const fs = require('fs');
const path = require('path');

async function copyFile(sourcePath, destinationPath) {
    try {
        await fs.promises.copyFile(sourcePath, destinationPath);
        console.log(`File copiato con successo da ${sourcePath} a ${destinationPath}`);
    } catch (err) {
        console.error(`Errore durante la copia del file: ${err.message}`);
    }
}

async function copyFileDemo(sourcePath, destinationDir) {
    console.log(`Copia del file: ${sourcePath} nella cartella: ${destinationDir}`);
    if (!fs.existsSync(destinationDir)) {
        console.log(`La cartella di destinazione non esiste. Creazione della cartella: ${destinationDir}`);
        fs.mkdirSync(destinationDir, { recursive: true });
    }
    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(destinationDir, fileName);
    await copyFile(sourcePath, destinationPath);
}

module.exports = { copyFile, copyFileDemo };

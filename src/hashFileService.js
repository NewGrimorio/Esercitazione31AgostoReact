const fs = require('fs');
const path = require('path');
const hash = require('crypto');

async function calculateFileHash(filePath) {
    try {
        const fileBuffer = await fs.promises.readFile(filePath);
        const hashSum = hash.createHash('sha256');
        hashSum.update(fileBuffer);
        return hashSum.digest('hex');
    } catch (err) {
        console.error(`Errore durante il calcolo dell'hash del file: ${err.message}`);
        return null;
    }
}

async function calculateFileHashDemo(filePath) {
    console.log(`Calcolo dell'hash del file: ${filePath}`);
    const hashValue = await calculateFileHash(filePath);
    if (hashValue) {
        console.log(`Hash calcolato: ${hashValue}`);
    } else {
        console.log('Impossibile calcolare l\'hash del file.');
    }
}

module.exports = { calculateFileHash, calculateFileHashDemo };


/*
5. Calcola hash

Utilizzando il modulo:

crypto

Calcolare almeno:

SHA-256

Esempio:

=================================
 HASH FILE
=================================

File: documento.pdf

SHA-256:

a4c3f8e91d8a...

Gli studenti dovranno leggere il file come Buffer e passarlo a:

crypto.createHash()
Bonus

Permettere all'utente di scegliere:

1. MD5
2. SHA-1
3. SHA-256
4. SHA-512
*/

const fs = require('fs');
const path = require('path');
const hash = require('crypto');
const readFileService = require('./readFileService');

async function calculateFileHash(filePath,hashType) {
    try {
        const fileBuffer = await fs.promises.readFile(filePath);
        const hashSum = hash.createHash(hashType);
        hashSum.update(fileBuffer);
        return hashSum.digest('hex');
    } catch (err) {
        console.error(`Errore durante il calcolo dell'hash del file: ${err.message}`);
        return null;
    }
}

async function calculateFileHashDemo(filePath,ask) {
    const hashType = await ask("Scegli il tipo di hash (md5, sha1, sha256, sha512): ");
    const hashValue = await calculateFileHash(filePath, hashType);
    if (hashValue) {
        console.log(`Hash calcolato (${hashType}): ${hashValue}`);
    } else {
        console.log('Impossibile calcolare l\'hash del file.');
    }
}

module.exports = { calculateFileHash, calculateFileHashDemo };


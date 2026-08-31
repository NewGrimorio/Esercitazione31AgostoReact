/*
4. Lettura del file

Utilizzare fs per leggere il file.

Per i file testuali è possibile utilizzare:

fs.readFile()

specificando:

'utf8'

Ma almeno una delle funzionalità dell'applicazione dovrà leggere il file senza specificare l'encoding, ottenendo quindi un:

Buffer
5. Analisi tramite Buffer

Questa è una delle parti principali dell'esercitazione.

Dato un file:

testo.txt

utilizzare un Buffer per determinare:

dimensione del file in byte;
numero di caratteri;
numero di parole;
numero di righe;
primo byte;
ultimo byte;
rappresentazione esadecimale dei primi 20 byte.

Esempio:

=================================
 ANALISI FILE
=================================

File: testo.txt

Dimensione:       1842 byte
Caratteri:        1730
Parole:            312
Righe:              45

Primo byte:         72
Ultimo byte:       10

Primi 20 byte:
48 65 6c 6c 6f 20 57 6f 72 6c 64 0a ...
Metodi Buffer consigliati

Gli studenti possono utilizzare:

Buffer.from()
buffer.length
buffer[index]
buffer.toString()
buffer.toString('hex')
6. Statistiche del testo

Se il file è testuale, calcolare anche:

Carattere più frequente

Esempio:

Carattere più frequente: "e"
Occorrenze: 142
Parola più frequente

Esempio:

Parola più frequente: "node"
Occorrenze: 27
Lunghezza media delle parole
Lunghezza media parola: 5.42
Numero di:
Maiuscole:       152
Minuscole:       1345
Numeri:           87
Spazi:            298
Caratteri speciali: 64

*/

const fs = require('fs');
const path = require('path');

// Legge il file come testo (encoding utf8).
async function readFileContent(filePath) {
  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch (err) {
    console.error(`Errore durante la lettura del file: ${err.message}`);
    return null;
  }
}

// Legge il file come un buffer (senza specificare l'encoding).
async function readFileAsBuffer(filePath) {
  try {
    return await fs.promises.readFile(filePath);
  } catch (err) {
    console.error(`Errore durante la lettura del file come Buffer: ${err.message}`);
    return null;
  }
}


function analyzeBuffer(buffer) {
  const text = buffer.toString('utf8');
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const lines = text.split(/\r?\n/);

  return {
    size: buffer.length,
    characters: text.length,
    words: words.length,
    lines: lines.length,
    firstByte: buffer[0],
    lastByte: buffer[buffer.length - 1],
    first20Hex: buffer.subarray(0, 20).toString('hex').match(/.{2}/g).join(' '),
  };
}


function textStatistics(text) {
  const charCount = {};
  const wordCount = {};
  const counters = { uppercase: 0, lowercase: 0, digits: 0, spaces: 0, special: 0 };

  for (const ch of text) {
    if (/[A-Z]/.test(ch)) counters.uppercase++;
    else if (/[a-z]/.test(ch)) counters.lowercase++;
    else if (/[0-9]/.test(ch)) counters.digits++;
    else if (/\s/.test(ch)) counters.spaces++;
    else counters.special++;

    // Per il carattere più frequente ignoro spazi e a capo
    if (!/\s/.test(ch)) charCount[ch] = (charCount[ch] || 0) + 1;
  }

  const words = text.toLowerCase().match(/[a-zàèéìòù0-9]+/g) || [];
  for (const w of words) wordCount[w] = (wordCount[w] || 0) + 1;

  const mostFrequent = (obj) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

  const [topChar, topCharCount] = mostFrequent(charCount);
  const [topWord, topWordCount] = mostFrequent(wordCount);
  const avgWordLength = words.length
    ? words.reduce((sum, w) => sum + w.length, 0) / words.length
    : 0;

  return { topChar, topCharCount, topWord, topWordCount, avgWordLength, ...counters };
}


async function analyzeFileDemo(filePath) {
  const buffer = await readFileAsBuffer(filePath);
  if (buffer === null) return;

  const a = analyzeBuffer(buffer);
  console.log('\n=================================');
  console.log(' ANALISI FILE');
  console.log('=================================\n');
  console.log(`File: ${path.basename(filePath)}\n`);
  console.log(`Dimensione:   ${String(a.size).padStart(8)} byte`);
  console.log(`Caratteri:    ${String(a.characters).padStart(8)}`);
  console.log(`Parole:       ${String(a.words).padStart(8)}`);
  console.log(`Righe:        ${String(a.lines).padStart(8)}\n`);
  console.log(`Primo byte:   ${String(a.firstByte).padStart(8)}`);
  console.log(`Ultimo byte:  ${String(a.lastByte).padStart(8)}\n`);
  console.log('Primi 20 byte:');
  console.log(`${a.first20Hex} ...`);

  const s = textStatistics(buffer.toString('utf8'));
  console.log('\n---------- Statistiche testo ----------');
  console.log(`Carattere più frequente: "${s.topChar}"  (occorrenze: ${s.topCharCount})`);
  console.log(`Parola più frequente:    "${s.topWord}"  (occorrenze: ${s.topWordCount})`);
  console.log(`Lunghezza media parola:  ${s.avgWordLength.toFixed(2)}\n`);
  console.log(`Maiuscole:          ${String(s.uppercase).padStart(6)}`);
  console.log(`Minuscole:          ${String(s.lowercase).padStart(6)}`);
  console.log(`Numeri:             ${String(s.digits).padStart(6)}`);
  console.log(`Spazi:              ${String(s.spaces).padStart(6)}`);
  console.log(`Caratteri speciali: ${String(s.special).padStart(6)}`);

  return { ...a, ...s };
}


async function readFileDemo(filePath, ask) {
  console.log('Seleziona come vuoi leggere il file:');
  console.log('1) Leggi come testo');
  console.log('2) Leggi come Buffer');
  const answer = (await ask("Seleziona un'opzione: ")).trim();

  if (answer === '1') {
    const content = await readFileContent(filePath);
    if (content !== null) console.log(`Contenuto del file ${filePath}:\n${content}`);
  } else if (answer === '2') {
    const content = await readFileAsBuffer(filePath);
    if (content !== null) console.log(`Contenuto del file ${filePath} come Buffer:\n`, content);
  } else {
    console.log('Opzione non valida.');
  }
}

module.exports = {
  readFileContent,
  readFileAsBuffer,
  analyzeBuffer,
  textStatistics,
  analyzeFileDemo,
  readFileDemo,
};



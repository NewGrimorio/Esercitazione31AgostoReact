/* Bonus: modalità HTTP

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

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { listFilesInDirectory } = require('./showFileService');

const PORT = process.env.PORT || 3000;
let server = null;

function createServer(filesDir) {
    return http.createServer((req, res) => {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;

        if (pathname === '/files') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(listFilesInDirectory(filesDir)));
        } else if (pathname === '/file') {
            const fileName = parsedUrl.searchParams.get('name');
            if (!fileName) {
                res.statusCode = 400;
                res.end('Parametro "name" mancante');
                return;
            }
            const filePath = path.join(filesDir, path.basename(fileName));
            fs.stat(filePath, (err, stats) => {
                if (err || !stats.isFile()) {
                    res.statusCode = 404;
                    res.end('File non trovato');
                    return;
                }
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Errore interno del server');
                        return;
                    }
                    const lines = data.split(/\r?\n/).length;
                    const words = data.split(/\s+/).filter(Boolean).length;
                    const fileInfo = {
                        name: path.basename(fileName),
                        size: stats.size,
                        extension: path.extname(fileName),
                        lines,
                        words
                    };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(fileInfo));
                });
            });
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    });
}

function startServer(filesDir) {
    return new Promise((resolve) => {
        if (server) return resolve();
        server = createServer(filesDir);
        server.listen(PORT, () => {
            console.log(`Server in ascolto su http://localhost:${PORT}`);
            resolve();
        });
    });
}

function stopServer() {
    return new Promise((resolve) => {
        if (!server) return resolve();
        server.close(() => {
            console.log('Server fermato.');
            server = null;
            resolve();
        });
    });
}


function fetchLocal(endpoint) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}${endpoint}`, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve({ status: res.statusCode, body }));
        }).on('error', reject);
    });
}

async function serverDemo(filesDir, ask) {
    await startServer(filesDir);

    console.log('\n1) Premi 1 per elencare i file (GET /files)');
    console.log('2) Premi 2 per inserire il nome di un file (GET /file?name=...)');
    console.log('0) Torna al menu principale');
    const choice = (await ask('Scelta: ')).trim();

    let endpoint = null;
    if (choice === '1') {
        endpoint = '/files';
    } else if (choice === '2') {
        const name = (await ask('Nome del file: ')).trim();
        endpoint = `/file?name=${encodeURIComponent(name)}`;
    } else {
        return;
    }

    try {
        const { status, body } = await fetchLocal(endpoint);
        console.log(`\nGET http://localhost:${PORT}${endpoint} -> ${status}`);
        console.log(body);
    } catch (err) {
        console.error(`Errore nella richiesta: ${err.message}`);
    }
}

module.exports = { createServer, startServer, stopServer, serverDemo };

const os = require('os');

function getSystemInfo() { 
    console.log("=== Informazioni sul sistema ===");
    console.log(`Sistema operativo: ${os.type()}`);
    console.log(`Architettura: ${os.arch()}`);
    console.log(`Hostname: ${os.hostname()}`);
    console.log(`Numero di CPU: ${os.cpus().length}`);
    console.log(`Memoria disponibile: ${Math.round(os.freemem() / (1024 * 1024))} MB`);
    console.log(`Memoria totale: ${Math.round(os.totalmem() / (1024 * 1024))} MB`);
    console.log("=== Informazioni Node.js ===");
    console.log(`Versione Node.js: ${process.version}`);
    console.log(`Percorso eseguibile Node.js: ${process.execPath}`);
    console.log(`Directory di lavoro corrente: ${process.cwd()}`);
    return {
        osType: os.type(),
        architecture: os.arch(),
        hostname: os.hostname(),
        cpuCount: os.cpus().length,
        freeMemory: Math.round(os.freemem() / (1024 * 1024)),
        totalMemory: Math.round(os.totalmem() / (1024 * 1024))
    };
}

module.exports = { getSystemInfo};

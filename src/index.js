/**
 * This is entry point of REST API for CRON-like jobs creator
 */
const express = require('express');
const { json } = require('body-parser');

const { sendHttpError } = require('./helpers/http-error');

const PORT = Number(process.env.PORT) || 8293;

const api = require('./routes');

const server = express();

// Body parsing rule
server.use(json());

// Set default response headers
server.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('X-Powered-By', 'CRON HTTP server');
    next();
});

server.use(api);

server.use((err, req, res, next) => {
    sendHttpError(err, res);
});

server.listen(PORT, () => {
    console.info(`Now listening on ${PORT}`);
});

process.on('uncaughtException', onError);
process.on('unhandledRejection', onError);
server.on('error', onError);

function onError(err) {
    console.error('Runtime Error:', err.message);
    console.error(err);
}

// Start Daemon
require('./services/execute.service').info();

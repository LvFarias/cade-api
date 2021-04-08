const debugLib = require('debug');

const dbLog = debugLib('Cade-API:db');
const db = (query, ...args) => {
    dbLog(query);
};
const info = debugLib('Cade-API:info');
const debug = debugLib('Cade-API:debug');
const error = debugLib('Cade-API:error');
const server = debugLib('Cade-API:server');

module.exports = {
    db,
    info,
    debug,
    error,
    server,
};

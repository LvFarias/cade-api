const cors = require('cors');
const express = require('express');

const logger = require('./libs/logger');
const indexRoute = require('./routes');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(initEndPoint);
app.use('/user', userRoutes);
app.use('/', indexRoute);
app.use(endEndPoint);

function initEndPoint(req, res, next) {
    logger.server(`INIT --> ${req.method}: ${req.url}`);
    req.returnObj = {
        data: {},
        error: '',
        message: '',
        status: 200,
    };
    
    req.success = (data = {}) => {
        req.returnObj.data = data;
        req.returnObj.status = 200;
        next();
    };
    
    req.error = (error, message = '', status = 400) => {
        req.returnObj.error = error;
        req.returnObj.status = status;
        req.returnObj.message = message;
        next();
    };

    next();
}

function endEndPoint(req, res, next) {
    const status = req.return.status;
    delete req.return.status;
    if (!req.return.error) delete req.return.error;
    if (!req.return.message) delete req.return.message;
    if (!Object.keys(req.return.data).length) delete req.return.data;
    res.status(status).json(req.return);
    logger.server(`END --> ${req.method}: ${req.url} - STATUS: ${res.statusCode} - ORIGIN: ${res.req.headers.origin}`);
}

module.exports = app;

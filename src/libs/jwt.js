const jwt = require('jsonwebtoken');

const logger = require('./logger');

const env = process.env;

function isAuthorized(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) {
        logger.debug('não tem token');
        logger.server(`END --> ${req.method}: ${req.originalUrl} - STATUS: 401 - ORIGIN: ${res.req.headers.origin}`);
        return res.status(401).send({ message: 'Failed to authenticate.' });
    }
    token = token.replace('Bearer ', '');
    jwt.verify(token, env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            logger.debug('token não bateu');
            logger.server(`END --> ${req.method}: ${req.originalUrl} - STATUS: 401 - ORIGIN: ${res.req.headers.origin}`);
            return res.status(401).send({ message: 'Failed to authenticate.' });
        }
        req['UserId'] = decoded;
        next();
    });
}

function createUserToken(id) {
    return jwt.sign(id, env.TOKEN_SECRET);
}

function bashPassword(password) {
    return jwt.sign(password, env.PASSWORD_SECRET);
}

function comparePassword(hash, password) {
    return new Promise((res, rej) => {
        jwt.verify(hash, env.PASSWORD_SECRET, function (err, decoded) {
            if (decoded == password) res(true);
            rej('password_not_math');
        });
    });
}

module.exports = {
    isAuthorized,
    bashPassword,
    createUserToken,
    comparePassword
};

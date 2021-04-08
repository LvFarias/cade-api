require('dotenv').config();

const { db } = require('../../src/libs/logger');

module.exports = {
  development: {
    logging: db,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PW,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
  },
  production: {
    logging: false,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PW,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
  },
};
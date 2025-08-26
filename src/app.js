
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();


// Init middleware
app.use(morgan('dev'));
// app.use(morgan('combined'));
// app.use(morgan('common'));
// app.use(morgan('short'));
// app.use(morgan('tiny'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

// Init routes
app.use('/', require('./routes'));

// Handle errors

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});

module.exports = app;
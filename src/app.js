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

// Init db

// Init routes
app.get('/', (req, res, next) => {
    const strCompression = 'Hello World!';

    return res.status(200).json({ 
        message: 'Welcome to the e-commerce API',
        metadata: strCompression.repeat(100000),
    });
});

// Handle errors

module.exports = app;
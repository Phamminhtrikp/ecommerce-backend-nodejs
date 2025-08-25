'use strict';

const mongoose = require('mongoose');

const connectString = 'mongodb+srv://tripham210504:LTDLY1xfsqXtfNuY@shopdev.fnvovvg.mongodb.net/?retryWrites=true&w=majority&appName=shopDev';

mongoose.connect(connectString)
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Dev
if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

module.exports = mongoose;
'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

// const connectString = 'mongodb+srv://tripham210504:LTDLY1xfsqXtfNuY@shopdev.fnvovvg.mongodb.net/?retryWrites=true&w=majority&appName=shopDev';
const connectString = 'mongodb://localhost:27017/shopDev';


class Database {
    constructor() {
        this._connect();
    }

    _connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50, // Limit connections in pool
            minPoolSize: 5
        })
            .then(() => {
                console.log('Database connection successful', countConnect());
            })
            .catch(err => {
                console.error('Database connection error:', err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
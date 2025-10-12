'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// Count the number of connections
const countConnect = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Number of connections:: ${numConnect}`);
    return numConnect;
}

// Check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on CPU cores
        const maxConnections = numCores * 4;

        console.log(`Active connections: ${numConnect}`);
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
        if (numConnect > maxConnections) {
            console.warn(`High number of connections detected: ${numConnect}`);
        }

    }, _SECONDS); // Monitor connection every 5 seconds
}
module.exports = { countConnect, checkOverload };
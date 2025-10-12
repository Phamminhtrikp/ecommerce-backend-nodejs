'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(field => [field, 1]));
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(field => [field, 0]));
}

const removeUndefinedObject = (obj = {}) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
}

const updateNestedObjectParser = obj => {
    // If the object is null or undefined, return an empty object
    if (obj === null || obj === undefined) {
        return {}; 
    }
    const final = {};
    Object.keys(obj).forEach(key => {
        // If the value is null or undefined, skip it
        if (obj[key] === null || obj[key] === undefined) return;
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response || {}).forEach(k => {
                final[`${key}.${k}`] = response[k];
            });
        }
        else {
            final[key] = obj[key];
        }
    })
    return final;
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}
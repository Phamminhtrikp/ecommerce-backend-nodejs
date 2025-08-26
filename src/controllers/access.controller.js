'use strict';

const { CREATED, SuccessResponse, OK } = require('../core/success.resoponse');
const AccessService = require('../services/access.service');

class AccessController {
    login = async (req, res, next) => {
        new OK({ 
            message: 'Login successful', 
            metadata: await AccessService.login(req.body) 
        }).send(res);
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registration successful',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }
}

module.exports = new AccessController();

'use strict';

const { CREATED, SuccessResponse, OK } = require('../core/success.resoponse');
const AccessService = require('../services/access.service');

class AccessController {
    
    handlerRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Refresh token successful',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res);
    }


    logout = async (req, res, next) => {
        new OK({
            message: 'Logout successful',
            metadata: await AccessService.logout({ keyStore: req.keyStore })
        }).send(res);
    }

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

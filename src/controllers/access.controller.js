'use strict';

const { keys } = require('lodash');
const { CREATED, SuccessResponse, OK } = require('../core/success.resoponse');
const AccessService = require('../services/access.service');

class AccessController {

    handlerRefreshToken = async (req, res, next) => {

        /***
         * =========== V1 ==========
         *
         *   new OK({
         *       message: 'Refresh token successful',
         *       metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
         *   }).send(res);
         * 
         * ========================
        */

        /***
         * =========== V2 fixed ==========
         * No need access token
         */
        new OK({
            message: 'Refresh token successful',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
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

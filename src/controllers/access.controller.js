'use strict';

const { CREATED } = require('../core/success.resoponse');
const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registration successful',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }
}

module.exports = new AccessController();

'use strict';

const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        try {
            // Handle sign up logic
            console.log(`[P]::signUp::`, req.body);
            const result = await AccessService.signUp(req.body);
            return res.status(result.code).json(result);
        } catch (error) {
            console.error('Error in signUp controller:', error);
            next(error);
        }
    }
}

module.exports = new AccessController();

'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError, NotFoundError } = require('../core/error.resoponse');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        //

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error('Error verifying access token::', err);
                throw new Error('Token verification failed');
            }
            console.log('Access token verified successfully::', decoded);
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error creating token pair:', error);
        throw new Error('Token creation failed');
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    // Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID]?.toString();
    if (!userId) {
        throw new UnauthorizedError('Invalid Request');
    }

    // Get access token
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not Found KeyStore');
    }

    // Verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
    if (!accessToken) {
        throw new UnauthorizedError('Invalid Request');
    }

    // Check user in dbs
    // Check keyStore with this userId
    // OK all => return next()
    try {
        const decodedUser = await JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodedUser.userId) {
            throw new UnauthorizedError('Invalid User');
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }

});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);

}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}

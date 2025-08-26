'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}

'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { ConflictError, InternalServerError, UnauthorizedError } = require('../core/error.resoponse');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {


    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById( keyStore._id );
        console.log({delKey});
        return delKey;
    }

    static login = async ({ email, password, refreshToken = null }) => {
        // Check email in dbs
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new UnauthorizedError('Authentication failed! Email or password is incorrect. Please try again.');
        }

        // Check match password
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new UnauthorizedError('Authentication failed! Email or password is incorrect. Please try again.');
        }

        // Create access token and refresh token
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // Generate tokens
        const { _id: userId } = foundShop;
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
        });
        // Get data return login
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // Check email exists
        const holderShop = await findByEmail({ email });
        if (holderShop) {
            throw new ConflictError('Shop already registered!');
        }

        // Hash password & create shop
        const hashedPassword = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: hashedPassword,
            roles: [RoleShop.SHOP]
        });

        if (!newShop) {
            throw new InternalServerError('Error creating new shop');
        }

        // Generate key pair
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // Save KeyStore
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey
        });

        if (!keyStore) {
            throw new InternalServerError('Failed to create keyStore');
        }

        // Generate tokens
        const tokens = await createTokenPair(
            { userId: newShop._id, email },
            publicKey,
            privateKey
        );

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newShop
            }),
            tokens
        };
    }

}

module.exports = AccessService;
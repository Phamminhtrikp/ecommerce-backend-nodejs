'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { ConflictRequestError, InternalServerRequestError } = require('../core/error.resoponse');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        // Check email exists
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new ConflictRequestError('Shop already registered!');
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
            throw new InternalServerRequestError('Error creating new shop');
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
            throw new InternalServerRequestError('Failed to create keyStore');
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
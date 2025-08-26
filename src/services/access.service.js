'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            // Check email exists

            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 409,
                    message: 'Shop already registered!',
                    status: 'error'
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: hashedPassword, roles: [RoleShop.SHOP] });

            if (newShop) {
                // Created privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({ privateKey, publicKey }); // Save collection keyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore) {
                    return {
                        code: 500,
                        message: 'keyStore error!',
                    }
                }

                // Created token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                console.log(`Created tokens::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;
'use strict';

const { toObjectId } = require('../helpers/toObjectId');
const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // Lvl 0
            // const tokens = await KeytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // });

            // return tokens ? tokens.publicKey : null;

            // lvl xx
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true };
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {

        return await keytokenModel.findOne({ user: toObjectId(userId) });
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id });
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken });
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId });
    }
}

module.exports = KeyTokenService;
/** @format */

const aes256 = require('aes256');

require('dotenv').config();

const cipher = aes256.createCipher(process.env.SECRET_KEY);

module.exports = {
    encrypt: (plaintext) => {
        return cipher.encrypt(plaintext);
    },
    decrypt: (plaintext) => {
        return cipher.decrypt(plaintext);
    },
};

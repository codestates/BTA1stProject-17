/** @format */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const aes256 = require('../utils/aes');

const {
    AccountBalanceQuery,
    AccountCreateTransaction,
    Client,
    Hbar,
    Mnemonic,
    ScheduleCreateTransaction,
    ScheduleSignTransaction,
    TransferTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config();

// db.json를 조작하기 위해 lowdb 사용
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
        'Environment variables myAccountId and myPrivateKey must be present'
    );
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

/*
 *  /api
 */
router.use((req, res, next) => {
    const walletData = db.get('wallet').value();
    // console.log(walletData);
    if (walletData.hash) {
        // console.log(walletData.hash);
        req.wallet = {
            hash: walletData.hash,
            access_time: walletData.access_time,
        };
    } else {
    }
    next();
});
router.post('/makeNewWallet', async (req, res, next) => {
    // console.clear();
    console.log('======== make New Wallet Begin ===========');
    try {
        const params = req.body;
        if (!params.password) throw new Error('not invalid password');

        const mnemonic = await makeNewMnemonic();
        const newAccountPrivateKey = await mnemonic.toEd25519PrivateKey();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;

        const accountCreateTransactionResponse =
            await new AccountCreateTransaction()
                .setKey(newAccountPublicKey)
                .setInitialBalance(Hbar.fromTinybars(1000))
                .execute(client);

        const accountCreateTransactionReceipt =
            await accountCreateTransactionResponse.getReceipt(client);
        const newAccountId = accountCreateTransactionReceipt.accountId;

        const hashedPwd = await hash(params.password);
        const hashedMnemonic = await hash(mnemonic.toString());
        const hashedAll = await hash(hashedMnemonic, hashedPwd);

        saveHashCode(hashedMnemonic, hashedAll);

        console.log('======== make New Wallet End ===========');

        res.json({
            message: 'ok',
            data: {
                mnemonic: mnemonic.toString(),
                privateKey: newAccountPrivateKey.toString(),
                publicKey: newAccountPublicKey.toString(),
                // accountId: newAccountId.toString(),
            },
        });
    } catch (err) {
        res.status(500);
        res.json({ message: err.message });
    }
});

router.post('/login', async (req, res, next) => {
    if (!req.body.password)
        res.status(500).json({ message: 'not invalid password' });

    if (await compareHash(req.body.password)) {
        db.get('wallet')
            .assign({
                access_time: ((Date.now() / 1000) | 0) + 3600,
            })
            .write();
        res.status(200).json({ message: 'login success' });
    } else {
        res.status(500).json({ message: 'login failed' });
    }
});

router.post('/restore-vault', async (req, res, next) => {
    const { mnemonic, password } = req.body;
    // const mnemonic = req.body.mnemonic;
    // const password = req.body.password;

    res.json({
        mnemonic: mnemonic,
        password: password,
    });
});

router.post('/aestest', (req, res, next) => {
    const encrypt = aes256.encrypt(req.body.password);
    // console.log(encrypt);
    const decrypt = aes256.decrypt(encrypt);
    // console.log(decrypt);
    res.send(decrypt);
});

router.use((err, req, res, next) => {
    res.status(500);
    res.json({ message: err.message });
});

const makeNewMnemonic = async () => {
    const mnemonic = await Mnemonic.generate12();
    return mnemonic;
};

const hash = async (mnemonic, password = null) => {
    const hashValue = mnemonic + password;
    return crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(hashValue)
        .digest('hex');
};

const getHashCode = async () => {
    return db.get('wallet').value();
};

const saveHashCode = async (hashedMnemonic, hash) => {
    if (!hash || !hashedMnemonic) throw new Error('not invalid hash');

    const response = db
        .get('wallet')
        .assign({
            hashedMnemonic: hashedMnemonic,
            hash: hash,
            access_time: ((Date.now() / 1000) | 0) + 3600,
        })
        .write();
    return response;
};

const saveHashCodeAES256 = async(hash);

const compareHash = async (password) => {
    const walletData = db.get('wallet').value();
    const { hashedMnemonic, hash: walletHash } = walletData;

    const newHash = await hash(hashedMnemonic, await hash(password));

    if (walletHash == newHash) return true;
    return false;
};

module.exports = router;

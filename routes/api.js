/** @format */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

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
    console.log(walletData);
    if (walletData.hash) {
        console.log(walletData.hash);
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

        // const accountCreateTransactionResponse =
        //     await new AccountCreateTransaction()
        //         .setKey(newAccountPublicKey)
        //         .setInitialBalance(Hbar.fromTinybars(1000))
        //         .execute(client);

        // const accountCreateTransactionReceipt =
        //     await accountCreateTransactionResponse.getReceipt(client);
        // const newAccountId = accountCreateTransactionReceipt.accountId; // 어드레스 역할 같음
        // console.log(newAccountId);

        const hashedPwd = await hash(params.password);
        const hashedMnemonic = await hash(mnemonic.toString());
        const hashedAll = await hash(hashedMnemonic, hashedPwd);
        // console.log(`hashedPwd :: ${hashedPwd}`);
        // console.log(`hashedMnemonic :: ${hashedMnemonic}`);
        // console.log(`hashedAll :: ${hashedAll}`);
        // console.log(
        //     await hash(
        //         '65572a449885e1b47f3f6c86f6a2f37d67409b4ea7977653bdb6988d57e804b5',
        //         '26406eac16210b4a099cc5993f7c659624e65591ee002e159b61646dec6387b8'
        //     )
        // );
        // console.log(
        //     '54a99592cc0ca590eef7668fd3b4c3036eff26716156d9c58bc872ee88405bed'
        // );
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
    // console.clear();
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

// router.post('/newMnemonic', async (req, res, next) => {
//     try {
//         const params = req.body;
//         const key = process.env.GENERATE_PWD;
//         console.log(`key : ${key}`);
//         console.log(params);
//         if (!params.password) throw new Error('비번 없음');
//         const mnemonic = await makeNewMnemonic();
//         const newAccountPrivateKey = await mnemonic.toEd25519PrivateKey(key);
//         console.log(newAccountPrivateKey.toString());
//         res.json({
//             message: 'ok',
//             data: {
//                 mnemonic: mnemonic.toString(),
//                 privateKey: newAccountPrivateKey.toString(),
//             },
//         });
//     } catch (err) {
//         res.status(500);
//         res.json({ message: err.message });
//     }
// });

// router.post('/cryptoTest', async (req, res, next) => {
//     const asd = await saveHashCode(
//         '1ce03fcb1f929a4c038310fc7c551b88aa4cadc3c29cee7b23de8b17f42827e7'
//     );
//     const hashValue = await hash(req.body.password);
//     const walletData = await getHashCode();
//     if (!walletData) res.send('not hashed');
//     // console.log(walletData);
//     // res.send(hashValue);
// });

// router.post('/insertTest', async (req, res, next) => {
//     db.get('table1')
//         .push({
//             name: req.body.name,
//             age: req.body.age,
//         })
//         .write();
//     console.log(req.body);
//     res.send('insertTest');
// });

router.post('/restore-vault', async (req, res, next) => {
    const { mnemonic, password } = req.body;
    // const mnemonic = req.body.mnemonic;
    // const password = req.body.password;

    res.json({
        mnemonic: mnemonic,
        password: password,
    });
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
    // console.clear();
    if (!hash || !hashedMnemonic) throw new Error('not invalid hash');
    // let hashCode = await getHashCode();

    // if (
    //     hashCode.hash &&
    //     typeof hashCode.hash == 'string' &&
    //     hashCode.hash.length == 64
    // ) {
    //     // todo) 저장된 해시를 수정
    //     console.log('수정');
    //     const result = db
    //         .get('wallet')
    //         .assign({
    //             hash: hash,
    //             access_time: ((Date.now() / 1000) | 0) + 3600,
    //         })
    //         .write();
    //     console.log(result);
    // } else {
    //     // todo) 저장된 해시 값이 없으므로 새로 추가
    //     console.log('추가');
    //     const result = db
    //         .get('wallet')
    //         .assign({
    //             hash: hash,
    //             access_time: ((Date.now() / 1000) | 0) + 3600,
    //         })
    //         .write();
    //     console.log(result);
    // }

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

const compareHash = async (password) => {
    const walletData = db.get('wallet').value();
    const { hashedMnemonic, hash: walletHash } = walletData;

    const newHash = await hash(hashedMnemonic, await hash(password));

    console.log(`walletHash :: ${walletHash}`);
    console.log(`newHash :: ${newHash}`);
    console.log(walletHash == newHash);

    if (walletHash == newHash) return true;
    return false;
};

module.exports = router;

/** @format */

const {
    Client,
    Mnemonic,
    AccountCreateTransaction,
    Hbar,
} = require('@hashgraph/sdk');
require('dotenv').config();

async function main() {
    const myAccountId = process.env.MY_ACCOUNT_ID;
    // console.log(myAccountId);
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    // console.log(myPrivateKey);

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
        throw new Error(
            'Environment variables myAccountId and myPrivateKey must be present'
        );
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    // client.setOperator(myAccountId, myPrivateKey);
    // generate a 24-word mnemonic
    // const mnemonic = await Mnemonic.generate();
    const mnemonic = await Mnemonic.fromString(
        'fly tide have mimic rich shoot hazard pause charge fringe custom open consider patrol trade repeat fluid upset spell invest east legend soon brick'
    );
    const password = '1234';

    console.log(`mnemonic = ${mnemonic.toString()}`);

    // convert to a new root key
    // const rootKey = await mnemonic.toEd25519PrivateKey();
    // console.log(`rootKey = ${rootKey.toString()}`);

    // derive index #0
    // WARN: don't hand out your root key
    // const key = await rootKey.derive(0);

    // console.log(`private key = ${key.toString()}`);
    // console.log(`public key = ${key.publicKey.toString()}`);

    // [...]

    // recover your key from the mnemonic
    // this takes space-separated or comma-separated words
    const recoveredMnemonic = await Mnemonic.fromString(mnemonic.toString());
    console.log(`recoveredMnemonic = ${recoveredMnemonic}`);
    const recoveredRootKey = await recoveredMnemonic.toEd25519PrivateKey();
    console.log(`recoveredRootKey = ${recoveredRootKey}`);

    // Returns the recover key
    const recoveredRootKeyRes = await recoveredRootKey.derive(0);
    console.log(`recoveredRootKeyRes = ${recoveredRootKeyRes}`);

    const newAccountPublicKey = recoveredRootKey.publicKey;
    console.log(`newAccountPublicKey = ${newAccountPublicKey}`);

    // const accountCreateTransactionResponse1 =
    //     await new AccountCreateTransaction(newAccountPublicKey)
    //         .setKey()
    //         .setInitialBalance(Hbar.fromTinybars(1000))
    //         .execute(client);

    // console.log(accountCreateTransactionResponse1);
}

void main();

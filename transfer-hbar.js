/** @format */

const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config();

async function main() {
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

    //Create new keys
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    const newAccountPrivateKey2 = PrivateKey.generateED25519();
    const newAccountPublicKey2 = newAccountPrivateKey2.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountTransactionResponse2 = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey2)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt2 = await newAccountTransactionResponse.getReceipt(client);
    // const newAccountId = getReceipt.accountId;
    const newAccountId = '0.0.48621123';
    const newAccountId2 = getReceipt2.accountId;
    // console.log(typeof newAccountId);

    console.log('The new account ID is: ' + newAccountId);
    console.log('The new account ID2 is: ' + newAccountId2);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);
    const accountBalance2 = await new AccountBalanceQuery()
        .setAccountId(newAccountId2)
        .execute(client);

    console.log(
        'The new account balance is: ' +
            accountBalance.hbars.toTinybars() +
            ' tinybar.'
    );
    console.log(
        '2 The new account balance is: ' +
            accountBalance2.hbars.toTinybars() +
            ' tinybar.'
    );

    //Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
        .addHbarTransfer(newAccountId2, Hbar.fromTinybars(-1000))
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log(
        'The transfer transaction from my account to the new account was: ' +
            transactionReceipt.status.toString()
    );

    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .getCost(client);

    console.log('The cost of query is: ' + queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log(
        'The account balance after the transfer is: ' +
            getNewBalance.hbars.toTinybars() +
            ' tinybar.'
    );

    const getNewBalance2 = await new AccountBalanceQuery()
        .setAccountId(newAccountId2)
        .execute(client);

    console.log(
        'The account balance after the transfer is: ' +
            getNewBalance2.hbars.toTinybars() +
            ' tinybar.'
    );
}
main();

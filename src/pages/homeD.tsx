import {
  AccountCreateTransaction,
  Client,
  Hbar,
  Mnemonic,
  ScheduleCreateTransaction, ScheduleSignTransaction, TransactionId,
  TransferTransaction
} from '@hashgraph/sdk';
import {useEffect, useState} from 'react';

interface HomeProps {

}

function Home({}: HomeProps) {
  const [client, setClient] = useState<Client | null>(null);
  const myAccountId = process.env.MY_ACCOUNT_ID!;
  const myPrivateKey = process.env.MY_PRIVATE_KEY!;

  useEffect( () => {
    (async () => {
      const client = Client.forTestnet();
      client.setOperator(myAccountId, myPrivateKey);
      setClient(client);

      // 신규 유저에요. 니모닉부터 만들어요, 패스워드도 받아요
      const mnemonic = await Mnemonic.generate();
      const password = '1234';

      const newAccountPrivateKey = await mnemonic.toEd25519PrivateKey(password);
      const newAccountPublicKey = newAccountPrivateKey.publicKey;

      const newAccount1 = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(100))
        .execute(client);


      const receipt1 = await newAccount1.getReceipt(client);
      const record1 = await newAccount1.getRecord(client);
      const newAccountId1 = receipt1.accountId; // 어드레스 역할 같음
      console.log('account1', record1.consensusTimestamp.toString());

      const newAccount2 = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(100))
        .execute(client);

      const receipt2 = await newAccount2.getReceipt(client);
      const newAccountId2 = receipt2.accountId;

      if (newAccountId1 && newAccountId2) {
        const transferTransaction = new TransferTransaction()
          .addHbarTransfer(newAccountId1, Hbar.fromTinybars(-50))
          .addHbarTransfer(newAccountId2, Hbar.fromTinybars(50))

        const scheduledTransaction = new ScheduleCreateTransaction()
          .setScheduledTransaction(transferTransaction)

        const scheduledTransactionResponse = await scheduledTransaction.execute(client);


        const scheduledTransactionReceipt = await scheduledTransactionResponse.getReceipt(client);
        const scheduledTransactionScheduledId = scheduledTransactionReceipt.scheduleId;

        const signTransaction = await new ScheduleSignTransaction()
          .setScheduleId(scheduledTransactionScheduledId!)
          .freezeWith(client)
          .sign(newAccountPrivateKey)
        const signTransactionResponse = await signTransaction.execute(client);


        console.log('newAccountId1 ::' ,newAccountId1.toString())
        console.log('scheduledTransaction Id ::', scheduledTransactionReceipt.scheduledTransactionId!.toString())

      }

    })()
  }, [])

  return (
    <div>
      home
    </div>
  );
};

export default Home;
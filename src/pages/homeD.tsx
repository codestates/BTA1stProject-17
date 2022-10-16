import {
  AccountBalanceQuery,
  Client,
  Hbar,
  Mnemonic,
  ScheduleCreateTransaction,
  ScheduleSignTransaction,
  TransferTransaction,
} from '@hashgraph/sdk';
import { useEffect, useState } from 'react';
import { useLazyGetAccountsQuery, useLazyGetTransactionsQuery } from '@/api';

function Home() {
  /* eslint-disable */
  const [client, setClient] = useState<Client | null>(null);
  const myAccountId = process.env.MY_ACCOUNT_ID!;
  const myPrivateKey = process.env.MY_PRIVATE_KEY!;

  const [getAccountsApi] = useLazyGetAccountsQuery();
  const [getTransactionsApi] = useLazyGetTransactionsQuery();

  useEffect( () => {
    (async () => {
      const client = Client.forTestnet();
      client.setOperator(myAccountId, myPrivateKey);
      setClient(client);

      // 신규 유저에요. 니모닉부터 만들어요, 패스워드도 받아요
      // const mnemonic = await Mnemonic.generate();
      // const password = '1234';

      const mnemonic = await Mnemonic.fromString('deposit question version business auction dwarf antique stomach piece vessel neck prevent decorate cheese dentist fashion act sample success project menu library grunt peanut');
      const password = '1234';

      const newAccountPrivateKey = await mnemonic.toEd25519PrivateKey(password);
      const newAccountPublicKey = newAccountPrivateKey.publicKey;

      // const accountCreateTransactionResponse1 = await new AccountCreateTransaction()
      //   .setKey(newAccountPublicKey)
      //   .setInitialBalance(Hbar.fromTinybars(1000))
      //   .execute(client);
      // //
      // //
      // const accountCreateTransactionReceipt1 = await accountCreateTransactionResponse1.getReceipt(client);
      // const record1 = await newAccount1.getRecord(client);
      // const newAccountId1 = accountCreateTransactionReceipt1.accountId; // 어드레스 역할 같음
      //
      // const newAccount2 = await new AccountCreateTransaction()
      //   .setKey(newAccountPublicKey)
      //   .setInitialBalance(Hbar.fromTinybars(1000))
      //   .execute(client);
      //
      // const receipt2 = await newAccount2.getReceipt(client);
      // const newAccountId2 = receipt2.accountId;

      // const newAccountPrivateKey = '302e020100300506032b6570042204205403a84e50e5cf16a805b09f2435b592e0cd592ddea5f3ab792ddc5f74eb2b2d'
      // const newAccountPublicKey = '302a300506032b65700321002749addf326c163ea329fe175312a4ba2b4655529064624b21f665dceb212584';
      const newAccountId1 = '0.0.48625812';
      const newAccountId2 = '0.0.48625813';


      console.log(newAccountPrivateKey.toString(), newAccountPublicKey.toString(), newAccountId1!.toString(), newAccountId2!.toString())

      if (newAccountId1 && newAccountId2) {
        const transferTransaction = new TransferTransaction()
          .addHbarTransfer(newAccountId1, Hbar.fromTinybars(-1))
          .addHbarTransfer(newAccountId2, Hbar.fromTinybars(1))

        const scheduledTransaction = new ScheduleCreateTransaction()
          .setScheduledTransaction(transferTransaction)
          .setScheduleMemo(new Date().toString()); // payerId를 제외한 모든 값이 같으면 이미 스케줄링된 트랜잭션이라고 응답이 온다.

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

        const newAccountId1BalanceQuery = new AccountBalanceQuery()
          .setAccountId(newAccountId1)
        const newAccountId2BalanceQuery = new AccountBalanceQuery()
          .setAccountId(newAccountId2)

        const [newAccountId1Balance, newAccountId2Balance] = await Promise.all([newAccountId1BalanceQuery.execute(client), newAccountId2BalanceQuery.execute(client)]);

        console.log(newAccountPublicKey.toString());
        const { data: accounts } = await getAccountsApi({
          queryParams: {
            account: {
              publicKey: newAccountPublicKey.toString()
            }
          }
        })

        const { data: transactions } = await getTransactionsApi({
          queryParams: {
            account: {
              id: newAccountId1,
            },
            transactionType: 'CRYPTOTRANSFER',
          }
        })

        console.log('data :: ', accounts, transactions);


        console.log('newAccountId1 Balance ::', newAccountId1Balance.hbars.toString());
        console.log('newAccountId2 Balance ::', newAccountId2Balance.hbars.toString());
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
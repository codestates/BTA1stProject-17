/** @jsxImportSource @emotion/react */

// TODO: 개발 종료 후 린트 활성화
/*eslint-disable*/

import {css, Theme} from '@emotion/react';
import Transaction from '@/components/Transaction';
import {useEffect, useState} from 'react';
import {useLazyGetTransactionsQuery} from '@/api';
import {useAppSelector} from '@/app/store';

function Transactions() {
  const [getTransactionsApi] = useLazyGetTransactionsQuery();
  const currentAccountId = useAppSelector(store => store.hedera.currentAccountId)
  const [transactions, setTransactions] = useState<any[] | null>(null);
  useEffect(() => {
    if (currentAccountId) {
      (async ()=> {
        const { data: { transactions }} = await getTransactionsApi({
          queryParams: {
            account: {
              id: currentAccountId,
            },
            transactionType: 'CRYPTOTRANSFER',
          }
        })
        setTransactions(transactions)
      })()
    }
  },[currentAccountId])

  console.log(transactions)

  const getTransactionInfo = (transfers: any) => {
    const candidate1 = transfers[2];
    const candidate2 = transfers[3];

    let myTransfer;
    let otherTransfer;

    if (candidate1.account === currentAccountId) {
      myTransfer = candidate1;
      otherTransfer = candidate2
    }
    else {
      myTransfer = candidate2;
      otherTransfer = candidate1;
    }

    return {
      amount: myTransfer.amount,
      target: otherTransfer.account,
    }
  };

  return (
    <section css={transactionsSectionCss}>
      <p>최근 활동</p>
      {
        transactions?.map(transaction => {
          const { amount, target } = getTransactionInfo(transaction.transfers);
          return (
            <Transaction
              key={transaction.consensus_timestamp}
              type={'CRYPTOTRANSFER'}
              amount={amount}
              target={target}
            />
          )
        })
      }
    </section>
  );
};

const transactionsSectionCss = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding: 0 20px;
  
  & > p {
    margin-top: 18px;
  }
  
  &:after {
    content: '';
    height: 20px;
  }
`



export default Transactions;
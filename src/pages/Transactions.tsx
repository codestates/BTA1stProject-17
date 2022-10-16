/** @jsxImportSource @emotion/react */

// TODO: 개발 종료 후 린트 활성화
/*eslint-disable*/

import {css, Theme} from '@emotion/react';
import Transaction from '@/components/Transaction';
import {useEffect, useState} from 'react';
import {useLazyGetTransactionsQuery} from '@/api';
import {useAppSelector} from '@/app/store';
import theme from '@/styles/theme';
import {BallTriangle} from 'react-loader-spinner';

function Transactions() {
  const [getTransactionsApi] = useLazyGetTransactionsQuery();
  const currentAccountId = useAppSelector(store => store.hedera.currentAccountId)
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (currentAccountId) {
      fetchTransactions();
    }
  },[currentAccountId])

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data: { transactions }} = await getTransactionsApi({
        queryParams: {
          account: {
            id: currentAccountId,
          },
          transactionType: 'CRYPTOTRANSFER',
        }
      })
      setTransactions(transactions)
    } catch (e) {
      alert('트랜잭션을 불러오는데 실패했습니다. 다시 불러와주세요.');
    }
    setIsLoading(false)
  }

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

  const handleRefreshBtnClick = () => {
    if (isLoading) return;
    setTransactions([]);
    fetchTransactions()
  }

  return (
    <section css={transactionsSectionCss}>
      <p>
        <span>최근 활동</span>
        <img
          width={19}
          height={19}
          src='/assets/images/icon-refresh.png'
          alt='refresh'
          onClick={handleRefreshBtnClick}
        />
      </p>
      {
        isLoading && <div className='loading-bar'>
            <BallTriangle ariaLabel="loading-indicator" color={theme.color.white} width={40} height={40} />
        </div>
      }
      {
        transactions.map(transaction => {
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    img {
      cursor: pointer;
    }
  }
  
  &:after {
    content: '';
    height: 20px;
  }
  
  .loading-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 200px;
  }
`



export default Transactions;
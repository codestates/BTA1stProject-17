/** @jsxImportSource @emotion/react */
import { css, Theme } from '@emotion/react';

type TransactionType = 'CRYPTOTRANSFER'; // 더 많은 것이 있지만 전송만 진행하기

interface TransactionProps {
  type: TransactionType;
  amount: number;
  target: string;
}

function Transaction({ type, amount, target }: TransactionProps) {
  const getLabel = () => {
    if (type === 'CRYPTOTRANSFER') {
      if (amount > 0) {
        return '코인 수령';
      }
      return '코인 전송';
    }
  };

  return (
    <div css={theme => transactionCss(theme, amount < 0)}>
      <img width={49} height={49} src={'/assets/images/logo-hh-black-big.png'} />
      <div className="transaction-description">
        <p className="transaction-top">
          <span className="transaction-type"> {getLabel()}</span>
          <span className="transaction-amount">
            {amount > 0 ? '+' : ''}
            {amount.toLocaleString()} tℏ
          </span>
        </p>
        <p className="transaction-bottom">받는 곳: {target}</p>
      </div>
    </div>
  );
}

const transactionCss = (theme: Theme, isAmountNegative: boolean) => css`
  display: flex;
  padding: 0 20px 0 10px;
  align-items: center;
  width: 100%;
  height: 66px;
  border-radius: 10px;
  border-left: 10px solid ${theme.color.black100};
  background-color: ${theme.color.black500};
  font-size: 16px;
  font-family: 'Inter-Medium';
  gap: 15px;

  .transaction-description {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  .transaction-top {
    display: flex;
    justify-content: space-between;
  }
  .transaction-type {
    color: ${theme.color.white};
  }
  .transaction-amount {
    color: ${isAmountNegative ? '#FFC3AA' : '#81B4F1'};
  }
`;

export default Transaction;

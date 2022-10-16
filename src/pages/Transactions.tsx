/** @jsxImportSource @emotion/react */

// TODO: 개발 종료 후 린트 활성화
/*eslint-disable*/

import {css, Theme} from '@emotion/react';
import Transaction from '@/components/Transaction';

interface TransactionsProps {
  
}

function Transactions({}: TransactionsProps) {
  return (
    <section css={transactionsSectionCss}>
      <p>최근 활동</p>
      <Transaction type={'CRYPTOTRANSFER'} amount={-100} target={'0.0.213213'}/>
      <Transaction type={'CRYPTOTRANSFER'} amount={100} target={'0.0.213213'}/>
      <Transaction type={'CRYPTOTRANSFER'} amount={-100} target={'0.0.213213'}/>
      <Transaction type={'CRYPTOTRANSFER'} amount={-100} target={'0.0.213213'}/>
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
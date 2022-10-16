/** @jsxImportSource @emotion/react */

// TODO: 개발 종료 후 린트 활성화
/*eslint-disable*/

import {css, Theme} from '@emotion/react';
import {ChangeEvent, useState} from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import theme from '@/styles/theme';

interface SendCryptoProps {
  
}

function SendCrypto({}: SendCryptoProps) {
  const [step, setStep] = useState<'INPUT' | 'CONFIRM'>('INPUT');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState(0);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setAddress(value);
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (isNaN(Number(value))) return;
    setAmount(value);
  }

  const handleBtnClick = () => {
    if (step === 'INPUT') {
      setStep('CONFIRM');
      return;
    }
  }

  return (
    <section css={sendCryptoSectionCss}>
      <div className='content'>
        <p className='content-title'>HBAR 전송 {step === 'CONFIRM' ? '확인' : ''}</p>
        {
          step === 'INPUT'
            ? <div className='input-wrap'>
                  <Input
                      value={address}
                      placeholder='받는 곳의 주소를 입력하세요.'
                      onChange={handleAddressChange}
                  />
                  <div className='amount-input'>
                      <Input
                          value={amount}
                          placeholder='금액을 입력하세요.'
                          type='number'
                          onChange={handleAmountChange}
                      />
                      <span>HBAR</span>
                  </div>
                  <span> (유효성 검사가 아직 구현되지 않았습니다. 올바른 값을 입력해주세요.)</span>

              </div>
            : <div className='confirm-info'>
                <p className='confirm-info-amount'>{amount} HBAR</p>
                <img width={19} height={19} src='/assets/images/icon-arrow-gray.png'/>
                <p className='confirm-info-address'>{address}</p>
                <div className='confirm-info-fee-wrap'>
                  <div css={dividerCss}/>
                  <p className='confirm-info-fee'>
                    <span>네트워크 수수료</span>
                    <span>{fee.toLocaleString()} HBAR</span>
                  </p>
                </div>
              </div>
        }
      </div>
      <Button onClick={handleBtnClick}>
        { step === 'INPUT' ? 'Next' : 'Send' }
      </Button>
    </section>
  );
};

const dividerCss = (theme: Theme) => css`
  border-top: 1px solid ${theme.color.black400};
  height: 1px;
`

const sendCryptoSectionCss = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 20px;

  .content {
    margin-top: 18px;
    
    &-title {
      margin-bottom: 18px;
    }
  }
  
  .input-wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    span:last-child {
      font-size: 12px;
      color: ${theme.color.black200}
    }
  }
  
  .amount-input {
    position: relative;
    span {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  
  .confirm-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 1px solid ${theme.color.black400};
    height: 157px;
    padding: 19px;
    border-radius: 5px;
    
    &-amount {
      font-size: 32px;
    }
    
    &-address {
      font-size: 15px;
      margin-bottom: 5px;

    }
    
    &-fee-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;
      height: 30px;
    }
    
    &-fee {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`

export default SendCrypto;
/** @jsxImportSource @emotion/react */

// TODO: 개발 종료 후 린트 활성화
/*eslint-disable*/

import {css, Theme} from '@emotion/react';
import {ChangeEvent, useMemo, useState} from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import theme from '@/styles/theme';
import {Hbar, ScheduleCreateTransaction, ScheduleSignTransaction, TransferTransaction} from '@hashgraph/sdk';
import {useAppSelector} from '@/app/store';
import {BallTriangle} from 'react-loader-spinner';

interface SendCryptoProps {
  
}

function SendCrypto({}: SendCryptoProps) {
  const [step, setStep] = useState<'INPUT' | 'CONFIRM'>('INPUT');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState(0.0001); // transfer fee는 0.0001 달러
  const { client, currentAccountId, accountKey } = useAppSelector(store => store.hedera);
  const [isSending, setIsSending] = useState(false);
  const [isSendingSuccess, setIsSendingSuccess] = useState(false);

  const isBtnDisabled = useMemo(() => {
    if (isSending) return true;
    if (step === 'INPUT') {
      if (!address || !amount) return true;
    }
    return false;
  }, [amount, address, isSending, isSendingSuccess, step])

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
    if (isSending || isSendingSuccess) return;
    if (step === 'INPUT') {
      if (!address || !amount) return;
      setStep('CONFIRM');
      return;
    }
    send();
  }

  const send = async() => {
    if (!currentAccountId || !client || !accountKey) return;
    try {
      setIsSending(true);
      const transferTransaction = new TransferTransaction()
        .addHbarTransfer(currentAccountId, Hbar.fromTinybars(-amount))
        .addHbarTransfer(address, Hbar.fromTinybars(amount))

      const scheduledTransaction = new ScheduleCreateTransaction()
        .setScheduledTransaction(transferTransaction)
        .setScheduleMemo(new Date().toString()); // payerId를 제외한 모든 값이 같으면 이미 스케줄링된 트랜잭션이라고 응답이 온다.

      const scheduledTransactionResponse = await scheduledTransaction.execute(client);

      const scheduledTransactionReceipt = await scheduledTransactionResponse.getReceipt(client);
      const scheduledTransactionScheduledId = scheduledTransactionReceipt.scheduleId;

      const signTransaction = await new ScheduleSignTransaction()
        .setScheduleId(scheduledTransactionScheduledId!)
        .freezeWith(client)
        .sign(accountKey.private)
      const signTransactionResponse = await signTransaction.execute(client);
      setIsSendingSuccess(true);
    } catch (e) {
      alert(e);
    }
    setIsSending(false)

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
                      <span>tℏ</span>
                  </div>
                  <p>
                    - 유효성 검사가 아직 구현되지 않았습니다. 올바른 값을 입력해주세요.<br/>
                    - 테스트용이기 때문에 tℏ 단위로만 전송 가능합니다.
                  </p>

              </div>
            : <div className='confirm-info'>
                <p className='confirm-info-amount'>{amount} tℏ</p>
                <img width={19} height={19} src='/assets/images/icon-arrow-gray.png'/>
                <p className='confirm-info-address'>{address}</p>
                <div className='confirm-info-fee-wrap'>
                  <div css={dividerCss}/>
                  <p className='confirm-info-fee'>
                    <span>네트워크 수수료</span>
                    <span>${fee.toLocaleString('ko-KR', {maximumFractionDigits: 4})}</span>
                  </p>
                </div>
              </div>
        }
      </div>
      <Button onClick={handleBtnClick} disabled={isBtnDisabled}>
      {
        !isSending
          ? !isSendingSuccess
              ? step === 'INPUT'
                ? 'Next'
                : 'Send'
              : 'Success'
          : <BallTriangle ariaLabel="loading-indicator" color={theme.color.white} width={20} height={20} />
        }
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
    
    p:last-child {
      font-size: 12px;
      color: ${theme.color.black200};
      line-height: 14px;
    }
  }
  
  .amount-input {
    position: relative;
    
    span {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translate(0, -50%);
      color: ${theme.color.black200};
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
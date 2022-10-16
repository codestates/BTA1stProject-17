/** @jsxImportSource @emotion/react */

// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
import {useAppDispatch} from '@/app/store';
import {ChangeEvent, useEffect, useState} from 'react';
import {setHelpLayout} from '@/slices/helpLayoutSlice';
import Input from '@/components/Input';
import {css} from '@emotion/react';
import Button from '@/components/Button';

function MakeWallet() {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [passwordCheckValue, setPasswordCheckValue] = useState('');

  useEffect(() => {
    dispatch(setHelpLayout({ description: '새로운 비밀번호를 입력해주세요.', hasBackButton: true }));
  })

  const isValidPassword = () => {
    if (!password || !passwordCheckValue) {
      alert('정확히 입력해주세요.');
      return false;
    }
    if (password !== passwordCheckValue) {
      alert('두 입력값이 일치하지 않습니다.');
      return false;
    }
    return true;
  }

  const handleMakeWalletBtnClick = () => {
    isValidPassword()

  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
  }
  const handlePasswordCheckValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPasswordCheckValue(value);
  }

  return (
    <section css={makeWalletSectionCss}>
      <div css={inputWrapCss}>
        <Input value={password} onChange={handlePasswordChange} placeholder='비밀번호'/>
        <Input value={passwordCheckValue} onChange={handlePasswordCheckValueChange} placeholder='비밀번호 확인'/>
      </div>
      <Button onClick={handleMakeWalletBtnClick}>
        새로운 지갑 생성
      </Button>
    </section>
  );
};

const makeWalletSectionCss = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 30px 17px 24px 17px;
`
const inputWrapCss = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 15px;
`

export default MakeWallet;
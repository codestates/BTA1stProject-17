/** @jsxImportSource @emotion/react */

// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
import {useAppDispatch, useAppSelector} from '@/app/store';
import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {setHelpLayout} from '@/slices/helpLayoutSlice';
import Input from '@/components/Input';
import {css} from '@emotion/react';
import Button from '@/components/Button';
import {useUrlQueryParams} from '@/hooks/location';
import {useNavigate} from 'react-router-dom';
import {encrypt} from '@/util/hash';
import {AccountCreateTransaction, Hbar, Mnemonic} from '@hashgraph/sdk';
import {setAccountIds, setAccountKey, setCurrentAccountId, setMnemonic} from '@/slices/hederaSlice';
import {useLazyGetAccountsQuery} from '@/api';
import {BallTriangle} from 'react-loader-spinner';
import theme from '@/styles/theme';

function MakeWallet() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useUrlQueryParams();
  const { mnemonic: mnemonicString, client } = useAppSelector(store => store.hedera);
  const hasAlreadyWallet = useMemo(() => params.hasAlreadyWallet, [params]);
  const [password, setPassword] = useState('');
  const [passwordCheckValue, setPasswordCheckValue] = useState('');
  const [getAccountsApi] = useLazyGetAccountsQuery();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleMakeWalletBtnClick = async () => {
    if (!isValidPassword()) return;

    try {
      setIsLoading(true);
      if (hasAlreadyWallet) {
        if (!mnemonicString) {
          alert('로그인 오류가 발생했습니다. 처음으로 되돌아갑니다.')
          navigate('/');
          return;
        }
        console.log('2');
        const hashedMnemonic = encrypt(mnemonicString, password);
        localStorage.setItem('hashedMnemonic', hashedMnemonic);
        console.log(mnemonicString);
        const mnemonic = await Mnemonic.fromString(mnemonicString);
        const accountPrivateKey = await mnemonic.toEd25519PrivateKey('1234');
        const accountPublicKey = accountPrivateKey.publicKey;
        console.log('3');
        dispatch(setAccountKey({ public: accountPublicKey, private: accountPrivateKey}));
        const {
          data: { accounts },
        } = await getAccountsApi({
          queryParams: {
            account: {
              publicKey: accountPublicKey.toString(),
            },
          },
        });

        dispatch(setAccountIds(accounts.map((e: any) => e.account)));
        dispatch(setCurrentAccountId(accounts[0].account));
        navigate('/wallet');
        return;
      }
      console.log('4');
      const newMnemonic = await Mnemonic.generate12();
      const hashedMnemonic = encrypt(newMnemonic.toString(), password);
      dispatch(setMnemonic(newMnemonic.toString()));

      const accountPrivateKey = await newMnemonic.toEd25519PrivateKey('1234');
      const accountPublicKey = accountPrivateKey.publicKey;
      dispatch(setAccountKey({ public: accountPublicKey, private: accountPrivateKey}));
      const response = await new AccountCreateTransaction()
        .setKey(accountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(100))
        .execute(client!);

      console.log('6');

      const receipt = await response.getReceipt(client!);
      console.log(receipt.accountId!.toString());

      localStorage.setItem('hashedMnemonic', hashedMnemonic);
      navigate('/help/check');
    } catch (e) {
      alert('오류가 발생했습니다. 처음으로 되돌아갑니다.');
      console.error(e);
    }
    setIsLoading(false);

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
        <Input
          value={password}
          onChange={handlePasswordChange}
          placeholder='비밀번호'
          type='password'/>
        <Input
          value={passwordCheckValue}
          onChange={handlePasswordCheckValueChange}
          placeholder='비밀번호 확인'
          type='password'/>
      </div>
      <Button onClick={handleMakeWalletBtnClick}>
        { isLoading
            ?  <BallTriangle ariaLabel="loading-indicator" color={theme.color.white} width={40} height={40} />
            : hasAlreadyWallet ? '지갑 가져오기' : '새로운 지갑 생성' }
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
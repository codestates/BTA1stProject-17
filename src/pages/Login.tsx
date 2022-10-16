/** @jsxImportSource @emotion/react */
// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
import {useAppDispatch} from '@/app/store';
import {ChangeEvent, useEffect, useState} from 'react';
import {setHelpLayout} from '@/slices/helpLayoutSlice';
import {css, Theme} from '@emotion/react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import {Link, useNavigate} from 'react-router-dom';
import {decrypt} from '@/util/hash';
import {Mnemonic} from '@hashgraph/sdk';
import {setAccountIds, setAccountKey, setCurrentAccountId} from '@/slices/hederaSlice';
import {useLazyGetAccountsQuery} from '@/api';

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [getAccountsApi] = useLazyGetAccountsQuery();

  useEffect(() => {
    dispatch(setHelpLayout({ description: '비밀번호를 입력해주세요' }))
  }, [])

  const getDecryptInfo = () => {
    const hashedMnemonic = localStorage.getItem('hashedMnemonic');
    if (!hashedMnemonic) {
      alert('오류가 발생했습니다. 처음으로 돌아갑니다');
      navigate('/');
      return { isSuccess: false, value: null };
    }
    console.log(hashedMnemonic);
    try {
      const decryptInfo = decrypt(hashedMnemonic, password);
      return decryptInfo;
    } catch (e) {
      return { isSuccess: false, value: null };
    }
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
  }

  const handleOpenWalletBtnClick = async() => {
    const decryptInfo = getDecryptInfo();
    if (!decryptInfo.isSuccess) {
      alert('잘못된 비밀번호입니다.');
      return;
    }
    const mnemonicString = decryptInfo.value;
    console.log('mnemonic::', mnemonicString);
    const mnemonic = await Mnemonic.fromString(mnemonicString!);
    const accountPrivateKey = await mnemonic.toEd25519PrivateKey('1234');
    const accountPublicKey = accountPrivateKey.publicKey;
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
  }

  return (
    <section css={loginSectionCss}>
      <div css={passwordInputWrapCss}>
        <Input value={password} onChange={handlePasswordChange} placeholder={'비밀번호'} type='password'/>
        <Link className='recover-link' to={'/help/recover'}>비밀번호를 잊어버렸습니다.</Link>
      </div>
      <Button onClick={handleOpenWalletBtnClick}>잠금 해제</Button>
    </section>
  );
};

const loginSectionCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 30px 17px 24px 17px;
`
const passwordInputWrapCss = (theme: Theme) => css`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  
  .recover-link {
    font-family: "Inter-Medium";
    color: ${theme.color.black200};
    text-decoration-line: none;
    
    &:hover {
      color: ${theme.color.black100};
    }
  }
`


export default Login;
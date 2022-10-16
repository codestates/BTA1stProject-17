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

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(setHelpLayout({ description: '비밀번호를 입력해주세요' }))
  }, [])

  const validatePassword = () => {
    // TODO: 니모닉 찾기
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
  }

  const handleOpenWalletBtnClick = () => {
    // validatePassword();
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
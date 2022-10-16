/** @jsxImportSource @emotion/react */
// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
import {useAppDispatch, useAppSelector} from '@/app/store';
import {useEffect, useState} from 'react';
import {setHelpLayout} from '@/slices/helpLayoutSlice';
import {css, Theme} from '@emotion/react';
import Button from '@/components/Button';
import {useNavigate} from 'react-router-dom';
import {setAccountIds, setCurrentAccountId} from '@/slices/hederaSlice';
import {useLazyGetAccountsQuery} from '@/api';

function CheckMnemonic() {
  console.log('here');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mnemonic, accountKey } = useAppSelector(store => store.hedera);
  const [isMnemonicRevealed, setIsMnemonicRevealed] = useState(false);
  const [getAccountsApi] = useLazyGetAccountsQuery();

  useEffect(() => {
    dispatch(setHelpLayout({ description: '지갑이 생성되었어요!\n다음의 복구구문을 꼭 기록해두세요!' }))
    fetchAccountIds();
  }, [])

  const fetchAccountIds = async() => {
    const {
      data: { accounts },
    } = await getAccountsApi({
      queryParams: {
        account: {
          publicKey: accountKey!.public.toString(),
        },
      },
    });
    dispatch(setAccountIds(accounts.map((e: any) => e.account)));
    dispatch(setCurrentAccountId(accounts[0].account));
  }

  const handleCheckMnemonicBtnClick = () => {
    setIsMnemonicRevealed(true);
  }

  const handleOpenWalletBtnClick = () => {
      navigate('/wallet');
  }

  return (
    <section css={checkMnemonicSectionCss}>
      <div css={mnemonicFieldCss}>
        { !isMnemonicRevealed &&
          <div css={blurCoverCss}>
              <button
                  css={checkMnemonicBtnCss}
                  onClick={handleCheckMnemonicBtnClick}
              >
                  복구 구문 확인
              </button>
          </div>
        }
        {mnemonic}
      </div>
      <p css={notificationCss}>
        복구 구문은 지갑을 복구할 때 필요한 값이에요.<br/>
        타인과 절대 공유하지 마세요!
      </p>
      <Button onClick={handleOpenWalletBtnClick}>지갑 열기</Button>
    </section>
  );
};

const checkMnemonicSectionCss = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  padding: 22px 17px 24px 17px;
  width: 100%;
  height: 100%;
`

const mnemonicFieldCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 83px;
  border: 1px solid ${theme.color.black400};
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  word-break: keep-all;
`

const notificationCss = (theme: Theme) => css`
  flex: 1;
  display: flex;
  height: 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-family: "Inter-Medium";
  line-height: 16px;
  
  &::before {
    content: '';
    width: 28px;
    height: 32px;
    background: url('/assets/images/icon-notify.png') no-repeat center center;
  }
`

const blurCoverCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(65,65,65, 0.3);
  backdrop-filter: blur(2.5px);
`

const checkMnemonicBtnCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 155px;
  padding: 5px 0;
  border-radius: 10px;
  background-color: white;
  font-size: 16px;
`

export default CheckMnemonic;
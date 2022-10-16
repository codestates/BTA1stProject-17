/** @jsxImportSource @emotion/react */
// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
import {css, Theme} from '@emotion/react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useAppSelector} from '@/app/store';
import {AccountBalanceQuery} from '@hashgraph/sdk';
import {BallTriangle} from 'react-loader-spinner';
import theme from '@/styles/theme';

interface WalletProps {
  
}

type MenuType = 'TRANSACTIONS' | 'SEND';

function Wallet({}: WalletProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { client, currentAccountId } = useAppSelector(store => store.hedera)
  const [currentMenu, setCurrentMenu] = useState<MenuType>('TRANSACTIONS');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === '/wallet') {
      navigate('/wallet/transactions');
    }
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [client, currentAccountId])

  const fetchBalance = async () => {
    if (client && currentAccountId) {
      setIsLoading(true);
      try {
        const accountIdBalanceQuery = new AccountBalanceQuery()
          .setAccountId(currentAccountId)
        const { hbars } = await accountIdBalanceQuery.execute(client);
        setBalance(hbars.toString());
      } catch (e) {
        alert('지갑 보유 밸런스를 불러오는데 실패했습니다. 다시 불러와주세요.');
      }
      setIsLoading(false);
    }
  }


  const handleMenuBtnClick = (type: MenuType) => {
    setCurrentMenu(type);
    if (type === 'TRANSACTIONS') {
      navigate('/wallet/transactions');
      return;
    }
    if (type === 'SEND') {
      navigate('/wallet/send');
      return;
    }
  }

  const handleRefreshBtnClick = () => {
    if (isLoading) return;
    fetchBalance()
  }

  return (
    <>
      <header css={walletHeaderCss}>
        <img src="/assets/images/logo-white-small.png" alt="logo"/>
        Testnet
      </header>
      <section css={coinBoardCss}>
        <figure css={hederaLogoWrapCss}/>
        <div css={coinAmountCss}>
          <p className='amount'>
            {
              isLoading
                ? <BallTriangle ariaLabel="loading-indicator" color={theme.color.white} width={30} height={30} />
                : <>
                    <span>{balance}</span>
                    <img
                      width={19}
                      height={19}
                      src='/assets/images/icon-refresh.png'
                      alt='refresh'
                      onClick={handleRefreshBtnClick}
                    />
                  </>
            }

          </p>
          <p className='description'>Hedera Hashgraph</p>
        </div>
        <div css={menuCss}>
          <button
            css={(theme) => menuButtonCss(theme, currentMenu === 'TRANSACTIONS')}
            onClick={() => handleMenuBtnClick('TRANSACTIONS')}
          >
            <img width={27} height={22} src={`/assets/images/${currentMenu === 'TRANSACTIONS' ? 'icon-list-white.png' : 'icon-list-gray.png'}`} alt="Transactions"/>
          </button>
          <button
            css={(theme) => menuButtonCss(theme, currentMenu === 'SEND')}
            onClick={() => handleMenuBtnClick('SEND')}
          >
            <img width={26} height={22} src={`/assets/images/${currentMenu === 'SEND' ? 'icon-send-white.png' : 'icon-send-gray.png'}`} alt="Send"/>
          </button>
        </div>
      </section>
      <main css={walletMainCss}>
        <Outlet/>
      </main>
      <footer css={footerCss}>
        <p>
          {currentAccountId}
          <img width={14} height={7} src="/assets/images/icon-dropdown.png"/>
        </p>
      </footer>
    </>
  );
};

const walletHeaderCss = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 17px;
  height: 56px;
  color: ${theme.color.white};
  font-family: 'Inter-Medium';
`

const coinBoardCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 200px;
  background-color: ${theme.color.black500};
`

const coinAmountCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  
  .amount {
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-family: 'Inter-Medium';
    font-size: 32px;
    
    img {
      position: absolute;
      right: 20px;
      top: -50px;
      cursor: pointer;
    }
  }
  
  .description {
    font-family: 'Inter-Light';
    font-size: 16px;
    color: ${theme.color.black100};
  }
`

const hederaLogoWrapCss = (theme: Theme) => css`
  display: flex;
  position: relative;
  justify-content: center;
  height: 62px;
  width: 100%;
  
  &:before {
    position: absolute;
    top: -40px;
    content: '';
    width: 90px;
    height: 90px;
    background: url("/assets/images/logo-hh-black-big.png") no-repeat center center;
    background-size: contain;
    border-radius: 100%;
    border: 7px solid ${theme.color.black500}
  }
`

const walletMainCss = css`
  width: 100%;
  height: 294px;
  overflow: auto;
`

const menuCss = css`
  display: flex;
  width: 100%;
  height: 50px;
`

const menuButtonCss = (theme: Theme, isActive: boolean) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100%;
  border-bottom: 3px solid ${isActive ? theme.color.white : theme.color.black300}
`

const footerCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 50px;
  width: 100%;
  background-color: ${theme.color.black500};
  border-top: 3px solid ${theme.color.black300};
  box-shadow: 0px -4px 10px 5px rgba(0, 0, 0, 0.25);

  p {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    
    &:hover {
      color: ${theme.color.black100 }
    }
  }
`

export default Wallet;
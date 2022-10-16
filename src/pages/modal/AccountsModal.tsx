/** @jsxImportSource @emotion/react */
import { css, Theme } from '@emotion/react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setAccountIds, setCurrentAccountId } from '@/slices/hederaSlice';
import { saveToClipboard } from '@/util/clipboard';
import React, { useState } from 'react';
import { setModal } from '@/slices/modalSlice';
import { AccountCreateTransaction, Hbar } from '@hashgraph/sdk';
import { useLazyGetAccountsQuery } from '@/api';
import theme from '@/styles/theme';
import { BallTriangle } from 'react-loader-spinner';

function AccountsModal() {
  const dispatch = useAppDispatch();
  const { client, accountIds, currentAccountId, accountKey } = useAppSelector(store => store.hedera);
  const [getAccountsApi] = useLazyGetAccountsQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountInputClick = (accountId: string) => {
    if (accountId === currentAccountId) return;
    dispatch(setCurrentAccountId(accountId));
  };

  const handleClipboardBtnClick = (e: React.MouseEvent<HTMLImageElement>, accountId: string) => {
    e.stopPropagation();
    saveToClipboard(accountId, () => {
      alert('주소가 클립보드에 저장되었습니다.');
    });
  };

  const handleAddAccountIdBtnClick = () => {
    addAccountId();
  };

  const addAccountId = async () => {
    if (accountIds.length > 3) {
      alert('현재 계정 추가는 최대 3개까지만 가능합니다.');
      return;
    }
    if (!accountKey || !client) return;
    try {
      setIsLoading(true);
      await new AccountCreateTransaction()
        .setKey(accountKey.public)
        .setInitialBalance(Hbar.fromTinybars(100))
        .execute(client);
      const {
        data: { accounts },
      } = await getAccountsApi({
        queryParams: {
          account: {
            publicKey: accountKey.public.toString(),
          },
        },
      });
      dispatch(setAccountIds(accounts.map((e: any) => e.account)));
      alert('계정 추가를 완료하였습니다.');
    } catch (e) {
      alert('계정 추가를 실패하였습니다. 다시 시도해주시길 바랍니다.');
    }
    setIsLoading(false);
  };

  const handleCloseBtn = () => {
    dispatch(setModal(null));
  };

  return (
    <div css={accountsModalCss}>
      <header>
        <span>내 계정</span>
        <img width={24} src="/assets/images/icon-close-white.png" onClick={handleCloseBtn} />
      </header>
      <main>
        {accountIds.map(accountId => (
          <div css={accountInputCss} onClick={() => handleAccountInputClick(accountId)}>
            <img width={44} src={`/assets/images/icon-radio-${accountId === currentAccountId ? 'on' : 'off'}.png`} />
            <span>{accountId}</span>
            <img
              width={21}
              onClick={e => handleClipboardBtnClick(e, accountId)}
              src="/assets/images/icon-clipboard-white.png"
            />
          </div>
        ))}
      </main>
      <footer onClick={handleAddAccountIdBtnClick} aria-disabled={isLoading}>
        {isLoading ? (
          <BallTriangle ariaLabel="loading-indicator" color={theme.color.white} width={30} height={30} />
        ) : (
          <>
            <img width={14} src="/assets/images/icon-plus.png" />
            <span> 계정 추가 </span>
          </>
        )}
      </footer>
    </div>
  );
}

const accountsModalCss = (theme: Theme) => css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: ${theme.color.black600};

  header {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 56px;
    border-bottom: 1px solid ${theme.color.black400};
    font-size: 16px;

    img {
      position: absolute;
      right: 20px;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 453px;
    padding: 20px;
    overflow: auto;
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    border-top: 1px solid ${theme.color.black400};
    font-size: 16px;
    gap: 10px;
    cursor: pointer;

    &:enabled:hover {
      background-color: ${theme.color.black500};
    }
  }
`;

const accountInputCss = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 360px;
  height: 66px;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 15px;
  background-color: ${theme.color.black500};
  cursor: pointer;

  &:hover {
    background-color: ${theme.color.black300};
  }

  span {
    width: 240px;
  }
`;

export default AccountsModal;

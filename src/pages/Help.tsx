/** @jsxImportSource @emotion/react */
import { useAppDispatch } from '@/app/store';
import { useEffect } from 'react';
import { setHelpLayout } from '@/slices/helpLayoutSlice';
import { css, Theme } from '@emotion/react';

// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
interface HelpProps {
  
}

function Help({}: HelpProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHelpLayout({ description: '환영합니다!\n헤데라 해시태그가 처음이신가요?' }))
  }, [])

  const handleRecoverWallet = () => {

  }

  return (
    <section css={helpSectionCss}>
      <button css={selectBtnCss}>
        <figure className='icon-wrap'>
          <img src='/assets/images/icon-download.png' alt='recoverWallet'/>
        </figure>
        <div className='btn-description'>
          <p className='important'>아니요. 지갑을 가져오겠습니다.</p>
          <p>복구 구문을 이용해 지갑을 가져옵니다.</p>
        </div>
      </button>
      <button css={selectBtnCss}>
        <figure className='icon-wrap'>
          <img src='/assets/images/icon-plus.png' alt='makeWallet'/>
        </figure>
        <div className='btn-description'>
          <p className='important'>네. 새로운 지갑을 만들래요!</p>
          <p>지갑 및 복구 구문을 생성합니다.</p>
        </div>
      </button>
    </section>
  );
};

const helpSectionCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  justify-content: center;
  align-items: center;
`

const selectBtnCss = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 340px;
  height: 80px;
  border: 1px solid ${theme.color.black400};
  border-radius: 10px;
  padding: 30px;
  
  &:hover {
    border: 1px solid ${theme.color.white};
  }
  
  .icon-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
  }
  
  .btn-description {
    width: 220px;
    
    p {
      text-align: start;
      color: ${theme.color.black100};
      
      &.important {
        font-size: 16px;
        color: ${theme.color.white}
      }
    }
  }
  
`



export default Help;
/** @jsxImportSource @emotion/react */
// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
import {useAppDispatch} from '@/app/store';
import {ChangeEvent, useEffect, useState} from 'react';
import {setHelpLayout} from '@/slices/helpLayoutSlice';
import {css, Theme} from '@emotion/react';
import cloneDeep from 'lodash.clonedeep'
import {useNavigate} from 'react-router-dom';
import Button from '@/components/Button';

interface RecoverWalletProps {
  
}

const INPUT_COUNT = 12;
const MAX_INPUT_COUNT_PER_LINE = 4;

function RecoverWallet({}: RecoverWalletProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inputLines, setInputLines] = useState<string[][]>(
    Array.from(
      {length: Math.ceil(INPUT_COUNT / MAX_INPUT_COUNT_PER_LINE)},
      () =>  Array.from({length: MAX_INPUT_COUNT_PER_LINE}, () => '')
    )
  );

  useEffect(() => {
    dispatch(setHelpLayout({ description: '소유하고 계신 복구 구문 단어 12개를\n차례대로 입력해주세요.', hasBackButton: true }))
  }, [])

  const validateMnemonic = () => {
    const isSomeInputEmpty = inputLines.some(inputLine => inputLine.some(value => !value));
    if (isSomeInputEmpty) {
      alert('니모닉을 정확히 입력해주세요.');
      return false;
    }
    return true;
  }

  const getMnemonicValue = () => {
    const mnemonicInputValue = inputLines.reduce((acc, curr) => {
      acc = acc + ' ' + curr.map(value => value).join(' ')
      return acc;
    }, '')
    return mnemonicInputValue;
  }

  const handleMnemonicInputChange = (e: ChangeEvent<HTMLInputElement>, lineOrder: number,  inputOrder: number) => {
    const newInputLines = cloneDeep(inputLines);
    const value = e.currentTarget.value;
    newInputLines[lineOrder][inputOrder] = value;
    setInputLines(prev => newInputLines)
  }

  const handleGetWalletBtnClick = () => {
    navigate('/check')
    // validateMnemonic()
    // const mnemonicValue = getMnemonicValue();
  }

  return (
    <section css={recoverWalletSectionCss}>
      <div css={mnemonicInputLineChainCss}>
        {
          inputLines.map((inputLine, lineOrder) =>
            <p css={mnemonicInputLineCss} key={lineOrder}>
              {
                inputLine.map((value, inputOrder) =>
                  <input
                    css={mnemonicInputCss}
                    key={inputOrder}
                    value={value}
                    onChange={(e) => handleMnemonicInputChange(e, lineOrder, inputOrder)}
                  />
                )
              }
            </p>
          )
        }
      </div>
      <Button
        onClick={handleGetWalletBtnClick}
      >
        지갑 가져오기
      </Button>
    </section>
  );
};

const recoverWalletSectionCss = css`
  width: 100%;
  height: 100%;
  padding: 17px 17px 24px 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`

const mnemonicInputLineChainCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  
`

const mnemonicInputLineCss = css`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`

const mnemonicInputCss = (theme: Theme) => css`
  display: flex;
  width: 80px;
  height: 30px;
  padding: 3px;
  border: 1px solid ${theme.color.black400};
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 5px;
  color: ${theme.color.white};
`



export default RecoverWallet;
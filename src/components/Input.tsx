/** @jsxImportSource @emotion/react */
import { HTMLProps } from 'react';
import { css, Theme } from '@emotion/react';

interface InputProps extends HTMLProps<HTMLInputElement> {}

function Input({ ...props }: InputProps) {
  return <input css={inputCss} {...props} />;
}

const inputCss = (theme: Theme) => css`
  height: 50px;
  border: 1px solid ${theme.color.black400};
  border-radius: 10px;
  color: ${theme.color.white};
  padding: 0 12px;
  font-size: 16px;

  &::placeholder {
    color: ${theme.color.black200};
  }
`;

export default Input;

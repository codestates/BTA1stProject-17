/** @jsxImportSource @emotion/react */
import { ButtonHTMLAttributes } from 'react';
import { css, Theme } from '@emotion/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

function Button({ ...props }: ButtonProps) {
  return (
    <button css={buttonCss} {...props}>
      {props.children}
    </button>
  );
}

const buttonCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border: none;
  background-color: ${theme.color.black500};
  border-radius: 5px;

  font-family: 'Inter-Medium';
  font-size: 20px;
  color: ${theme.color.white};

  &:enabled:hover {
    background-color: ${theme.color.black400};
  }

  &:disabled {
    cursor: default;
    color: ${theme.color.black600};
  }
`;

export default Button;

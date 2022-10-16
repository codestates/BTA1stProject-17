/** @jsxImportSource @emotion/react */
import { Outlet, useNavigate } from 'react-router-dom';
import { css, Theme } from '@emotion/react';
import { useAppSelector } from '@/app/store';

function HelpLayout() {
  const { description, hasBackButton } = useAppSelector(store => store.helpLayout);
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <>
      <header css={theme => helpHeaderCss(theme)}>
        {hasBackButton && (
          <img
            className="back-button"
            src="/assets/images/icon-back.png"
            alt="back-button"
            onClick={handleBackButtonClick}
          />
        )}
        Hedera Hastag
      </header>
      <section css={theme => helpHeaderDescriptionSectionCss(theme)}>
        <img src="/assets/images/logo-white-big.png" />
        <p>{description}</p>
      </section>
      <main css={helpMainCss}>
        <Outlet />
      </main>
    </>
  );
}

const helpHeaderCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  color: ${theme.color.black100};
  font-family: 'Inter-Medium';

  .back-button {
    position: absolute;
    left: 20px;
    width: 12px;
    height: 21px;
  }
`;

const helpHeaderDescriptionSectionCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  height: 300px;
  align-items: center;
  padding-top: 60px;
  background-color: ${theme.color.black500};

  img {
    width: 120px;
    height: 120px;
    fill: black;
  }
  p {
    padding-top: 30px;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    white-space: pre-wrap;
    height: 60px;
  }
`;

const helpMainCss = css`
  width: 100%;
  height: 245px;
`;

export default HelpLayout;

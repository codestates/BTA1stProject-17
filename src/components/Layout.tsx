/** @jsxImportSource @emotion/react */
import { css, Theme } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import Modal from '@/components/Modal';

function Layout() {
  return (
    <div css={layoutCss}>
      <Outlet />
      <Modal />
    </div>
  );
}

const layoutCss = (theme: Theme) => css`
  position: relative;
  width: 400px;
  height: 600px;
  background-color: ${theme.color.black600};
  box-shadow: 0 0 8px black;
`;

export default Layout;

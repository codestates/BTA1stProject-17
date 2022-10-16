/** @jsxImportSource @emotion/react */
import { css, Theme } from '@emotion/react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div css={layoutCss}>
      <Outlet />
    </div>
  );
}

const layoutCss = (theme: Theme) => css`
  width: 400px;
  height: 600px;
  background-color: ${theme.color.black600};
  box-shadow: 0 0 8px black;
`;

export default Layout;

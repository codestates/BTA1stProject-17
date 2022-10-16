/** @jsxImportSource @emotion/react */

import { Global, css } from '@emotion/react';

const style = css`
  @font-face {
    font-family: 'Inter-Medium';
    src: url('/assets/fonts/Inter-Medium.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Inter-SemiBold';
    src: url('/assets/fonts/Inter-SemiBold.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Inter-Bold';
    src: url('/assets/fonts/Inter-Bold.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Inter-Light';
    src: url('/assets/fonts/Inter-Light.ttf') format('truetype');
  }

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-family: 'Inter-Medium';
    vertical-align: baseline;
    color: #d9d9d9;
    box-sizing: border-box;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  body {
    line-height: 1;
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    box-sizing: border-box;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0);
  }

  input {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
  }

  span {
    color: white;
  }
`;

// const getFonts = () => {
//   const fontNames = ['Inter-Medium', 'Inter-SemiBold', 'Inter-Bold'];
//   return fontNames.map(name => ({
//     "@font-face": {
//       fontFamily: name,
//       src: `url(${require(`../assets/fonts/${name}.ttf`)})`,
//     }
//   }))
// }

const GlobalStyle = () => {
  return <Global styles={style} />;
};

export default GlobalStyle;

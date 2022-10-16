const theme = {
  color: {
    black600: '#222222',
    black100: '#979797',
    black500: '#2D2D2D',
    white: '#D9D9D9',
  },
} as const;

export type TypeForMakingTheme = typeof theme;

export default theme;

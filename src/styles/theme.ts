const theme = {
  color: {
    skyblue: '#3DA1FF',
    'dark-100': '#333333',
    'dark-200': '#1C1C1C',
    'dark-300': '#0C0F13',
  },
} as const;

export type TypeForMakingTheme = typeof theme;

export default theme;

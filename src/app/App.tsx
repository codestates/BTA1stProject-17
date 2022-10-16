/** @jsxImportSource @emotion/react */
import { ThemeProvider } from '@emotion/react';
import GlobalStyle from '@/styles/global';
import theme from '@/styles/theme';
import { Provider } from 'react-redux';
import store from '@/app/store';
import { MemoryRouter as BrowserRouter } from 'react-router-dom';
// import { BrowserRouter } from 'react-router-dom';
import Router from '@/route';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
      {location.pathname}
    </Provider>
  );
}

export default App;

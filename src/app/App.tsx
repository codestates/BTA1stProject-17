/** @jsxImportSource @emotion/react */
import { ThemeProvider} from '@emotion/react';
import GlobalStyle from '@/styles/global';
import theme from '@/styles/theme';
import {Provider} from 'react-redux';
import store from '@/app/store';
import {BrowserRouter} from 'react-router-dom';
import Router from '@/route';

interface AppProps {

}

function App({}: AppProps) {


  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
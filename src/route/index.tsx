import { useRoutes } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import Main from '@/pages/Main';
import Layout from '@/components/Layout';
import Wallet from '@/pages/Wallet';
import Help from '@/pages/Help';
import Login from '@/pages/Login';
import MakeWallet from '@/pages/MakeWallet';
import RecoverWallet from '@/pages/RecoverWallet';
import CheckNemonic from '@/pages/CheckNemonic';
import HelpLayout from '@/components/HelpLayout';

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Main /> },
        {
          path: '/wallet',
          element: <Wallet />,
        },
        {
          path: '/help',
          element: <HelpLayout />,
          children: [
            { index: true, element: <Help /> },
            {
              path: 'login',
              element: <Login />,
            },
            {
              path: 'make',
              element: <MakeWallet />,
            },
            {
              path: 'recover',
              element: <RecoverWallet />,
            },
            {
              path: 'check',
              element: <CheckNemonic />,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
};

export default Router;

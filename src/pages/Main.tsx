import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store';
import { Client } from '@hashgraph/sdk';
import { setClient } from '@/slices/hederaSlice';
import { useEffect } from 'react';

function Main() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const init = async () => {
    const hashedMnemonic = localStorage.getItem('hashedMnemonic');
    const myAccountId = process.env.MY_ACCOUNT_ID!;
    const myPrivateKey = process.env.MY_PRIVATE_KEY!;
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    dispatch(setClient(client));
    if (!hashedMnemonic) {
      navigate('/help');
    } else {
      navigate('/help/login');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return <></>;
}

export default Main;

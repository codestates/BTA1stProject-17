import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store';
import { useLazyGetAccountsQuery } from '@/api';
import { Client, Mnemonic } from '@hashgraph/sdk';
import { setAccountIds, setAccountKey, setClient, setCurrentAccountId, setMnemonic } from '@/slices/hederaSlice';
import { useEffect } from 'react';

// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
interface MainProps {
  
}

function Main({}: MainProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getAccountsApi] = useLazyGetAccountsQuery();

  const init = async() => {
    const myAccountId = process.env.MY_ACCOUNT_ID!;
    const myPrivateKey = process.env.MY_PRIVATE_KEY!;
    const client = Client.forTestnet();
    const mnemonic = await Mnemonic.fromString('deposit question version business auction dwarf antique stomach piece vessel neck prevent decorate cheese dentist fashion act sample success project menu library grunt peanut');
    client.setOperator(myAccountId, myPrivateKey);
    const accountPrivateKey = await mnemonic.toEd25519PrivateKey('1234');
    const accountPublicKey = accountPrivateKey.publicKey;

    const { data: { accounts } } = await getAccountsApi({
      queryParams: {
        account: {
          publicKey: accountPublicKey.toString()
        }
      }
    })

    dispatch(setClient(client));
    dispatch(setMnemonic(mnemonic.toString()));
    dispatch(setAccountKey({ public: accountPublicKey, private: accountPrivateKey}));
    dispatch(setAccountIds( accounts.map((e: any) => e.account)));
    dispatch(setCurrentAccountId(accounts[0].account));
  }

  useEffect(() => {
    init()
  }, [])

  return <>
    <button onClick={() => navigate('/help')}>
      헬프 페이지 가기
    </button>
    <button onClick={() => navigate('/wallet')}>
      월렛 페이지 가기
    </button>
  </>
};

export default Main;
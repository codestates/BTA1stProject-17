import { createSlice } from '@reduxjs/toolkit';
import { Client, PrivateKey, PublicKey } from '@hashgraph/sdk';

interface HederaState {
  client: Client | null;
  mnemonic: string | null;
  accountKey: {
    public: PublicKey;
    private: PrivateKey;
  } | null;
  accountIds: string[];
  currentAccountId: string | null;
  currentAccountIdIdx: number;
}

const initialState: HederaState = {
  client: null,
  mnemonic: null,
  accountKey: null,
  accountIds: [],
  currentAccountId: null,
  currentAccountIdIdx: 0,
};

const HederaSlice = createSlice({
  name: 'hedera',
  initialState,
  reducers: {
    setClient(state, action) {
      state.client = action.payload;
    },
    setMnemonic(state, action) {
      state.mnemonic = action.payload;
    },
    setAccountKey(state, action) {
      state.accountKey = action.payload;
    },
    setAccountIds(state, action) {
      state.accountIds = action.payload;
    },
    setCurrentAccountId(state, action) {
      state.currentAccountId = action.payload.id;
      state.currentAccountIdIdx = action.payload.idx;
    },
  },
});

export const { setClient, setMnemonic, setAccountKey, setCurrentAccountId, setAccountIds } = HederaSlice.actions;
export default HederaSlice.reducer;

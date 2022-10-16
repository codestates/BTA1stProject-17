import { createSlice } from '@reduxjs/toolkit';
import { Client } from '@hashgraph/sdk';

interface HederaState {
  client: Client | null;
  mnemonic: string | null;
  accountKey: {
    public: string;
    private: string;
  } | null;
  currentAccountId: string | null;
}

const initialState: HederaState = {
  client: null,
  mnemonic: null,
  accountKey: null,
  currentAccountId: '0.0.48625813',
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
    setCurrentAccountId(state, action) {
      state.currentAccountId = action.payload;
    },
  },
});

export const { setClient, setMnemonic, setAccountKey, setCurrentAccountId } = HederaSlice.actions;
export default HederaSlice.reducer;

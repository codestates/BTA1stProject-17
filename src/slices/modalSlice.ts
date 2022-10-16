import { createSlice } from '@reduxjs/toolkit';
import AccountsModal from '@/pages/modal/AccountsModal';

export const MODAL_COMPONENT_MAP = {
  AccountsModal: AccountsModal,
};

interface ModalState {
  type: keyof typeof MODAL_COMPONENT_MAP | null;
}

const initialState: ModalState = {
  type: null,
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal(state, action) {
      state.type = action.payload;
    },
  },
});

export const { setModal } = ModalSlice.actions;
export default ModalSlice.reducer;

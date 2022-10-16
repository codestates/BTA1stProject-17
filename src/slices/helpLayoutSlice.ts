import { createSlice } from '@reduxjs/toolkit';

interface HelpLayoutState {
  description: string;
  hasBackButton?: boolean;
}

const initialState: HelpLayoutState = {
  description: '',
  hasBackButton: false,
};

const HelpLayoutSlice = createSlice({
  name: 'helpLayout',
  initialState,
  reducers: {
    setHelpLayout(state, action) {
      console.log(action);
      state.description = action.payload.description;
      state.hasBackButton = action.payload.hasBackButton ?? false;
    },
  },
});

export const { setHelpLayout } = HelpLayoutSlice.actions;
export default HelpLayoutSlice.reducer;

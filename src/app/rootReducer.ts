import { combineReducers } from 'redux';
import { api } from '@/api';
import helpLayout from '@/slices/helpLayoutSlice';
import hedera from '@/slices/hederaSlice';
import modal from '@/slices/modalSlice';

const rootReducer = combineReducers({
  helpLayout,
  hedera,
  modal,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;

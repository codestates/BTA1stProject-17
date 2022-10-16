import { combineReducers } from 'redux';
import { api } from '@/api';
import helpLayout from '@/slices/helpLayoutSlice';
import hedera from '@/slices/hederaSlice';

const rootReducer = combineReducers({
  helpLayout,
  hedera,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;

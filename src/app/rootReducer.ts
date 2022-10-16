import { combineReducers } from 'redux';
import { api } from '@/api';
import helpLayout from '@/slices/helpLayoutSlice';

const rootReducer = combineReducers({
  helpLayout,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;

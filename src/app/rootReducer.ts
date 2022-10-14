import {combineReducers} from 'redux';
import {api} from '@/api';
import home from '@/components/homeD/homeSlice'

const rootReducer = combineReducers({
  home,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
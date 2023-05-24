import {combineReducers} from 'redux';

import tableReducer from './tableSlice';

const rootReducer = combineReducers({
  tableId: tableReducer,
});

export default rootReducer;

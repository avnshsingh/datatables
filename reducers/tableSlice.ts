import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface tableState {
  id: number;
}

const initialState: tableState = {
  id: 1,
};

const tableslice = createSlice({
  name: 'tableId',
  initialState,
  reducers: {
    updateTableId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
  },
});

export const {updateTableId} = tableslice.actions;
export default tableslice.reducer;

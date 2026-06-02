import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billingData: {}
};

const opdBillingSlice = createSlice({
  name: 'opdBilling',
  initialState,
  reducers: {
    setBillingInfo: (state, action) => {
      state.billingData = action.payload;
    },
    clearBillingData: (state) => {
      state.billingData = null;
    }
  }
});

export const { setBillingInfo, clearBillingData } = opdBillingSlice.actions;
export default opdBillingSlice.reducer;

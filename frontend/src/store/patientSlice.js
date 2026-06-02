import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPatient: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    selectPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    clearPatient: (state) => {
      state.selectedPatient = null;
    },
  },
});

export const { selectPatient, clearPatient } = patientSlice.actions;
export default patientSlice.reducer;

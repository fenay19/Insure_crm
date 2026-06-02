import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import REACT_APP_API_URL from '../api/api';
import axios from 'axios';

// Async thunk to fetch user rights
export const fetchUserRights = createAsyncThunk('patient/fetchUserRights', async (id, thunkAPI) => {
  console.log('Fetching rights for user ID:', id);
  try {
    const response = await axios.get(`${REACT_APP_API_URL}admin/user-rights/${id}`);
    console.log('User rights response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user rights:', error);
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  authorize: false,
  userId: null,
  userData: null,
  SystemRightData: null,
  hasFetchedRights: false,
  isCheckingRights: false // 👈 new flag
};

const authSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setRightData: (state, action) => {
      state.authorize = action.payload;
    },
    logout: (state) => {
      state.userId = null;
      state.userData = null;
      state.SystemRightData = null;
      state.hasFetchedRights = false;
      state.isCheckingRights = false;
      sessionStorage.removeItem('hasFetchedRights');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRights.pending, (state) => {
        state.isCheckingRights = true; // start checking
      })
      .addCase(fetchUserRights.fulfilled, (state, action) => {
        const { systemRights, populatedUser } = action.payload;
        state.SystemRightData = systemRights;
        state.authorize = populatedUser.refId.access;
        state.userId = populatedUser._id;
        state.userData = populatedUser;
        state.hasFetchedRights = true;
        state.isCheckingRights = false; // done
      })
      .addCase(fetchUserRights.rejected, (state) => {
        state.isCheckingRights = false;
        state.authorize = false;
      });
  }
});

// Exports
export const { setRightData, logout } = authSlice.actions;
export default authSlice.reducer;

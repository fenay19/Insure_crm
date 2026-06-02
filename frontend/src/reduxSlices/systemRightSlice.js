import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import REACT_APP_API_URL from '../api/api';

// Async thunk for fetching system rights
export const fetchSystemRights = createAsyncThunk(
  'systemRights/fetchSystemRights',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}admin/user/system-rights/${userId}`);
      if (response.data?.success) {
        return response.data.systemRights;
      } else {
        return thunkAPI.rejectWithValue(response.data?.message || "Failed to fetch");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  systemRights: null,
  isLoading: false,
  error: null,
};

const systemRightsSlice = createSlice({
  name: 'systemRights',
  initialState,
  reducers: {
    clearSystemRights: (state) => {
      state.systemRights = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemRights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSystemRights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.systemRights = action.payload;
      })
      .addCase(fetchSystemRights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSystemRights } = systemRightsSlice.actions;
export default systemRightsSlice.reducer;
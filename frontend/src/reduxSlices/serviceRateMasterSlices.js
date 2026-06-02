import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedServiceRateListItem: null,
  selectedFilter: 'pathology',
  selectedItemIdForViewHistory : ''
}

const serviceRateListSlice = createSlice({
  name: 'serviceDetail',
  initialState,
  reducers: {
    setSelectedServiceRateList: (state, action) => {
      state.selectedServiceRateListItem = action.payload
    },

    clearSelectedServiceRateListItem: state => {
      state.selectedServiceRateListItem = null
    },

    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload
    },

    setSelectedItemIdForViewHistory : (state, action) => {
      state.selectedItemIdForViewHistory = action.payload
    },

    clearSelectedItemIdForViewHistory : (state, action) => {
      state.selectedItemIdForViewHistory = ''
    }
  }
})

export const { setSelectedServiceRateList, clearSelectedServiceRateListItem, setSelectedFilter, setSelectedItemIdForViewHistory, clearSelectedItemIdForViewHistory } = serviceRateListSlice.actions
export default serviceRateListSlice.reducer

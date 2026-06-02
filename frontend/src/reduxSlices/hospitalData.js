import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hospitalData : null
}

const hospitalDataSlice = createSlice({
    name : 'hospitalData',
    initialState,
    reducers : {
        setHospitalData : (state, action) => {
            state.hospitalData = action.payload
        }
    }
})

export const {setHospitalData} = hospitalDataSlice.actions
export default hospitalDataSlice.reducer
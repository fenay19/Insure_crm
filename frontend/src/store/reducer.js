// third party
import { combineReducers } from 'redux';

// project import
import customizationReducer from './customizationReducer';
import patientReducer from './patientSlice';
import opdBillingReducer from '../reduxSlices/opdBillingSlice';
import opdBillingStates from '../reduxSlices/opdBillingStates';
import hospitalDataSlices from '../reduxSlices/hospitalData';
import serviceRateMasterSlices from '../reduxSlices/serviceRateMasterSlices';
import systemRightsReducer from '../reduxSlices/systemRightSlice';
import { baseApi } from 'services/baseApi';
import  authSlice from '../reduxSlices/authSlice';
// ==============================|| REDUCER ||============================== //

const reducer = combineReducers({
  auth:authSlice,
  customization: customizationReducer,
  patient: patientReducer,
  opdBilling: opdBillingReducer,
  hospitalData: hospitalDataSlices,
  serviceRateListMaster: serviceRateMasterSlices,
  opdBillingStates,
  systemRights: systemRightsReducer,
  [baseApi.reducerPath]: baseApi.reducer
});

export default reducer;

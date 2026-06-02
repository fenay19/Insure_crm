import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { retrieveToken } from 'api/api';
import REACT_APP_API_URL from 'api/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = retrieveToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Department', 'Consultants', 'Remarks', 'OPD_Patient','Radiology', 'IPD_Form','Notification','crossConsultation','Income','PT','PathologyTest','Entry',],
  endpoints: () => ({})
});

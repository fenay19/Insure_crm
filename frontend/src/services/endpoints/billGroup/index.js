import { baseApi } from 'services/baseApi';

export const billGroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillGroup: builder.query({
      query: () => `billgroup-master`,
      transformResponse: (res) => res?.data || [],
      providesTags: ['BillGroup']
    })
  })
});

export const { useGetBillGroupQuery } = billGroupApi;

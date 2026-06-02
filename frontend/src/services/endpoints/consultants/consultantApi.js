import { baseApi } from 'services/baseApi';

export const consultantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsultants: builder.query({
      query: () => `newConsultant`,
      transformResponse: (res) => res?.data,
      providesTags: ['Consultants']
    })
  })
});

export const { useGetConsultantsQuery } = consultantApi;

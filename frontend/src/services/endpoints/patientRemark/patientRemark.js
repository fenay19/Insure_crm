import { baseApi } from 'services/baseApi';

export const patientRemarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addRemark: builder.mutation({
      query: (data) => ({
        url: `patient-glass-prescription/remark`,
        method: 'POST',
        body: { data }
      }),
      invalidatesTags: ['Remarks']
    }),
    getRemark: builder.query({
      query: (id) => `patient-glass-prescription/remark/${id}`,
      transformResponse: (res) => res?.data?.[0],
      providesTags: ['Remarks']
    }),
    updateRemark: builder.mutation({
      query: ({ id, data }) => ({
        url: `patient-glass-prescription/remark-update/${id}`,
        method: 'PUT',
        body: { data }
      }),
      invalidatesTags: ['Remarks']
    })
  })
});

export const { useAddRemarkMutation, useGetRemarkQuery, useUpdateRemarkMutation } = patientRemarkApi;

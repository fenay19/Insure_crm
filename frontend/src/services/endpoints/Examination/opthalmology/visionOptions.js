import { baseApi } from 'services/baseApi';
export const visionOptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addVisionOption: builder.mutation({
      query: (data) => ({
        url: `vision-options`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['visionOptions']
    }),
    getAllVisionOptions: builder.query({
      query: () => 'vision-options',
      providesTags: ['visionOptions'],
      transformResponse: (res) => res?.data || []
    }),
    deleteVisionOptions: builder.mutation({
      query: (data) => ({
        url: `vision-options/delete`,
        method: 'DELETE',
        body: data
      }),
      invalidatesTags: ['visionOptions']
    })
  })
});

export const { useGetAllVisionOptionsQuery, useAddVisionOptionMutation, useDeleteVisionOptionsMutation } = visionOptionApi;

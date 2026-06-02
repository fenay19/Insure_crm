import { baseApi } from 'services/baseApi';
export const findingOptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addFindingOption: builder.mutation({
      query: (data) => ({
        url: `finding-options`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['FindingOptions']
    }),
    getAllFindingOptions: builder.query({
      query: () => 'finding-options',
      providesTags: ['FindingOptions'],
      transformResponse: (res) => res?.data || []
    }),
    deleteFindingOptions: builder.mutation({
      query: (data) => ({
        url: `finding-options/delete`,
        method: 'DELETE',
        body: data
      }),
      invalidatesTags: ['FindingOptions']
    })
  })
});

export const { useGetAllFindingOptionsQuery, useAddFindingOptionMutation, useDeleteFindingOptionsMutation } = findingOptionApi;

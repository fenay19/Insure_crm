import { baseApi } from 'services/baseApi';

export const arDilatedOptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addArDilatedOption: builder.mutation({
      query: (data) => ({
        url: 'ar-options-dilated',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ArDilatedOptions'],
    }),
    getAllArDilatedOptions: builder.query({
      query: () => 'ar-options-dilated',
      providesTags: ['ArDilatedOptions'],
      transformResponse: (res) => res?.data || [],
    }),
    deleteArDilatedOption: builder.mutation({
      query: (data) => ({
        url: 'ar-options-dilated/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['ArDilatedOptions'],
    }),
  }),
});

export const {
  useAddArDilatedOptionMutation,
  useGetAllArDilatedOptionsQuery,
  useDeleteArDilatedOptionMutation,
} = arDilatedOptionApi;

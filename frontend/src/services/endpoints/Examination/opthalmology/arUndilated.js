import { baseApi } from 'services/baseApi';

export const arUndilatedOptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addArUndilatedOption: builder.mutation({
      query: (data) => ({
        url: 'ar-options-undilated',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ArUndilatedOptions'],
    }),
    getAllArUndilatedOptions: builder.query({
      query: () => 'ar-options-undilated',
      providesTags: ['ArUndilatedOptions'],
      transformResponse: (res) => res?.data || [],
    }),
    deleteArUndilatedOption: builder.mutation({
      query: (data) => ({
        url: 'ar-options-undilated/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['ArUndilatedOptions'],
    }),
  }),
});

export const {
  useAddArUndilatedOptionMutation,
  useGetAllArUndilatedOptionsQuery,
  useDeleteArUndilatedOptionMutation,
} = arUndilatedOptionApi;

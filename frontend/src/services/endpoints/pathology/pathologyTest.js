import { baseApi } from 'services/baseApi';
export const pathologyTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPathologyProfileTests: builder.query({
      query: () => 'investigation-pathology-master/profile',
      transformResponse: (res) => res?.data || [],
      providesTags: ['PathologyTest']
    }),
    getPathologyTests: builder.query({
      query: () => 'investigation-pathology-master',
      transformResponse: (res) => res?.investigations || [],
      providesTags: ['PathologyTest']
    }),
    addPathologyProfileTests: builder.mutation({
      query: (formData) => ({
        url: 'investigation-pathology-master/profile',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['PathologyTest']
    }),
    updatePathologyProfileTests: builder.mutation({
      query: ({ formData, id }) => ({
        url: `investigation-pathology-master/profile/${id}`,
        method: 'PUT',
        body: formData
      }),
      invalidatesTags: ['PathologyTest']
    }),
    deletePathologyProfileTests: builder.mutation({
      query: (id) => ({
        url: `investigation-pathology-master/profile/delete/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['PathologyTest']
    })
  })
});

export const {
  useGetPathologyProfileTestsQuery,
  useAddPathologyProfileTestsMutation,
  useDeletePathologyProfileTestsMutation,
  useUpdatePathologyProfileTestsMutation,
  useGetPathologyTestsQuery
} = pathologyTestApi;

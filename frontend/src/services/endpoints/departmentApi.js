import { baseApi } from 'services/baseApi';

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => `department-setup`,
      transformResponse: (res) => res?.data,
      providesTags: ['Department']
    })
  })
});

export const { useGetDepartmentsQuery } = departmentApi;

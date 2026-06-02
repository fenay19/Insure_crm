import { get } from "api/api";

import { baseApi } from "services/baseApi";
export const radiologyTemplateSectionApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getRadiologySection:builder.query({
            query:()=>`/section`,
            providesTags:['RadiologySection'],
            transformResponse: (res) => res 
        }),
        addRadiologySection:builder.mutation({
            query:(data)=>({
                url:`/section`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['RadiologySection']
        }),
        updateRadiologySection: builder.mutation({
            query: ({ id, updatedData }) => ({
              url: `section/${id}`,
              method: 'PUT',
              body: updatedData,
            }),
            invalidatesTags: ['RadiologySection'],
          }),
        deleteRadiologySection: builder.mutation({
            query: (id) => ({
              url: `section/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['RadiologySection'],
          }),
    })
})

export const {useGetRadiologySectionQuery,useAddRadiologySectionMutation,useUpdateRadiologySectionMutation,useDeleteRadiologySectionMutation}=radiologyTemplateSectionApi
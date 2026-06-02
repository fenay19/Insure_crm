import { get } from "api/api";

import { baseApi } from "services/baseApi";
export const radiologyTemplateApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getRadiologyTemplate:builder.query({
            query:()=>`template-radiology/files`,
            providesTags:['Radiology']
        }),
        addRaiologyTemplate:builder.mutation({
            query:(data)=>({
                url:`template-radiology/files`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Radiology']
        }),
        updateRadiologyTemplate: builder.mutation({
            query: ({ id, updatedData }) => ({
              url: `template-radiology/${id}`,
              method: 'PUT',
              body: updatedData,
            }),
            invalidatesTags: ['Radiology'],
          }),
        deleteRadiologyTemplate: builder.mutation({
            query: (id) => ({
              url: `template-radiology/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['Radiology'],
          }),
    })
})

export const {useGetRadiologyTemplateQuery,useAddRaiologyTemplateMutation,useUpdateRadiologyTemplateMutation,useDeleteRadiologyTemplateMutation}=radiologyTemplateApi
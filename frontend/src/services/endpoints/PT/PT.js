import { get } from "api/api";

import { baseApi } from "services/baseApi";
export const PTApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getPT:builder.query({
            query:()=>`pt/`,
            providesTags:['PT'],
            transformResponse:((res)=>res?.data||[])
        }),
        addPT:builder.mutation({
            query:(data)=>({
                url:`pt`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['PT']
        }),
        updatePT: builder.mutation({
            query: ({ id, updatedData }) => ({
              url: `/pt/${id}`,
              method: 'PUT',
              body: updatedData,
            }),
            invalidatesTags: ['PT'],
          }),
        deletePT: builder.mutation({
            query: (id) => ({
              url: `pt/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['PT'],
          }),
    })
})

export const {useGetPTQuery,useAddPTMutation,useUpdatePTMutation,useDeletePTMutation}=PTApi
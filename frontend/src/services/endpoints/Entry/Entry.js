import { get } from "api/api";

import { baseApi } from "services/baseApi";
export const EntryApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getEntry:builder.query({
            query:()=>`/entry`,
            providesTags:['Entry']
        }),
        addEntry:builder.mutation({
            query:(data)=>({
                url:`/entry`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Entry']
        }),
        updateEntry: builder.mutation({
            query: ({ id, updatedData }) => ({
              url: `entry/${id}`,
              method: 'PUT',
              body: updatedData,
            }),
            invalidatesTags: ['Entry'],
          }),
        deleteEntry: builder.mutation({
            query: (id) => ({
              url: `entry/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['Entry'],
          }),
    })
})

export const {useGetEntryQuery,useAddEntryMutation,useUpdateEntryMutation,useDeleteEntryMutation}=EntryApi
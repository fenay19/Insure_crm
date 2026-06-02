import { get } from "api/api";

import { baseApi } from "services/baseApi";
export const IncomeApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getIncome:builder.query({
            query:()=>`income`,
            providesTags:['Income'],
            transformResponse:((res)=>res?.data||[])
        }),
        addIncome:builder.mutation({
            query:(data)=>({
                url:`income`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Income']
        }),
        updateIncome: builder.mutation({
            query: ({ id, updatedData }) => ({
              url: `income/${id}`,
              method: 'PUT',
              body: updatedData,
            }),
            invalidatesTags: ['Income'],
          }),
        deleteIncome: builder.mutation({
          query: ({id}) => ({
            url: `income/${id}`,
            method: 'DELETE',
          }),
  invalidatesTags: ['Income'],
}),
    })
})

export const {useGetIncomeQuery,useAddIncomeMutation,useUpdateIncomeMutation,useDeleteIncomeMutation}=IncomeApi
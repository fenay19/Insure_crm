import { baseApi } from "services/baseApi";


export const ipdFormSetupApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getIpdForm:builder.query({
            query:()=>`ipd-form-setup/files`,
            providesTags:['IPD_Form']
        }),
        addIpdForm:builder.mutation({
            query:(data)=>({
                url:`ipd-form-setup/files`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['IPD_Form']
        }),
        updateIpdForm: builder.mutation({
            query: ({ id, updatedData }) => ({
              url: `ipd-form-setup/${id}`,
              method: 'PUT',
              body: updatedData,
            }),
            invalidatesTags: ['IPD_Form'],
          }),
        deleteIpdForm: builder.mutation({
            query: (id) => ({
              url: `ipd-form-setup/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['IPD_Form'],
          }),
    })
})

export const {useGetIpdFormQuery,useAddIpdFormMutation,useUpdateIpdFormMutation,useDeleteIpdFormMutation} = ipdFormSetupApi
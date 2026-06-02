import { baseApi } from 'services/baseApi';

export const createCrossConsultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPatientCrossConsultation: builder.mutation({
      query: (data) => ({
        url: '/patient-cross-consultation',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['crossConsultation']
    }),
   updatePatientCrossConsultation: builder.mutation({
    query: ({id,data}) => ({
       url: `/patient-cross-consultation/edit/${id}`,
       method: 'PUT',
       body: data
     }),
     invalidatesTags: ['crossConsultation']
   }),
     getPatientCrossConsultation: builder.query({
          query: (id) =>`/patient-cross-consultation/get/${id}`,
          transformResponse:(res)=>res?.data||{},
              providesTags: ['crossConsultation']
   }),
   deletePatientCrossConsultation: builder.mutation({
     query: (id) => ({
          url: `/patient-cross-consultation/delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['crossConsultation']
   })
  })
});

export const {
     useAddPatientCrossConsultationMutation,useLazyGetPatientCrossConsultationQuery,useDeletePatientCrossConsultationMutation,useUpdatePatientCrossConsultationMutation
}=createCrossConsultationApi


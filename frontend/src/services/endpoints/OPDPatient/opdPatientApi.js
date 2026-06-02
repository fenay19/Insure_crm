import { baseApi } from 'services/baseApi';

export const opdPatientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientOut: builder.query({
      query: (id) => `opd-patient/getDailyConfirmedAppoitmentsConsultantWise/${id}`,
      transformResponse: (res) => {
        if (res?.data) {
          const patientOut = (res?.data || [])?.filter((patient) => patient?.status?.toLowerCase()?.trim() === 'patient out');
          return patientOut;
        }
      },
      providesTags: ['OPD_Patient']
    }),
    updatePatientStatus: builder.mutation({
      query: (id) => ({
        url: `opd-patient/update-patient-status/${id}`,
        method: 'PUT',
        body: { status: 'Patient Out' }
      }),
      invalidatesTags: ['OPD_Patient']
    }),
    updatePatientBillType: builder.mutation({
      query: (body) => ({
        url: `opd-patient/bill-type`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['OPD_Patient']
    })
  })
});

export const { useGetPatientOutQuery, useUpdatePatientStatusMutation, useUpdatePatientBillTypeMutation } = opdPatientApi;

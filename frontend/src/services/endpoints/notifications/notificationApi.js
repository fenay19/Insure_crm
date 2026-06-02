import { baseApi } from 'services/baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (id) => `notification/consultant/${id}`,
      providesTags: ['Notification']
    }),
    getNotificationsPatient: builder.query({
      query: (id) => `notification/patient/${id}`,
      providesTags: ['Notification']
    }),
    sendNotfication: builder.mutation({
      query: (newNotification) => ({
        url: '/notification/consultant',
        method: 'POST',
        body: newNotification
      }),
      invalidatesTags: ['Notification']
    }),
    updateNotificationStatus: builder.mutation({
      query: (id) => ({
        url: `/notification/consultant-status/${id?.id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Notification']
    })
  })
});

export const { useSendNotficationMutation, useGetNotificationsQuery, useUpdateNotificationStatusMutation,useGetNotificationsPatientQuery } = notificationApi;

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { useGetNotificationsQuery, useUpdateNotificationStatusMutation } from 'services/endpoints/notifications/notificationApi';

const NotificationDialog = ({ open, onClose, notification }) => {
  const loginData = JSON.parse(localStorage.getItem('loginData'));
  const consultantId = loginData?.refId;

  const { data = [], refetch } = useGetNotificationsQuery(consultantId);
  const [updateNotification, {}] = useUpdateNotificationStatusMutation();
  if (!notification) return null;
  const handleApprove = async () => {
    const id = data?.[0]?._id;
    await updateNotification({ id });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Notification Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          {notification.message}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Pending: ₹{notification.pendingAmount}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Paid: ₹{notification.paidAmount}
        </Typography>
        <Typography variant="body2">Created At: {new Date(notification.createdAt).toLocaleString()}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={handleApprove}>
          Approve Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;

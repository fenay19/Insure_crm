import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Box, Paper } from '@mui/material';
import { get } from 'api/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function ViewHistoryOfServiceRates({ isOpen, onClose }) {
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedServiceRateListItem, selectedFilter, selectedItemIdForViewHistory } = useSelector(
    (state) => state.serviceRateListMaster
  );

  // Fetch history data
  const fetchServiceRateAndCodeWithCreatedAndUpdatedDate = async () => {
    setIsLoading(true);
    try {
      const response = await get(
        `service-rate-new/getCreatedAndUpdatedHistoryOfServiceRate/${selectedServiceRateListItem._id}/${selectedFilter}/${selectedItemIdForViewHistory}`
      );

      if (response.success) {
        setHistoryData(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch history data.');
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
      toast.error('An error occurred while fetching history data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the modal opens or dependencies change
  useEffect(() => {
    if (isOpen) {
      fetchServiceRateAndCodeWithCreatedAndUpdatedDate();
    }

    return () => {
      setHistoryData(null);
    };
  }, [isOpen, selectedServiceRateListItem._id, selectedFilter, selectedItemIdForViewHistory]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString(); // Format date and time based on user's locale
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
        Service Rate History
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : historyData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Rate History */}
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Rate History
              </Typography>
              <Typography>
                <strong>Rate:</strong> {historyData.rate}
              </Typography>
              <Typography>
                <strong>Created At:</strong> {formatDate(historyData.rateCreatedAt)}
              </Typography>
              <Typography>
                <strong>Updated At:</strong> {formatDate(historyData.rateUpdatedAt)}
              </Typography>
            </Paper>

            {/* Code History */}
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Code History
              </Typography>
              <Typography>
                <strong>Code:</strong> {historyData.code}
              </Typography>
              <Typography>
                <strong>Created At:</strong> {formatDate(historyData.codeCreatedAt)}
              </Typography>
              <Typography>
                <strong>Updated At:</strong> {formatDate(historyData.codeUpdatedAt)}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
            No history data available.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewHistoryOfServiceRates;

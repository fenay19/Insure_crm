import React, { useState } from 'react';
import { Card, CardContent, Typography, Divider, Box, InputLabel, Select, MenuItem, Menu } from '@mui/material';
import { currentDate, extractPrefixAndNumber } from 'utils/currentDate';
import { Button, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setBillType } from 'reduxSlices/opdBillingStates';
import BillType from './BillType';

const PatientDemoGraph = () => {
  const dispatch = useDispatch();
  const { billingData } = useSelector((state) => state.opdBilling);
  const billDate = currentDate();
  const billNo = extractPrefixAndNumber(billingData?.opd_regNo || 'N/A');
  const [inputData, setInputData] = useState('');
  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (mode) => {
    if (mode) {
      console.log(mode);
      dispatch(setBillType(mode));
      handleChange({ target: { name: 'billType', value: mode } }); // Manually triggering handleChange
    }
    setAnchorEl(null);
  };

  return (
    <Card sx={{ padding: '1rem', width: '30%' }}>
      <CardContent>
        {/* Header */}
        <Typography variant="h6" gutterBottom>
          Patient Demography
        </Typography>
        <Divider sx={{ marginBottom: '1rem' }} />

        {/* Fields */}
        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            OPD Registration Type:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.consultationType || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            OPD No.:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.opd_regNo || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            UHID No.:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.uhid || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Patient Name:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.patientFirstName
              ? `${billingData.patientFirstName} ${billingData.patientMiddleName || ''} ${billingData.patientLastName || ''}`
              : 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Age/Gender:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.age || 'N/A'} / {billingData?.gender || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Mobile No:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.mobile_no || 'N/A'}
          </Typography>
        </Box>

        {billingData?.patientPayee !== '' && (
          <Box sx={{ marginBottom: '0.5rem' }}>
            <Typography variant="body2" fontWeight="600" display="inline">
              Patient Payee:{' '}
            </Typography>
            <Typography variant="body2" display="inline">
              {billingData?.patientPayee || 'N/A'}
            </Typography>
          </Box>
        )}

        {billingData?.tpa !== '' && (
          <Box sx={{ marginBottom: '0.5rem' }}>
            <Typography variant="body2" fontWeight="600" display="inline">
              TPA:{' '}
            </Typography>
            <Typography variant="body2" display="inline">
              {billingData?.tpa || 'N/A'}
            </Typography>
          </Box>
        )}

        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Department:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.departmentName || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Consultant:{' '}
          </Typography>
          <Typography variant="body2" display="inline">
            {billingData?.consultantName || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Bill No :
          </Typography>
          <Typography variant="body2" display="inline">
            {billNo || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: '0.5rem' }}>
          <Typography variant="body2" fontWeight="600" display="inline">
            Bill Date :
          </Typography>
          <Typography variant="body2" display="inline">
            {billDate || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BillType />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientDemoGraph;

import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setBillType } from 'reduxSlices/opdBillingStates';
import { useUpdatePatientBillTypeMutation } from 'services/endpoints/OPDPatient/opdPatientApi';

const BillType = () => {
  const dispatch = useDispatch();
  const { billingData } = useSelector((state) => state.opdBilling);

  const [updateBillType] = useUpdatePatientBillTypeMutation();
  const { billType } = useSelector((state) => state.opdBillingStates);
  const handleSelectChange = async (e) => {
    try {
      dispatch(setBillType(e.target.value));
      await updateBillType({ type: e.target.value, patientId: billingData?.patientId });
    } catch (err) {}
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <Typography variant="body2" fontWeight="600">
        Bill Type:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="bill-type-label">Select</InputLabel>
        <Select labelId="bill-type-label" name="billType" value={billType || ''} onChange={handleSelectChange} label="Select">
          <MenuItem value="Credit">Credit</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Cash Credit">Cash Credit</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default BillType;

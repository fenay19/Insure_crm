import React, { useEffect, useState } from 'react';
import { TextField, Box, Typography, Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAddRemarkMutation, useGetRemarkQuery, useUpdateRemarkMutation } from 'services/endpoints/patientRemark/patientRemark';
import { toast } from 'react-toastify';

const RemarkSection = ({ departmentId = '' } = {}) => {
  const [visionRemark, setVisionRemark] = useState('');
  const [visionAdvice, setVisionAdvice] = useState('');
  const patient = useSelector((state) => state.patient.selectedPatient);

  const [addRemark, { isLoading: isAdding, isSuccess: isAddSuccess, isError: isAddError, error: addError, reset: resetAdd }] =
    useAddRemarkMutation();

  const [
    updateRemark,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError, reset: resetUpdate }
  ] = useUpdateRemarkMutation();

  const { data, isLoading: isFetching } = useGetRemarkQuery(patient?.patientId?._id, {
    skip: !patient?.patientId?._id
  });

  // Populate fields when data is fetched
  useEffect(() => {
    if (data) {
      setVisionRemark(data?.visionRemark || '');
      setVisionAdvice(data?.visionAdvice || '');
    }
  }, [data]);

  const handleSave = async () => {
    const payload = {
      patientId: patient?.patientId?._id,
      consultantId: patient?.consultantId,
      departmentId,
      visionRemark,
      visionAdvice
    };

    try {
      if (data?._id) {
        // Update existing remark
        await updateRemark({ id: data._id, data: payload }).unwrap();
      } else {
        // Add new remark
        await addRemark(payload).unwrap();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      toast.success('Remark saved successfully!');
      resetAdd();
      resetUpdate();
    }

    if (isAddError || isUpdateError) {
      toast.error(addError?.data?.message || updateError?.data?.message || 'Failed to save remark.');
    }
  }, [isAddSuccess, isUpdateSuccess, isAddError, isUpdateError, addError, updateError, resetAdd, resetUpdate]);

  return (
    <Box sx={{ width: '100%', p: 2, boxShadow: 3, my: 3, backgroundColor: 'white' }}>
      <Typography
        variant="h4"
        sx={{
          backgroundColor: '#126078',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          borderRadius: '5px'
        }}
      >
        Remark
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Vision Remark"
            variant="outlined"
            fullWidth
            value={visionRemark}
            onChange={(e) => setVisionRemark(e.target.value)}
            disabled={isFetching}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Vision Advice"
            variant="outlined"
            fullWidth
            value={visionAdvice}
            onChange={(e) => setVisionAdvice(e.target.value)}
            disabled={isFetching}
          />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={handleSave} disabled={isAdding || isUpdating || isFetching}>
            {data ? 'Update' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RemarkSection;

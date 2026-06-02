import React from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { put } from 'api/api';

const EditBmiScale = ({ bmiValue = 0, onClose, getData, editData }) => {
  // Define BMI range
  const patient = useSelector((state) => state.patient.selectedPatient);

  const minBmi = 10;
  const maxBmi = 40;
  let scaledBmi = ((bmiValue - minBmi) / (maxBmi - minBmi)) * 100;
  scaledBmi = Math.max(0, Math.min(100, scaledBmi));

  // Determine BMI Category
  let bmiCategory = 'N/A';
  let bmiColor = '#333';

  if (bmiValue < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#2196F3';
  } else if (bmiValue >= 18.5 && bmiValue < 25) {
    bmiCategory = 'Normal';
    bmiColor = '#4CAF50';
  } else if (bmiValue >= 25 && bmiValue < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#FFC107';
  } else if (bmiValue >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#F44336';
  }

  const handleBmiUpdate = async () => {
    try {
      const res = await put(`form-setup/vital-master/update-single/${patient?.patientId?._id}/${editData?._id}`, {
        bmiValue,
        bmiType: bmiCategory,
        unit: 'kg/m2',
        vitalName: 'Body Mass Index (BMI)'
      });
      if (res?.status) {
        toast.success('BMI updated successfully!');
        getData();
        onClose();
      } else {
        toast.success('Failed to Update');
      }
    } catch (error) {
      toast.error('Failed to update BMI');
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '90%',
          maxWidth: 600,
          textAlign: 'center',
          mt: 4,
          p: 5,
          borderRadius: 4,
          boxShadow: 4,
          bgcolor: '#fff',
          mb: 4,
          mx: 'auto'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
          BMI Scale <span style={{ color: '#1976D2', fontWeight: 'bold', fontSize: '1.5em', marginLeft: '1rem' }}>{bmiValue} kg/m2</span>
        </Typography>

        {/* BMI Categories */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 2 }}>
          <Typography variant="body1" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
            Underweight
          </Typography>
          <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
            Normal
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFC107', fontWeight: 'bold' }}>
            Overweight
          </Typography>
          <Typography variant="body1" sx={{ color: '#F44336', fontWeight: 'bold' }}>
            Obese
          </Typography>
        </Box>

        {/* Progress Bar with Indicator */}
        <Box sx={{ position: 'relative', mt: 4 }}>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: 18,
              borderRadius: 10,
              background: 'linear-gradient(to right, #2196F3 0%, #4CAF50 30%, #FFC107 60%, #F44336 90%)',
              boxShadow: '0px 6px 14px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          />

          {/* BMI Indicator Pointer */}
          {bmiValue && (
            <Box
              sx={{
                position: 'absolute',
                left: `calc(${scaledBmi}% - 12px)`,
                top: -28,
                fontWeight: 'bold',
                fontSize: 30,
                color: '#333',
                transition: 'left 0.3s ease'
              }}
            >
              ▲
            </Box>
          )}
        </Box>

        {/* BMI Value & Category Display */}
        <Typography sx={{ mt: 3, fontSize: '1.5rem', fontWeight: 'bold', color: bmiColor }}>
          Your BMI: {bmiValue} ({bmiCategory})
        </Typography>

        {/* Update Button */}
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleBmiUpdate}>
          Update
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default EditBmiScale;

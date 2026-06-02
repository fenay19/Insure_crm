import React from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';

const BmiScale = ({ bmi = 0, setPatientVitalData, setPatientSetedData } = {}) => {
  // Define BMI range
  const minBmi = 10;
  const maxBmi = 40;
  let scaledBmi = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
  scaledBmi = Math.max(0, Math.min(100, scaledBmi));

  // Determine BMI Category
  let bmiCategory = 'N/A';
  let bmiColor = '#333';

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#2196F3';
  } else if (bmi >= 18.5 && bmi < 25) {
    bmiCategory = 'Normal';
    bmiColor = '#4CAF50';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#FFC107';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#F44336';
  }

  const handleBmiSave = () => {
    setPatientVitalData((prev) => ({
      ...prev,
      bodyMassIndex: [{ bmiValue: bmi, bmiType: bmiCategory, unit: 'kg/m2', vitalName: 'Body Mass Index (BMI)' }]
    }));
    setPatientSetedData((prev) => ({
      ...prev,
      bodyMassIndex: [{ bmiValue: bmi, bmiType: bmiCategory, unit: 'kg/m2', vitalName: 'Body Mass Index (BMI)' }]
    }));
  };

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 600,
        textAlign: 'center',
        mt: 4,
        p: 5,
        borderRadius: 4,
        border:1,
        borderColor:"#126078",
         boxShadow: "0 1px 6px 1px #126078",
        bgcolor: '#fff',
        mb: 4,
        mx: 'auto'
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
        BMI Scale <span style={{ color: '#1976D2', fontWeight: 'bold', fontSize: '1.5em', marginLeft: '1rem' }}>{bmi} kg/m2</span>
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
        {bmi && (
          <Box
            sx={{
              position: 'absolute',
              left: `calc(${scaledBmi}% - 12px)`, // Adjust position dynamically
              top: -28,
              fontWeight: 'bold',
              fontSize: 30, // Bigger indicator
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
        Your BMI: {bmi} ({bmiCategory})
      </Typography>

      {/* Save Button */}
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleBmiSave}>
        Save
      </Button>
    </Box>
  );
};

export default BmiScale;

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Card,
  CardContent,
  Divider,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { toast, ToastContainer } from 'react-toastify';
import { calculateBMI } from '../data';
import EditSelectableChips from '../EditSelectableChips/EditSelectableChips';
import EditHeightAndWeightDropdown from '../HeightAndWeightDropDown/EditHeightAndWeight';
import EditBloodOxygenSaturation from '../BloodOxygenSaturation/EditBloodOxygenSaturation';
import EditBloodPressure from '../BloodPressure/EditBloodPressure';
import EditBmiScale from '../BMIScale/EditBmi';
import EditTemperature from '../Temperature/EditTemperature';
import { bmiData, pulseRate, respiratoryRate } from '../data';

const PatientVitalDisplay = ({ patientVitalData, handleDelete, getData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVital, setSelectedVital] = useState(null);
  const [editType, setEditType] = useState('');
  const [viewMode, setViewMode] = useState('compact'); // 'compact' or 'grid'

  if (!patientVitalData) return null;

  const smallHeightHeadings = ['blood oxygen saturation (spo2)', 'blood pressure (bp)'];

  let formattedVitals = [];
  Object.entries(patientVitalData).forEach(([key, vitals]) => {
    if (Array.isArray(vitals)) {
      vitals.forEach((vital) => formattedVitals.push(vital));
    }
  });

  let bmiCategory = 'N/A';
  let bmiColor = '#333';
  const height = patientVitalData?.height?.[0]?.height;
  const weight = patientVitalData?.weight?.[0]?.weight;
  const bmiValue = height && weight ? calculateBMI(weight, height) : 0;
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

  const heightVital = formattedVitals.find((v) => v.vitalName?.toLowerCase().trim() === 'height');
  const weightVital = formattedVitals.find((v) => v.vitalName?.toLowerCase().trim() === 'weight');
  const bmiVital = formattedVitals.find((v) => v.vitalName?.toLowerCase().trim() === 'body mass index (bmi)');

  formattedVitals = formattedVitals.filter(
    (v) =>
      v.vitalName?.toLowerCase().trim() !== 'height' &&
      v.vitalName?.toLowerCase().trim() !== 'weight' &&
      v.vitalName?.toLowerCase().trim() !== 'body mass index (bmi)'
  );

  const handleEditClick = (vital, type = '') => {
    setSelectedVital(vital);
    setEditType(type);
    setOpenDialog(true);
  };

  const handleCombinedDelete = (e) => {
    e.stopPropagation();
    if (heightVital?._id) handleDelete(heightVital._id);
    if (weightVital?._id) handleDelete(weightVital._id);
  };

  const getEditComponent = () => {
    const name = selectedVital?.vitalName?.toLowerCase().trim();
    switch (name) {
      case 'height':
      case 'weight':
        return (
          <EditHeightAndWeightDropdown
            data={{ height: heightVital, weight: weightVital }}
            getData={getData}
            onClose={() => setOpenDialog(false)}
          />
        );
      case 'respiratory rate (rr)':
        return (
          <EditSelectableChips data={respiratoryRate} editData={selectedVital} getData={getData} onClose={() => setOpenDialog(false)} />
        );
      case 'pulse (radial)/heart rate':
        return <EditSelectableChips data={pulseRate} editData={selectedVital} getData={getData} onClose={() => setOpenDialog(false)} />;
      case 'blood oxygen saturation (spo2)':
        return <EditBloodOxygenSaturation editData={selectedVital} getData={getData} onClose={() => setOpenDialog(false)} />;
      case 'blood pressure (bp)':
        return <EditBloodPressure editData={selectedVital} getData={getData} onClose={() => setOpenDialog(false)} />;
      case 'body mass index (bmi)':
        return <EditBmiScale editData={selectedVital} getData={getData} onClose={() => setOpenDialog(false)} bmiValue={bmiValue} />;
      case 'temperature':
        return <EditTemperature editData={selectedVital} getData={getData} onClose={() => setOpenDialog(false)} />;
      default:
        return <Typography>No specific editor available for this vital.</Typography>;
    }
  };

  const fahrenheitToCelsius = (fahrenheit) => (((fahrenheit - 32) * 5) / 9).toFixed(2);

  // Grid View Vital Card
  const GridVitalCard = ({ vital }) => {
    if (!vital) return null;

    const isSmallHeight = smallHeightHeadings.includes(vital?.vitalName?.toLowerCase().trim());
    const isHeightWeight = vital.vitalName?.toLowerCase().trim() === 'height' || vital.vitalName?.toLowerCase().trim() === 'weight';
    const isBMI = vital.vitalName?.toLowerCase().trim() === 'body mass index (bmi)';
    const displayName = isHeightWeight ? 'Height & Weight' : vital.vitalName;

    return (
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          '&:hover': { boxShadow: 3 },
        border:"1px solid #34aadc " 
        }}
        onClick={() => (isHeightWeight ? handleEditClick(heightVital, 'height-weight') : handleEditClick(vital))}
      >
        <CardContent sx={{ p: 1.5, position: 'relative', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
              {displayName}
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                isHeightWeight ? handleCombinedDelete(e) : handleDelete(vital?._id);
              }}
              sx={{ p: 0.25 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          {isHeightWeight ? (
            <Box>
              <Typography variant="body2" fontWeight="bold" fontSize="0.75rem">
                Height: {heightVital?.height ?? '-'} {heightVital?.unit ?? ''}
              </Typography>
              <Typography variant="body2" fontWeight="bold" fontSize="0.75rem">
                Weight: {weightVital?.weight ?? '-'} {weightVital?.unit ?? ''}
              </Typography>
            </Box>
          ) : isBMI ? (
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '0.85rem', color: bmiColor }}>
              {vital.selectedRangeValue || vital.value || vital.range || vital?.bmiValue || '-'} {vital.unit}
              <Typography component="span" sx={{ display: 'block', fontSize: '0.7rem' }}>
                ({bmiCategory})
              </Typography>
            </Typography>
          ) : (
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                {vital.selectedRangeValue || vital.value || vital.range || '-'}{' '}
                {vital.vitalName?.toLowerCase().trim() !== 'blood pressure (bp)' && vital.unit}
                {vital.vitalName?.toLowerCase().trim() === 'temperature' && (
                  <Typography component="span" sx={{ fontSize: '0.7rem' }}>
                    {` (${fahrenheitToCelsius(parseFloat(vital?.value))}°C)`}
                  </Typography>
                )}
              </Typography>

              {vital.ranges && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                    Systolic: {vital.ranges.systolic} mmHg
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                    Diastolic: {vital.ranges.diastolic} mmHg
                  </Typography>
                </Box>
              )}

              {vital.selectedParameters && Object.keys(vital.selectedParameters).length > 0 && (
                <Box sx={{ mt: 0.5 }}>
                  {Object.entries(vital.selectedParameters).map(([paramName, values], idx) => (
                    <Typography key={idx} variant="body2" sx={{ fontSize: '0.7rem' }}>
                      {paramName}: {values.map((v) => v.value).join(', ')}
                    </Typography>
                  ))}
                </Box>
              )}

              {vital.methods?.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                  {vital.methods.map((method, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <Checkbox checked disabled size="small" sx={{ p: 0.25 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        {method}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 1.5,
          mb: 2,
          backgroundColor: 'background.paper',
          boxShadow: 2,
          maxHeight: viewMode === 'compact' ? '320px' : '500px',
          overflow: 'auto'
        }}
      >
        <Grid container spacing={1}>
          {/* Height + Weight Card */}
          {(heightVital || weightVital) && (
            <Grid item xs={6} borderRadius={3} sm={4} md={3}>
              <GridVitalCard vital={heightVital || weightVital} />
            </Grid>
          )}

          {/* BMI Card */}
          {bmiVital && (
            <Grid item xs={6}  borderRadius={3} sm={4} md={3}>
              <GridVitalCard vital={bmiVital} />
            </Grid>
          )}

          {/* Other vitals */}
          {formattedVitals.map((vital, index) => (
            <Grid item xs={6}  borderRadius={3} sm={4} md={3} key={index}>
              <GridVitalCard vital={vital} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center' }}>Edit {selectedVital?.vitalName}</DialogTitle>
        <DialogContent sx={{ margin: 'auto' }}>{selectedVital && getEditComponent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default PatientVitalDisplay;

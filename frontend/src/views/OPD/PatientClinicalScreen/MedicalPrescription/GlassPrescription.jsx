import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { post } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';

// const minusValues = [
//   '-0.25',
//   '-0.50',
//   '-0.75',
//   '-1.00',
//   '-1.25',
//   '-1.50',
//   '-1.75',
//   '-2.00',
//   '-2.25',
//   '-2.50',
//   '-2.75',
//   '-3.00',
//   '-3.25',
//   '-3.50',
//   '-3.75',
//   '-4.00',
//   '-4.25',
//   '-4.50',
//   '-4.75',
//   '-5.00',
//   '-5.25',
//   '-5.50',
//   '-5.75',
//   '-6.00',
//   '-6.25',
//   '-6.50',
//   '-6.75',
//   '-7.00',
//   '-7.50',
//   '-7.75',
//   '-8.00',
//   '-8.25',
//   '-8.50',
//   '-8.75',
//   '-9.00',
//   '-9.25',
//   '-9.50',
//   '-9.75',
//   '-10.00',
//   '-10.25',
//   '-10.50',
//   '-10.75',
//   '-11.00',
//   '-11.25',
//   '-11.50',
//   '-11.75',
//   '-12.00',
//   '-12.25',
//   '-12.50',
//   '-12.75',
//   '-13.00',
//   '-13.25',
//   '-13.50',
//   '-13.75',
//   '-13.00',
//   '-13.25',
//   '-13.50',
//   '-13.75',
//   '-14.00',
//   '-14.25',
//   '-14.50',
//   '-14.75',
//   '-15.00',
//   '-15.25',
//   '-15.50',
//   '-15.75',
//   '-16.00',
//   '-16.25',
//   '-16.50',
//   '-16.75',
//   '-17.00',
//   '-17.25',
//   '-17.50',
//   '-17.75',
//   '-18.00',
//   '-18.25',
//   '-18.50',
//   '-18.75',
//   '-19.00',
//   '-19.25',
//   '-19.50',
//   '-19.75',
//   '-20.00',
//   '-20.25',
//   '-20.50'
// ];
// const additionLeftAndRightSphere = [
//   // Column 1
//   '+20.50',
//   '+20.25',
//   '+20.00',
//   '+19.75',
//   '+19.50',
//   '+19.25',
//   '+19.00',
//   '+18.75',
//   '+18.50',
//   '+18.25',
//   '+18.00',
//   '+17.75',
//   '+17.50',
//   '+17.25',
//   '+17.00',
//   '+16.75',
//   '+16.50',
//   '+16.25',
//   '+16.00',
//   '+15.75',
//   '+15.50',
//   '+15.25',
//   '+15.00',
//   '+14.75',
//   '+14.50',
//   '+14.25',
//   '+14.00',

//   // Column 2
//   '+13.75',
//   '+13.50',
//   '+13.25',
//   '+13.00',
//   '+13.75',
//   '+13.50',
//   '+13.25',
//   '+13.00',
//   '+12.75',
//   '+12.50',
//   '+12.25',
//   '+12.00',
//   '+11.75',
//   '+11.50',
//   '+11.25',
//   '+11.00',
//   '+10.75',
//   '+10.50',
//   '+10.25',
//   '+10.00',
//   '+9.75',
//   '+9.50',
//   '+9.25',
//   '+9.00',
//   '+8.75',
//   '+8.50',
//   '+8.25',

//   // Column 3
//   '+8.00',
//   '+7.75',
//   '+7.50',
//   '+7.00',
//   '+6.75',
//   '+6.50',
//   '+6.25',
//   '+6.00',
//   '+5.75',
//   '+5.50',
//   '+5.25',
//   '+5.00',
//   '+4.75',
//   '+4.50',
//   '+4.25',
//   '+4.00',
//   '+3.75',
//   '+3.50',
//   '+3.25',
//   '+3.00',
//   '+2.75',
//   '+2.50',
//   '+2.25',
//   '+2.00',
//   '+1.75',
//   '+1.50',
//   '+1.25',

//   // Column 4
//   '+1.00',
//   '+0.75',
//   '+0.50',
//   '+0.25',
//   '+0.00'
// ];
// const sphereAndCylinderOptions = [...additionLeftAndRightSphere, ...minusValues];
const cylinderOptions = ['+6', '+5', '+4', '+3', '+2', '+1', '0', '-1', '-2', '-3', '-4', '-5', '-6'];
const axisOptions = Array(37)
  ?.fill(0)
  ?.map((d, i) => {
    return `${i * 5}° `;
  });
const visionOptions = [
  '6/60',
  '6/36',
  '6/24',
  '6/18',
  '6/12',
  '6/9',
  '6/6',
  '6/5',
  '6/4',
  '6/60P',
  '6/36P',
  '6/24P',
  '6/18P',
  '6/12P',
  '6/9P',
  '6/6P',
  '6/5P',
  '6/4P',
  'N4',
  'N5',
  'N6',
  'N8',
  'N12',
  'N18',
  'N24',
  'N36',
  'N60',
  'CF-1/2M',
  'CF-1M',
  'CF-2M',
  'CF-3M'
];

// const additionLeftAndRightSphere = Array.from({ length: (3 - 0.75) / 0.25 + 1 }, (_, i) => `+${(0.75 + i * 0.25).toFixed(2)}`);

const GlassPrescription = ({ patient, departmentId, getGlassPrescription, isExamination }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isPlusSelected, setIsPlusSelected] = useState(true);
  const [openDialog, setOpenDialog] = useState({ eye: null, type: null, field: null });
  const additionLeftAndRightSphere = [
    ...new Set([
      '+20.50',
      '+20.25',
      '+20.00',
      '+19.75',
      '+19.50',
      '+19.25',
      '+19.00',
      '+18.75',
      '+18.50',
      '+18.25',
      '+18.00',
      '+17.75',
      '+17.50',
      '+17.25',
      '+17.00',
      '+16.75',
      '+16.50',
      '+16.25',
      '+16.00',
      '+15.75',
      '+15.50',
      '+15.25',
      '+15.00',
      '+14.75',
      '+14.50',
      '+14.25',
      '+14.00',
      '+13.75',
      '+13.50',
      '+13.25',
      '+13.00',
      '+12.75',
      '+12.50',
      '+12.25',
      '+12.00',
      '+11.75',
      '+11.50',
      '+11.25',
      '+11.00',
      '+10.75',
      '+10.50',
      '+10.25',
      '+10.00',
      '+9.75',
      '+9.50',
      '+9.25',
      '+9.00',
      '+8.75',
      '+8.50',
      '+8.25',
      '+8.00',
      '+7.75',
      '+7.50',
      '+7.00',
      '+6.75',
      '+6.50',
      '+6.25',
      '+6.00',
      '+5.75',
      '+5.50',
      '+5.25',
      '+5.00',
      '+4.75',
      '+4.50',
      '+4.25',
      '+4.00',
      '+3.75',
      '+3.50',
      '+3.25',
      '+3.00',
      '+2.75',
      '+2.50',
      '+2.25',
      '+2.00',
      '+1.75',
      '+1.50',
      '+1.25',
      '+1.00',
      '+0.75',
      '+0.50',
      '+0.25',
      '+0.00'
    ])
  ];

  const minusValues = [
    ...new Set([
      '-0.25',
      '-0.50',
      '-0.75',
      '-1.00',
      '-1.25',
      '-1.50',
      '-1.75',
      '-2.00',
      '-2.25',
      '-2.50',
      '-2.75',
      '-3.00',
      '-3.25',
      '-3.50',
      '-3.75',
      '-4.00',
      '-4.25',
      '-4.50',
      '-4.75',
      '-5.00',
      '-5.25',
      '-5.50',
      '-5.75',
      '-6.00',
      '-6.25',
      '-6.50',
      '-6.75',
      '-7.00',
      '-7.50',
      '-7.75',
      '-8.00',
      '-8.25',
      '-8.50',
      '-8.75',
      '-9.00',
      '-9.25',
      '-9.50',
      '-9.75',
      '-10.00',
      '-10.25',
      '-10.50',
      '-10.75',
      '-11.00',
      '-11.25',
      '-11.50',
      '-11.75',
      '-12.00',
      '-12.25',
      '-12.50',
      '-12.75',
      '-13.00',
      '-13.25',
      '-13.50',
      '-13.75',
      '-14.00',
      '-14.25',
      '-14.50',
      '-14.75',
      '-15.00',
      '-15.25',
      '-15.50',
      '-15.75',
      '-16.00',
      '-16.25',
      '-16.50',
      '-16.75',
      '-17.00',
      '-17.25',
      '-17.50',
      '-17.75',
      '-18.00',
      '-18.25',
      '-18.50',
      '-18.75',
      '-19.00',
      '-19.25',
      '-19.50',
      '-19.75',
      '-20.00',
      '-20.25',
      '-20.50'
    ])
  ];

  const [eyeData, setEyeData] = useState({
    right: { distance: { sphere: '', cylinder: '', axis: '', vision: '' }, add: { sphere: '', cylinder: '', axis: '', vision: '' } },
    left: { distance: { sphere: '', cylinder: '', axis: '', vision: '' }, add: { sphere: '', vision: '' } }
  });
  const isEyeDataEmpty = (eyeData) => {
    return Object.values(eyeData).every((eye) => Object.values(eye).every((type) => Object.values(type).every((value) => value === '')));
  };
  const fieldOptions = {
    sphere: openDialog.type === 'add' ? additionLeftAndRightSphere?.reverse() : [],
    cylinder: cylinderOptions,
    axis: axisOptions,
    vision: visionOptions
  };

  // Handles dialog open and close
  const handleDialogOpen = (eye, type, field) => setOpenDialog({ eye, type, field });
  const handleDialogClose = () => setOpenDialog({ eye: null, type: null, field: null });

  // Handles changes in prescription values
  const handleEyeChange = (eye, type, field, value) => {
    setEyeData((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [type]: { ...prev[eye][type], [field]: value } }
    }));
    handleDialogClose();
  };

  const handleSave = async () => {
    try {
      if (isEyeDataEmpty(eyeData)) {
        toast.error('Cannot submit an empty prescription!');
        return;
      }

      const res = await post(`patient-glass-prescription`, {
        ...eyeData,
        patientId: patient?.patientId?._id,
        consultantId: patient?.consultantId,
        departmentId
      });
      if (res?.success) {
        toast.success('Saved SuccessFully');
        getGlassPrescription();
      } else {
        toast.error('Failed to Save');
      }
    } catch (err) {
      toast.error('Some thing went wrong');
    }
  };
  useEffect(() => {
    // Update the add.vision field for both eyes whenever distance.vision changes
    setEyeData((prev) => ({
      ...prev,
      right: {
        ...prev.right,
        add: { ...prev.right.add, vision: prev.right.distance.vision }
      },
      left: {
        ...prev.left,
        add: { ...prev.left.add, vision: prev.left.distance.vision }
      }
    }));
  }, [eyeData.right.distance.vision, eyeData.left.distance.vision]);
  console.log(eyeData);

  return (
    <>
      <Grid container spacing={2} mt={4} sx={{ boxShadow: 3, p: 2 }}>
        {['right', 'left'].map((eye) => (
          <Grid item xs={12} md={isExamination ? 12 : 6} key={eye}>
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                border: '1px solid #ccc',
                marginBottom: 2
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#fff',
                  backgroundColor: '#126078',
                  padding: 2
                }}
              >
                {eye.charAt(0).toUpperCase() + eye.slice(1)} Eye
              </Typography>

              {['distance', 'add'].map((type) => (
                <Grid container spacing={2} alignItems="center" mt={2} key={type}>
                  <Grid item xs={isMobile ? 12 : 3}>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', textAlign: isMobile ? 'center' : 'left' }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                  </Grid>

                  {/* Conditionally rendering only Sphere and Vision for Addition */}
                  {type === 'add' &&
                    ['sphere', 'vision'].map((field) => (
                      <Grid item xs={isMobile ? 6 : 2} key={field}>
                        <FormControl fullWidth>
                          <InputLabel id={`${eye}-${field}-select`}>{field.charAt(0).toUpperCase() + field.slice(1)}</InputLabel>
                          <Select
                            id={`${eye}-${field}-select`}
                            value={eyeData[eye][type][field]}
                            onOpen={() => handleDialogOpen(eye, type, field)}
                            open={false}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                          >
                            <MenuItem value={eyeData[eye][type][field]}>{eyeData[eye][type][field] || `Select ${field}`}</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Dialog for Selecting Values */}
                        <Dialog
                          open={openDialog.eye === eye && openDialog.type === type && openDialog.field === field}
                          onClose={handleDialogClose}
                        >
                          <DialogTitle>Select {field.charAt(0).toUpperCase() + field.slice(1)} Value</DialogTitle>
                          <DialogContent>
                            <Box display="flex" gap={1} p={2} flexWrap="wrap">
                              {fieldOptions[field].map((option) => (
                                <Chip
                                  key={option}
                                  label={option}
                                  clickable
                                  color={eyeData[eye][type][field] === option ? 'primary' : 'default'}
                                  onClick={() => handleEyeChange(eye, type, field, option)}
                                />
                              ))}
                            </Box>

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                              <Button onClick={handleDialogClose} variant="outlined">
                                Cancel
                              </Button>
                            </Box>
                          </DialogContent>
                        </Dialog>
                      </Grid>
                    ))}

                  {/* For Distance type, include all fields: sphere, cylinder, axis, vision */}
                  {type === 'distance' &&
                    ['sphere', 'cylinder', 'axis', 'vision'].map((field) => (
                      <Grid item xs={isMobile ? 6 : 2} key={field}>
                        <FormControl fullWidth>
                          <InputLabel id={`${eye}-${field}-select`}>{field.charAt(0).toUpperCase() + field.slice(1)}</InputLabel>
                          <Select
                            id={`${eye}-${field}-select`}
                            value={eyeData[eye][type][field]}
                            onOpen={() => handleDialogOpen(eye, type, field)}
                            open={false}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                          >
                            <MenuItem value={eyeData[eye][type][field]}>{eyeData[eye][type][field] || `Select ${field}`}</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Dialog for Selecting Values */}
                        <Dialog
                          open={openDialog.eye === eye && openDialog.type === type && openDialog.field === field}
                          onClose={handleDialogClose}
                        >
                          <DialogTitle>Select {field.charAt(0).toUpperCase() + field.slice(1)} Value</DialogTitle>
                          <DialogContent>
                            <Box display="flex" flexDirection="column" gap={2} p={2}>
                              {field === 'sphere' ? (
                                <>
                                  <Box display="flex" gap={1}>
                                    <Button variant={isPlusSelected ? 'contained' : 'outlined'} onClick={() => setIsPlusSelected(true)}>
                                      + Plus
                                    </Button>
                                    <Button variant={!isPlusSelected ? 'contained' : 'outlined'} onClick={() => setIsPlusSelected(false)}>
                                      - Minus
                                    </Button>
                                  </Box>

                                  <Box display="flex" flexWrap="wrap" gap={1}>
                                    {(isPlusSelected ? additionLeftAndRightSphere?.reverse() : minusValues).map((option) => (
                                      <Chip
                                        key={option}
                                        label={option}
                                        clickable
                                        color={eyeData[eye][type][field] === option ? 'primary' : 'default'}
                                        onClick={() => handleEyeChange(eye, type, field, option)}
                                      />
                                    ))}
                                  </Box>
                                </>
                              ) : (
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                  {fieldOptions[field].map((option) => (
                                    <Chip
                                      key={option}
                                      label={option}
                                      clickable
                                      color={eyeData[eye][type][field] === option ? 'primary' : 'default'}
                                      onClick={() => handleEyeChange(eye, type, field, option)}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                              <Button onClick={handleDialogClose} variant="outlined">
                                Cancel
                              </Button>
                            </Box>
                          </DialogContent>
                        </Dialog>
                      </Grid>
                    ))}
                </Grid>
              ))}
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave} sx={{ px: 3 }}>
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default GlassPrescription;

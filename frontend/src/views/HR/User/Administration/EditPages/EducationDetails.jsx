import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { get, post, put, remove } from '../../../../../api/api.js';
import { toast } from 'react-toastify';
function EducationDetails({ setValue, storedAllData, setStoredAllData }) {
  const [educationDetails, seteducationDetails] = useState({
    qualification: '',
    yearOfPassing: '',
    universityOrBoard: ''
  });

  const qualificationOptions = [
    { value: 'SSC', label: 'SSC' },
    { value: 'HSC', label: 'HSC' },
    { value: 'Graduation', label: 'Graduation' },
    { value: 'Post Graduation', label: 'Post Graduation' },
    { value: 'Other', label: 'Other' }
  ];

  const [errors, setErrors] = useState({
    qualification: '',
    yearOfPassing: '',
    universityOrBoard: ''
  });

  //todo: added new
  useEffect(() => {
    // Step: set submittedFormId from _id if not set
    if (storedAllData?._id && !storedAllData?.submittedFormId) {
      setStoredAllData((prev) => ({
        ...prev,
        submittedFormId: storedAllData._id
      }));
    }

    // Step: Load existing educationDetails
    // seteducationDetails(storedAllData.educationDetails || {});
    if (Array.isArray(storedAllData.educationDetails) && storedAllData.educationDetails.length > 0) {
      seteducationDetails(storedAllData.educationDetails[0]); // Use first object
    }
  }, [storedAllData.educationDetails]);

  // useEffect(() => {
  //   seteducationDetails(storedAllData.educationDetails || {});
  // }, [storedAllData.educationDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    seteducationDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      seteducationDetails((prev) => ({ ...prev, cancelCheck: file }));
    }
  };

  const educationDetailsValidations = () => {
    const validations = [
      { field: 'qualification', message: 'qualification is required' },
      { field: 'yearOfPassing', message: 'yearOfPassing is required' },
      { field: 'universityOrBoard', message: 'universityOrBoard is required' }
    ];

    let newErrors = {};
    let isValid = true;

    validations.forEach(({ field, message }) => {
      if (!educationDetails[field]) {
        newErrors[field] = message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async () => {
    // 🛡️ Run validation first
    if (!educationDetailsValidations()) return;

    if (storedAllData?.submittedFormId) {
      try {
        const payLoad = { ...educationDetails };

        // 🔥 If you only need JSON (no files)
        const response = await put(`administrative/education/${storedAllData.submittedFormId}`, payLoad);

        if (response.success) {
          // ✅ Update parent stored data
          setStoredAllData((prev) => ({
            ...prev,
            educationDetails: response.data.educationDetails
          }));
          toast.success(response.message);
          setValue((prev) => prev + 1); // move to next step
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        toast.error('Something went wrong. Try again.');
      }
    } else {
      toast.error('Please submit the Basic Details first');
      setValue(0); // go to step 1
    }
  };

  // const handleSubmit = async () => {
  //   // 🛡️ Run validation first
  //   if (!educationDetailsValidations()) return;

  //   if (storedAllData?.submittedFormId) {
  //     const payLoad = { ...educationDetails };
  //     const formData = new FormData();

  //     for (const [key, value] of Object.entries(payLoad)) {
  //       if (value) {
  //         formData.append(key, value);
  //       }
  //     }

  //     try {
  //       const res = await put(`administrative/education/${storedAllData.submittedFormId}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(payLoad)
  //       });

  //       const response = await res.json();

  //       if (response.success === true) {
  //         // ✅ Update parent stored data
  //         setStoredAllData((prev) => ({ ...prev, educationDetails: response.data.educationDetails }));
  //         toast.success(response.message);
  //         setValue((prev) => prev + 1); // move to next step
  //       } else {
  //         toast.error(response.message);
  //       }
  //     } catch (err) {
  //       toast.error('Something went wrong. Try again.');
  //     }
  //   } else {
  //     toast.error('Please submit the Basic Details first');
  //     setValue(0); // go to step 1
  //   }
  // };

  return (
    <div>
      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: '100%', width: '100%', boxShadow: 3 }}>
          <CardHeader
            title="Education Details Form"
            titleTypographyProps={{ variant: 'h5', align: 'center' }}
            sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
          />
          <CardContent>
            <form>
              <Typography variant="h6" gutterBottom>
                Education Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    name="qualification"
                    value={educationDetails.qualification}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.qualification}
                    helperText={errors.qualification}
                    SelectProps={{
                      native: true
                    }}
                  >
                    <option value="">Select Qualification</option>
                    {qualificationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Year of Passing"
                    type="year"
                    InputProps={{ inputProps: { max: new Date().getFullYear() } }}
                    name="yearOfPassing"
                    value={educationDetails.yearOfPassing}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.yearOfPassing}
                    helperText={errors.yearOfPassing}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Name of University/Board"
                    name="universityOrBoard"
                    value={educationDetails.universityOrBoard}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.universityOrBoard}
                    helperText={errors.universityOrBoard}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                      Save & Next
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default EducationDetails;

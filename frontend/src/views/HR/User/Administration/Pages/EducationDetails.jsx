import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import REACT_APP_API_URL from 'api/api';
import {get, post, put, remove} from "../../../../../api/api.js"
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

  useEffect(() => {
    seteducationDetails(storedAllData.educationDetails || {});
  }, [storedAllData.educationDetails]);

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
      { field: 'qualification', message: 'Qualification is required' },
      { field: 'yearOfPassing', message: 'Year of Passing is required' },
      { field: 'universityOrBoard', message: 'University/Board name is required' }
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate inputs before submission
  if (!educationDetailsValidations()) return;

  if (storedAllData?.submittedFormId) {
    try {
      const payload = {
        qualification: educationDetails.qualification,
        yearOfPassing: educationDetails.yearOfPassing,
        universityOrBoard: educationDetails.universityOrBoard,
      };

      const data = await put(
        `administrative/education/${storedAllData.submittedFormId}`,
        payload
      );

      if (data.success) {
        setStoredAllData((prev) => ({ ...prev, educationDetails: data.data }));
        toast.success(data.message);
        setValue((prev) => prev + 1);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error submitting education:", err);
      toast.error("Something went wrong");
    }
  } else {
    toast.error("Please submit the Basic Details first");
    setValue(0);
  }
};

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate inputs before submission
  //   if (!educationDetailsValidations()) return;

  //   if (storedAllData?.submittedFormId) {
  //     try {
  //       const response = await put(`administrative/education/${storedAllData.submittedFormId}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           qualification: educationDetails.qualification,
  //           yearOfPassing: educationDetails.yearOfPassing,
  //           universityOrBoard: educationDetails.universityOrBoard
  //         })
  //       });

  //       const data = await response.json();

  //       if (data.success) {
  //         setStoredAllData((prev) => ({ ...prev, education: data.data }));
  //         toast.success(data.message);
  //         setValue((prev) => prev + 1);
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } catch (err) {
  //       console.error('Error submitting education:', err);
  //       toast.error('Something went wrong');
  //     }
  //   } else {
  //     toast.error('Please submit the Basic Details first');
  //     setValue(0);
  //   }
  // };

  // const handleSubmit = async e => {
  //   e.preventDefault()

  //   if (true) {
  //     if (storedAllData?.submittedFormId) {
  //       const payLoad = { ...educationDetails }
  //       const formData = new FormData()

  //       for (const [key, value] of Object.entries(payLoad)) {
  //         if (value) {
  //           formData.append(key, value)
  //         }
  //       }

  //       const submitEducationDetails = await fetch(`${REACT_APP_API_URL}administrative/educationDetails/${storedAllData.submittedFormId}`, {
  //         method: 'POST',
  //         body: formData
  //       })

  //       const response = await submitEducationDetails.json()

  //       if (response.success === true) {
  //         setStoredAllData(prev => ({ ...prev, educationDetails: response?.data?.educationDetails }))
  //         toast.success(response.message)
  //         setValue(prev => prev + 1)
  //       }

  //       if (response.success === false) {
  //         toast.error(response.message)
  //       }
  //     } else {
  //       toast.error('Please submit the Basic Details first')
  //       setValue(0)
  //     }
  //   }
  // }

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

                {/* save and next button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/* <Button type="submit" variant="contained" color="primary" >
                    Save & Next
                  </Button> */}
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

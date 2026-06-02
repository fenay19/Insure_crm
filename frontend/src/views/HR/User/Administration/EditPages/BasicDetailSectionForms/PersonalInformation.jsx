import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import REACT_APP_API_URL from '../../../../../../api/api.js';
import { get, post, put, remove } from '../../../../../../api/api.js';

function PersonalInformation({ basicDetails, setBasicDetails, errors, handleUpdate }) {
  const [prefixData, setPrefixData] = useState([]);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  // Fetch prefix data from API
  async function fetchPrefix() {
    const response = await get('prefix');
    setPrefixData(response.allPrefix || []);
  }

  // Set initial profile photo preview if it exists
  // useEffect(() => {
  //   fetchPrefix();
  //   if (basicDetails.profilePhoto && typeof basicDetails.profilePhoto === 'string') {
  //     if (basicDetails.profilePhoto && typeof basicDetails.profilePhoto === 'string') {
  //       setProfilePhotoPreview(`${REACT_APP_API_URL}api/images/${basicDetails.profilePhoto}`);
  //     }
  //   }
  // }, [basicDetails.profilePhoto]);
  useEffect(() => {
  fetchPrefix();

  if (
    basicDetails?.profilePhoto &&
    typeof basicDetails.profilePhoto === 'string' &&
    !profilePhotoPreview
  ) {
    setProfilePhotoPreview(
      `${REACT_APP_API_URL}api/images/${basicDetails.profilePhoto}`
    );
  }
}, [basicDetails?.profilePhoto, profilePhotoPreview]);


  // Handle profile photo change
  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhotoPreview(URL.createObjectURL(file));
      setBasicDetails((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Employee Code"
            name="empCode"
            fullWidth
            value={basicDetails.empCode}
            onChange={handleUpdate}
            error={!!errors.empCode}
            helperText={errors.empCode}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="prefix">Prefix</InputLabel>
            <Select labelId="prefix" name="prefix" value={basicDetails.prefix} onChange={handleUpdate} error={!!errors.prefix}>
              {prefixData.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.prefix}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            value={basicDetails.firstName}
            onChange={handleUpdate}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            name="middleName"
            fullWidth
            value={basicDetails.middleName}
            onChange={handleUpdate}
            error={!!errors.middleName}
            helperText={errors.middleName}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={basicDetails.lastName}
            onChange={handleUpdate}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="gender">Gender</InputLabel>
            <Select labelId="gender" name="gender" value={basicDetails.gender} onChange={handleUpdate} error={!!errors.gender}>
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            fullWidth
            value={formatDateForInput(basicDetails.dateOfBirth)}
            onChange={handleUpdate}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="Date of Anniversary"
            name="dateOfAnniversary"
            fullWidth
            value={basicDetails.dateOfAnniversary}
            onChange={handleUpdate}
            error={!!errors.dateOfAnniversary}
            helperText={errors.dateOfAnniversary}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            // type="date"
            label="Spouse"
            name="spouseName"
            fullWidth
            value={basicDetails.spouseName}
            onChange={handleUpdate}
            error={!!errors.spouseName}
            helperText={errors.spouseName}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Aadhaar Number"
            name="adharNumber"
            fullWidth
            value={basicDetails.adharNumber}
            onChange={handleUpdate}
            error={!!errors.adharNumber}
            helperText={errors.adharNumber}
          />
        </Grid>

        {/* <Grid item xs={12} sm={4}>
          <TextField
            label="Pan Number"
            name="panNo"
            fullWidth
            value={basicDetails.panNo}
            onChange={handleUpdate}
            error={!!errors.panNo}
            helperText={errors.panNo}
            // InputLabelProps={{ shrink: true }}
          />
        </Grid> */}

        <Grid item xs={12} sm={8} container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Profile Photo (Image Only)
              <input type="file" accept="image/*" hidden onChange={handleProfilePhotoChange} />
            </Button>
            {errors.profilePhoto && (
              <Typography variant="caption" color="error">
                {errors.profilePhoto}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            {profilePhotoPreview ? (
    <Box>
      <img
        src={profilePhotoPreview}
        alt="Profile Preview"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid #ccc',
          padding: '2px'
        }}
      />
    </Box>
  ) : (
    <Typography variant="caption" color="textSecondary">
      No preview available
    </Typography>
  )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default PersonalInformation;

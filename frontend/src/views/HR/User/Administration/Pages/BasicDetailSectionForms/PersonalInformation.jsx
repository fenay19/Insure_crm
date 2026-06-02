import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { get } from '../../../../../../api/api.js';

function PersonalInformation({ basicDetails, setBasicDetails, errors, handleUpdate }) {
  const [prefixData, setPrefixData] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const toDateInputValue = (value) => {
    if (!value) return '';
    return value.length >= 10 ? value.slice(0, 10) : value;
  };

  async function fetchPrefix() {
    const response = await get('prefix');
    setPrefixData(response.allPrefix || []);
  }

  useEffect(() => {
    fetchPrefix();
  }, []);

  // const handleProfilePhotoChange = event => {
  //   const file = event.target.files[0]
  //   setProfilePhoto(URL.createObjectURL(file))
  //   setBasicDetails(prev => ({ ...prev, profilePhoto: file }))
  // }
  // const handleProfilePhotoChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     // Preview the photo
  //     setProfilePhoto(URL.createObjectURL(file));

  //     // Store the file in basicDetails for submission
  //     setBasicDetails((prev) => ({ ...prev, profilePhoto: file }));

  //     // Clear error if previously shown
  //     // setErrors((prev) => ({ ...prev, profilePhoto: '' }));
  //   }
  // };
  
  const handleProfilePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setProfilePhoto(URL.createObjectURL(file));
    setBasicDetails((prev) => ({ ...prev, profilePhoto: file }));
  }
};


  console.log('basicDetails', basicDetails);

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, marginTop: 4 }}>
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Employee Code"
            name="empCode"
            fullWidth
            value={basicDetails.empCode}
            onChange={handleUpdate}
            error={!!errors.empCode}
            helperText={errors.empCode}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="prefix">Prefix</InputLabel>
            <Select
              labelId="prefix"
              label="prefix"
              name="prefix"
              value={basicDetails.prefix || ''}
              onChange={handleUpdate}
              error={!!errors.prefix}
            >
              {prefixData.map((item, index) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.prefix}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
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

        <Grid item xs={12} sm={3}>
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

        <Grid item xs={12} sm={3}>
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

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="gender">Gender</InputLabel>
            <Select
              labelId="gender"
              label="gender"
              name="gender"
              value={basicDetails.gender || ''}
              onChange={handleUpdate}
              error={!!errors.gender}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            fullWidth
            value={toDateInputValue(basicDetails.dateOfBirth)}
            onChange={handleUpdate}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* <Grid item xs={12} sm={3}>
          <TextField
            type='date'
            label='Date of Anniversary'
            name='dateOfAnniversary'
            fullWidth
            value={basicDetails.dateOfAnniversary}
            onChange={handleUpdate}
            error={!!errors.dateOfAnniversary}
            helperText={errors.dateOfAnniversary}
            InputLabelProps={{ shrink: true }}
          />
        </Grid> */}

        <Grid item xs={12} sm={3}>
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

        {/* <Grid item xs={12} sm={3}>
          <TextField
            label="Pan Number"
            name="panNumber"
            fullWidth
            value={basicDetails.panNumber}
            onChange={handleUpdate}
            error={!!errors.panNumber}
            helperText={errors.panNumber}
          />
        </Grid> */}

        <Grid item xs={12} sm={6} container spacing={2} alignItems="center">
          {/* <Grid item xs={6}>
            <Button variant='outlined' component='label' fullWidth>
              Upload Profile Photo (Image Only)
              <input type='file' accept='image/*' hidden onChange={handleProfilePhotoChange} />
            </Button>
            {errors.profilePhoto && (
              <Typography variant='caption' color='error'>
                {errors.profilePhoto}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            {profilePhoto && (
              <Box>
                <img
                  src={profilePhoto}
                  alt='Profile Preview'
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Grid> */}

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
            {profilePhoto || basicDetails.profilePhoto ? (
              <Box>
                <img
                  src={
                    profilePhoto
                      ? profilePhoto // Preview new file
                      : typeof basicDetails.profilePhoto === 'string'
                        ? `${process.env.REACT_APP_API_URL}api/images/${basicDetails.profilePhoto}` // Stored URL
                        : ''
                  }
                  alt="Profile Preview"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3} ml={1}>
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={basicDetails.isMarried}
                onChange={(e) =>
                  setBasicDetails((prev) => ({
                    ...prev,
                    isMarried: e.target.checked,
                    dateOfAnniversary: e.target.checked ? prev.dateOfAnniversary : ''
                  }))
                }
                name="isMarried"
                color="primary"
              />
            }
            label="Married"
          /> */}
          <FormControlLabel
  control={
    <Checkbox
      checked={basicDetails.isMarried}
      onChange={(e) =>
        setBasicDetails((prev) => ({
          ...prev,
          isMarried: e.target.checked,
          spouseName: e.target.checked ? prev.spouseName : '' // Clear if unchecked
        }))
      }
      name="isMarried"
    />
  }
  label="Married"
/>
        </Grid>
        {basicDetails.isMarried && (
          <>
            <Grid item xs={12} sm={3}>
              {/* <TextField
                label="Spouse Name"
                name="spouseName"
                fullWidth
                value={basicDetails.spouseName}
                onChange={handleUpdate}
                error={!!errors.spouseName}
                helperText={errors.spouseName}
              /> */}
              <TextField
    label="Spouse Name"
    name="spouseName"
    value={basicDetails.spouseName}
    onChange={handleUpdate}
    error={!!errors.spouseName}
    helperText={errors.spouseName}
  />
            </Grid>
            <Grid item xs={12} sm={3}>
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
          </>
        )}
      </Grid>
    </>
  );
}

export default PersonalInformation;

// //! new data

// import React, { useEffect, useState } from 'react'
// import {
//   Typography, Grid, TextField, Select, MenuItem, FormControl,
//   InputLabel, Button, Box, Checkbox, FormControlLabel
// } from '@mui/material'
// import { get } from 'api/api'

// function PersonalInformation({ basicDetails, setBasicDetails, errors, handleUpdate }) {
//   const [prefixData, setPrefixData] = useState([])
//   const [profilePhoto, setProfilePhoto] = useState(null)

//   async function fetchPrefix() {
//     const response = await get('prefix')
//     setPrefixData(response.allPrefix || [])
//   }

//   useEffect(() => {
//     fetchPrefix()
//   }, [])

//   const handleProfilePhotoChange = event => {
//     const file = event.target.files[0]
//     setProfilePhoto(URL.createObjectURL(file))
//     setBasicDetails(prev => ({ ...prev, profilePhoto: file }))
//   }

//   const handleLocalUpdate = (e) => {
//     const { name, value } = e.target
//     if (name === 'empCode') return  // Prevent manual editing
//     setBasicDetails(prev => ({ ...prev, [name]: value }))
//   }

//   return (
//     <>
//       <Typography variant='h6' gutterBottom>
//         Personal Information
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             label='Employee Code'
//             name='empCode'
//             fullWidth
//             value={basicDetails.empCode || ''}
//             InputProps={{ readOnly: true }}
//             error={!!errors.empCode}
//             helperText={errors.empCode}
//           />
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <FormControl fullWidth>
//             <InputLabel id='prefix'>Prefix</InputLabel>
//             <Select
//               labelId='prefix'
//               label="prefix"
//               name='prefix'
//               value={basicDetails.prefix || ''}
//               onChange={handleLocalUpdate}
//               error={!!errors.prefix}
//             >
//               {prefixData.map((item) => (
//                 <MenuItem key={item._id} value={item._id}>
//                   {item.prefix}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <TextField
//             label='First Name'
//             name='firstName'
//             fullWidth
//             value={basicDetails.firstName || ''}
//             onChange={handleLocalUpdate}
//             error={!!errors.firstName}
//             helperText={errors.firstName}
//           />
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <TextField
//             label='Middle Name'
//             name='middleName'
//             fullWidth
//             value={basicDetails.middleName || ''}
//             onChange={handleLocalUpdate}
//             error={!!errors.middleName}
//             helperText={errors.middleName}
//           />
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <TextField
//             label='Last Name'
//             name='lastName'
//             fullWidth
//             value={basicDetails.lastName || ''}
//             onChange={handleLocalUpdate}
//             error={!!errors.lastName}
//             helperText={errors.lastName}
//           />
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <FormControl fullWidth>
//             <InputLabel id='gender'>Gender</InputLabel>
//             <Select
//               labelId='gender'
//               label='gender'
//               name='gender'
//               value={basicDetails.gender || ''}
//               onChange={handleLocalUpdate}
//               error={!!errors.gender}
//             >
//               <MenuItem value=''>Select Gender</MenuItem>
//               <MenuItem value='Male'>Male</MenuItem>
//               <MenuItem value='Female'>Female</MenuItem>
//               <MenuItem value='Other'>Other</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <TextField
//             type='date'
//             label='Date of Birth'
//             name='dateOfBirth'
//             fullWidth
//             value={basicDetails.dateOfBirth || ''}
//             onChange={handleLocalUpdate}
//             error={!!errors.dateOfBirth}
//             helperText={errors.dateOfBirth}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <TextField
//             label='Aadhaar Number'
//             name='adharNumber'
//             fullWidth
//             value={basicDetails.adharNumber || ''}
//             onChange={handleLocalUpdate}
//             error={!!errors.adharNumber}
//             helperText={errors.adharNumber}
//           />
//         </Grid>

//         <Grid item xs={12} sm={3}>
//           <TextField
//             label='PAN Number'
//             name='panNo'
//             fullWidth
//             value={basicDetails.panNo || ''}
//             onChange={handleLocalUpdate}
//             error={!!errors.panNo}
//             helperText={errors.panNo}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6} container spacing={2} alignItems='center'>
//           <Grid item xs={6}>
//             <Button variant='outlined' component='label' fullWidth>
//               Upload Profile Photo (Image Only)
//               <input type='file' accept='image/*' hidden onChange={handleProfilePhotoChange} />
//             </Button>
//             {errors.profilePhoto && (
//               <Typography variant='caption' color='error'>
//                 {errors.profilePhoto}
//               </Typography>
//             )}
//           </Grid>
//           <Grid item xs={6}>
//             {profilePhoto && (
//               <Box>
//                 <img
//                   src={profilePhoto}
//                   alt='Profile Preview'
//                   style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
//                 />
//               </Box>
//             )}
//           </Grid>
//         </Grid>

//         <Grid item xs={12} sm={3} ml={1}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={basicDetails.isMarried || false}
//                 onChange={(e) =>
//                   setBasicDetails((prev) => ({
//                     ...prev,
//                     isMarried: e.target.checked,
//                     dateOfAnniversary: e.target.checked ? prev.dateOfAnniversary : ''
//                   }))
//                 }
//                 name="isMarried"
//                 color="primary"
//               />
//             }
//             label="Married"
//           />
//         </Grid>

//         {basicDetails.isMarried && (
//           <>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label='Spouse Name'
//                 name='spouseName'
//                 fullWidth
//                 value={basicDetails.spouseName || ''}
//                 onChange={handleLocalUpdate}
//                 error={!!errors.spouseName}
//                 helperText={errors.spouseName}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 type='date'
//                 label='Date of Anniversary'
//                 name='dateOfAnniversary'
//                 fullWidth
//                 value={basicDetails.dateOfAnniversary || ''}
//                 onChange={handleLocalUpdate}
//                 error={!!errors.dateOfAnniversary}
//                 helperText={errors.dateOfAnniversary}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//           </>
//         )}
//       </Grid>
//     </>
//   )
// }

// export default PersonalInformation

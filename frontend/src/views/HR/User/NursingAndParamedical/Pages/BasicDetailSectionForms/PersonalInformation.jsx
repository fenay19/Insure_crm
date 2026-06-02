import React, { useEffect, useState } from 'react'
import { Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material'
import { get } from 'api/api'

function PersonalInformation ({ basicDetails, setBasicDetails, errors, handleUpdate }) {
  const [prefixData, setPrefixData] = useState([])
  const [profilePhoto, setProfilePhoto] = useState(null)

  async function fetchPrefix () {
    const response = await get('prefix')
    setPrefixData(response.allPrefix || [])
  }

  useEffect(() => {
    fetchPrefix()
  }, [])

  

  const handleProfilePhotoChange = event => {
    const file = event.target.files[0]
    setProfilePhoto(URL.createObjectURL(file))
    setBasicDetails(prev => ({ ...prev, profilePhoto: file }))
  }

 

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Employee Code'
            name='empCode'
            fullWidth
            value={basicDetails.empCode}
            onChange={handleUpdate}
            error={!!errors.empCode}
            helperText={errors.empCode}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='prefix'>Prefix</InputLabel>
            <Select labelId='prefix' label='prefix' name='prefix' value={basicDetails.prefix} onChange={handleUpdate} error={!!errors.prefix}>
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
            label='First Name'
            name='firstName'
            fullWidth
            value={basicDetails.firstName}
            onChange={handleUpdate}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label='Middle Name'
            name='middleName'
            fullWidth
            value={basicDetails.middleName}
            onChange={handleUpdate}
            error={!!errors.middleName}
            helperText={errors.middleName}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label='Last Name'
            name='lastName'
            fullWidth
            value={basicDetails.lastName}
            onChange={handleUpdate}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='gender'>Gender</InputLabel>
            <Select labelId='gender' label='gender' name='gender' value={basicDetails.gender} onChange={handleUpdate} error={!!errors.gender}>
              <MenuItem value=''>Select Gender</MenuItem>
              <MenuItem value='Male'>Male</MenuItem>
              <MenuItem value='Female'>Female</MenuItem>
              <MenuItem value='Other'>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            type='date'
            label='Date of Birth'
            name='dateOfBirth'
            fullWidth
            value={basicDetails.dateOfBirth}
            onChange={handleUpdate}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
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
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label='Aadhaar Number'
            name='adharNumber'
            fullWidth
            value={basicDetails.adharNumber}
            onChange={handleUpdate}
            error={!!errors.adharNumber}
            helperText={errors.adharNumber}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label='Passport Number'
            name='passPortNumber'
            fullWidth
            value={basicDetails.passPortNumber}
            onChange={handleUpdate}
            error={!!errors.passPortNumber}
            helperText={errors.passPortNumber}
          />
        </Grid>

        <Grid item xs={12} sm={6} container spacing={2} alignItems='center'>
          <Grid item xs={6}>
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
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default PersonalInformation

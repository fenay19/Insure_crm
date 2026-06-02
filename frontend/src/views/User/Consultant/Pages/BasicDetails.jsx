import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'

const BasicDetails = ({ setFormData, setIsFormVisible, setValue, formData }) => {
  const [basicDetails, setBasicDetails] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    dateOfAnniversary: '',
    adharNumber: '',
    panNumber: '',
    profilePhoto: null,
    passPortNumber: '',

    contactNumber: '',
    alternateContactNumber: '',
    email: '',
    alternateEmail: '',

    emergencyContactPersonName: '',
    emergencyContactPersonMobileNumber: '',
    emergencyAddress: ''
  })

  const genderOptions = ['Male', 'Female', 'Other']

  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    dateOfAnniversary: '',
    adharNumber: '',
    panNumber: '',
    profilePhoto: '',
    passPortNumber: '',

    contactNumber: '',
    alternateContactNumber: '',
    email: '',
    alternateEmail: '',

    emergencyContactPersonName: '',
    emergencyContactPersonMobileNumber: '',
    emergencyAddress: ''
  })

  useEffect(() => {
    setBasicDetails(formData.basicDetails || {})
  }, [formData.basicDetails])

  const handleChange = e => {
    const { name, value } = e.target
    setBasicDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const maxSize = 2 * 1024 * 1024 // 2 MB

      if (!validImageTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Only image files (JPEG, PNG) are allowed.'
        }))
        setBasicDetails(prev => ({ ...prev, profilePhoto: null }))
        return
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'File size must not exceed 2 MB.'
        }))
        setBasicDetails(prev => ({ ...prev, profilePhoto: null }))
        return
      }

      // If validation passes
      setBasicDetails(prev => ({ ...prev, profilePhoto: file }))
      setErrors(prev => ({ ...prev, profilePhoto: '' }))
    }
  }

  const BasicDetailsFormValidation = () => {
    const validations = [
      { field: 'firstName', message: 'First name is required.' },
      { field: 'middleName', message: 'Middle name is required.' },
      { field: 'lastName', message: 'Last name is required.' },
      { field: 'gender', message: 'Gender is required.' },
      { field: 'dateOfBirth', message: 'Date of birth is required.' },
      { field: 'dateOfAnniversary', message: 'Date of anniversary is required.' },
      { field: 'adharNumber', message: 'Aadhar number is required.' },
      { field: 'panNumber', message: 'PAN number is required.' },
      { field: 'profilePhoto', message: 'Profile photo is required.' },
      { field: 'passPortNumber', message: 'Passport number is required.' },
      { field: 'contactNumber', message: 'Contact number is required.' },
      { field: 'email', message: 'Email is required.' },
      { field: 'emergencyContactPersonName', message: 'Emergency contact person name is required.' },
      { field: 'emergencyContactPersonMobileNumber', message: 'Emergency person mobile number is required.' },
      { field: 'emergencyAddress', message: 'Emergency address is required.' }
    ]

    let allValid = true
    const newErrors = {}

    validations.forEach(({ field, message }) => {
      if (!basicDetails[field]) {
        newErrors[field] = message
        allValid = false
      }
    })

    if (basicDetails.contactNumber && !/^\d{10}$/.test(basicDetails.contactNumber)) {
      newErrors.contactNumber = 'Enter a valid 10-digit contact number.'
      allValid = false
    }

    if (basicDetails.alternateContactNumber && !/^\d{10}$/.test(basicDetails.alternateContactNumber)) {
      newErrors.alternateContactNumber = 'Enter a valid 10-digit alternate contact number.'
      allValid = false
    }

    if (basicDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicDetails.email)) {
      newErrors.email = 'Enter a valid email address.'
      allValid = false
    }

    if (basicDetails.alternateEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicDetails.alternateEmail)) {
      newErrors.alternateEmail = 'Enter a valid alternate email address.'
      allValid = false
    }

    setErrors(newErrors)
    return allValid
  }

  const handleSubmit = e => {
    e.preventDefault()

    // if (BasicDetailsFormValidation()) {
    if (true) {
      //check validations

      //append basicDetails in formData
      setFormData(prev => ({
        ...prev,
        basicDetails: basicDetails
      }))

      //make contactDetails Visible if basic details validate
      setIsFormVisible(prev => ({
        ...prev,
        addressDetails: true
      }))

      //will move automatically to contact details
      setValue(1)
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title=''
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='First Name'
                  name='firstName'
                  value={basicDetails.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  fullWidth
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Middle Name'
                  name='middleName'
                  value={basicDetails.middleName}
                  onChange={handleChange}
                  error={!!errors.middleName}
                  helperText={errors.middleName}
                  fullWidth
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Last Name'
                  name='lastName'
                  value={basicDetails.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  fullWidth
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select name='gender' label='Gender' value={basicDetails.gender || ''} onChange={handleChange}>
                    {genderOptions.map(gender => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.gender && <Box sx={{ color: 'red', fontSize: 12, mt: 0.5 }}>{errors.gender}</Box>}
                </FormControl>
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Date of Birth'
                  name='dateOfBirth'
                  type='date'
                  value={basicDetails.dateOfBirth}
                  onChange={handleChange}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Date of Anniversary */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Date of Anniversary'
                  name='dateOfAnniversary'
                  type='date'
                  value={basicDetails.dateOfAnniversary}
                  onChange={handleChange}
                  error={!!errors.dateOfAnniversary}
                  helperText={errors.dateOfAnniversary}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Aadhar Number */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Aadhar Number'
                  name='adharNumber'
                  value={basicDetails.adharNumber}
                  onChange={handleChange}
                  error={!!errors.adharNumber}
                  helperText={errors.adharNumber}
                  fullWidth
                />
              </Grid>

              {/* PAN Number */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='PAN Number'
                  name='panNumber'
                  value={basicDetails.panNumber}
                  onChange={handleChange}
                  error={!!errors.panNumber}
                  helperText={errors.panNumber}
                  fullWidth
                />
              </Grid>

              {/* Profile Photo */}
              <Grid item xs={12} sm={4}>
                <Button variant='outlined' component='label' fullWidth>
                  Upload Profile Photo
                  <input type='file' name='profilePhoto' onChange={handleFileChange} hidden />
                </Button>
                {errors.profilePhoto && (
                  <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                    {errors.profilePhoto}
                  </Typography>
                )}
                {basicDetails.profilePhoto && (
                  <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
                    Selected File: {basicDetails.profilePhoto.name}
                  </Typography>
                )}
              </Grid>

              {/* Passport Number */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Passport Number'
                  name='passPortNumber'
                  value={basicDetails.passPortNumber}
                  onChange={handleChange}
                  error={!!errors.passPortNumber}
                  helperText={errors.passPortNumber}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Contact Number'
                  name='contactNumber'
                  value={basicDetails.contactNumber}
                  onChange={handleChange}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Alternate Contact Number'
                  name='alternateContactNumber'
                  value={basicDetails.alternateContactNumber}
                  onChange={handleChange}
                  error={!!errors.alternateContactNumber}
                  helperText={errors.alternateContactNumber}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Email'
                  name='email'
                  value={basicDetails.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  type='email'
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Alternate Email'
                  name='alternateEmail'
                  value={basicDetails.alternateEmail}
                  onChange={handleChange}
                  error={!!errors.alternateEmail}
                  helperText={errors.alternateEmail}
                  type='email'
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Emergency Contact Person Name'
                  name='emergencyContactPersonName'
                  value={basicDetails.emergencyContactPersonName}
                  onChange={handleChange}
                  error={!!errors.emergencyContactPersonName}
                  helperText={errors.emergencyContactPersonName}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label='Emergency Contact Person Mobile Number'
                  name='emergencyContactPersonMobileNumber'
                  value={basicDetails.emergencyContactPersonMobileNumber}
                  onChange={handleChange}
                  error={!!errors.emergencyContactPersonMobileNumber}
                  helperText={errors.emergencyContactPersonMobileNumber}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label='Emergency Address'
                  name='emergencyAddress'
                  value={basicDetails.emergencyAddress}
                  onChange={handleChange}
                  error={!!errors.emergencyAddress}
                  helperText={errors.emergencyAddress}
                  fullWidth
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type='submit' variant='contained' color='primary'>
                    Save & Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default BasicDetails

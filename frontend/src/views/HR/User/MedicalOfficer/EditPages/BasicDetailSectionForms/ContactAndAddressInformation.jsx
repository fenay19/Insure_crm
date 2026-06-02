import React, { useEffect, useCallback } from 'react'
import { Typography, Grid, TextField, FormControlLabel, Checkbox } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ContactAndAddressInformation ({ basicDetails, setBasicDetails, errors, setErrors, handleUpdate }) {
  const handleCheckboxChange = e => {
    const { checked } = e.target
    if (checked) {
      setBasicDetails(prev => ({
        ...prev,
        isPermanentSame: checked,
        permanentAddress: prev.residentialAddress,
        permanentPincode: prev.residentialPincode,
        permanentCity: prev.residentialCity,
        permanentDistrict: prev.residentialDistrict,
        permanentState: prev.residentialState
      }))

      // Reset errors for permanent address fields when checkbox is checked
      setErrors(prev => ({
        ...prev,
        permanentAddress: '',
        permanentPincode: '',
        permanentCity: '',
        permanentDistrict: '',
        permanentState: ''
      }))
    } else {
      setBasicDetails(prev => ({
        ...prev,
        isPermanentSame: checked,
        permanentAddress: '',
        permanentPincode: '',
        permanentCity: '',
        permanentDistrict: '',
        permanentState: ''
      }))
    }
  }

  const fetchPincodeDetails = useCallback(async (pincode, type) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = await response.json()

      if (data[0].Status === 'Success') {
        const { District, State } = data[0].PostOffice[0]
        const City = data[0].PostOffice[0].Name

        setBasicDetails((prev) => ({
          ...prev,
          [`${type}City`]: City || '',
          [`${type}District`]: District || '',
          [`${type}State`]: State || '',
        }))
      } else {
        toast.error('Invalid pincode')
      }
    } catch (error) {
      setBasicDetails((prev) => ({
        ...prev,
        [`${type}City`]: '',
        [`${type}District`]: '',
        [`${type}State`]: '',
      }))
      toast.error(`Error fetching ${type} pincode details:`)
      console.error(`Error fetching ${type} pincode details:`, error)
    }
  }, [])

  useEffect(() => {
    if (basicDetails?.residentialPincode?.length === 6) {
      fetchPincodeDetails(basicDetails.residentialPincode, 'residential')
    }

    if (basicDetails?.permanentPincode?.length === 6) {
      fetchPincodeDetails(basicDetails.permanentPincode, 'permanent')
    }
  }, [basicDetails.residentialPincode, basicDetails.permanentPincode, fetchPincodeDetails])

  return (
    <div>
      <Typography variant='h6' gutterBottom sx={{ marginTop: 4 }}>
        Contact Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Contact Number'
            name='contactNumber'
            fullWidth
            value={basicDetails.contactNumber}
            onChange={handleUpdate}
            error={!!errors.contactNumber}
            helperText={errors.contactNumber}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Alternate Contact Number'
            name='alternateContactNumber'
            fullWidth
            value={basicDetails.alternateContactNumber}
            onChange={handleUpdate}
            error={!!errors.alternateContactNumber}
            helperText={errors.alternateContactNumber}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Email'
            type='email'
            name='email'
            fullWidth
            value={basicDetails.email}
            onChange={handleUpdate}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Alternate Email'
            type='email'
            name='alternateEmail'
            fullWidth
            value={basicDetails.alternateEmail}
            onChange={handleUpdate}
            error={!!errors.alternateEmail}
            helperText={errors.alternateEmail}
          />
        </Grid>
      </Grid>

      <Typography variant='h6' gutterBottom sx={{ marginTop: 4 }}>
        Address Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Residential Address'
            name='residentialAddress'
            fullWidth
            value={basicDetails.residentialAddress}
            onChange={handleUpdate}
            error={!!errors.residentialAddress}
            helperText={errors.residentialAddress}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Residential Pincode'
            type='number'
            name='residentialPincode'
            fullWidth
            value={basicDetails.residentialPincode}
            onChange={handleUpdate}
            error={!!errors.residentialPincode}
            helperText={errors.residentialPincode}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Residential City'
            name='residentialCity'
            fullWidth
            value={basicDetails.residentialCity}
            onChange={handleUpdate}
            error={!!errors.residentialCity}
            helperText={errors.residentialCity}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Residential District'
            name='residentialDistrict'
            fullWidth
            value={basicDetails.residentialDistrict}
            onChange={handleUpdate}
            error={!!errors.residentialDistrict}
            helperText={errors.residentialDistrict}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Residential State'
            name='residentialState'
            fullWidth
            value={basicDetails.residentialState}
            onChange={handleUpdate}
            error={!!errors.residentialState}
            helperText={errors.residentialState}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={basicDetails.isPermanentSame} onChange={handleCheckboxChange} name='isPermanentSame' />}
            label='Permanent address is same as residential address'
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Permanent Address'
            name='permanentAddress'
            fullWidth
            value={basicDetails.permanentAddress}
            onChange={handleUpdate}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Permanent Pincode'
            name='permanentPincode'
            type='number'
            fullWidth
            value={basicDetails.permanentPincode}
            onChange={handleUpdate}
            error={!!errors.permanentPincode}
            helperText={errors.permanentPincode}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Permanent City'
            name='permanentCity'
            fullWidth
            value={basicDetails.permanentCity}
            onChange={handleUpdate}
            error={!!errors.permanentCity}
            helperText={errors.permanentCity}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Permanent District'
            name='permanentDistrict'
            fullWidth
            value={basicDetails.permanentDistrict}
            onChange={handleUpdate}
            error={!!errors.permanentDistrict}
            helperText={errors.permanentDistrict}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label='Permanent State'
            name='permanentState'
            fullWidth
            value={basicDetails.permanentState}
            onChange={handleUpdate}
            error={!!errors.permanentState}
            helperText={errors.permanentState}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default ContactAndAddressInformation

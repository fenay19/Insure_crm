import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel } from '@mui/material'

function AddressDetails ({ setFormData, setIsFormVisible, setValue, formData }) {
  const [addressDetails, setAddressDetails] = useState({
    residentialAddress: '',
    residentialPincode: '',
    residentialCity: '',
    residentialDistrict: '',
    residentialState: '',
    permanentAddress: '',
    permanentPincode: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentState: '',
    isPermanentSame: false
  })

  const [errors, setErrors] = useState({
    residentialAddress: '',
    residentialPincode: '',
    residentialCity: '',
    residentialDistrict: '',
    residentialState: '',
    permanentAddress: '',
    permanentPincode: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentState: ''
  })


  const fetchPincodeDetails = async (pincode, type) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = await response.json()

      if (data[0].Status === 'Success') {
        const { District, State } = data[0].PostOffice[0]
        const City = data[0].PostOffice[0].Name

        setAddressDetails(prev => ({
          ...prev,
          [`${type}City`]: City || '',
          [`${type}District`]: District || '',
          [`${type}State`]: State || ''
        }))
      } else {
        throw new Error('Invalid Pincode')
      }
    } catch (error) {
      setAddressDetails(prev => ({
        ...prev,
        [`${type}City`]: '',
        [`${type}District`]: '',
        [`${type}State`]: ''
      }))
      console.error(`Error fetching ${type} pincode details:`, error)
    }
  }

  useEffect(() => {
    if (addressDetails?.residentialPincode?.length === 6) {
      fetchPincodeDetails(addressDetails.residentialPincode, 'residential')
    }
    if (addressDetails?.permanentPincode?.length === 6) {
      fetchPincodeDetails(addressDetails.permanentPincode, 'permanent')
    }
  }, [addressDetails.residentialPincode, addressDetails.permanentPincode])



  

  
  const handleChange = e => {
    const { name, value } = e.target
    setAddressDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  useEffect(() => {
    setAddressDetails(formData.addressDetails || {})
  }, [formData.addressDetails])

  const validateAddressDetails = () => {
    const validations = [
      { field: 'residentialAddress', message: 'Residential address is required.' },
      { field: 'residentialPincode', message: 'Residential pincode is required.' },
      { field: 'residentialCity', message: 'Residential city is required.' },
      { field: 'residentialDistrict', message: 'Residential district is required.' },
      { field: 'residentialState', message: 'Residential state is required.' },
      { field: 'permanentAddress', message: 'Permanent address is required.' },
      { field: 'permanentPincode', message: 'Permanent pincode is required.' },
      { field: 'permanentCity', message: 'Permanent city is required.' },
      { field: 'permanentDistrict', message: 'Permanent district is required.' },
      { field: 'permanentState', message: 'Permanent state is required.' }
    ]

    let allValid = true
    const newErrors = {}

    validations.forEach(({ field, message }) => {
      if (!addressDetails[field]) {
        newErrors[field] = message
        allValid = false
      }
    })

    setErrors(newErrors)
    return allValid
  }

  const handleCheckboxChange = e => {
    const { checked } = e.target
    if (checked) {
      setAddressDetails(prev => ({
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
      setAddressDetails(prev => ({
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

  const handleSubmit = e => {
    e.preventDefault()
    // if (validateAddressDetails()) {
    if (true) {
      setFormData(prev => ({
        ...prev,
        addressDetails: addressDetails
      }))

      setIsFormVisible(prev => ({
        ...prev,
        pastEmploymentDetails: true
      }))

      setValue(prev => prev + 1)
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Address Details'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Residential Address */}
              <Grid item xs={12}>
                <TextField
                  label='Residential Address'
                  name='residentialAddress'
                  value={addressDetails.residentialAddress}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.residentialAddress}
                  helperText={errors.residentialAddress}
                />
              </Grid>

              {/* Residential Pincode */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Residential Pincode'
                  name='residentialPincode'
                  value={addressDetails.residentialPincode}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.residentialPincode}
                  helperText={errors.residentialPincode}
                />
              </Grid>

              {/* Residential City */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Residential City'
                  name='residentialCity'
                  value={addressDetails.residentialCity}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.residentialCity}
                  helperText={errors.residentialCity}
                />
              </Grid>

              {/* Residential District */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Residential District'
                  name='residentialDistrict'
                  value={addressDetails.residentialDistrict}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.residentialDistrict}
                  helperText={errors.residentialDistrict}
                />
              </Grid>

              {/* Residential State */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Residential State'
                  name='residentialState'
                  value={addressDetails.residentialState}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.residentialState}
                  helperText={errors.residentialState}
                />
              </Grid>

              {/* Checkbox to Copy Residential to Permanent Address */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={addressDetails.isPermanentSame} onChange={handleCheckboxChange} name='isPermanentSame' />}
                  label='Permanent address is same as residential address'
                />
              </Grid>

              {/* Permanent Address */}
              <Grid item xs={12}>
                <TextField
                  label='Permanent Address'
                  name='permanentAddress'
                  value={addressDetails.permanentAddress}
                  onChange={handleChange}
                  fullWidth
                  disabled={addressDetails.isPermanentSame} // Disable input when the checkbox is checked
                  error={!!errors.permanentAddress}
                  helperText={errors.permanentAddress}
                />
              </Grid>

              {/* Permanent Pincode */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Permanent Pincode'
                  name='permanentPincode'
                  value={addressDetails.permanentPincode}
                  onChange={handleChange}
                  fullWidth
                  disabled={addressDetails.isPermanentSame} // Disable input when the checkbox is checked
                  error={!!errors.permanentPincode}
                  helperText={errors.permanentPincode}
                />
              </Grid>

              {/* Permanent City */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Permanent City'
                  name='permanentCity'
                  value={addressDetails.permanentCity}
                  onChange={handleChange}
                  fullWidth
                  disabled={addressDetails.isPermanentSame} // Disable input when the checkbox is checked
                  error={!!errors.permanentCity}
                  helperText={errors.permanentCity}
                />
              </Grid>

              {/* Permanent District */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Permanent District'
                  name='permanentDistrict'
                  value={addressDetails.permanentDistrict}
                  onChange={handleChange}
                  fullWidth
                  disabled={addressDetails.isPermanentSame} // Disable input when the checkbox is checked
                  error={!!errors.permanentDistrict}
                  helperText={errors.permanentDistrict}
                />
              </Grid>

              {/* Permanent State */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Permanent State'
                  name='permanentState'
                  value={addressDetails.permanentState}
                  onChange={handleChange}
                  fullWidth
                  disabled={addressDetails.isPermanentSame} // Disable input when the checkbox is checked
                  error={!!errors.permanentState}
                  helperText={errors.permanentState}
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

export default AddressDetails

import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader } from '@mui/material'

function BankDetails ({ setFormData, setIsFormVisible, setValue, formData }) {
  const [bankDetails, setBankDetails] = useState({
    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    cancelCheck: null
  })

  const [errors, setErrors] = useState({
    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    cancelCheck: ''
  })

  const validateBankDetails = () => {
    const validations = [
      { field: 'nameOnBankAccount', message: 'Name on bank account is required' },
      { field: 'bankAccountNumber', message: 'Bank account number is required' },
      { field: 'bankName', message: 'Bank name is required' },
      { field: 'branchName', message: 'Branch name is required' },
      { field: 'ifscCode', message: 'IFSC code is required' }
    ]

    let allValid = true
    let newErrors = {}

    validations.forEach(({ field, message }) => {
      if (!bankDetails[field]) {
        newErrors[field] = message
        allValid = false
      }
    })

    if (!bankDetails.cancelCheck) {
      newErrors.cancelCheck = 'Cancelled check or passbook is required'
      allValid = false
    } else if (bankDetails.cancelCheck.type !== 'application/pdf') {
      newErrors.cancelCheck = 'Only PDF files are allowed'
      allValid = false
    }

    setErrors(newErrors)
    return allValid
  }

  const handleChange = e => {
    const { name, value } = e.target
    setBankDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  useEffect(() => {
    setBankDetails(formData.bankDetails || {})
  }, [formData.bankDetails])

  const handleFileChange = e => {
    const file = e.target.files[0]
    setBankDetails(prev => ({ ...prev, cancelCheck: file }))
    setErrors(prev => ({ ...prev, cancelCheck: '' }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    // if (validateBankDetails()) {
    if (true) {
      setFormData(prev => ({
        ...prev,
        bankDetails: bankDetails
      }))

      setIsFormVisible(prev => ({
        ...prev,
        employmentDetails: true
      }))

      setValue(prev => prev + 1)
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Bank Details Form'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Name on Bank Account */}
              <Grid item xs={12}>
                <TextField
                  label='Name on Bank Account'
                  name='nameOnBankAccount'
                  value={bankDetails.nameOnBankAccount}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.nameOnBankAccount}
                  helperText={errors.nameOnBankAccount}
                />
              </Grid>

              {/* Bank Account Number */}
              <Grid item xs={12}>
                <TextField
                  label='Bank Account Number'
                  name='bankAccountNumber'
                  value={bankDetails.bankAccountNumber}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.bankAccountNumber}
                  helperText={errors.bankAccountNumber}
                />
              </Grid>

              {/* Bank Name */}
              <Grid item xs={12}>
                <TextField
                  label='Bank Name'
                  name='bankName'
                  value={bankDetails.bankName}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.bankName}
                  helperText={errors.bankName}
                />
              </Grid>

              {/* Branch Name */}
              <Grid item xs={12}>
                <TextField
                  label='Branch Name'
                  name='branchName'
                  value={bankDetails.branchName}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.branchName}
                  helperText={errors.branchName}
                />
              </Grid>

              {/* IFSC Code */}
              <Grid item xs={12}>
                <TextField
                  label='IFSC Code'
                  name='ifscCode'
                  value={bankDetails.ifscCode}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode}
                />
              </Grid>

              {/* Cancel Check or Passbook */}
              <Grid item xs={12}>
                <Button variant='outlined' component='label' fullWidth>
                  Upload Cancelled Check or Passbook (PDF Only)
                  <input type='file' name='cancelCheck' accept='application/pdf' onChange={handleFileChange} hidden />
                </Button>
                {bankDetails.cancelCheck && (
                  <Box sx={{ marginTop: 1 }}>
                    <strong>File Selected: </strong>
                    {bankDetails.cancelCheck.name}
                  </Box>
                )}
                {errors.cancelCheck && <Box sx={{ marginTop: 1, color: 'red' }}>{errors.cancelCheck}</Box>}
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

export default BankDetails

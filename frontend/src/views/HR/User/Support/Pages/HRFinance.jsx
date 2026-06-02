import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, Typography } from '@mui/material'
import REACT_APP_API_URL from 'api/api'
import { toast } from 'react-toastify'
function HRFinance ({ setValue, storedAllData, setStoredAllData }) {
  const [hrFinance, setHrFinance] = useState({
    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panCardNo: '',
    cancelCheck: ''
  })

  const [errors, setErrors] = useState({
    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panCardNo: '',
    cancelCheck: ''
  })

  useEffect(() => {
    setHrFinance(storedAllData.hrFinance || {})
  }, [storedAllData.hrFinance])

  const handleChange = e => {
    const { name, value } = e.target
    setHrFinance(prev => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = e => {
    const file = e.target.files[0]
    if (file instanceof File) {
      setHrFinance(prev => ({ ...prev, cancelCheck: file }))
    }
  }

  const hrFinanceValidations = () => {
    const validations = [
      { field: 'nameOnBankAccount', message: 'Name on Bank Account is required' },
      { field: 'bankAccountNumber', message: 'Bank Account Number is required' },
      { field: 'bankName', message: 'Bank Name is required' },
      { field: 'branchName', message: 'Branch Name is required' },
      { field: 'ifscCode', message: 'IFSC Code is required' },
      { field: 'panCardNo', message: 'PAN Card Number is required' },
      { field: 'cancelCheck', message: 'Cancelled Check or Passbook is required' }
    ]

    let newErrors = {}
    let isValid = true

    validations.forEach(({ field, message }) => {
      if (!hrFinance[field]) {
        newErrors[field] = message
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (true) {
      if (storedAllData?.submittedFormId) {
        const payLoad = { ...hrFinance }
        const formData = new FormData()

        for (const [key, value] of Object.entries(payLoad)) {
          if (value) {
            formData.append(key, value)
          }
        }

        const submitHrFDetails = await fetch(`${REACT_APP_API_URL}support/hrFinance/${storedAllData.submittedFormId}`, {
          method: 'PUT',
          body: formData
        })

        const response = await submitHrFDetails.json()

        if (response.success === true) {
          setStoredAllData(prev => ({ ...prev, hrFinance: response?.data?.hrFinance }))
          toast.success(response.message)
          setValue(prev => prev + 1)
        }

        if (response.success === false) {
          toast.error(response.message)
        }
      } else {
        toast.error('Please submit the Basic Details first')
        setValue(0)
      }
    } 
  }

  return (
    <div>
      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: '100%', width: '100%', boxShadow: 3 }}>
          <CardHeader
            title='HR Finance'
            titleTypographyProps={{ variant: 'h5', align: 'center' }}
            sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Typography variant='h6' gutterBottom>
                Bank Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label='Name on Bank Account'
                    name='nameOnBankAccount'
                    value={hrFinance.nameOnBankAccount}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.nameOnBankAccount}
                    helperText={errors.nameOnBankAccount}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label='Bank Account Number'
                    name='bankAccountNumber'
                    value={hrFinance.bankAccountNumber}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.bankAccountNumber}
                    helperText={errors.bankAccountNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label='Bank Name'
                    name='bankName'
                    value={hrFinance.bankName}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label='Branch Name'
                    name='branchName'
                    value={hrFinance.branchName}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.branchName}
                    helperText={errors.branchName}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label='IFSC Code'
                    name='ifscCode'
                    value={hrFinance.ifscCode}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.ifscCode}
                    helperText={errors.ifscCode}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label='PAN Card Number'
                    name='panCardNo'
                    value={hrFinance.panCardNo}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.panCardNo}
                    helperText={errors.panCardNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant='outlined' component='label' fullWidth>
                    Upload Cancelled Check or Passbook (PDF Only)
                    <input type='file' accept='application/pdf' hidden onChange={handleFileSelect} />
                  </Button>
                  <Typography>{hrFinance.cancelCheck instanceof File ? hrFinance.cancelCheck.name : ''}</Typography>
                </Grid>
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
    </div>
  )
}

export default HRFinance

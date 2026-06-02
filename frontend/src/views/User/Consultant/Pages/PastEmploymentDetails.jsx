import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader } from '@mui/material'

function PastEmploymentDetails ({ setFormData, setIsFormVisible, setValue, formData }) {
  const [pastEmploymentData, setPastEmploymentData] = useState({
    companyName: '',
    position: '',
    relievingDate: '',
    inHandSalary: '',
    note: ''
  })

  const [errors, setErrors] = useState({
    companyName: '',
    position: '',
    relievingDate: '',
    inHandSalary: ''
  })

  const pastEmploymentValidations = () => {
    const validations = [
      { field: 'companyName', message: 'Company name is required' },
      { field: 'position', message: 'Position is required' },
      { field: 'relievingDate', message: 'Relieving date is required' },
      { field: 'inHandSalary', message: 'In-hand salary is required' }
    ]

    let allValid = true
    let newErrors = {}

    validations.forEach(({ field, message }) => {
      if (!pastEmploymentData[field]) {
        newErrors[field] = message
        allValid = false
      }
    })

    setErrors(newErrors)
    return allValid
  }

  const handleChange = e => {
    const { name, value } = e.target
    setPastEmploymentData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  useEffect(() => {
    setPastEmploymentData(formData.pastEmploymentDetails || {})
  },[formData.pastEmploymentDetails])

  const handleSubmit = e => {
    e.preventDefault()
    // if (pastEmploymentValidations()) {
      if (true) {

      setFormData(prev => ({
        ...prev,
        pastEmploymentDetails: pastEmploymentData
      }))

      setIsFormVisible(prev => ({
        ...prev,
        bankDetails: true
      }))

      setValue(prev => prev + 1)
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Past Employment Details'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Company Name */}
              <Grid item xs={12}>
                <TextField
                  label='Company Name'
                  name='companyName'
                  value={pastEmploymentData.companyName}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
              </Grid>

              {/* Position */}
              <Grid item xs={12}>
                <TextField
                  label='Position'
                  name='position'
                  value={pastEmploymentData.position}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.position}
                  helperText={errors.position}
                />
              </Grid>

              {/* Relieving Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Relieving Date'
                  name='relievingDate'
                  type='date'
                  value={pastEmploymentData.relievingDate}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.relievingDate}
                  helperText={errors.relievingDate}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              {/* In-Hand Salary */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='In-Hand Salary'
                  name='inHandSalary'
                  value={pastEmploymentData.inHandSalary}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.inHandSalary}
                  helperText={errors.inHandSalary}
                  type='number'
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField label='Note' name='note' value={pastEmploymentData.note} onChange={handleChange} fullWidth multiline rows={4} />
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

export default PastEmploymentDetails

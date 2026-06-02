import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, MenuItem, Select, InputLabel, FormControl } from '@mui/material'

function EmploymentDetails ({ setFormData, setIsFormVisible, setValue, formData }) {
  const [employmentDetails, setEmploymentDetails] = useState({
    joiningDate: '',
    position: '',
    location: '',
    typeOfEmployee: '',
    inHandSalary: '',
    relievingDate: '',
    department: '',
    reportTo: '',
    description: ''
  })

  const [errors, setErrors] = useState({
    joiningDate: '',
    position: '',
    location: '',
    typeOfEmployee: '',
    inHandSalary: '',
    department: '',
    reportTo: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setEmploymentDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  useEffect(() => {
    setEmploymentDetails(formData.employmentDetails || {})
  }, [formData.employmentDetails])

  const employmentDetailValidation = () => {
    const validations = [
      { field: 'joiningDate', message: 'Joining date is required' },
      { field: 'position', message: 'Position is required' },
      { field: 'location', message: 'Location is required' },
      { field: 'typeOfEmployee', message: 'Type of employee is required' },
      { field: 'inHandSalary', message: 'In-hand salary is required' },
      { field: 'department', message: 'Department is required' },
      { field: 'reportTo', message: 'Reporting manager is required' }
    ]

    let isValid = true
    let newErrors = {}

    validations.forEach(({ field, message }) => {
      if (!employmentDetails[field]) {
        newErrors[field] = message
        isValid = false
      }
    })

    if (employmentDetails.inHandSalary && isNaN(employmentDetails.inHandSalary)) {
      newErrors.inHandSalary = 'In-hand salary must be a valid number'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = e => {
    e.preventDefault()
    // if (employmentDetailValidation()) {
    if (true) {
      setFormData(prev => ({
        ...prev,
        employmentDetails: employmentDetails
      }))

      setIsFormVisible(prev => ({
        ...prev,
        documentation: true
      }))

      setValue(prev => prev + 1)
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Employment Details Form'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Joining Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Joining Date'
                  name='joiningDate'
                  type='date'
                  value={employmentDetails.joiningDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.joiningDate}
                  helperText={errors.joiningDate}
                />
              </Grid>

              {/* Position */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Position'
                  name='position'
                  value={employmentDetails.position}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.position}
                  helperText={errors.position}
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Location'
                  name='location'
                  value={employmentDetails.location}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location}
                />
              </Grid>

              {/* Type of Employee */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.typeOfEmployee}>
                  <InputLabel>Type of Employee</InputLabel>
                  <Select name='typeOfEmployee' value={employmentDetails.typeOfEmployee || ''} onChange={handleChange}>
                    <MenuItem value='Full-Time'>Full-Time</MenuItem>
                    <MenuItem value='Part-Time'>Part-Time</MenuItem>
                    <MenuItem value='Intern'>Intern</MenuItem>
                    <MenuItem value='Contract'>Contract</MenuItem>
                  </Select>
                  {errors.typeOfEmployee && <Box sx={{ color: 'red', fontSize: 12, mt: 0.5 }}>{errors.typeOfEmployee}</Box>}
                </FormControl>
              </Grid>

              {/* In-Hand Salary */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='In-Hand Salary'
                  name='inHandSalary'
                  value={employmentDetails.inHandSalary}
                  onChange={handleChange}
                  fullWidth
                  type='number'
                  error={!!errors.inHandSalary}
                  helperText={errors.inHandSalary}
                />
              </Grid>

              {/* Relieving Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Relieving Date'
                  name='relievingDate'
                  type='date'
                  value={employmentDetails.relievingDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Department */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Department'
                  name='department'
                  value={employmentDetails.department}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.department}
                  helperText={errors.department}
                />
              </Grid>

              {/* Report To */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Report To'
                  name='reportTo'
                  value={employmentDetails.reportTo}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.reportTo}
                  helperText={errors.reportTo}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label='Description'
                  name='description'
                  value={employmentDetails.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
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

export default EmploymentDetails

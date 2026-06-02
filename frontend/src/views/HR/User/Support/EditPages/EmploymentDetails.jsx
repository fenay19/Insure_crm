import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, MenuItem } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { get, put } from 'api/api'

function EmploymentDetails ({ setValue, setStoredAllData, storedAllData }) {
  const id = storedAllData._id
  const [deparmentData, setDepartmentData] = useState([])
  const [empRoleData, setEmpRoleData] = useState([])
  const [designationData, setDesignationData] = useState([])
  const [filteredDesignation, setFilteredDesignation] = useState([])
  const typeOfEmployeeData = ['Contract', 'Outsource', 'Part time', 'Full time', 'Visiting', 'Trainee', 'Probationer']
  const [supportDataForReportTo, setSupportDataForReportTo] = useState([])

  async function fetchSupportDataForReportTo () {
    const response = await get('/support/supportData/reportTo')
    setSupportDataForReportTo(response.data.length > 0 ? response.data : [])
  }

  async function fetchDepartmentData () {
    const response = await get('department-setup')
    setDepartmentData(response.data || [])
  }

  async function fetchEmployeeRole () {
    const response = await get('employee-role')
    setEmpRoleData(response.employeeRole || [])
  }

  async function fetchDesignation () {
    const response = await get('designation-master')
    setDesignationData(response.data)
  }

  useEffect(() => {
    fetchDepartmentData()
    fetchEmployeeRole()
    fetchDesignation()
    fetchSupportDataForReportTo()
  }, [])

  const [employmentDetails, setEmploymentDetails] = useState({
    departmentOrSpeciality: '',
    empRole: '',
    designation: '',
    typeOfEmployee: '',
    joiningDate: '',
    location: '',
    appointmentDate: '',
    reportTo: '',
    description: ''
  })

  const [errors, setErrors] = useState({
    departmentOrSpeciality: '',
    empRole: '',
    designation: '',
    typeOfEmployee: '',
    joiningDate: '',
    location: '',
    reportTo: ''
  })

  useEffect(() => {
    setEmploymentDetails(storedAllData.employmentDetails || {})
  }, [storedAllData.employmentDetails])

  useEffect(() => {
    const selectedEmployeeRole = employmentDetails.empRole
    if (selectedEmployeeRole) {
      const filteredDesigationAccordingToEmpRole = designationData.filter(item => item.empRoleId === selectedEmployeeRole)
      setFilteredDesignation(filteredDesigationAccordingToEmpRole)
    }
  }, [employmentDetails.empRole, designationData])

  const handleChange = e => {
    const { name, value } = e.target
    setEmploymentDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const employmentDetailValidation = () => {
    const validations = [
      { field: 'departmentOrSpeciality', message: 'Department Or Speciality is required' },
      { field: 'empRole', message: 'Employee role is required' },
      { field: 'designation', message: 'Designation is required' },
      { field: 'typeOfEmployee', message: 'Type of employee is required' },
      { field: 'joiningDate', message: 'Joining date is required' },
      { field: 'location', message: 'Location is required' },
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

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // if (employmentDetailValidation()) {
    if (true) {
      const response = await put(`support/employmentDetails/${id}`, { employmentDetails })
      if (response.success === true) {
        setStoredAllData(prev => ({
          ...prev,
          employmentDetails: response.data.employmentDetails
        }))
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Current Employment Details Form'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Department */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label='Department/Speciality'
                  name='departmentOrSpeciality'
                  value={employmentDetails.departmentOrSpeciality || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.departmentOrSpeciality}
                  helperText={errors.departmentOrSpeciality}
                >
                  {deparmentData.map((item, index) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.departmentName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Employee Role */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label='Employee Role'
                  name='empRole'
                  value={employmentDetails.empRole || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.empRole}
                  helperText={errors.empRole}
                >
                  {empRoleData.map((item, index) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.employeeRole}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Designation */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label='Designation'
                  name='designation'
                  value={employmentDetails.designation || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.designation}
                  helperText={errors.designation}
                >
                  {filteredDesignation?.length > 0 ? (
                    filteredDesignation.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.designationName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No Data Found</MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* Type of Employee */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label='Type of Employee'
                  name='typeOfEmployee'
                  value={employmentDetails.typeOfEmployee || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.typeOfEmployee}
                  helperText={errors.typeOfEmployee}
                >
                  {typeOfEmployeeData.map(item => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Relieving Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Appointment Date'
                  name='appointmentDate'
                  type='date'
                  value={employmentDetails?.appointmentDate?.slice(0, 10) || ''}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Joining Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Joining Date'
                  name='joiningDate'
                  type='date'
                  value={employmentDetails?.joiningDate?.slice(0, 10) || ''}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.joiningDate}
                  helperText={errors.joiningDate}
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

              {/* Report To */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label='Report To'
                  name='reportTo'
                  value={employmentDetails.reportTo || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.reportTo}
                  helperText={errors.reportTo || ''}
                >
                  {supportDataForReportTo && supportDataForReportTo.length > 0 ? (
                    supportDataForReportTo.map(item => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.basicDetails.firstName && item.basicDetails.lastName
                          ? `${item.basicDetails.firstName} ${item.basicDetails.lastName}`
                          : 'No Name Available'}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data found</MenuItem>
                  )}
                </TextField>
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
                  <Button type='submit' variant='contained' color='primary' onClick={handleSubmit}>
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

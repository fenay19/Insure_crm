import React, { useState, useEffect } from 'react'
import {
  IconButton,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post, get } from 'api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddDesignation = ({ handleClose, getData, nextDesignationCode }) => {
  const [inputData, setInputData] = useState({
    empRole: '',
    empRoleId: '',
    designationName: '',
    designationCode: '',
    description: '',
    designationFunction: {
      clinical: false,
      administrative: false,
      finance: false
    }
  })

  useEffect(() => {
    if(inputData.empRole !== "" && inputData.designationName !== "") {
      setInputData(prev => ({
        ...prev,
        designationCode : nextDesignationCode
      }))
    }
  }, [inputData.empRole, inputData.designationName, nextDesignationCode, inputData])

  const [error, setError] = useState({
    empRoleId: '',
    designationName: '',
    designationCode: '',
    designationFunction: ''
  })

  const [roles, setRoles] = useState([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await get('employee-role')
        setRoles(response.employeeRole)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    fetchRoles()
  }, [])

  const handleSave = event => {
    handleSubmitData(event)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleEmployeeRole = e => {
    const selectedEmployeeRoleId = e.target.value
    const selectedEmployeeRole = roles.find(role => role._id === selectedEmployeeRoleId)

    setInputData(prev => ({
      ...prev,
      empRole: selectedEmployeeRole.employeeRole,
      empRoleId: selectedEmployeeRoleId
    }))

    if (selectedEmployeeRoleId) {
      setError(prev => ({
        ...prev,
        empRoleId: ''
      }))
    }
  }

  const handleFunctionChange = field => {
    setInputData(prev => ({
      ...prev,
      designationFunction: {
        clinical: field === 'clinical',
        administrative: field === 'administrative',
        finance: field === 'finance'
      }
    }))
    setError(prev => ({ ...prev, designationFunction: '' }))
  }

  const validation = () => {
    const validateFields = [
      { field: 'empRoleId', message: 'Employee Role is required' },
      { field: 'designationName', message: 'Designation Name is required' },
      { field: 'designationCode', message: 'Designation Code is required' }
    ]

    let allValid = true
    let newErrors = {}

    validateFields.forEach(({ field, message }) => {
      if (!inputData[field]) {
        newErrors[field] = message
        allValid = false
      }
    })

    // Validate designationFunction (at least one checkbox must be selected)
    const hasSelectedFunction = Object.values(inputData.designationFunction).some(val => val)
    if (!hasSelectedFunction) {
      newErrors.designationFunction = 'Please select a designation function.'
      allValid = false
    }

    setError(newErrors)

    return allValid
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    const validate = validation()

    if (validate) {
      await post('designation-master', inputData)
        .then(response => {
          if (response.error) {
            toast.error(response.error)
          }

          if (response.designation) {
            toast.success(response.msg)
            setInputData({
              designationName: '',
              designationCode: '',
              description: '',
              empRoleId: '',
              designationFunction: {
                clinical: false,
                administrative: false,
                finance: false
              }
            })
            handleClose()
            getData()
          }
        })
        .catch(error => {
          if (error.response?.data?.msg) {
            alert(error.response.data.msg)
          } else {
            alert('Something went wrong, please try later!')
          }
        })
    }
  }

  return (
    <div className='modal'>
      <h2 className='popupHead'>Add Designation</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth error={!!error.empRoleId}>
              <InputLabel>Employee Role</InputLabel>
              <Select value={inputData.empRoleId} onChange={handleEmployeeRole} name='empRoleId' label='Employee Role'>
                {roles.map(role => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.employeeRole}
                  </MenuItem>
                ))}
              </Select>
              {error.empRoleId && <FormHelperText>{error.empRoleId}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label='Designation Name'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.designationName}
              name='designationName'
              error={!!error.designationName}
              helperText={error.designationName}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label='Designation Code'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.designationCode}
              name='designationCode'
              error={!!error.designationCode}
              helperText={error.designationCode}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Description'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.description}
              name='description'
            />
          </Grid>

          <Grid item xs={12}>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
              <FormControlLabel
                control={<Checkbox checked={inputData.designationFunction.clinical} onChange={() => handleFunctionChange('clinical')} />}
                label='Clinical'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputData.designationFunction.administrative}
                    onChange={() => handleFunctionChange('administrative')}
                  />
                }
                label='Administrative'
              />
              <FormControlLabel
                control={<Checkbox checked={inputData.designationFunction.finance} onChange={() => handleFunctionChange('finance')} />}
                label='Support'
              />
            </FormGroup>
            {error.designationFunction && <FormHelperText error>{error.designationFunction}</FormHelperText>}
          </Grid>

          <Grid item xs={12}>
            <Box>
              <IconButton type='submit' title='Save' className='btnSave'>
                <Save />
              </IconButton>
              <IconButton title='Cancel' onClick={handleClose} className='btnCancel'>
                <Cancel />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default AddDesignation

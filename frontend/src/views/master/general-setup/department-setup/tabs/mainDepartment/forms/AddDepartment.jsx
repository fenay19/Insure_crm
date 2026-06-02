import React, { useEffect, useState } from 'react'
import {
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Typography
} from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post, get } from 'api/api'
import { toast } from 'react-toastify'

const AddDepartment = ({ handleClose, getData }) => {
  const [departmentTypeData, setDepartmentTypeData] = useState([])
  const [departmentSubTypeData, setDepartmentSubTypeData] = useState([])
  const [inputData, setInputData] = useState({
    departmentType: '',
    departmentSubType: '',
    departmentBranch: '',
    departmentName: '',
    departmentCode: '',
    serviceLedger: '',
    departmentFunction: {
      isLab: false,
      isPharmacy: false,
      isSpeciality: false,
      isRadiology: false,
      Other: false
    },
    status: 'active'
  })

  const [error, setError] = useState({
    departmentType: '',
    departmentSubType: '',
    departmentBranch: '',
    departmentName: '',
    serviceLedger: ''
  })

  const fetchDepartmentTypeData = async () => {
    try {
      const result = await get('department-type')
      setDepartmentTypeData(result.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Fetch Department Sub-Types
  const fetchDepartmentSubData = async () => {
    try {
      const result = await get('department-sub-type')
      const filtered = result.data?.filter(item => item.departmentTypeId.departmentTypeName === inputData.departmentType)
      setDepartmentSubTypeData(filtered)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchLatestDepartmentCode = async () => {
    try {
      const result = await get('department-setup')
      const codes = result.data.map(dept => dept.departmentCode)

      if (codes.length > 0) {
        // Extract the numeric part of each department code
        const numericCodes = codes.map(code => parseInt(code.match(/\d+$/), 10)).filter(num => !isNaN(num))

        // Find the maximum numeric code
        const maxCode = Math.max(...numericCodes)

        // Increment the code and format it with leading zeros
        const newCode = String(maxCode + 1).padStart(6, '0')

        setInputData(prev => ({
          ...prev,
          departmentCode: newCode
        }))
      } else {
        // If no codes exist, start with '000001'
        setInputData(prev => ({
          ...prev,
          departmentCode: '000001'
        }))
      }
    } catch (err) {
      console.log('Error fetching department code:', err)
    }
  }



  useEffect(() => {
    fetchDepartmentTypeData()
    fetchLatestDepartmentCode()
  }, [])

  useEffect(() => {
    if (inputData.departmentType) {
      fetchDepartmentSubData()
    }
  }, [inputData.departmentType])

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleCheckboxChange = e => {
    const { name, checked } = e.target
    setInputData(prev => ({
      ...prev,
      departmentFunction: { ...prev.departmentFunction, [name]: checked }
    }))
  }

  const validateFields = () => {
    const newErrors = {}
    if (!inputData.departmentType) newErrors.departmentType = 'Department Type is required'
    if (!inputData.departmentSubType) newErrors.departmentSubType = 'Department Sub-Type is required'
    if (!inputData.departmentName) newErrors.departmentName = 'Department Name is required'

    return Object.keys(newErrors).length === 0
  }

  const handleSubmitData = async e => {
    e.preventDefault()
    if (!validateFields()) return
    console.log('INPUT ', inputData)
    try {
      const res = await post('department-setup', inputData)
      handleClose()
      getData()

      toast.success(res.msg)
    } catch (error) {
      console.log('Error:', error)
      toast.error('Failed to add department')
    }
  }

  return (
    <div className='modal'>
      <h2>Add Department</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!error.departmentType}>
              <InputLabel>Department Type</InputLabel>
              <Select
                labelId='departmentTypeLabel'
                label='>Department Type'
                variant='outlined'
                name='departmentType'
                value={inputData.departmentType}
                onChange={handleInputChange}
              >
                {departmentTypeData.map(type => (
                  <MenuItem key={type._id} value={type.departmentTypeName}>
                    {type.departmentTypeName}
                  </MenuItem>
                ))}
              </Select>
              {error.departmentType && <FormHelperText>{error.departmentType}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!error.departmentSubType}>
              <InputLabel>Department Sub-Type</InputLabel>
              <Select
                labelId='departmentsubTypeLabel'
                label='>Department Sub-Type'
                variant='outlined'
                name='departmentSubType'
                value={inputData.departmentSubType}
                onChange={handleInputChange}
              >
                {departmentSubTypeData.map(subType => (
                  <MenuItem key={subType._id} value={subType.departmentSubTypeName}>
                    {subType.departmentSubTypeName}
                  </MenuItem>
                ))}
              </Select>
              {error.departmentSubType && <FormHelperText>{error.departmentSubType}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!error.departmentBranch}>
              <InputLabel>Department Branch</InputLabel>
              <Select
                labelId='departmentBranch'
                label='>Department Branch'
                variant='outlined'
                name='departmentBranch'
                value={inputData.departmentBranch}
                onChange={handleInputChange}
              >
                <MenuItem value='Medical'>Medical</MenuItem>
                <MenuItem value='Surgical'>Surgical</MenuItem>
              </Select>
              {error.departmentBranch && <FormHelperText>{error.departmentBranch}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Department Name'
              name='departmentName'
              fullWidth
              value={inputData.departmentName}
              onChange={handleInputChange}
              error={!!error.departmentName}
              helperText={error.departmentName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label='Department Code' name='departmentCode' fullWidth value={inputData.departmentCode} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Service Ledger</InputLabel>
              <Select
                labelId='ledgerLabel'
                label='>Service Ledger'
                variant='outlined'
                name='serviceLedger'
                value={inputData.serviceLedger}
                onChange={handleInputChange}
              >
                <MenuItem value='Laboratory'>Laboratory</MenuItem>
                <MenuItem value='General Surgery'>General Surgery</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography>Department Function:</Typography>
            {[
              { label: 'Is Lab', key: 'isLab' },
              { label: 'Is Speciality', key: 'isSpeciality' },
              { label: 'Is Pharmacy', key: 'isPharmacy' },
              { label: 'Is Radiology', key: 'isRadiology' },
              { label: 'Other', key: 'Other' }
            ].map(func => (
              <FormControlLabel
                key={func.key}
                control={<Checkbox name={func.key} checked={inputData.departmentFunction[func.key]} onChange={handleCheckboxChange} />}
                label={func.label}
              />
            ))}
          </Grid>

          {/* Save and Cancel Buttons */}
          <Grid item xs={12}>
            <div className='btnGroup'>
              <IconButton type='submit' title='Save' className='btnSave'>
                <Save />
              </IconButton>
              <IconButton title='Cancel' onClick={handleClose} className='btnCancel'>
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default AddDepartment

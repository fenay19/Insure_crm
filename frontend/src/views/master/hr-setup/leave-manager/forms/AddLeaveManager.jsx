import React, { useState, useEffect } from 'react'
import { IconButton, Grid, TextField, MenuItem } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { get, post } from 'api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddLeaveManager = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    typeOfLeave: '',
    noOfLeaves: ''
  })
  const [error, setError] = useState({
    typeOfLeave: '',
    noOfLeaves: ''
  })
  const [leaveTypes, setLeaveTypes] = useState([])

  // Fetch leave types from the master API
  const fetchLeaveTypes = async () => {
    try {
      const response = await get('typeOfLeave')
      setLeaveTypes(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch leave types.')
    }
  }

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const handleCancel = () => {
    handleClose()
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  // Validation function
  const validations = () => {
    const newErrors = {
      typeOfLeave: inputData.typeOfLeave ? '' : 'Type of Leave is required',
      noOfLeaves: inputData.noOfLeaves
        ? isNaN(inputData.noOfLeaves)
          ? 'Number of Leaves must be a number'
          : ''
        : 'Number of Leaves is required'
    }

    setError(newErrors)

    // Return true if no errors
    return !Object.values(newErrors).some(err => err !== '')
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    // Perform validations
    if (!validations()) {
      toast.error('Please fix the errors before submitting.')
      return
    }

    // API Call
    try {
      const response = await post('leaveManager', { inputData })
      console.log(response)
      if (response.success === true) {
        setInputData({
          typeOfLeave: '',
          noOfLeaves: ''
        })
        handleClose()
        toast.success(response.message)
        getData()
      }

      if (response.success === false) {
        toast.error(response.message)
      }
    } catch (error) {
      if (error.response && error.response.data.msg) {
        toast.error(error.response.data.msg)
      } else {
        toast.error('Something went wrong, please try later!')
      }
    }
  }

  return (
    <div className='modal'>
      <h2 className='popupHead'>Add Leave Manage</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label='Type of Leave'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.typeOfLeave}
              name='typeOfLeave'
              error={error.typeOfLeave !== ''}
              helperText={error.typeOfLeave}
            >
              {leaveTypes.map(type => (
                <MenuItem key={type._id} value={type._id}>
                  {type.typeOfLeave}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type='number'
              fullWidth
              label='Number of Leaves'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.noOfLeaves}
              name='noOfLeaves'
              error={error.noOfLeaves !== ''}
              helperText={error.noOfLeaves}
            />
          </Grid>
          <Grid item xs={12}>
            <div className='btnGroup'>
              <IconButton type='submit' title='Save' className='btnSave'>
                <Save />
              </IconButton>
              <IconButton title='Cancel' onClick={handleCancel} className='btnCancel'>
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default AddLeaveManager

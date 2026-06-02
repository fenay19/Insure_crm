import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { put } from 'api/api'
import { toast } from 'react-toastify'

const EditTypeOfLeave = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    typeOfLeave: editData.typeOfLeave
  })
  const [error, setError] = useState({
    typeOfLeave: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.typeOfLeave === '') {
      setError(prev => ({ ...prev, typeOfLeave: 'Type of Leave is required' }))
      return
    }

    if (inputData.typeOfLeave !== '') {
      try {
        const response = await put(`typeOfLeave/${editData._id}`, { inputData })
        if (response.success === true) {
          setInputData({ typeofleave: '' })
          toast.success(response.message)
          handleClose()
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
  }

  return (
    <div className='modal'>
      <h2 className='popupHead'>Update Type of Leave</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Type of Leave'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.typeOfLeave}
              name='typeOfLeave'
              error={error.typeOfLeave !== ''}
              helperText={error.typeOfLeave}
            />
          </Grid>
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

export default EditTypeOfLeave

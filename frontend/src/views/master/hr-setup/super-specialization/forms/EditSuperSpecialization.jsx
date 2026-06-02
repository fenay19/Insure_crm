import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { put } from 'api/api'
import { toast } from 'react-toastify'

const EditSuperSpecialization = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    superSpecialization: editData.superSpecialization
  })
  const [error, setError] = useState({
    superSpecialization: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.superSpecialization === '') {
      setError(prev => ({ ...prev, superSpecialization: 'Super Specialization name is required' }))
      return
    }

    if (inputData.superSpecialization !== '') {
      try {
        const response = await put(`superSpecialization/${editData._id}`, { inputData })

        if (response.success === true) {
          setInputData({ superSpecialization: '' })
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
      <h2 className='popupHead'>Update Super Specialization</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Super Specialization'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.superSpecialization}
              name='superSpecialization'
              error={error.superSpecialization !== ''}
              helperText={error.superSpecialization}
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

export default EditSuperSpecialization

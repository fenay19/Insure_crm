import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post, put } from 'api/api'
import { toast } from 'react-toastify'

const EditSpecimen = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    specimen: editData.name
  })
  const [error, setError] = useState({
    specimen: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.specimen === '') {
      setError(prev => ({ ...prev, specimen: 'Specimen is required' }))
    }

    if (inputData.specimen !== '') {
      await put(`specimen-pathology-master/${editData._id}`, { name: inputData.specimen })
        .then(response => {
          toast.success(response.msg)
          setInputData({ specimen: '' })
          handleClose()
          getData()
        })
        .catch(error => {
          if (error.response?.data.msg) {
            toast.error(error.response.data.msg)
          } else {
            toast.error('Something went wrong, Please try later!!')
          }
        })
    }
  }

  return (
    <div className='modal'>
      <h2 className='popupHead'>Update Specimen</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Specimen'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.specimen}
              name='specimen'
              error={error.specimen !== ''}
              helperText={error.specimen}
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

export default EditSpecimen

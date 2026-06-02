import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post, put } from 'api/api'
import { toast } from 'react-toastify'

const EditUnit = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    unit: editData.name
  })
  const [error, setError] = useState({
    unit: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.unit === '') {
      setError(prev => ({ ...prev, unit: 'Unit is required' }))
    }

    if (inputData.unit !== '') {
      await put(`unit-pathology-master/${editData._id}`, { name: inputData.unit })
        .then(response => {
          setInputData({ unit: '' })
          toast.success(response.msg)
          handleClose()
          getData()
        })
        .catch(error => {
          if (error.response.data.msg !== undefined) {
            alert(error.response.data.msg)
          } else {
            alert('Something went wrong, Please try later!!')
          }
        })
    }
  }

  return (
    <div className='modal'>
      <h2 className='popupHead'>Update Unit</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Unit'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.unit}
              name='unit'
              error={error.unit !== '' ? true : false}
              helperText={error.unit}
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

export default EditUnit

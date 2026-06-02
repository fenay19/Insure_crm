import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post } from 'api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddUnit = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    unit: ''
  })
  const [error, setError] = useState({
    unit: ''
  })

  const handleCancel = () => {
    handleClose()
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => {
      return { ...prev, [name]: value }
    })
    setError(prev => {
      return { ...prev, [name]: '' }
    })
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.unit === '') {
      setError(prev => {
        return { ...prev, unit: 'Unit is required' }
      })
      toast.error('Unit is required')
      return
    }

    if (inputData.unit !== '') {
      try {
        await post('unit-pathology-master', { name: inputData.unit }).then(response => {
          setInputData({
            unit: ''
          })
          handleClose()
          toast.success(response.msg)
          getData()
        })
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
    <>
      <div className='modal'>
        <h2 className='popupHead'>Add Unit</h2>
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
                error={error.unit !== ''}
                helperText={error.unit}
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
    </>
  )
}

export default AddUnit

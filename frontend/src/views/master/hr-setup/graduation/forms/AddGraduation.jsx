import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post } from 'api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddGraduation = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    graduation: ''
  })
  const [error, setError] = useState({
    graduation: ''
  })

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

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.graduation === '') {
      setError(prev => ({
        ...prev,
        graduation: 'Graduation name is required'
      }))
      return
    }

    if (inputData.graduation !== '') {
      try {
        await post('graduation', { inputData }).then(response => {
          console.log(response)

          if (response.success === true) {
            setInputData({
              graduation: ''
            })
            toast.success(response.message)
            handleClose()
            getData()
          }

          if (response.success === false) {
            toast.error(response.message)
          }
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
        <h2 className='popupHead'>Add Graduation</h2>
        <form onSubmit={handleSubmitData}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Graduation'
                variant='outlined'
                onChange={handleInputChange}
                value={inputData.graduation}
                name='graduation'
                error={error.graduation !== ''}
                helperText={error.graduation}
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

export default AddGraduation

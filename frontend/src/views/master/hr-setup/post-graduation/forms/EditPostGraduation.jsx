import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { put } from 'api/api'
import { toast } from 'react-toastify'

const EditPostGraduation = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    postGraduation: editData.postGraduation
  })
  const [error, setError] = useState({
    postGraduation: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.postGraduation === '') {
      setError(prev => ({ ...prev, postGraduation: 'Post Graduation is required' }))
      return
    }

    if (inputData.postGraduation !== '') {
      try {
        const response = await put(`postGraduation/${editData._id}`, { inputData })
        console.log(response)
        if (response.success === true) {
          setInputData({ postGraduation: '' })
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
      <h2 className='popupHead'>Update Post Graduation</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Post Graduation'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.postGraduation}
              name='postGraduation'
              error={error.postGraduation !== ''}
              helperText={error.postGraduation}
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

export default EditPostGraduation

import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { post } from 'api/api'

const AddPostGraduation = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    postGraduation: ''
  })
  const [error, setError] = useState({
    postGraduation: ''
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

    if (inputData.postGraduation === '') {
      setError(prev => ({
        ...prev,
        postGraduation: 'Post Graduation name is required'
      }))
      return
    }

    if (inputData.postGraduation !== '') {
      try {
        const response = await post('postGraduation', { inputData })
        if (response.success === true) {
          setInputData({
            postGraduation: ''
          })
          toast.success(response.message)
          handleClose()
          getData()
        }
        if (response.success === false) {
          toast.error(response.message)
        }
      } catch (error) {
        toast.error('Something went wrong, please try later!')
      }
    }
  }

  return (
    <>
      <div className='modal'>
        <h2 className='popupHead'>Add Post Graduation</h2>
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

export default AddPostGraduation

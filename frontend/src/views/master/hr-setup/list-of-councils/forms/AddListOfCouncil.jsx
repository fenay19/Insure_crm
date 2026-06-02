import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post } from 'api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddListOfCouncil = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    council: ''
  })
  const [error, setError] = useState({
    council: ''
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

    if (inputData.council === '') {
      setError(prev => ({
        ...prev,
        council: 'Council name is required'
      }))

      return
    }

    if (inputData.council !== '') {
      try {
        const response = await post('listOfCouncils', { inputData })
        if (response.success === true) {
          setInputData({
            council: ''
          })
          handleClose()
          toast.success(response.message)
          getData()
        } else {
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
    <>
      <div className='modal'>
        <h2 className='popupHead'>Add Council</h2>
        <form onSubmit={handleSubmitData}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Council'
                variant='outlined'
                onChange={handleInputChange}
                value={inputData.council}
                name='council'
                error={error.council !== ''}
                helperText={error.council}
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

export default AddListOfCouncil

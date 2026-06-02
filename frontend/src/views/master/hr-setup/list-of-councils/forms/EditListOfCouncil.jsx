import React, { useState } from 'react'
import { IconButton, Grid, TextField } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { put } from 'api/api'
import { toast } from 'react-toastify'

const EditListOfCouncil = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    council: editData.council // Assuming `editData.name` contains the current council name
  })

  const [error, setError] = useState({
    council: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
    setError(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    if (inputData.council === '') {
      setError(prev => ({ ...prev, council: 'Council name is required' }))
      return
    }

    if (inputData.council !== '') {
      try {
        const response = await put(`listOfCouncils/${editData._id}`, { inputData })
        console.log(response)
        if (response.success === true) {
          setInputData({ council: '' })
          toast.success(response.message)
          handleClose()
          getData()
        }

      if(response.success === false){
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
      <h2 className='popupHead'>Update Council</h2>
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

export default EditListOfCouncil

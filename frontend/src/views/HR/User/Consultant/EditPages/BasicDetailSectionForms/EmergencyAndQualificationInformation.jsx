import React, { useEffect, useState } from 'react'
import { Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { get } from 'api/api'

function EmergencyAndQualificationInformation ({ basicDetails, errors, handleUpdate }) {
  const [diplomaData, setDiplomaData] = useState([])
  const [graduationData, setGraduationData] = useState([])
  const [postGraduationData, setPostGraduationData] = useState([])

  async function fetchDiploma () {
    const response = await get('diploma')
    setDiplomaData(response.data || [])
  }

  async function fetchGraduation () {
    const response = await get('graduation')
    setGraduationData(response.data)
  }

  async function fetchPostGraduation () {
    const response = await get('postGraduation')
    setPostGraduationData(response.data || [])
  }

  useEffect(() => {
    fetchDiploma()
    fetchGraduation()
    fetchPostGraduation()
  }, [])

  const handleMultiSelectChange = (event, fieldName) => {
    const { value } = event.target
    handleUpdate({
      target: {
        name: fieldName,
        value: typeof value === 'string' ? value.split(',') : value
      }
    })
  }


  return (
    <div>
      {/* Emergency Contact Information Section */}
      <Typography variant='h6' gutterBottom sx={{ marginTop: 4 }}>
        Emergency Contact Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Contact Person Name'
            name='emergencyContactPersonName'
            fullWidth
            value={basicDetails.emergencyContactPersonName}
            onChange={handleUpdate}
            error={!!errors.emergencyContactPersonName}
            helperText={errors.emergencyContactPersonName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Emergency Contact Number'
            name='emergencyContactPersonMobileNumber'
            fullWidth
            value={basicDetails.emergencyContactPersonMobileNumber}
            onChange={handleUpdate}
            error={!!errors.emergencyContactPersonMobileNumber}
            helperText={errors.emergencyContactPersonMobileNumber}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Emergency Address'
            name='emergencyAddress'
            fullWidth
            value={basicDetails.emergencyAddress}
            onChange={handleUpdate}
            error={!!errors.emergencyAddress}
            helperText={errors.emergencyAddress}
          />
        </Grid>
      </Grid>

      {/* Qualification Information Section */}
      {/* <Typography variant='h6' gutterBottom sx={{ marginTop: 4 }}>
        Qualification Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Minimum Qualification'
            name='minimumQualification'
            fullWidth
            value={basicDetails.minimumQualification}
            onChange={handleUpdate}
            error={!!errors.minimumQualification}
            helperText={errors.minimumQualification}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='diploma'>Diploma</InputLabel>
            <Select
              labelId='diploma'
              multiple
              name='diploma'
              value={basicDetails.diploma || []}
              onChange={e => handleMultiSelectChange(e, 'diploma')}
              renderValue={selected =>
                diplomaData
                  .filter(item => selected?.includes(item._id))
                  .map(item => item.diploma)
                  .join(', ')
              }
            >
              {diplomaData.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={basicDetails?.diploma?.includes(item._id)} />
                  <ListItemText primary={item.diploma} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='graduation'>Graduation</InputLabel>
            <Select
              labelId='graduation'
              multiple
              name='graduation'
              value={basicDetails.graduation || []}
              onChange={e => handleMultiSelectChange(e, 'graduation')}
              renderValue={selected =>
                graduationData
                  .filter(item => selected?.includes(item._id))
                  .map(item => item.graduation)
                  .join(', ')
              }
            >
              {graduationData.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={basicDetails?.graduation?.includes(item._id)} />
                  <ListItemText primary={item.graduation} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='postGraduation'>Post Graduation</InputLabel>
            <Select
              labelId='postGraduation'
              multiple
              name='postGraduation'
              value={basicDetails.postGraduation || []}
              onChange={e => handleMultiSelectChange(e, 'postGraduation')}
              renderValue={selected =>
                postGraduationData
                  .filter(item => selected.includes(item._id))
                  .map(item => item.postGraduation)
                  .join(', ')
              }
            >
              {postGraduationData.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={basicDetails?.postGraduation?.includes(item._id)} />
                  <ListItemText primary={item.postGraduation} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Other Qualifications'
            name='otherQualification'
            fullWidth
            value={basicDetails.otherQualification}
            onChange={handleUpdate}
            error={!!errors.otherQualification}
            helperText={errors.otherQualification}
          />
        </Grid>
      </Grid> */}


    </div>
  )
}

export default EmergencyAndQualificationInformation

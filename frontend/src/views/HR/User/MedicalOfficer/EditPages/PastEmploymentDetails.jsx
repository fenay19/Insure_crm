import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import { put } from 'api/api'
import { toast } from 'react-toastify'

function PastEmploymentDetails ({ setStoredAllData, setValue, storedAllData }) {
  const id = storedAllData._id
  const [pastEmploymentData, setPastEmploymentData] = useState([
    {
      organisationName: '',
      designation: '',
      empCode: '',
      joiningDate: '',
      relievingDate: '',
      inHandSalary: '',
      yearsOfExperience: '',
      note: ''
    }
  ])

  useEffect(() => {
    setPastEmploymentData(
      storedAllData.pastEmploymentDetails.length !== 0
        ? storedAllData.pastEmploymentDetails
        : [
            {
              organisationName: '',
              designation: '',
              empCode: '',
              joiningDate: '',
              relievingDate: '',
              inHandSalary: '',
              yearsOfExperience: '',
              note: ''
            }
          ]
    )
  }, [storedAllData.pastEmploymentDetails])

  const [errors, setErrors] = useState({})

  console.log(pastEmploymentData)

  const validateFields = data => {
    const validations = [
      { field: 'organisationName', message: 'Organisation name is required' },
      { field: 'designation', message: 'Designation is required' },
      { field: 'empCode', message: 'Employee code is required' },
      { field: 'joiningDate', message: 'Joining date is required' },
      { field: 'relievingDate', message: 'Relieving date is required' },
      { field: 'inHandSalary', message: 'In-hand salary is required' },
      { field: 'yearsOfExperience', message: 'Years of experience is required' }
    ]

    let allValid = true
    let newErrors = {}

    validations.forEach(({ field, message }) => {
      data.forEach((entry, index) => {
        if (!entry[field]) {
          newErrors[`${field}-${index}`] = message
          allValid = false
        }
      })
    })

    setErrors(newErrors)
    return allValid
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedData = [...pastEmploymentData]
    updatedData[index][name] = value
    setPastEmploymentData(updatedData)
    setErrors(prev => ({ ...prev, [`${name}-${index}`]: '' }))
  }

  const handleAddRow = () => {
    setPastEmploymentData(prev => [
      ...prev,
      {
        organisationName: '',
        designation: '',
        empCode: '',
        joiningDate: '',
        relievingDate: '',
        inHandSalary: '',
        yearsOfExperience: '',
        note: ''
      }
    ])
  }

  const handleRemoveRow = index => {
    const updatedData = pastEmploymentData.filter((_, i) => i !== index)
    setPastEmploymentData(updatedData)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      // if (validateFields(pastEmploymentData)) {
      if (true) {
        const response = await put(`medicalOfficer/pastEmploymentDetails/${id}`, { pastEmploymentData })
        console.log(response)

        if (response.success === true) {
          setStoredAllData(prev => ({
            ...prev,
            pastEmploymentDetails: response.data.pastEmploymentDetails
          }))
          toast.success(response.message || 'Data updated successfully.')
        } else {
          toast.error(response.message || 'Failed to update data.')
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'An error occurred on the server.')
      } else {
        toast.error('Something went wrong. Please try again later.')
      }
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: '100%', width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Past Employment Details'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TableContainer component={Paper} sx={{ border: '1px solid black' }}>
              <Table sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow sx={{ border: '1px solid black' }}>
                    <TableCell sx={{ border: '1px solid black' }}>Organisation Name</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Designation</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Employee Code</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Joining Date</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Relieving Date</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>In-Hand Salary</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Years of Experience</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Note</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pastEmploymentData.map((entry, index) => (
                    <TableRow key={index} sx={{ border: '1px solid black' }}>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='organisationName'
                          value={entry.organisationName}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`organisationName-${index}`]}
                          helperText={errors[`organisationName-${index}`]}
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='designation'
                          value={entry.designation}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`designation-${index}`]}
                          helperText={errors[`designation-${index}`]}
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='empCode'
                          value={entry.empCode}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`empCode-${index}`]}
                          helperText={errors[`empCode-${index}`]}
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='joiningDate'
                          type='date'
                          value={entry?.joiningDate?.slice(0, 10)}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`joiningDate-${index}`]}
                          helperText={errors[`joiningDate-${index}`]}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='relievingDate'
                          type='date'
                          value={entry?.relievingDate?.slice(0, 10)}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`relievingDate-${index}`]}
                          helperText={errors[`relievingDate-${index}`]}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='inHandSalary'
                          value={entry.inHandSalary}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`inHandSalary-${index}`]}
                          helperText={errors[`inHandSalary-${index}`]}
                          type='number'
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField
                          name='yearsOfExperience'
                          value={entry.yearsOfExperience}
                          onChange={e => handleChange(index, e)}
                          fullWidth
                          error={!!errors[`yearsOfExperience-${index}`]}
                          helperText={errors[`yearsOfExperience-${index}`]}
                          type='number'
                        />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <TextField name='note' value={entry.note} onChange={e => handleChange(index, e)} fullWidth multiline />
                      </TableCell>
                      <TableCell sx={{ border: '1px solid black' }}>
                        <Button onClick={() => handleRemoveRow(index)} color='secondary'>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button type='button' onClick={handleAddRow} variant='outlined'>
                Add Experience
              </Button>
              <Button type='submit' variant='contained' color='primary'>
                Save & Next
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PastEmploymentDetails

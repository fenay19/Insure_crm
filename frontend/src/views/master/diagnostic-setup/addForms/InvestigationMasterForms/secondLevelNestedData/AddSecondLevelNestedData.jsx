import React, { useEffect, useState } from 'react'
import { IconButton, Grid, TextField, MenuItem, Button } from '@mui/material'
import { Cancel, Height, Save } from '@mui/icons-material'
import { get, post, put } from 'api/api'
import { Delete, Add } from '@mui/icons-material'
import { toast } from 'react-toastify'

const AddSecondLevelNestedData = ({ handleClose, fetchData, investigationData }) => {

  function generateRandomEightDigitNumber () {
    return Math.floor(10000000 + Math.random() * 90000000)
  }

  
  const [inputData, setInputData] = useState({
    testName: '',
    testCode: generateRandomEightDigitNumber(),
    machine: '',
    machineId: '',
    formula: '',
    unit: '',
    unitId: '',
    testDetail: [
      {
        minTestRange: '',
        maxTestRange: '',
        gender: '',
        ageRange: ''
      }
    ]
  })

  const [machines, setAllMachine] = useState([])
  const [units, setAllUnits] = useState([])

  const fetchMastersData = async () => {
    try {
      const [machinesData, unitsData] = await Promise.all([get('machine-pathology-master'), get('unit-pathology-master')])
      setAllMachine(machinesData.data)
      setAllUnits(unitsData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
    }
  }

  useEffect(() => {
    fetchMastersData()
  }, [])

  const [error, setError] = useState({
    testName: '',
    machineId: '',
    unitId: '',
    testDetail: [
      {
        minTestRange: '',
        maxTestRange: '',
        gender: '',
        ageRange: ''
      }
    ]
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

  const handleUnitChange = e => {
    const selectedUnitId = e.target.value
    const selectedUnit = units.find(unit => unit._id === selectedUnitId)

    setInputData(prev => ({
      ...prev,
      unit: selectedUnit.name,
      unitId: selectedUnit._id
    }))

    setError(prev => ({
      ...prev,
      [e.target.name]: ''
    }))
  }

  const handleMachineChange = e => {
    const selectedMachineId = e.target.value
    const selectedMachine = machines.find(machine => machine._id === selectedMachineId)

    setInputData(prev => ({
      ...prev,
      machine: selectedMachine.machineName,
      machineId: selectedMachine._id
    }))

    setError(prev => ({
      ...prev,
      [e.target.name]: ''
    }))
  }

  const handleTestDetailChange = (index, field, value) => {
    const updatedTestDetails = [...inputData.testDetail]
    updatedTestDetails[index][field] = value
    setInputData(prev => ({
      ...prev,
      testDetail: updatedTestDetails
    }))
  }

  const addTestDetailRow = () => {
    setInputData(prev => ({
      ...prev,
      testDetail: [
        ...prev.testDetail,
        {
          minTestRange: '',
          maxTestRange: '',
          gender: '',
          ageRange: ''
        }
      ]
    }))
  }

  const removeTestDetailRow = index => {
    setInputData(prev => ({
      ...prev,
      testDetail: prev.testDetail.filter((_, i) => i !== index)
    }))
  }

  const validation = () => {
    const validationFields = [
      { field: 'testName', message: 'Test Name field is required' },
      { field: 'machineId', message: 'Machine Name field is required' },
      { field: 'unitId', message: 'Unit field is required' }
    ]

    let allValid = true

    validationFields.forEach(({ field, message }) => {
      if (!inputData[field]) {
        setError(prev => {
          return { ...prev, [field]: message }
        })
        allValid = false
      }
    })
    return allValid
  }

  const handleSubmitData = async e => {
    e.preventDefault()

    const isValid = validation()

    if (isValid) {
      const dataToSend = [
        ...investigationData.parameters,
        {
          testName: inputData.testName,
          testCode: inputData.testCode,
          machine: inputData.machine,
          machineId: inputData.machineId,
          formula: inputData.formula,
          unit: inputData.unit,
          unitId: inputData.unitId,
          testDetail: inputData.testDetail
        }
      ]

      await put(`investigation-pathology-master/${investigationData._id}`, { parameters: dataToSend })
        .then(response => {
          toast.success(`Test added under ${investigationData.testName}`)
          handleClose()
          fetchData()
          setInputData({
            testName: '',
            testCode: '',
            machine: '',
            machineId: '',
            formula: '',
            unit: '',
            unitId: '',
            testDetail: [
              {
                minTestRange: '',
                maxTestRange: '',
                gender: '',
                ageRange: ''
              }
            ]
          })
        })
        .catch(error => {
          if (error.response && error.response.data.msg) {
            console.log(error.response.data.msg)
          } else {
            console.log('Something went wrong, please try later!')
          }
        })
    }
  }

  return (
    <div>
      <h2 className='popupHead'>Add under {investigationData.testName}</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1} maxHeight={800}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Test Name'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.testName}
              name='testName'
              error={error.testName !== ''}
              helperText={error.testName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Test Code'
              variant='outlined'
              value={inputData.testCode}
              name='testCode'
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Machine'
              variant='outlined'
              onChange={e => handleMachineChange(e)}
              value={inputData.machineId}
              name='machineId'
              error={error.machineId !== ''}
              helperText={error.machineId}
            >
              {machines?.map((machine, index) => (
                <MenuItem key={index} value={machine._id}>
                  {machine.machineName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Unit'
              variant='outlined'
              onChange={e => handleUnitChange(e)}
              value={inputData.unitId}
              name='unitId'
              error={error.unitId !== ''}
              helperText={error.unitId}
            >
              {units?.map((unit, index) => (
                <MenuItem key={index} value={unit._id}>
                  {unit.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label='Formula' variant='outlined' onChange={handleInputChange} value={inputData.formula} name='formula' />
          </Grid>

          <>
            <Grid item xs={12}>
              <h5>Test Details</h5>
            </Grid>
            {inputData.testDetail.map((detail, index) => (
              <Grid container sx={{ marginLeft: '2px', marginTop: '2px' }} spacing={2} key={index}>
                <Grid item xs={3}>
                  <TextField
                    label='Min Test Range'
                    variant='outlined'
                    value={detail.minTestRange}
                    onChange={e => handleTestDetailChange(index, 'minTestRange', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label='Max Test Range'
                    variant='outlined'
                    value={detail.maxTestRange}
                    onChange={e => handleTestDetailChange(index, 'maxTestRange', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label='Gender'
                    variant='outlined'
                    value={detail.gender}
                    onChange={e => handleTestDetailChange(index, 'gender', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label='Age Range'
                    variant='outlined'
                    value={detail.ageRange}
                    onChange={e => handleTestDetailChange(index, 'ageRange', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => removeTestDetailRow(index)} disabled={inputData.testDetail.length === 1}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={addTestDetailRow}>
                Add Range
              </Button>
            </Grid>
          </>
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
  )
}

export default AddSecondLevelNestedData

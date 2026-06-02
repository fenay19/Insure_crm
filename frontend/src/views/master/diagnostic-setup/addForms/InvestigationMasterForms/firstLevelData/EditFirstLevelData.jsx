import React, { useState, useEffect } from 'react'
import { IconButton, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { post, get, put } from 'api/api'
import { FormHelperText } from '@mui/material'
import { Delete, Add } from '@mui/icons-material'
import Loader from 'component/Loader/Loader'
import { toast } from 'react-toastify'
const EditFirstLevelData = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    testName: editData.testName || '',
    testCode: editData.testCode || '',
    department: editData.department || '',
    departmentId: editData.departmentId || '',
    machineName: editData.machineName || '',
    machineId: editData.machineId || '',
    specimen: editData.specimen || '',
    specimenId: editData.specimenId,
    unit: editData.unit,
    unitId: editData.unitId,
    formula: editData.formula,
    testType: 'Numeric',
    testDetail: [...editData.testDetail],
    description: ''
  })

  const [error, setError] = useState({
    testName: '',
    testCode: '',
    departmentId: '',
    machineId: '',
    specimenId: '',
    unitId: '',
    formula: '',
    testType: ''
  })

  console.log(inputData)
  const [departments, setAllDepartments] = useState([])
  const [machines, setAllMachine] = useState([])
  const [specimens, setAllSpecimen] = useState([])
  const [units, setAllUnits] = useState([])
  const testTypes = ['Numeric', 'Descriptive']

  const fetchMastersData = async () => {
    try {
      const [departmentsData, machinesData, unitsData, specimensData] = await Promise.all([
        get('department-setup'),
        get('machine-pathology-master'),
        get('unit-pathology-master'),
        get('specimen-pathology-master')
      ])
      setAllDepartments(departmentsData.data)
      setAllMachine(machinesData.data)
      setAllSpecimen(specimensData.specimen)
      setAllUnits(unitsData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
    }
  }

  function generateRandomEightDigitNumber () {
    return Math.floor(10000000 + Math.random() * 90000000)
  }
  useEffect(() => {
    setInputData(prev => ({
      ...prev,
      testCode: generateRandomEightDigitNumber()
    }))
    fetchMastersData()
  }, [])

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

  const handleDepartmentChange = e => {
    const selectedDepartmentId = e.target.value
    const selectedDepartment = departments.find(department => department._id === selectedDepartmentId)

    setInputData(prev => ({
      ...prev,
      department: selectedDepartment.departmentName,
      departmentId: selectedDepartment._id
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
      machineName: selectedMachine.machineName,
      machineId: selectedMachine._id
    }))

    setError(prev => ({
      ...prev,
      [e.target.name]: ''
    }))
  }

  const handleSpecimenChange = e => {
    const selectedSpecimenId = e.target.value
    const selectedSpecimen = specimens.find(specimen => specimen._id === selectedSpecimenId)

    setInputData(prev => ({
      ...prev,
      specimen: selectedSpecimen.name,
      specimenId: selectedSpecimen._id
    }))

    setError(prev => ({
      ...prev,
      [e.target.name]: ''
    }))
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
      { field: 'testCode', message: 'Test Code field is required' },
      { field: 'departmentId', message: 'Department field is required' },
      { field: 'machineId', message: 'Machine Name field is required' },
      { field: 'specimenId', message: 'Specimen field is required' },
      { field: 'unitId', message: 'Unit field is required' },
      { field: 'formula', message: 'Formula field is required' },
      { field: 'testType', message: 'Test Type field is required' }
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

    const isDataValid = validation()

    if (isDataValid) {
      await put(`investigation-pathology-master/${editData._id}`, inputData)
        .then(response => {
          toast.success(response.msg)

          setInputData({
            testName: '',
            testCode: '',
            department: '',
            departmentId: '',
            machineName: '',
            machineId: '',
            specimen: '',
            specimenId: '',
            unit: '',
            unitId: '',
            formula: '',
            testType: 'Numeric',
            testDetail: [
              {
                minTestRange: '',
                maxTestRange: '',
                gender: '',
                ageRange: ''
              }
            ],
            description: {}
          })
          handleClose()
          getData()
        })
        .catch(error => {
          if (error.response && error.response.data.msg) {
            alert(error.response.data.msg)
          } else {
            alert('Something went wrong, please try later!')
          }
        })
    }
  }

  return (
    <div>
      <h2 className='popupHead'>Edit {editData.testName} Test</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          {/* Test Name */}
          <Grid item xs={12} sm={3}>
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

          {/* Test Code */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label='Test Code'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.testCode}
              name='testCode'
              error={error.testCode !== ''}
              helperText={error.testCode}
            />
          </Grid>

          {/* Department */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined' error={error.departmentId !== ''}>
              <InputLabel>Department</InputLabel>
              <Select label='Department' value={inputData.departmentId} onChange={handleDepartmentChange} name='departmentId'>
                {departments.map((department, index) => (
                  <MenuItem key={index} value={department._id}>
                    {department.departmentName}
                  </MenuItem>
                ))}
              </Select>
              {error.departmentId && <FormHelperText>{error.departmentId}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Machine Name */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined' error={error.machineId !== ''}>
              <InputLabel>Machine</InputLabel>
              <Select label='Machine' value={inputData.machineId} onChange={handleMachineChange} name='machineId'>
                {machines.map((machine, index) => (
                  <MenuItem key={index} value={machine._id}>
                    {machine.machineName}
                  </MenuItem>
                ))}
              </Select>
              {error.machineId && <FormHelperText>{error.machineId}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Specimen */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined' error={error.specimenId !== ''}>
              <InputLabel>Specimen</InputLabel>
              <Select label='Specimen' value={inputData.specimenId} onChange={handleSpecimenChange} name='specimenId'>
                {specimens.map((specimen, index) => (
                  <MenuItem key={index} value={specimen._id}>
                    {specimen.name}
                  </MenuItem>
                ))}
              </Select>
              {error.specimenId && <FormHelperText>{error.specimenId}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined' error={error.unitId !== ''}>
              <InputLabel>Unit</InputLabel>
              <Select label='Unit' value={inputData.unitId} onChange={handleUnitChange} name='unitId'>
                {units.map((unit, index) => (
                  <MenuItem key={index} value={unit._id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
              {error.unitId && <FormHelperText>{error.unitId}</FormHelperText>} {/* Display error if there's an issue */}
            </FormControl>
          </Grid>

          {/* Formula */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label='Formula'
              variant='outlined'
              onChange={handleInputChange}
              value={inputData.formula}
              name='formula'
              error={error.formula !== ''}
              helperText={error.formula}
            />
          </Grid>

          {/* Test Type */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined' error={error.testType !== ''}>
              <InputLabel>Test Type</InputLabel>
              <Select label='Test Type' value={inputData.testType} onChange={handleInputChange} name='testType'>
                {testTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {error.testType && <FormHelperText>{error.testType}</FormHelperText>}
            </FormControl>
          </Grid>

          {inputData.testType === 'Numeric' && (
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
          )}

          {inputData.testType === 'Descriptive' && (
            <Grid item xs={12}>
              <TextField
                label='Description'
                variant='outlined'
                value={inputData.description}
                onChange={handleInputChange}
                name='description'
                fullWidth
              />
            </Grid>
          )}

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

export default EditFirstLevelData

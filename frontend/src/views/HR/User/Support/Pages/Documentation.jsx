import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  FormHelperText,
  TextField,
  Switch,
  Modal
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import REACT_APP_API_URL from 'api/api'
import { initialState } from 'store/customizationReducer'

function Documentation ({ setValue, setStoredAllData, storedAllData }) {
  const initialFilesState = {
    offerLetter: null,
    confirmationLetter: null,
    appointmentLetter: null,
    employeeJoiningLetter: null,
    employeeApplicationForm: null,
    resume: null,
    employeeBackgroundVerificationForm: null,
    selfDeclarationForm: null,
    healthCheckupReport: null,
    jdJsForm: null,
    promotionLetter: null,
    degreeCertificate: null,
    counsellingRegistration: null,
    trainingCertificate: null,
    additionalCertificate: null,
    grievanceForm: null,
    panCard: null,
    adharCard: null,
    otherIdProof: null,
    resignationLetter: null,
    clearanceForm: null,
    experienceCertificate: null,
    passport: null
  }

  const [files, setFiles] = useState(initialFilesState)
  const [errors, setErrors] = useState({})
  const [toggleState, setToggleState] = useState({})
  const [customFields, setCustomFields] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [newDocumentName, setNewDocumentName] = useState('')

  useEffect(() => {
    const documentation = Object.keys(storedAllData.documentation).length > 0 ? storedAllData.documentation : initialFilesState
    setFiles(documentation)

    const updatedToggleState = Object.keys(initialFilesState).reduce((state, key) => {
      state[key] = !!documentation[key]
      return state
    }, {})

    setToggleState(updatedToggleState)
  }, [])

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]

    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, [fieldName]: 'Only PDF files are allowed' }))
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 2MB' }))
        return
      }

      setErrors(prev => ({ ...prev, [fieldName]: '' }))
      setFiles(prev => ({ ...prev, [fieldName]: file }))
    }
  }

  const handleToggleChange = (e, fieldName) => {
    const checked = e.target.checked
    setToggleState(prev => ({ ...prev, [fieldName]: checked }))
    if (!checked) {
      setFiles(prev => ({ ...prev, [fieldName]: null }))
    }
  }

  const handleAddCustomField = () => {
    if (!newDocumentName.trim()) {
      alert('Document name cannot be empty.')
      return
    }

    const formattedName = newDocumentName.replace(/\s+/g, '').toLowerCase()
    if (files[formattedName]) {
      alert('Document name already exists.')
      return
    }

    setFiles(prev => ({ ...prev, [formattedName]: null }))
    setCustomFields(prev => [...prev, formattedName])
    setNewDocumentName('')
    setModalOpen(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (storedAllData?.submittedFormId) {
      try {
        const formData = new FormData()

        const documentationFields = Object.keys(files) || []

        documentationFields.forEach(field => {
          const isFile = files[field]

          if (isFile instanceof File) {
            formData.append(field, isFile)
          }
        })

        const updateDocuments = await fetch(`${REACT_APP_API_URL}support/documents/${storedAllData?.submittedFormId}`, {
          method: 'PUT',
          body: formData
        })

        const response = await updateDocuments.json()

        if (response.success === true) {
          setStoredAllData(prev => ({ ...prev, documentation: files }))
          toast.success(response.message)
          setValue(prev => prev + 1)
        }

        if (response.success === false) {
          toast.error(response.message)
        }
      } catch (error) {
        console.error('Error appending files to FormData:', error)
      }
    } else {
      toast.error('Please submit the Basic details first')
      setValue(0)
    }
  }

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8'
      }}
    >
      <Card
        sx={{
          maxWidth: '100%',
          width: '100%',
          boxShadow: 6,
          borderRadius: 4,
          backgroundColor: '#ffffff'
        }}
      >
        <CardHeader
          title='Upload Documentation'
          titleTypographyProps={{
            variant: 'h5',
            align: 'center',
            sx: { color: '#344767', fontWeight: 'bold' }
          }}
          sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label='documentation table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      Sr.No
                    </TableCell>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      Documents
                    </TableCell>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      Upload?
                    </TableCell>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      Select File
                    </TableCell>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      View File
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(files).map((fieldName, index) => (
                    <TableRow key={fieldName}>
                      <TableCell sx={{ textAlign: 'left' }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        <Switch
                          checked={toggleState[fieldName] || false}
                          onChange={e => handleToggleChange(e, fieldName)}
                          name={fieldName}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {toggleState[fieldName] && (
                          <FormControl fullWidth>
                            <input
                              type='file'
                              accept='.pdf'
                              onChange={e => handleFileChange(e, fieldName)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '160px'
                              }}
                            />
                            {errors[fieldName] && (
                              <FormHelperText error sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#d32f2f' }}>
                                {errors[fieldName]}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {files[fieldName] && toggleState[fieldName] ? (
                          <Button
                            variant='outlined'
                            color='primary'
                            sx={{ textTransform: 'none' }}
                            onClick={() => window.open(URL.createObjectURL(files[fieldName]), '_blank')}
                          >
                            View File
                          </Button>
                        ) : (
                          <span>Unable to view</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setModalOpen(true)}
                disabled={Object.keys(storedAllData?.documentation).length > 0}
                sx={{
                  marginRight: 2,
                  padding: '10px 30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1e88e5'
                  }
                }}
              >
                Add Other Documents
              </Button>

              <Button
                type='submit'
                variant='contained'
                color='secondary'
                disabled={Object.keys(storedAllData?.documentation).length > 0}
                sx={{
                  padding: '10px 30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#43a047'
                  }
                }}
              >
                Submit Documents
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {/* Modal for Adding Custom Document */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <TextField
            fullWidth
            variant='outlined'
            label='Enter Document Name'
            value={newDocumentName}
            onChange={e => setNewDocumentName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleAddCustomField}
            disabled={Object.keys(storedAllData?.documentation).length > 0}
          >
            Add Document
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default Documentation

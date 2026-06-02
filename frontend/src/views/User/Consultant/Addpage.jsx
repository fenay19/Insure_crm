import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid, Modal, Button } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link, useNavigate } from 'react-router-dom'

import BasicDetails from '../Consultant/Pages/BasicDetails'
import AddressDetails from '../Consultant/Pages/AddressDetails'
import PastEmploymentDetails from '../Consultant/Pages/PastEmploymentDetails'
import BankDetails from '../Consultant/Pages/BankDetails'
import EmployementDetails from '../Consultant/Pages/EmploymentDetails'
import Documentation from '../Consultant/Pages/Documentation'
import REACT_APP_API_URL, { retrieveToken } from 'api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddPage = () => {
  const [value, setValue] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    if (isFormVisible[getTabKey(newValue)]) {
      setValue(newValue)
    } else {
      alert('Please complete the current section before proceeding.')
    }
  }

  const [formData, setFormData] = useState({
    basicDetails: {},
    addressDetails: {},
    pastEmploymentDetails: {},
    bankDetails: {},
    employmentDetails: {},
    documentation: {}
  })

  const [isFormVisible, setIsFormVisible] = useState({
    basicDetails: true,
    addressDetails: false,
    pastEmploymentDetails: false,
    bankDetails: false,
    employmentDetails: false,
    documentation: false
  })

  const [isAllFormsValidate, setIsAllFormsValidate] = useState(false)

  const getTabKey = tabIndex => {
    switch (tabIndex) {
      case 0:
        return 'basicDetails'
      case 1:
        return 'addressDetails'
      case 2:
        return 'pastEmploymentDetails'
      case 3:
        return 'bankDetails'
      case 4:
        return 'employmentDetails'
      case 5:
        return 'documentation'
      default:
        return ''
    }
  }

  console.log(formData)

  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <BasicDetails setFormData={setFormData} setIsFormVisible={setIsFormVisible} setValue={setValue} formData={formData} />
      case 1:
        return <AddressDetails setFormData={setFormData} setIsFormVisible={setIsFormVisible} setValue={setValue} formData={formData} />
      case 2:
        return (
          <PastEmploymentDetails setFormData={setFormData} setIsFormVisible={setIsFormVisible} setValue={setValue} formData={formData} />
        )
      case 3:
        return <BankDetails setFormData={setFormData} setIsFormVisible={setIsFormVisible} setValue={setValue} formData={formData} />
      case 4:
        return <EmployementDetails setFormData={setFormData} setIsFormVisible={setIsFormVisible} setValue={setValue} formData={formData} />
      case 5:
        return (
          <Documentation
            setFormData={setFormData}
            setIsFormVisible={setIsFormVisible}
            setValue={setValue}
            formData={formData}
            setIsAllFormsValidate={setIsAllFormsValidate}
          />
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (isAllFormsValidate) {
      setIsModalOpen(true) // Open modal when all forms are validated
    }
  }, [isAllFormsValidate])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const normalData = {
      basicDetails: formData.basicDetails,
      addressDetails: formData.addressDetails,
      pastEmploymentDetails: formData.pastEmploymentDetails,
      bankDetails: formData.bankDetails,
      employmentDetails: formData.employmentDetails
    }

    const administrativeData = new FormData()
    administrativeData.append('data', JSON.stringify(normalData))

    administrativeData.append(
      'profilePhoto',
      formData.basicDetails.profilePhoto instanceof File ? formData.basicDetails.profilePhoto : null
    )
    administrativeData.append('cancelCheck', formData.bankDetails.cancelCheck instanceof File ? formData.bankDetails.cancelCheck : null)

    const documentationFields = Object.keys(formData.documentation)

    documentationFields.forEach(field => {
      const file = formData.documentation[field]
      if (file instanceof File) {
        administrativeData.append(field, file)
      }
    })

    try {
      const token = retrieveToken()
      const response = await fetch(`${REACT_APP_API_URL}newConsultant`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: administrativeData
      })

      const data = await response.json()
      console.log('Response Data:', data)

      if (data.status === 201 && data.data) {
        toast.success(data.msg)
        setIsModalOpen(false)
        setIsAllFormsValidate(false)

        setTimeout(() => {
          navigate('/users/consultant')
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Network Error: Please check your connection and try again.')
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Add Consultant
        </Typography>
      </Breadcrumb>

      {/* Tabs for Master Selection */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons='auto'
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Tab label='Basic Details' disabled={!isFormVisible.basicDetails} />
          <Tab label='Address Details' disabled={!isFormVisible.addressDetails} />
          <Tab label='Past Employment Details' disabled={!isFormVisible.pastEmploymentDetails} />
          <Tab label='Bank Details' disabled={!isFormVisible.bankDetails} />
          <Tab label='Employment Details' disabled={!isFormVisible.employmentDetails} />
          <Tab label='Documentation' disabled={!isFormVisible.documentation} />
        </Tabs>

        <Divider />
      </Box>

      {/* Render the selected master content */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {renderMasterContent()}
          </Grid>
        </Grid>
      </Box>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleModalClose} aria-labelledby='form-submission-modal'>
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
          <Typography variant='h6' id='form-submission-modal'>
            Confirm Submission
          </Typography>
          <Typography sx={{ mt: 2 }}>Are you sure you want to submit the administrative data?</Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant='outlined' onClick={handleModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default AddPage

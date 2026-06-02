import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardHeader, Button } from '@mui/material'
import PersonalInformation from '../EditPages/BasicDetailSectionForms/PersonalInformation'
import ContactAndAddressInformation from '../EditPages/BasicDetailSectionForms/ContactAndAddressInformation'
import EmergencyAndQualificationInformation from '../EditPages/BasicDetailSectionForms/EmergencyAndQualificationInformation'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import REACT_APP_API_URL from 'api/api'

const BasicDetails = ({ setValue, storedAllData, setStoredAllData }) => {
  const id = storedAllData._id
  const [basicDetails, setBasicDetails] = useState({
    empCode: '',
    prefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    dateOfAnniversary: '',
    adharNumber: '',
    passPortNumber: '',

    contactNumber: '',
    alternateContactNumber: '',
    email: '',
    alternateEmail: '',

    residentialAddress: '',
    residentialPincode: '',
    residentialCity: '',
    residentialDistrict: '',
    residentialState: '',
    permanentAddress: '',
    permanentPincode: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentState: '',
    isPermanentSame: false,

    emergencyContactPersonName: '',
    emergencyContactPersonMobileNumber: '',
    emergencyAddress: '',

    // minimumQualification: '',
    // diploma: [],
    // graduation: [],
    // postGraduation: [],
    // otherQualification: '',

    profilePhoto: null
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    setBasicDetails(storedAllData.basicDetails || {})
  }, [storedAllData.basicDetails])

  const handleUpdate = e => {
    const { name, value } = e.target
    setBasicDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Basic Details Form Validation Function
  const BasicDetailsFormValidation = () => {
    const validations = [
      { field: 'empCode', message: 'Employee code is required.' },
      { field: 'firstName', message: 'First name is required.' },
      // { field: 'middleName', message: 'Middle name is required.' },
      { field: 'lastName', message: 'Last name is required.' },
      { field: 'contactNumber', message: 'Contact number is required.' },
      { field: 'email', message: 'Email is required.' }
    ]

    let allValid = true
    const newErrors = {}

    // Validate regular fields
    validations.forEach(({ field, message }) => {
      if (!basicDetails[field]) {
        newErrors[field] = message
        allValid = false
      }
    })

    // Validate contactNumber and alternateContactNumber length
    if (basicDetails.contactNumber) {
      if (basicDetails.contactNumber.length !== 10) {
        newErrors.contactNumber = 'Contact number must be exactly 10 digits.'
        allValid = false
      }
    }

    if (basicDetails.alternateContactNumber) {
      if (basicDetails.alternateContactNumber.length !== 10) {
        newErrors.alternateContactNumber = 'Alternate contact number must be exactly 10 digits.'
        allValid = false
      }
    }

    // Validate email format using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (basicDetails.email && !emailRegex.test(basicDetails.email)) {
      newErrors.email = 'Please enter a valid email address.'
      allValid = false
    }

    // Validate alternateEmail format using regex
    if (basicDetails.alternateEmail && !emailRegex.test(basicDetails.alternateEmail)) {
      newErrors.alternateEmail = 'Please enter a valid alternate email address.'
      allValid = false
    }

    // Validate profile photo size
    if (basicDetails.profilePhoto) {
      const maxFileSize = 2 * 1024 * 1024 // 2 MB
      if (basicDetails.profilePhoto.size > maxFileSize) {
        newErrors.profilePhoto = 'Image size must be less than 2 MB.'
        allValid = false
      }
    }

    setErrors(newErrors)
    return allValid
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const isValid = BasicDetailsFormValidation()

    if (isValid) {
      const payLoad = { ...basicDetails }

      const formData = new FormData()

      for (const [key, value] of Object.entries(payLoad)) {
        if (value) {
          formData.append(key, value)
        }
      }

      const submitBasicDetails = await fetch(`${REACT_APP_API_URL}medicalOfficer/basicDetails/${id}`, {
        method: 'PUT',
        body: formData
      })

      const response = await submitBasicDetails.json()
      console.log(response)

      if (response.success === true) {
        setStoredAllData(prev => ({ ...prev, basicDetails: response.data.basicDetails, submittedFormId: response.data._id }))
        toast.success(response.message)
        // setValue(prev => prev + 1)
      }

      if (response.success === false) {
        toast.error(response.message)
      }
    } else {
      toast.error('Please fill out all required fields.')
    }
  }

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: '100%', width: '100%', boxShadow: 3 }}>
        <CardHeader
          title='Basic Details Form'
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <PersonalInformation
              basicDetails={basicDetails}
              setBasicDetails={setBasicDetails}
              errors={errors}
              setErrors={setErrors}
              handleUpdate={handleUpdate}
            />

            <ContactAndAddressInformation
              basicDetails={basicDetails}
              setBasicDetails={setBasicDetails}
              errors={errors}
              setErrors={setErrors}
              handleUpdate={handleUpdate}
            />

            <EmergencyAndQualificationInformation
              basicDetails={basicDetails}
              setBasicDetails={setBasicDetails}
              errors={errors}
              setErrors={setErrors}
              handleUpdate={handleUpdate}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
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

export default BasicDetails

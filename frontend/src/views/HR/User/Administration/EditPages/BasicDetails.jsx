import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Button } from '@mui/material';
import PersonalInformation from '../EditPages/BasicDetailSectionForms/PersonalInformation';
import ContactAndAddressInformation from '../EditPages/BasicDetailSectionForms/ContactAndAddressInformation';
import EmergencyAndQualificationInformation from '../EditPages/BasicDetailSectionForms/EmergencyAndQualificationInformation';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
// import REACT_APP_API_URL from 'api/api'
import { get, post, put, remove } from '../../../../../api/api.js';

// Utility to sanitize bank fields
function cleanBankField(field) {
  if (Array.isArray(field)) field = field[0];
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (typeof parsed === 'string') return parsed;
      if (Array.isArray(parsed)) return parsed[0] || '';
    } catch (e) {}
    return field;
  }
  return field || '';
}

const BasicDetails = ({ setValue, storedAllData, setStoredAllData }) => {
  const id = storedAllData._id;
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
    panNo: '',
    isMarried: false,
    spouseName: '',
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

    emergencyContacts: [
      {
        emergencyContactPersonName: '',
        emergencyContactPersonMobileNumber: '',
        emergencyAddress: ''
      }
    ],

    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panCardNo: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (storedAllData.basicDetails) {
      setBasicDetails((prev) => ({
        ...prev,
        ...storedAllData.basicDetails,
        bankAccountNumber: cleanBankField(storedAllData.basicDetails.bankAccountNumber),
        bankName: cleanBankField(storedAllData.basicDetails.bankName),
        branchName: cleanBankField(storedAllData.basicDetails.branchName)
      }));
    }
  }, [storedAllData.basicDetails]);

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setBasicDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Basic Details Form Validation Function
  const BasicDetailsFormValidation = () => {
    const validations = [
      { field: 'empCode', message: 'Employee code is required.' },
      { field: 'firstName', message: 'First name is required.' },
      { field: 'lastName', message: 'Last name is required.' },
      { field: 'contactNumber', message: 'Contact number is required.' },
      { field: 'email', message: 'Email is required.' }
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    const maxFileSize = 2 * 1024 * 1024; // 2 MB

    let allValid = true;
    const newErrors = {};

    // Validate required fields
    validations.forEach(({ field, message }) => {
      if (!basicDetails[field]) {
        newErrors[field] = message;
        allValid = false;
      }
    });

    // Validate email format
    if (basicDetails.email && !emailRegex.test(basicDetails.email)) {
      newErrors.email = 'Please enter a valid email address.';
      allValid = false;
    }

    if (basicDetails.alternateEmail && !emailRegex.test(basicDetails.alternateEmail)) {
      newErrors.alternateEmail = 'Please enter a valid email address.';
      allValid = false;
    }

    // Validate contact number length (must be exactly 10 digits)
    if (basicDetails.contactNumber && basicDetails.contactNumber.length !== 10) {
      newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
      allValid = false;
    }

    if (basicDetails.alternateContactNumber && basicDetails.alternateContactNumber.length !== 10) {
      newErrors.alternateContactNumber = 'Alternate contact number must be exactly 10 digits.';
      allValid = false;
    }

    // Validate profile photo size
    if (basicDetails.profilePhoto) {
      if (basicDetails.profilePhoto.size > maxFileSize) {
        newErrors.profilePhoto = 'Image size must be less than 2 MB.';
        allValid = false;
      }
    }

    setErrors(newErrors);
    return allValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = BasicDetailsFormValidation();

    if (isValid) {
      const payLoad = { ...basicDetails };

      const formData = new FormData();

      // for (const [key, value] of Object.entries(payLoad)) {
      //   if (value !== undefined && value !== null) {
      //     if (
      //       (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File)))
      //       && key !== "profilePhoto"
      //     ) {
      //       formData.append(key, JSON.stringify(value));
      //     } else {
      //       formData.append(key, value);
      //     }
      //   }
      // }

      for (const [key, value] of Object.entries(payLoad)) {
        if (value !== undefined && value !== null && value !== '') {
          if ((Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) && key !== 'profilePhoto') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      }

      const submitBasicDetails = await put(`administrative/basicDetails/${id}`, formData);

      // const response = await submitBasicDetails.json()
      // if (response.success === true) {
      //   setStoredAllData(prev => ({
      //     ...prev,
      //     basicDetails: response.data.basicDetails,
      //     submittedFormId: response.data._id
      //   }))
      //   toast.success(response.message)
      //   setValue && setValue((prev) => prev + 1)
      // }

      // if (response.success === false) {
      //   toast.error(response.message)
      // }
      if (submitBasicDetails.success === true) {
        setStoredAllData((prev) => ({
          ...prev,
          basicDetails: submitBasicDetails.data.basicDetails,
          submittedFormId: submitBasicDetails.data._id
        }));
        toast.success(submitBasicDetails.message);
        setValue && setValue((prev) => prev + 1);
      }

      if (submitBasicDetails.success === false) {
        toast.error(submitBasicDetails.message);
      }
    } else {
      toast.error('Please fill out all required fields.');
    }
  };

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: '100%', width: '100%', boxShadow: 3 }}>
        <CardHeader
          title="Basic Details Form"
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
              <Button type="submit" variant="contained" color="primary">
                Save & Next
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BasicDetails;

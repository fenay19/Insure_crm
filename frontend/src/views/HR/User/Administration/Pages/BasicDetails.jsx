// import React, { useEffect, useState } from 'react'
// import { Box, Card, CardContent, CardHeader, Button } from '@mui/material'
// import PersonalInformation from './BasicDetailSectionForms/PersonalInformation'
// import ContactAndAddressInformation from './BasicDetailSectionForms/ContactAndAddressInformation'
// import EmergencyAndQualificationInformation from './BasicDetailSectionForms/EmergencyAndQualificationInformation'
// import 'react-toastify/dist/ReactToastify.css'
// import { toast } from 'react-toastify'
// import REACT_APP_API_URL, { get } from 'api/api'
// import BankDetails from 'views/master/BankDetails/BankDetails'

// const BasicDetails = ({ setValue, storedAllData, setStoredAllData }) => {
//   const [basicDetails, setBasicDetails] = useState({
//     empCode: '',
//     prefix: '',
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     gender: '',
//     dateOfBirth: '',
//     adharNumber: '',
//     panNo: '',
//     isMarried: false,
//     spouseName: '',
//     dateOfAnniversary: '',

//     contactNumber: '',
//     alternateContactNumber: '',
//     email: '',
//     alternateEmail: '',

//     residentialAddress: '',
//     residentialPincode: '',
//     residentialCity: '',
//     residentialDistrict: '',
//     residentialState: '',
//     permanentAddress: '',
//     permanentPincode: '',
//     permanentCity: '',
//     permanentDistrict: '',
//     permanentState: '',
//     isPermanentSame: false,

//     emergencyContactPersonName: '',
//     emergencyContactPersonMobileNumber: '',
//     emergencyAddress: '',

//     minimumQualification: '',
//     diploma: [],
//     graduation: [],
//     postGraduation: [],
//     otherQualification: '',

//     profilePhoto: null
//   })
//   const [errors, setErrors] = useState({})

//   const [latestEmployeeCode, setLatestEmployeeCode] = useState('')

//   // async function fetchLatestEmployeeCode () {
//   //   const response = await get('administrative/administrativeData/getEmployeeCode')
//   //   setLatestEmployeeCode(response.success === true ? response.empCode :  '')
//   // }

//   //todo: generated code
//    useEffect(() => {
//     async function fetchEmpCode() {
//       const response = await get('administrative/generate-employee-code')
//       if (response.success && response.empCode) {
//         setBasicDetails(prev => ({ ...prev, empCode: response.empCode }))
//       }
//     }
//     if (!storedAllData?.submittedFormId) {
//       fetchEmpCode()
//     } else if (storedAllData?.basicDetails?.empCode) {
//       setBasicDetails(prev => ({ ...prev, empCode: storedAllData.basicDetails.empCode }))
//     }
//   }, [storedAllData?.submittedFormId, storedAllData?.basicDetails?.empCode])

//   useEffect(() => {

//     if(storedAllData.submittedFormId){
//       setBasicDetails(prev => ({...prev, empCode : storedAllData.basicDetails.empCode}))
//     }
//     else{
//       setBasicDetails(prev => ({...prev, empCode : latestEmployeeCode}))
//     }

//   },[latestEmployeeCode, storedAllData.submittedFormId, storedAllData.basicDetails.empCode])

//   // useEffect(() => {
//   //   fetchLatestEmployeeCode()
//   // }, [])

//   useEffect(() => {
//     setBasicDetails(storedAllData.basicDetails || {})
//   }, [storedAllData.basicDetails])

//   const handleUpdate = e => {
//     const { name, value } = e.target
//     setBasicDetails(prev => ({ ...prev, [name]: value }))
//     setErrors(prev => ({ ...prev, [name]: '' }))
//   }

//   // Basic Details Form Validation Function
//   const BasicDetailsFormValidation = () => {
//     const validations = [
//       { field: 'empCode', message: 'Employee code is required.' },
//       { field: 'firstName', message: 'First name is required.' },
//       // { field: 'middleName', message: 'Middle name is required.' },
//       { field: 'lastName', message: 'Last name is required.' },
//       { field: 'contactNumber', message: 'Contact number is required.' },
//       { field: 'email', message: 'Email is required.' }
//     ]

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation regex
//     const maxFileSize = 2 * 1024 * 1024 // 2 MB

//     let allValid = true
//     const newErrors = {}

//     // Validate required fields
//     validations.forEach(({ field, message }) => {
//       if (!basicDetails[field]) {
//         newErrors[field] = message
//         allValid = false
//       }
//     })

//     // Validate email format
//     if (basicDetails.email && !emailRegex.test(basicDetails.email)) {
//       newErrors.email = 'Please enter a valid email address.'
//       allValid = false
//     }

//     if (basicDetails.alternateEmail && !emailRegex.test(basicDetails.alternateEmail)) {
//       newErrors.alternateEmail = 'Please enter a valid email address.'
//       allValid = false
//     }

//     // Validate contact number length (must be exactly 10 digits)
//     if (basicDetails.contactNumber && basicDetails.contactNumber.length !== 10) {
//       newErrors.contactNumber = 'Contact number must be exactly 10 digits.'
//       allValid = false
//     }

//     if (basicDetails.alternateContactNumber && basicDetails.alternateContactNumber.length !== 10) {
//       newErrors.alternateContactNumber = 'Alternate contact number must be exactly 10 digits.'
//       allValid = false
//     }

//     // Validate profile photo size
//     if (basicDetails.profilePhoto) {
//       if (basicDetails.profilePhoto.size > maxFileSize) {
//         newErrors.profilePhoto = 'Image size must be less than 2 MB.'
//         allValid = false
//       }
//     }

//     setErrors(newErrors)
//     return allValid
//   }

//   const handleSubmit = async event => {
//     event.preventDefault()

//     const isValid = BasicDetailsFormValidation()

//     if (isValid) {
//       const payLoad = { ...basicDetails }

//       const formData = new FormData()

//       for (const [key, value] of Object.entries(payLoad)) {
//         if (value) {
//           formData.append(key, value)
//         }
//       }

//       const submitBasicDetails = await fetch(`${REACT_APP_API_URL}administrative/basicDetails`, {
//         method: 'POST',
//         body: formData
//       })

//       const response = await submitBasicDetails.json()
//       console.log(response)

//       if (response.success === true) {
//         setStoredAllData(prev => ({ ...prev, basicDetails: response.data.basicDetails, submittedFormId: response.data._id }))
//         toast.success(response.message)
//         setValue(prev => prev + 1)
//       }

//       if (response.success === false) {
//         toast.error(response.message)
//       }
//     } else {
//       toast.error('Please fill out all required fields.')
//     }
//   }

//   return (
//     <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
//       <Card sx={{ maxWidth: '100%', width: '100%', boxShadow: 3 }}>
//         <CardHeader
//           title='Basic Details Form'
//           titleTypographyProps={{ variant: 'h5', align: 'center' }}
//           sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
//         />
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <PersonalInformation
//               basicDetails={basicDetails}
//               setBasicDetails={setBasicDetails}
//               errors={errors}
//               setErrors={setErrors}
//               handleUpdate={handleUpdate}
//             />

//             <ContactAndAddressInformation
//               basicDetails={basicDetails}
//               setBasicDetails={setBasicDetails}
//               errors={errors}
//               setErrors={setErrors}
//               handleUpdate={handleUpdate}
//             />

//             <EmergencyAndQualificationInformation
//               basicDetails={basicDetails}
//               setBasicDetails={setBasicDetails}
//               errors={errors}
//               setErrors={setErrors}
//               handleUpdate={handleUpdate}
//             />

//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
//               <Button type='submit' variant='contained' color='primary' disabled={storedAllData.basicDetails._id}>
//                 Save & Next
//               </Button>
//             </Box>
//           </form>
//         </CardContent>
//       </Card>
//     </Box>
//   )
// }

// export default BasicDetails

//! new code

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Button } from '@mui/material';
import PersonalInformation from './BasicDetailSectionForms/PersonalInformation';
import ContactAndAddressInformation from './BasicDetailSectionForms/ContactAndAddressInformation';
import EmergencyAndQualificationInformation from './BasicDetailSectionForms/EmergencyAndQualificationInformation';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import REACT_APP_API_URL, { get, post } from '../../../../../api/api.js';
import BankDetails from 'views/master/BankDetails/BankDetails';

const BasicDetails = ({ setValue, storedAllData, setStoredAllData }) => {
  const [basicDetails, setBasicDetails] = useState({
    empCode: '',
    prefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    adharNumber: '',
    // panNumber: '',
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

    emergencyContactPersonName: '',
    emergencyContactPersonMobileNumber: '',
    emergencyAddress: '',

    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panCardNo: ''
  });
  const [errors, setErrors] = useState({});

  // Generate empCode when adding new staff
  useEffect(() => {
    async function fetchEmpCode() {
      try {
        const response = await get('administrative/generate-employee-code');
        console.log('basic details form: ', response.empCode);

        setBasicDetails((prev) => ({
          ...prev,
          empCode: response.empCode // ✅ Safely update just empCode
        }));
        // setBasicDetails(response.empCode);
      } catch (err) {
        // Optionally handle error
      }
    }
    if (!storedAllData?.submittedFormId) {
      fetchEmpCode();
    } else if (storedAllData?.basicDetails?.empCode) {
      setBasicDetails((prev) => ({ ...prev, empCode: storedAllData.basicDetails.empCode }));
    }
  }, [storedAllData?.submittedFormId, storedAllData?.basicDetails?.empCode]);

  useEffect(() => {
    setBasicDetails(storedAllData.basicDetails || {});
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
      // { field: 'middleName', message: 'Middle name is required.' },
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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const isValid = BasicDetailsFormValidation();

  //   if (isValid) {
  //     const payLoad = { ...basicDetails };
  //     console.log('payload', payLoad);

  //     const formData = new FormData();

  //     // for (const [key, value] of Object.entries(payLoad)) {
  //     //   if (value) {
  //     //     formData.append(key, value)
  //     //   }
  //     // }

  //     // for (const [key, value] of Object.entries(payLoad)) {
  //     //   if (value !== undefined && value !== null) {
  //     //     if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
  //     //       formData.append(key, JSON.stringify(value));
  //     //     } else {
  //     //       formData.append(key, value);
  //     //     }
  //     //   }
  //     // }

  //     for (const [key, value] of Object.entries(payLoad)) {
  //       if (value !== undefined && value !== null) {
  //         // ✅ Handle file separately (only profilePhoto)
  //         if (key === 'profilePhoto' && value instanceof File) {
  //           formData.append(key, value);
  //         }
  //         // ✅ For other objects/arrays, stringify them
  //         else if (typeof value === 'object') {
  //           formData.append(key, JSON.stringify(value));
  //         } else {
  //           formData.append(key, value);
  //         }
  //       }
  //     }

  //     const submitBasicDetails = await fetch(`${REACT_APP_API_URL}administrative/basicDetails`, {
  //       method: 'POST',
  //       body: formData
  //     });

  //     const response = await submitBasicDetails.json();
  //     console.log('submit basic details', response);

  //     if (response.success === true) {
  //       setStoredAllData((prev) => ({ ...prev, basicDetails: response.data.basicDetails, submittedFormId: response.data._id }));
  //       toast.success(response.message);
  //       setValue((prev) => prev + 1);
  //     }

  //     if (response.success === false) {
  //       toast.error(response.message);
  //     }
  //   } else {
  //     toast.error('Please fill out all required fields.');
  //   }
  // };

  //TODO: NEW DATA

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = BasicDetailsFormValidation();
    if (!isValid) {
      toast.error('Please fill out all required fields.');
      return;
    }

    try {
      const formData = new FormData();

      // Append all form fields
      for (const [key, value] of Object.entries(basicDetails)) {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (typeof value === 'boolean' && value === false && key !== 'isPermanentSame' && key !== 'isMarried')
        ) {
          continue;
        }

        if (key === 'profilePhoto' && value instanceof File) {
          formData.append('profilePhoto', value); // image file
        } else if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }

      // Getting companyId from localStorage
      // const companyId = localStorage.getItem('companyId');

      // ✅ Call API - post() already returns JSON
      const response = await post(`administrative/basicDetails`, formData);

      console.log('submit basic details', response);

      if (response.success) {
        setStoredAllData((prev) => ({
          ...prev,
          basicDetails: response.data.basicDetails,
          submittedFormId: response.data._id
        }));
        toast.success(response.message);
        setValue((prev) => prev + 1);
      } else {
        toast.error(response.message || 'Failed to save basic details.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      if (err.message === 'Unauthorized') {
        toast.error('Session expired. Please log in again.');
        return;
      }
      toast.error('Failed to save basic details. Check console for details.');
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
              <Button type="submit" variant="contained" color="primary" disabled={storedAllData.basicDetails._id}>
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

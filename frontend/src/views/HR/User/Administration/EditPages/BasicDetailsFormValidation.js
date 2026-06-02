// BasicDetailsFormValidation.js
export const BasicDetailsFormValidation = (basicDetails, setErrors) => {
  const validations = [
    { field: 'empCode', message: 'Employee code is required.' },
    { field: 'firstName', message: 'First name is required.' },
    { field: 'lastName', message: 'Last name is required.' },
    { field: 'contactNumber', message: 'Contact number is required.' },
    { field: 'email', message: 'Email is required.' }
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxFileSize = 2 * 1024 * 1024; // 2 MB

  let allValid = true;
  const newErrors = {};

  validations.forEach(({ field, message }) => {
    if (!basicDetails[field]) {
      newErrors[field] = message;
      allValid = false;
    }
  });

  if (basicDetails.email && !emailRegex.test(basicDetails.email)) {
    newErrors.email = 'Please enter a valid email address.';
    allValid = false;
  }

  if (basicDetails.alternateEmail && !emailRegex.test(basicDetails.alternateEmail)) {
    newErrors.alternateEmail = 'Please enter a valid email address.';
    allValid = false;
  }

  if (basicDetails.contactNumber && basicDetails.contactNumber.length !== 10) {
    newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
    allValid = false;
  }

  if (basicDetails.alternateContactNumber && basicDetails.alternateContactNumber.length !== 10) {
    newErrors.alternateContactNumber = 'Alternate contact number must be exactly 10 digits.';
    allValid = false;
  }

  if (basicDetails.profilePhoto) {
    if (basicDetails.profilePhoto.size > maxFileSize) {
      newErrors.profilePhoto = 'Image size must be less than 2 MB.';
      allValid = false;
    }
  }

  setErrors(newErrors);
  return allValid;
};

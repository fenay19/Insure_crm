import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import REACT_APP_API_URL from '../../../../../../api/api.js';
import { toast } from 'react-toastify';
function BankDetails({ setValue, storedAllData, setStoredAllData }) {
  const [BankDetails, setBankDetails] = useState({
    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panCardNo: '',
    cancelCheck: ''
  });

  const [errors, setErrors] = useState({
    nameOnBankAccount: '',
    bankAccountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panCardNo: '',
    cancelCheck: ''
  });

  useEffect(() => {
    setBankDetails(storedAllData.BankDetails || {});
  }, [storedAllData.BankDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setBankDetails((prev) => ({ ...prev, cancelCheck: file }));
    }
  };

  const BankDetailsValidations = () => {
    const validations = [
      { field: 'nameOnBankAccount', message: 'Name on Bank Account is required' },
      { field: 'bankAccountNumber', message: 'Bank Account Number is required' },
      { field: 'bankName', message: 'Bank Name is required' },
      { field: 'branchName', message: 'Branch Name is required' },
      { field: 'ifscCode', message: 'IFSC Code is required' },
      { field: 'panCardNo', message: 'PAN Card Number is required' },
      { field: 'cancelCheck', message: 'Cancelled Check or Passbook is required' }
    ];

    let newErrors = {};
    let isValid = true;

    validations.forEach(({ field, message }) => {
      if (!BankDetails[field]) {
        newErrors[field] = message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (true) {
      if (storedAllData?.submittedFormId) {
        const payLoad = { ...BankDetails };
        const formData = new FormData();

        for (const [key, value] of Object.entries(payLoad)) {
          if (value) {
            formData.append(key, value);
          }
        }

        const submitHrFDetails = await fetch(`${REACT_APP_API_URL}administrative/BankDetails/${storedAllData.submittedFormId}`, {
          method: 'PUT',
          body: formData
        });

        const response = await submitHrFDetails.json();

        if (response.success === true) {
          setStoredAllData((prev) => ({ ...prev, BankDetails: response?.data?.BankDetails }));
          toast.success(response.message);
          setValue((prev) => prev + 1);
        }

        if (response.success === false) {
          toast.error(response.message);
        }
      } else {
        toast.error('Please submit the Basic Details first');
        setValue(0);
      }
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Name on Bank Account"
            name="nameOnBankAccount"
            value={BankDetails.nameOnBankAccount}
            onChange={handleChange}
            fullWidth
            error={!!errors.nameOnBankAccount}
            helperText={errors.nameOnBankAccount}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bank Account Number"
            name="bankAccountNumber"
            value={BankDetails.bankAccountNumber}
            onChange={handleChange}
            fullWidth
            error={!!errors.bankAccountNumber}
            helperText={errors.bankAccountNumber}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bank Name"
            name="bankName"
            value={BankDetails.bankName}
            onChange={handleChange}
            fullWidth
            error={!!errors.bankName}
            helperText={errors.bankName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Branch Name"
            name="branchName"
            value={BankDetails.branchName}
            onChange={handleChange}
            fullWidth
            error={!!errors.branchName}
            helperText={errors.branchName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="IFSC Code"
            name="ifscCode"
            value={BankDetails.ifscCode}
            onChange={handleChange}
            fullWidth
            error={!!errors.ifscCode}
            helperText={errors.ifscCode}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="PAN Card Number"
            name="panCardNo"
            value={BankDetails.panCardNo}
            onChange={handleChange}
            fullWidth
            error={!!errors.panCardNo}
            helperText={errors.panCardNo}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default BankDetails;

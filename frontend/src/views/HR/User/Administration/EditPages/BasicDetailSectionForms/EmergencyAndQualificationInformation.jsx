import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { get } from 'api/api';

function EmergencyAndQualificationInformation({ basicDetails, errors, handleUpdate }) {
  const [diplomaData, setDiplomaData] = useState([]);
  const [graduationData, setGraduationData] = useState([]);
  const [postGraduationData, setPostGraduationData] = useState([]);

  async function fetchDiploma() {
    const response = await get('diploma');
    setDiplomaData(response.data || []);
  }

  async function fetchGraduation() {
    const response = await get('graduation');
    setGraduationData(response.data);
  }

  async function fetchPostGraduation() {
    const response = await get('postGraduation');
    setPostGraduationData(response.data || []);
  }

  useEffect(() => {
    fetchDiploma();
    fetchGraduation();
    fetchPostGraduation();
  }, []);

  const contacts =
    Array.isArray(basicDetails.emergencyContacts) && basicDetails.emergencyContacts.length > 0
      ? basicDetails.emergencyContacts
      : [
          {
            emergencyContactPersonName: '',
            emergencyAddress: '',
            emergencyContactPersonMobileNumber: ''
          }
        ];

  // Handle change for a single contact
  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = contacts.map((c, i) => (i === index ? { ...c, [name]: value } : c));
    handleUpdate({
      target: {
        name: 'emergencyContacts',
        value: updatedContacts
      }
    });
  };

  // Add new contact
  const addContact = () => {
    handleUpdate({
      target: {
        name: 'emergencyContacts',
        value: [
          ...contacts,
          {
            emergencyContactPersonName: '',
            emergencyAddress: '',
            emergencyContactPersonMobileNumber: ''
          }
        ]
      }
    });
  };

  // Remove contact at index
  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    handleUpdate({
      target: {
        name: 'emergencyContacts',
        value:
          updatedContacts.length > 0
            ? updatedContacts
            : [
                {
                  emergencyContactPersonName: '',
                  emergencyAddress: '',
                  emergencyContactPersonMobileNumber: ''
                }
              ]
      }
    });
  };

  const handleMultiSelectChange = (event, fieldName) => {
    const { value } = event.target;
    handleUpdate({
      target: {
        name: fieldName,
        value: typeof value === 'string' ? value.split(',') : value
      }
    });
  };
  return (
    <div>
      {/* Emergency Contact Information Section */}
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, marginTop: 4 }}>
        Emergency Contact Information
      </Typography>
      {contacts.map((contact, index) => (
        <Grid container spacing={2} mb={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Contact Person Name"
              name="emergencyContactPersonName"
              fullWidth
              value={contact.emergencyContactPersonName}
              onChange={(e) => handleContactChange(index, e)}
              error={!!(errors.emergencyContactPersonName && errors.emergencyContactPersonName[index])}
              helperText={errors.emergencyContactPersonName && errors.emergencyContactPersonName[index]}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Emergency Address"
              name="emergencyAddress"
              fullWidth
              value={contact.emergencyAddress}
              onChange={(e) => handleContactChange(index, e)}
              error={!!(errors.emergencyAddress && errors.emergencyAddress[index])}
              helperText={errors.emergencyAddress && errors.emergencyAddress[index]}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Emergency Contact Number"
              name="emergencyContactPersonMobileNumber"
              fullWidth
              value={contact.emergencyContactPersonMobileNumber}
              onChange={(e) => handleContactChange(index, e)}
              error={!!(errors.emergencyContactPersonMobileNumber && errors.emergencyContactPersonMobileNumber[index])}
              helperText={errors.emergencyContactPersonMobileNumber && errors.emergencyContactPersonMobileNumber[index]}
            />
          </Grid>
          <Grid item xs={6} sm={0.5} container alignItems="center">
            <IconButton color="primary" onClick={addContact} aria-label="add contact">
              <AddIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item xs={6} sm={0.5} container alignItems="center">
            <IconButton
              color="error"
              onClick={() => removeContact(index)}
              aria-label="delete"
              disabled={contacts.length === 1} // Prevent removing last blank row
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Bank Details */}
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, marginTop: 4 }}>
        Bank Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Name on Bank Account"
            name="nameOnBankAccount"
            fullWidth
            value={basicDetails.nameOnBankAccount}
            onChange={handleUpdate}
            error={!!errors.nameOnBankAccount}
            helperText={errors.nameOnBankAccount}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bank Account Number"
            name="bankAccountNumber"
            value={basicDetails.bankAccountNumber}
            onChange={handleUpdate}
            fullWidth
            error={!!errors.bankAccountNumber}
            helperText={errors.bankAccountNumber}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bank Name"
            name="bankName"
            value={basicDetails.bankName}
            onChange={handleUpdate}
            fullWidth
            error={!!errors.bankName}
            helperText={errors.bankName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Branch Name"
            name="branchName"
            value={basicDetails.branchName}
            onChange={handleUpdate}
            fullWidth
            error={!!errors.branchName}
            helperText={errors.branchName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="IFSC Code"
            name="ifscCode"
            value={basicDetails.ifscCode}
            onChange={handleUpdate}
            fullWidth
            error={!!errors.ifscCode}
            helperText={errors.ifscCode}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="PAN Card Number"
            name="panCardNo"
            value={basicDetails.panCardNo}
            onChange={handleUpdate}
            fullWidth
            error={!!errors.panCardNo}
            helperText={errors.panCardNo}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default EmergencyAndQualificationInformation;

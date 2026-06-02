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

  // Make sure emergencyContacts is always an array
  const emergencyContacts = basicDetails.emergencyContacts || [
    { emergencyContactPersonName: '', emergencyAddress: '', emergencyContactPersonMobileNumber: '' }
  ];

  // Add new contact
  const addContact = () => {
    const updated = [
      ...emergencyContacts,
      { emergencyContactPersonName: '', emergencyAddress: '', emergencyContactPersonMobileNumber: '' }
    ];
    handleUpdate({
      target: {
        name: 'emergencyContacts',
        value: updated
      }
    });
  };

  // Remove contact by index
  const removeContact = (idx) => {
    const updated = emergencyContacts.filter((_, i) => i !== idx);
    handleUpdate({
      target: {
        name: 'emergencyContacts',
        value: updated
      }
    });
  };

  // Change contact field
  const handleContactChange = (idx, field, value) => {
    const updated = emergencyContacts.map((c, i) => (i === idx ? { ...c, [field]: value } : c));
    handleUpdate({
      target: {
        name: 'emergencyContacts',
        value: updated
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
      {emergencyContacts.map((contact, index) => (
        <Grid container spacing={2} mb={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Contact Person Name"
              name="emergencyContactPersonName"
              fullWidth
              value={contact.emergencyContactPersonName}
              onChange={(e) => handleContactChange(index, 'emergencyContactPersonName', e.target.value)}
              error={!!(errors.emergencyContacts && errors.emergencyContacts[index]?.emergencyContactPersonName)}
              helperText={errors.emergencyContacts && errors.emergencyContacts[index]?.emergencyContactPersonName}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Emergency Address"
              name="emergencyAddress"
              fullWidth
              value={contact.emergencyAddress}
              onChange={(e) => handleContactChange(index, 'emergencyAddress', e.target.value)}
              error={!!(errors.emergencyContacts && errors.emergencyContacts[index]?.emergencyAddress)}
              helperText={errors.emergencyContacts && errors.emergencyContacts[index]?.emergencyAddress}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Emergency Contact Number"
              name="emergencyContactPersonMobileNumber"
              fullWidth
              value={contact.emergencyContactPersonMobileNumber}
              onChange={(e) => handleContactChange(index, 'emergencyContactPersonMobileNumber', e.target.value)}
              error={!!(errors.emergencyContacts && errors.emergencyContacts[index]?.emergencyContactPersonMobileNumber)}
              helperText={errors.emergencyContacts && errors.emergencyContacts[index]?.emergencyContactPersonMobileNumber}
            />
          </Grid>
          <Grid item xs={12} md={1} container justifyContent="flex-start">
            <IconButton color="primary" onClick={addContact} aria-label="add contact">
              <AddIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={0.5} container justifyContent="flex-end">
            <IconButton onClick={() => removeContact(index)} color="error" aria-label="delete" disabled={emergencyContacts.length === 1}>
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Qualification Information Section
      <Typography variant='h6' gutterBottom sx={{ marginTop: 4 }}>
        Qualification Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Minimum Qualification'
            name='minimumQualification'
            fullWidth
            value={basicDetails.minimumQualification}
            onChange={handleUpdate}
            error={!!errors.minimumQualification}
            helperText={errors.minimumQualification}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel id='diploma'>Diploma</InputLabel>
            <Select
              labelId='diploma'
              multiple
              name='diploma'
              value={basicDetails.diploma || []}
              onChange={e => handleMultiSelectChange(e, 'diploma')}
              renderValue={selected =>
                diplomaData
                  .filter(item => selected?.includes(item._id))
                  .map(item => item.diploma)
                  .join(', ')
              }
            >
              {diplomaData.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={basicDetails?.diploma?.includes(item._id)} />
                  <ListItemText primary={item.diploma} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel id='graduation'>Graduation</InputLabel>
            <Select
              labelId='graduation'
              multiple
              name='graduation'
              value={basicDetails.graduation || []}
              onChange={e => handleMultiSelectChange(e, 'graduation')}
              renderValue={selected =>
                graduationData
                  .filter(item => selected?.includes(item._id))
                  .map(item => item.graduation)
                  .join(', ')
              }
            >
              {graduationData.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={basicDetails?.graduation?.includes(item._id)} />
                  <ListItemText primary={item.graduation} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel id='postGraduation'>Post Graduation</InputLabel>
            <Select
              labelId='postGraduation'
              multiple
              name='postGraduation'
              value={basicDetails.postGraduation || []}
              onChange={e => handleMultiSelectChange(e, 'postGraduation')}
              renderValue={selected =>
                postGraduationData
                  .filter(item => selected.includes(item._id))
                  .map(item => item.postGraduation)
                  .join(', ')
              }
            >
              {postGraduationData.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={basicDetails?.postGraduation?.includes(item._id)} />
                  <ListItemText primary={item.postGraduation} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Other Qualifications'
            name='otherQualification'
            fullWidth
            value={basicDetails.otherQualification}
            onChange={handleUpdate}
            error={!!errors.otherQualification}
            helperText={errors.otherQualification}
          />
        </Grid>
      </Grid>  */}

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

import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Card, CardContent } from '@mui/material';

const TransferForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    uhid: '',
    mobile: '',
    ipOrDaycareNo: '',
    transferFrom: '',
    reasonForTransfer: '',
    transferTo: '',
    transferDate: '',
    transferTime: '',
    conditionOfPatient: '',
    note: '',
    diagnosis: '',
    handoverBy: '',
    receivedBy: '',
    transferRequest: '',
    transferConfirm: '',
    transferType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Options for Transfer From and Transfer To
  const transferFromOptions = ['Department/Specialty', 'Consultant', 'Bed No'];
  const transferToOptions = ['Department/Specialty', 'Consultant', 'Registration No'];

  return (
    <Card
      sx={{
        maxWidth: '100%',
        width: { xs: '95%', sm: '90%', md: '80%' },
        mx: 'auto',
        mt: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Transfer Form
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 2, sm: 3 }
          }}
          onSubmit={handleSubmit}
        >
          {/* Form Fields */}
          <TextField label="Name of Patient" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="UHID NO" name="uhid" value={formData.uhid} onChange={handleChange} fullWidth />
          <TextField label="Mobile No." name="mobile" value={formData.mobile} onChange={handleChange} fullWidth />
          <TextField label="IP No./Daycare No." name="ipOrDaycareNo" value={formData.ipOrDaycareNo} onChange={handleChange} fullWidth />

          {/* Transfer Type(Select) */}
          <FormControl fullWidth>
            <InputLabel>Transfer Type</InputLabel>
            <Select label="Transfer Type" name="transferType" value={formData.transferType} onChange={handleChange}>
              {transferFromOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Transfer From */}
          <TextField label="Transfer From" name="transferFrom" value={formData.transferFrom} onChange={handleChange} fullWidth />
          {/* Transfer To (Select) */}
          <FormControl fullWidth>
            <InputLabel>Transfer To</InputLabel>
            <Select label="Transfer To" name="transferTo" value={formData.transferTo} onChange={handleChange}>
              {transferToOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Reason for Transfer */}
          <TextField
            label="Reason for Transfer"
            name="reasonForTransfer"
            value={formData.reasonForTransfer}
            onChange={handleChange}
            fullWidth
          />

          {/* Transfer To (Select) */}

          {/* Use HTML date and time inputs */}
          <TextField
            label="Transfer Date"
            name="transferDate"
            type="date"
            value={formData.transferDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Transfer Time"
            name="transferTime"
            type="time"
            value={formData.transferTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* Other fields */}
          <TextField
            label="Condition of Patient"
            name="conditionOfPatient"
            value={formData.conditionOfPatient}
            onChange={handleChange}
            fullWidth
          />
          <TextField label="Note" name="note" value={formData.note} onChange={handleChange} fullWidth />
          <TextField label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} fullWidth />
          <TextField label="Handover By" name="handoverBy" value={formData.handoverBy} onChange={handleChange} fullWidth />
          <TextField label="Received By" name="receivedBy" value={formData.receivedBy} onChange={handleChange} fullWidth />

          {/* Transfer Request (TextField) */}
          <TextField label="Transfer Request" name="transferRequest" value={formData.transferRequest} onChange={handleChange} fullWidth />

          {/* Transfer Confirm (TextField) */}
          <TextField label="Transfer Confirm" name="transferConfirm" value={formData.transferConfirm} onChange={handleChange} fullWidth />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3' },
              mt: 3,
              backgroundColor: '#1976d2',
              fontSize: { xs: '0.8rem', sm: '1rem' },
              padding: '6px 12px',
              mr: 0,
              display: 'block',
              marginLeft: 'auto'
            }}
          >
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransferForm;

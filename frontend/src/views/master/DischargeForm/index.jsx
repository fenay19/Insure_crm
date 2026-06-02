import React, { useEffect, useState } from 'react';
import { Box, TextField, Select, MenuItem, Button, Typography, Card, CardContent, FormControl, InputLabel } from '@mui/material';
import { get } from 'api/api';
import useDischargeFormData from './hooks/useFormData';

const DischargeForm = () => {
  const { formData, handleChange, handleSubmit, patientCategory, patientPayee, tpaData, departments } = useDischargeFormData();

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
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Discharge Form
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
          <TextField label="UHID No" name="uhid" value={formData.uhid} onChange={handleChange} fullWidth />
          <TextField label="IPD No." name="ipdNo" value={formData.ipdNo} onChange={handleChange} fullWidth />

          {/* Department/Speciality Select */}
          <FormControl fullWidth>
            <InputLabel>Department/Speciality</InputLabel>
            <Select label="Department/Speciality" name="department" value={formData.departmentId} onChange={handleChange}>
              {departments?.map((dept) => (
                <MenuItem key={dept?._id} value={dept?._id}>
                  {dept?.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Consultant" name="consultantDoctor" value={formData.consultantDoctor} onChange={handleChange} fullWidth />
          <TextField
            label="Date of Admission"
            name="dateOfAdmission"
            type="date"
            value={formData.dateOfAdmission}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
          <TextField label="Bed No." name="bedNo" value={formData.bedNo} onChange={handleChange} fullWidth />
          <TextField label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} fullWidth />
          <TextField
            label="Discharge Request Date"
            name="dischargeRequestDate"
            type="date"
            value={formData.dischargeRequestDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
          <TextField
            label="Discharge Request Time"
            name="dischargeRequestTime"
            type="time"
            value={formData.dischargeRequestTime}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Discharge Type</InputLabel>
            <Select label="Discharge Type" name="dischargeType" value={formData.dischargeType} onChange={handleChange}>
              <MenuItem value="Discharge">Discharge</MenuItem>
              <MenuItem value="Dama">Dama</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
              <MenuItem value="Death">Death</MenuItem>
            </Select>
          </FormControl>

          {/* Conditionally Render Fields Based on Discharge Type */}
          {formData.dischargeType === 'Dama' && (
            <TextField label="Reason for Dama" name="reasonForDama" value={formData.reasonOfDama} onChange={handleChange} fullWidth />
          )}
          {formData.dischargeType === 'Transfer' && (
            <>
              <TextField
                label="Reason for Transfer"
                name="reasonOfTransfer"
                value={formData.reasonOfTransfer}
                onChange={handleChange}
                fullWidth
              />
              <TextField label="Transfer To" name="transferTo" value={formData.transferTo} onChange={handleChange} fullWidth />
            </>
          )}
          {formData.dischargeType === 'Death' && (
            <>
              <TextField label="Cause of Death" name="causeOfDeath" value={formData.causeOfDeath} onChange={handleChange} fullWidth />

              <TextField
                label="Death Day"
                name="deathDay"
                type="date"
                value={formData.deathDay}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
              />
              <TextField
                label="Death Time"
                name="deathTime"
                type="time"
                value={formData.deathTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
              />
            </>
          )}

          {formData.dischargeType === 'Discharge' && (
            <TextField
              label="Discharge Condition"
              name="dischargeCondition"
              value={formData.dischargeCondition}
              onChange={handleChange}
              fullWidth
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Patient Category</InputLabel>
            <Select label="Patient Category" name="patientCategory" value={formData.patientCategoryId} onChange={handleChange}>
              {patientCategory?.map((category) => (
                <MenuItem key={category?._id} value={category?._id}>
                  {category?.parentGroupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Patient Payee</InputLabel>
            <Select label="Patient Payee" name="patientPayee" value={formData.patientPayeeId} onChange={handleChange}>
              {patientPayee?.map((payee) => (
                <MenuItem key={payee?._id} value={payee?._id}>
                  {payee?.payeeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>TPA</InputLabel>
            <Select label="TPA" name="tpa" value={formData.tpaId} onChange={handleChange}>
              {tpaData?.map((tpaItem) => (
                <MenuItem key={tpaItem?._id} value={tpaItem?._id}>
                  {tpaItem?.tpaCompanyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} fullWidth />

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

export default DischargeForm;

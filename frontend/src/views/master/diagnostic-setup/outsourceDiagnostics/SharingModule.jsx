import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box
} from '@mui/material';
import { Delete, Save } from '@mui/icons-material';

const SharingModule = ({ setOpen }) => {
  const [sharingType, setSharingType] = useState('value');
  const [percentage, setPercentage] = useState(40);
  const [data, setData] = useState([{ test: '', serviceRate: '', costAgreed: '', saved: false }]);

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    updatedData[index]['saved'] = false; // Mark as unsaved if edited

    if (sharingType === 'percentage' && field === 'serviceRate') {
      // Auto-calculate costAgreed when service rate changes in percentage mode
      updatedData[index]['costAgreed'] = value ? (value * percentage) / 100 : '';
    }

    setData(updatedData);
  };

  // Handle percentage mode calculation
  const handlePercentageChange = (value) => {
    setPercentage(value);
    if (sharingType === 'percentage') {
      const updatedData = data.map((row) => ({
        ...row,
        costAgreed: row.serviceRate ? (row.serviceRate * value) / 100 : ''
      }));
      setData(updatedData);
    }
  };

  // Save row
  const handleSaveRow = (index) => {
    const updatedData = [...data];
    updatedData[index]['saved'] = true;
    setData(updatedData);

    // If all rows are saved, add a new empty row
    if (updatedData.every((row) => row.saved)) {
      setData([...updatedData, { test: '', serviceRate: '', costAgreed: '', saved: false }]);
    }
  };

  // Delete row
  const handleDeleteRow = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData.length > 0 ? updatedData : [{ test: '', serviceRate: '', costAgreed: '', saved: false }]);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex' }}>
        {/* Toggle between Value and Percentage */}
        <RadioGroup row value={sharingType} onChange={(e) => setSharingType(e.target.value)} sx={{ marginBottom: 2 }}>
          <FormControlLabel value="value" control={<Radio />} label="Value" />
          <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
        </RadioGroup>

        {/* Percentage Dropdown (Only if "percentage" mode is selected) */}
        {sharingType === 'percentage' && (
          <Select
            value={percentage}
            onChange={(e) => handlePercentageChange(e.target.value)}
            sx={{ marginBottom: 2, width: '100px' }}
            size="small"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => (
              <MenuItem key={p} value={p}>
                {p}%
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Test Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Service Rate</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cost Agreed</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={row.test}
                    onChange={(e) => handleInputChange(index, 'test', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={row.serviceRate}
                    onChange={(e) => handleInputChange(index, 'serviceRate', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    variant="outlined"
                    fullWidth
                    disabled={sharingType === 'percentage'}
                    value={row.costAgreed}
                    onChange={(e) => handleInputChange(index, 'costAgreed', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" onClick={() => handleSaveRow(index)}>
                      <Save />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteRow(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {/* Footer Row */}
            <TableRow sx={{ backgroundColor: '#ffff99' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{data.reduce((acc, item) => acc + Number(item.serviceRate || 0), 0)}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{data.reduce((acc, item) => acc + Number(item.costAgreed || 0), 0)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Close Button */}
      <Button variant="contained" color="secondary" onClick={() => setOpen(false)} sx={{ marginTop: 2 }}>
        Close
      </Button>
    </Paper>
  );
};

export default SharingModule;

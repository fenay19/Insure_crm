import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const DateMonthFilter= ({ onFilter }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleFilter = () => {
    onFilter({ fromDate, toDate, selectedMonth });
  };
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* From Date Input */}
      <TextField
        label="From Date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        size="small"
        type="date"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 150 }}
      />
      {/* To Date Input */}
      <TextField
        label="To Date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        size="small"
        type="date"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 150 }}
      />
      {/* Month Input */}
      <TextField
        label="Month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        size="small"
        type="month"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 170 }}
      />
      
    </Box>
  );
};

export default DateMonthFilter;

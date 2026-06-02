import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Card,
  CardContent,
  Box,
  Button
} from '@mui/material';
import { get } from 'api/api';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function ConsultantDataTable({ consultantData, setConsultantSchedulingData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [availability, setAvailability] = useState({});
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDate, setSelectedDate] = useState(dayjs());
  useEffect(() => {
    async function fetchAvailability() {
      const availabilityData = {};
      for (const consultant of consultantData) {
        const response = await get(
          `appointmentSchedule-master/getData/checkConsultantAvailableOrNot/${consultant._id}?date=${encodeURIComponent(selectedDate)}`
        );
        // Store complete response of scheduling of consultant
        availabilityData[consultant._id] = response;
      }
      setAvailability(availabilityData);
    }

    if (consultantData.length > 0 && selectedDate) {
      fetchAvailability();
    }
  }, [consultantData, selectedDate]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (consultant) => {
    const schedulingData = availability[consultant._id];

    if (schedulingData?.available) {
      setConsultantSchedulingData({
        consultantData: consultant,
        schedulingData: schedulingData.schedule,
        date: new Date(selectedDate)
      });
  
    } else {
      setConsultantSchedulingData({});
    }
  };
  const filteredData = consultantData.filter((consultant) => {
    const search = searchQuery.trim().toLowerCase();

    return (
      consultant?.basicDetails?.firstName?.toLowerCase()?.includes(search) ||
      consultant?.basicDetails?.lastName?.toLowerCase()?.includes(search) ||
      consultant?.employmentDetails?.departmentOrSpeciality?.departmentName?.toLowerCase()?.includes(search)
    );
  });

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: '20px auto', boxShadow: 3 }}>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
            {/* Search Input */}
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: '250px' }}
            />

            {/* Date Picker (Calendar) */}
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
        </LocalizationProvider>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
              <TableRow>
                <TableCell>Sr.No.</TableCell>
                <TableCell>Employee Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((consultant, index) => (
                <TableRow key={consultant._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{consultant?.basicDetails?.empCode}</TableCell>
                  <TableCell>
                    {consultant?.basicDetails?.firstName} {consultant?.basicDetails?.lastName}
                  </TableCell>
                  <TableCell>{consultant?.employmentDetails?.designation?.designationName}</TableCell>
                  <TableCell>{consultant?.employmentDetails?.departmentOrSpeciality?.departmentName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={availability[consultant._id]?.available ? 'success' : 'error'}
                      sx={{ minWidth: '120px' }}
                      onClick={() => handleClick(consultant)}
                    >
                      {availability[consultant._id]?.available ? 'Available' : 'Not Available'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
}

export default ConsultantDataTable;

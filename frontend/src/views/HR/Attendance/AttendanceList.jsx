import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import Breadcrumb from 'component/Breadcrumb';
import { useSelector } from 'react-redux';
import { get, post } from 'api/api'; // your API wrapper

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]); // list of dates ({ _id, date })
  const [filteredRecords, setFilteredRecords] = useState([]); // date view (records) or month summary
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // format: YYYY-MM-DD
  });

  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [attendancePermission, setAttendancePermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });

  const systemRights = useSelector((state) => state.systemRights.systemRights);
  const navigate = useNavigate();

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') setAdmin(true);
    if (systemRights?.actionPermissions?.['attendance-list']) {
      setAttendancePermission(systemRights.actionPermissions['attendance-list']);
    }
    // fetchAllDates();
    // 👇 Automatically fetch today's attendance
    handleDateChange({ target: { value: selectedDate } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemRights]);

  // fetch all attendance dates for the list view
  const fetchAllDates = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await post('attendance/get'); // GET /api/attendance
      // expect res.data.data = array of { _id, date }
      const payload = res?.data || [];
      // normalize into array of { date, _id }
      setAttendanceRecords(payload);
      setFilteredRecords(payload);
    } catch (err) {
      console.error('Error fetching attendance list:', err);
      setError('Failed to load attendance list.');
    } finally {
      setLoading(false);
    }
  };

  // handle selecting a specific date
  const handleDateChange = async (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    setSelectedMonth('');
    setError('');
    if (!dateValue) {
      setFilteredRecords(attendanceRecords);
      return;
    }

    try {
      setLoading(true);
      const res = await post(`attendance/get`, { date: dateValue });
      // expect res.data.type === 'date' and res.data.data is array of records
      const data = res?.data || [];
      setFilteredRecords(data);
    } catch (err) {
      console.error('Error fetching attendance for date:', err);
      setFilteredRecords([]);
      setError('No attendance found for selected date.');
    } finally {
      setLoading(false);
    }
  };

  // handle selecting a month (YYYY-MM)
  const handleMonthChange = async (e) => {
    const monthValue = e.target.value;
    setSelectedMonth(monthValue);
    setSelectedDate('');
    setError('');
    if (!monthValue) {
      setFilteredRecords(attendanceRecords);
      return;
    }

    try {
      setLoading(true);
      const res = await post(`attendance/get`, { month: monthValue });
      // expect res.data.type === 'month' and res.data.data is aggregated array
      const data = res?.data || [];
      setFilteredRecords(data);
    } catch (err) {
      console.error('Error fetching attendance for month:', err);
      setFilteredRecords([]);
      setError('No attendance found for selected month.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedDate('');
    setSelectedMonth('');
    setError('');
    setFilteredRecords(attendanceRecords);
    handleDateChange({ target: { value: selectedDate } });
  };

  const handleEdit = (date) => {
    // navigate to attendance page with date query param for editing/marking
    navigate(`/hr/attendance?date=${date}`);
  };

  const addAttendance = () => {
    navigate('/hr/attendance');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Box p={3}>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          HR
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Attendance
        </Typography>
      </Breadcrumb>

      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Attendance List</Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Select Date"
            type="date"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Select Month"
            type="month"
            size="small"
            value={selectedMonth}
            onChange={handleMonthChange}
            InputLabelProps={{ shrink: true }}
          />

          <Button variant="outlined" color="warning" onClick={handleClear} startIcon={<CancelIcon />}>
            Clear
          </Button>

          {(attendancePermission?.Add || isAdmin) && (
            <Button variant="contained" color="primary" onClick={addAttendance} startIcon={<AddIcon />}>
              Add
            </Button>
          )}

          <Button variant="outlined" color="secondary" onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box py={2}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SR.NO</TableCell>
                  {selectedDate ? (
                    <>
                      <TableCell>EMPLOYEE NAME</TableCell>
                      <TableCell>STATUS</TableCell>
                    </>
                  ) : selectedMonth ? (
                    <>
                      <TableCell>EMPLOYEE NAME</TableCell>

                      <TableCell>PRESENT DAYS</TableCell>
                      <TableCell>PRESENT %</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>DATE</TableCell>
                      <TableCell>ACTION</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedDate ? (
                  filteredRecords.length > 0 ? (
                    filteredRecords.map((rec, i) => (
                      <TableRow key={`${rec.staffId || rec.name}-${i}`}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {rec.name ||
                            (rec.staffId &&
                              rec.staffId.basicDetails &&
                              `${rec.staffId.basicDetails.firstName} ${rec.staffId.basicDetails.lastName}`) ||
                            'Unknown'}
                        </TableCell>
                        <TableCell>
                          {rec.status ? (
                            <Typography
                              variant="body2"
                              sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '12px',
                                fontWeight: 400,
                                color:
                                  rec.status === 'PRESENT'
                                    ? '#0f5132'
                                    : rec.status === 'ABSENT'
                                      ? '#842029'
                                      : rec.status === 'HALF DAY'
                                        ? '#664d03'
                                        : '#1a1a1a',
                                backgroundColor:
                                  rec.status === 'PRESENT'
                                    ? '#d1e7dd'
                                    : rec.status === 'ABSENT'
                                      ? '#f8d7da'
                                      : rec.status === 'HALF DAY'
                                        ? '#fff3cd'
                                        : '#e0e0e0',
                                textTransform: 'capitalize',
                                textAlign: 'center',
                                minWidth: 80
                              }}
                            >
                              {rec.status}
                            </Typography>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No data found for selected date.</TableCell>
                    </TableRow>
                  )
                ) : selectedMonth ? (
                  filteredRecords.length > 0 ? (
                    filteredRecords.map((rec, i) => (
                      <TableRow key={`${rec.name}-${i}`}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{rec.name}</TableCell>
                        <TableCell>{rec.presentDays}</TableCell>
                        <TableCell>{rec.presentPercentage}%</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No data found for selected month.</TableCell>
                    </TableRow>
                  )
                ) : attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record, index) => (
                    <TableRow key={record._id || record.date}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => handleEdit(record.date)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No attendance data available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceList;

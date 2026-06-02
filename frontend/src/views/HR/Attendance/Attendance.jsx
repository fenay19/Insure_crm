import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get, post } from 'api/api';
import { toast } from 'react-toastify';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const Status = ['PRESENT', 'ABSENT', 'HALF DAY'];
  const navigate = useNavigate();

  // Fetch staff list from backend
  const fetchStaffList = async () => {
    try {
      const res = await get('administrative');
      const staffList = res?.data?.filter((staff) => !staff.isSuspended) || [];

      // Prepare attendance data
      const initialAttendance = staffList.map((staff) => ({
        staffId: staff.basicDetails?.empCode || staff._id || 'N/A',
        name: `${staff.basicDetails?.firstName || ''} ${staff.basicDetails?.lastName || ''}`.trim(),
        status: 'PRESENT',
        inTime: '10:00',
        outTime: '18:00',
        comment: '',
        _id: staff._id
      }));

      setAttendanceData(initialAttendance);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff list');
    }
  };

  // Load attendance data or initialize
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const dateParam = queryParams.get('date');
    const targetDate = dateParam || new Date().toISOString().split('T')[0];
    setSelectedDate(targetDate);

    const existing = JSON.parse(localStorage.getItem('attendanceLog')) || [];
    // console.log(existing);

    const found = existing.find((item) => item.date === targetDate);

    if (found) {
      setAttendanceData(found.records);
    } else {
      fetchStaffList();
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...attendanceData];
    updated[index][field] = value;
    setAttendanceData(updated);
  };

  console.log(attendanceData);

  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    try {
      const payload = {
        date: selectedDate,
        records: attendanceData.map((item) => ({
          staffId: item._id,
          status: item.status,
          inTime: item.inTime,
          outTime: item.outTime,
          comment: item.comment
        }))
      };

      const res = await post('attendance', payload);

      if (res.success) {
        toast.success('Attendance saved successfully!');
        navigate('/hr/attendance-list');
      } else {
        toast.error('Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Server error while saving attendance');
    }
  };

  const handleEdit = () => {
    navigate('/hr/attendance-list');
  };

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          HR
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Attendance
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <TextField type="date" disabled value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={handleEdit} startIcon={<ArrowBackIcon />}></Button>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>SN</TableCell>
                        <TableCell>STAFF ID</TableCell>
                        <TableCell>STAFF NAME</TableCell>
                        <TableCell>MARK</TableCell>
                        <TableCell>IN TIME</TableCell>
                        <TableCell>OUT TIME</TableCell>
                        <TableCell>COMMENTS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceData.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{entry.staffId}</TableCell>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                              <Select
                                labelId={`status-label-${index}`}
                                value={entry.status}
                                label="Status"
                                onChange={(e) => handleChange(index, 'status', e.target.value)}
                              >
                                {Status.map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="time"
                              value={entry.inTime}
                              onChange={(e) => handleChange(index, 'inTime', e.target.value)}
                              inputProps={{ step: 300 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="time"
                              value={entry.outTime}
                              onChange={(e) => handleChange(index, 'outTime', e.target.value)}
                              inputProps={{ step: 300 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField value={entry.comment} onChange={(e) => handleChange(index, 'comment', e.target.value)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Box>

              <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<SaveIcon />}>
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Attendance;

import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  // Edit,
  // Delete,
  Radio,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Edit, Delete } from '@mui/icons-material';

import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Add, Close as CloseIcon } from '@mui/icons-material';
import Breadcrumb from 'component/Breadcrumb';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const gridSpacing = 2;

const LeaveApplicationForm = () => {
  const [form, setForm] = useState(initialFormState());
  const [data, setData] = useState([]);

  const [staffOptions, setStaffOptions] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [status, setStatus] = useState([]);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [errors, setErrors] = useState({});
  const [availableLeave, setAvailableLeave] = useState(null); // Example only

  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const [leaveDuration, setLeaveDuration] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [open, setOpen] = useState(false);

  const [isAdmin, setAdmin] = useState(false);
  const [leaveManagementPermission, setLeaveManagementPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  function initialFormState() {
    return {
      staffName: '',
      leaveType: '',
      status: 'Applied', // default string instead of ID
      availableLeave: 10,
      leaveMode: 'Full Day',
      fromDate: '',
      toDate: '',
      noOfDays: '',
      alternateMobileNo: '',
      reason: ''
    };
  }

  const loginRole = localStorage.getItem('loginRole');

  const handleLeaveDurationChange = (e) => {
    setLeaveDuration(e.target.value);
    if (e.target.value !== 'multi') {
      setNumberOfDays('');
    }
  };

  const handleNumberOfDaysChange = (e) => {
    setNumberOfDays(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleStatusClick = (entry) => {
    setSelectedLeave(entry);
    setStatusDialogOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.staffName) newErrors.staffName = 'Staff Name is required';
    if (!form.leaveType) newErrors.leaveType = 'Leave Type is required';
    if (form.leaveMode === 'multi' && !form.noOfDays) newErrors.noOfDays = 'No. of Days is required';
    if (!form.reason) newErrors.reason = 'Reason is required';
    if (!form.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //todo : new handle submit
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const leaveData = { ...form, status: 'Applied' }; // always Applied

      if (form._id) {
        await put(`leaveManager/${form._id}`, leaveData);
        toast.success('Leave updated!');
      } else {
        await post('leaveManager', leaveData);
        toast.success('Leave created!');
      }

      setOpen(false);
      setForm(initialFormState());
      getLeaveManagerData();
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  // Function to fetch leave count for current year
  const fetchAvailableLeave = async (staffName, leaveTypeId) => {
    if (!staffName || !leaveTypeId) return;

    try {
      // Find leave type object from leaveTypes array
      const leaveTypeObj = leaveTypes.find((lt) => lt._id === leaveTypeId);
      if (!leaveTypeObj) return;

      console.log(leaveTypeObj);

      const leaveTypeName = leaveTypeObj.leaveType;
      const totalAllocatedLeave = leaveTypeObj.totalLeaves || 0; // <-- use number from leaveType doc

      const response = await get(`/leaveManager/leave-count/${encodeURIComponent(staffName)}/${encodeURIComponent(leaveTypeName)}`);

      if (response.success) {
        const totalTaken = response.totalLeavesTaken || 0;
        setForm((prev) => ({
          ...prev,
          availableLeave: totalAllocatedLeave - totalTaken
        }));
      }
    } catch (error) {
      console.error('Error fetching available leave:', error);
    }
  };

  // Watch staffName and leaveType changes
  useEffect(() => {
    fetchAvailableLeave(form.staffName, form.leaveType);
  }, [form.staffName, form.leaveType]);

  //todo: handle edit and delete
  const handleEdit = (entry) => {
    setForm({
      ...entry,
      leaveType: entry.leaveType?._id || '',
      status: entry.status || 'Applied' // default to Applied
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await remove(`leaveManager/delete/${id}`);
      toast.success('Leave deleted');
      getLeaveManagerData(); // refresh table
    } catch (error) {
      toast.error('Failed to delete');
      console.error('Delete error:', error);
    }
  };

  // get whole data from the leaveManager
  const getLeaveManagerData = async () => {
    let response = await get('/leaveManager');
    console.log('leave manager ', response.data);
    setData(response.data);
  };

  // statff name adminstrative
  const getStaffName = async () => {
    const response = await get('administrative');
    const dataStaff = response.data.map((item) => {
      // console.log("basic details ", item.basicDetails)
      const fullName = item.basicDetails.firstName + ' ' + item.basicDetails.lastName;
      // console.log('fullname of statff: ', fullName);
      return fullName;
    });
    // console.log('administrative data:', dataStaff);
    setStaffOptions(dataStaff);
  };

  // leave type
  const leaveTypeData = async () => {
    try {
      const response = await get('leaveType');

      // ✅ Check if response has data
      if (response.status === 'true' && Array.isArray(response.data)) {
        // console.log('✅ Leave Types:', response.data);
        setLeaveTypes(response.data); // set state
      } else {
        console.warn('⚠️ Unexpected response format', response);
      }
    } catch (error) {
      console.error('❌ Error fetching leave types:', error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedLeave) return;

    try {
      await put(`leaveManager/update-status/${selectedLeave._id}`, {
        status: newStatus,
        rejectReason: newStatus === 'Rejected' ? rejectionReason : selectedLeave.reason
      });

      toast.success(`Leave ${newStatus}`);
      setStatusDialogOpen(false);
      setSelectedLeave(null);
      setRejecting(false);
      setRejectionReason('');
      getLeaveManagerData();
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusData = async () => {
    try {
      const response = await get('status');

      // ✅ Check if response is valid
      if (response.status === 'true' && Array.isArray(response.data)) {
        // console.log('✅ Status result:', response.data);
        setStatus(response.data); // Set state
      } else {
        console.warn('⚠️ Unexpected response format in status API:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching status data:', error);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['leave-management']) {
      setLeaveManagementPermission(systemRights.actionPermissions['leave-management']);
    }
    getLeaveManagerData();
    getStaffName();
    leaveTypeData();
    getStatusData();
  }, [systemRights]);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Leave Manager
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              {(leaveManagementPermission.Add === true || isAdmin) && (
                <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                  Apply Leave
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Bank Table */}
          {data?.length > 0 && (
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SN</TableCell>
                          <TableCell>Staff Name</TableCell>
                          <TableCell>Leave Type</TableCell>
                          <TableCell>From Date</TableCell>
                          <TableCell>To Date</TableCell>
                          <TableCell>Days</TableCell>
                          <TableCell>Status</TableCell>
                          {/* <TableCell>Reason</TableCell> */}
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((entry, index) => (
                          <TableRow sx={{ verticalAlign: 'top' }} key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{entry.staffName}</TableCell>
                            <TableCell>{entry.leaveType?.leaveType || '-'}</TableCell>
                            <TableCell>{dayjs(entry?.fromDate).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>{dayjs(entry?.toDate).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>{entry.noOfDays}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                color={entry.status === 'Approved' ? 'success' : entry.status === 'Rejected' ? 'error' : 'warning'}
                                onClick={() => {
                                  const loginRole = localStorage.getItem('loginRole');
                                  // if (entry.status === 'Applied' && loginRole === 'admin') {
                                  if (loginRole === 'admin') {
                                    handleStatusClick(entry);
                                  }
                                }}
                                // disabled={entry.status !== 'Applied' || localStorage.getItem('loginRole') !== 'admin'}
                                sx={{
                                  textTransform: 'none',
                                  minWidth: 80,
                                  fontWeight: 500,
                                  borderRadius: 2,
                                  boxShadow: 1,
                                  cursor:
                                    entry.status === 'Applied' && localStorage.getItem('loginRole') === 'admin' ? 'pointer' : 'default',
                                  '&:hover': {
                                    // backgroundColor:
                                    //   entry.status === 'Applied' && localStorage.getItem('loginRole') === 'admin'
                                    //     ? 'primary.light'
                                    //     : 'inherit',
                                    boxShadow: entry.status === 'Applied' && localStorage.getItem('loginRole') === 'admin' ? 3 : 1
                                  }
                                }}
                              >
                                {entry.status || 'Applied'}
                              </Button>
                            </TableCell>

                            {/* <TableCell>{entry.reason}</TableCell> */}
                            <TableCell>
                              {(leaveManagementPermission.Edit === true || isAdmin) && (
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEdit(entry)}
                                  // disabled={entry.status === 'Approved' || entry.status === 'Rejected'}
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              {(leaveManagementPermission.Delete === true || isAdmin) && (
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(entry._id)}
                                  // disabled={entry.status === 'Approved' || entry.status === 'Rejected'}
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 22 }}>Leave Details</DialogTitle>

        <DialogContent dividers>
          {selectedLeave && (
            <Box
              sx={{
                p: 3,
                bgcolor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Grid container spacing={2}>
                {/* Other fields */}
                {[
                  { label: 'Staff Name', value: selectedLeave.staffName },
                  { label: 'Leave Type', value: selectedLeave.leaveType?.leaveType || '-' },
                  { label: 'From Date', value: dayjs(selectedLeave.fromDate).format('DD-MM-YYYY') },
                  { label: 'To Date', value: selectedLeave.toDate ? dayjs(selectedLeave.toDate).format('DD-MM-YYYY') : '-' },
                  { label: 'No. of Days', value: selectedLeave.noOfDays },
                  {
                    label: 'Status',
                    value: selectedLeave.status,
                    color: selectedLeave.status === 'Approved' ? 'green' : selectedLeave.status === 'Rejected' ? 'red' : 'orange'
                  }
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Grid item xs={5}>
                      <Typography fontWeight="bold" fontSize={16} color="#555">
                        {item.label}:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography fontSize={16} fontWeight={item.label === 'Status' ? 'bold' : 'normal'} color={item.color || '#333'}>
                        {item.value}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}

                {/* Reason field full width */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography fontWeight="bold" fontSize={16} color="#555">
                    Reason:
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      p: 2,
                      bgcolor: '#f9f9f9',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      minHeight: 80,
                      maxHeight: 200,
                      overflowY: 'auto',
                      fontSize: 16,
                      color: '#333'
                    }}
                  >
                    {selectedLeave.reason}
                  </Box>
                </Grid>
                {selectedLeave.rejectReason && selectedLeave.rejectReason.trim() !== '' && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography fontWeight="bold" fontSize={16} color="#555">
                      Reject Reason:
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        p: 2,
                        bgcolor: '#f9f9f9',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        minHeight: 80,
                        maxHeight: 200,
                        overflowY: 'auto',
                        fontSize: 16,
                        color: '#333'
                      }}
                    >
                      {selectedLeave.rejectReason}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          {/* Show input box on first click, above the buttons */}
          {rejecting && (
            <TextField
              label="Reason for Rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              multiline
              rows={2}
              required
              fullWidth
            />
          )}

          {/* Buttons row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {loginRole === 'admin' && (
              <>
                <Button
                  color="success"
                  variant="contained"
                  sx={{ minWidth: 100, color: '#ffffff' }}
                  onClick={() => handleUpdateStatus('Approved')}
                >
                  Approve
                </Button>

                <Button
                  color="error"
                  variant="contained"
                  sx={{ minWidth: 100, color: '#ffffff' }}
                  onClick={() => {
                    if (!rejecting) {
                      setRejecting(true); // first click → show input
                    } else {
                      handleUpdateStatus('Rejected'); // second click → submit
                    }
                  }}
                >
                  Reject
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              onClick={() => {
                setStatusDialogOpen(false);
                setRejecting(false);
                setRejectionReason('');
              }}
            >
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Leave Application
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center" sx={{ my: 'auto' }}>
            {/* Staff Name */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Staff Name"
                name="staffName"
                value={form.staffName}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.staffName}
                helperText={errors.staffName}
              >
                {staffOptions.map((staff, i) => (
                  <MenuItem key={i} value={staff}>
                    {staff}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Leave Type */}
            <Grid item xs={6} md={4}>
              <TextField
                select
                label="Leave Type"
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.leaveType}
                helperText={errors.leaveType}
              >
                {leaveTypes.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.leaveType}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* <Grid item xs={12} md={3}>
              <TextField
                select
                label="Status"
                name="status"
                value={form.status || '68ed28a058dc616f100270e9'} // default to Pending
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.status}
                helperText={errors.status}
              >
                {status.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.statusName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

            {/* Available Leave (disabled) */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Available Leave"
                name="availableLeave"
                value={form.availableLeave || 10}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            {/* Radio buttons */}
            <Grid item xs={12}>
              <RadioGroup row name="leaveMode" value={form.leaveMode || 'Full Day'} onChange={handleChange}>
                <FormControlLabel value="Half Day" control={<Radio />} label="Half Day" />
                <FormControlLabel value="Full Day" control={<Radio />} label="Full Day" />
                <FormControlLabel value="Multiple Days" control={<Radio />} label="Multiple Days" />
              </RadioGroup>
            </Grid>

            {/* From Date */}
            <Grid item xs={12} md={3}>
              <TextField
                label="From Date"
                name="fromDate"
                type="date"
                value={form.fromDate || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  const updated = { ...form, fromDate: value };
                  if (form.leaveMode === 'Full Day') updated.noOfDays = 1;
                  if (form.leaveMode === 'Half Day') updated.noOfDays = 0.5;
                  setForm(updated);
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* To Date (only for multiple/full days) */}
            {form.leaveMode === 'Multiple Days' && (
              <Grid item xs={12} md={3}>
                <TextField
                  label="To Date"
                  name="toDate"
                  type="date"
                  value={form.toDate || ''}
                  onChange={(e) => {
                    const { value } = e.target;
                    const from = new Date(form.fromDate);
                    const to = new Date(value);
                    const diff = (to - from) / (1000 * 60 * 60 * 24) + 1;
                    setForm({
                      ...form,
                      toDate: value,
                      noOfDays: diff > 0 ? diff : 0
                    });
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required={form.leaveMode === 'Multiple Days'}
                />
              </Grid>
            )}

            {/* No. of Days (disabled) */}
            <Grid item xs={12} md={3}>
              <TextField label="No. of Days" name="noOfDays" type="number" value={form.noOfDays || ''} fullWidth disabled />
            </Grid>

            {/* Alternative Mobile No To Contact On Emergency */}
            <Grid item xs={12} md={3}>
              <TextField
                label="Alternate Mobile no"
                name="alternateMobileNo"
                type="tel"
                value={form.alternateMobileNo || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Reason */}
            <Grid item xs={12}>
              <TextField
                label="Reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
                error={!!errors.reason}
                helperText={errors.reason}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>

          <ToastContainer />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveApplicationForm;

import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';

// axiosInstance
// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api';
import { useSelector } from 'react-redux';

const LeaveType = () => {
  const [form, setForm] = useState({
    leaveType: '',
    shortForm: '',
    totalLeaves: '',
    leavesPerMonth: ''
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [leaveTypePermission, setLeaveTypePermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.leaveType) newErrors.leaveType = 'Leave Type is required';
    if (!form.shortForm) newErrors.shortForm = 'Short Form is required';
    if (!form.totalLeaves) newErrors.totalLeaves = 'Total Leaves are required';
    if (!form.leavesPerMonth) newErrors.leavesPerMonth = 'Leaves Per Month are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // use axiosInstance to fetch data from the server with useEffect
  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['leave-type']) {
      setLeaveTypePermission(systemRights.actionPermissions['leave-type']);
    }
    const fetchData = async () => {
      try {
        const response = await get('leaveType');
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({
      leaveType: '',
      shortForm: '',
      totalLeaves: '',
      leavesPerMonth: ''
    });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Add or update leave type using axiosInstance
  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (editIndex !== null) {
          // Update
          const id = data[editIndex]._id;
          const response = await put(`leaveType/${id}`, form);
          const updated = [...data];
          updated[editIndex] = response?.data;
          setData(updated);
        } else {
          // Add
          const response = await post('leaveType', form);
          setData([...data, response?.data]);
        }
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Delete leave type using axiosInstance
  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`leaveType/${id}`);
      const updated = [...data];
      updated.splice(index, 1);
      setData(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  console.log('data----', data);
  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Leave Type
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Leave Type</Typography>
        {(leaveTypePermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Leave Type
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Leave Type' : 'Add Leave Type'}
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
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Leave Type"
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                error={!!errors.leaveType}
                helperText={errors.leaveType}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Short Form"
                name="shortForm"
                value={form.shortForm}
                onChange={handleChange}
                error={!!errors.shortForm}
                helperText={errors.shortForm}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Total Leaves"
                name="totalLeaves"
                type="number"
                value={form.totalLeaves}
                onChange={handleChange}
                error={!!errors.totalLeaves}
                helperText={errors.totalLeaves}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Leaves Per Month"
                name="leavesPerMonth"
                type="number"
                value={form.leavesPerMonth}
                onChange={handleChange}
                error={!!errors.leavesPerMonth}
                helperText={errors.leavesPerMonth}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px',
              padding: '2px'
            }}
          >
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              minWidth: '40px',
              padding: '2px',
              backgroundColor: value.primaryLight
            }}
          >
            <IconButton color="inherit">{editIndex !== null ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
        <Card>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Short Form</TableCell>
                    <TableCell>Total Leaves</TableCell>
                    <TableCell>Leaves Per Month</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                {data?.length > 0 ?
                <TableBody>
                  {data?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.leaveType}</TableCell>
                      <TableCell>{row.shortForm}</TableCell>
                      <TableCell>{row.totalLeaves}</TableCell>
                      <TableCell>{row.leavesPerMonth}</TableCell>
                      <TableCell>
                        {(leaveTypePermission.Edit === true || isAdmin) && (
                          <Button
                            size="small"
                            onClick={() => handleEdit(index)}
                            sx={{
                              padding: '1px',
                              minWidth: '24px',
                              height: '24px',
                              mr: '5px'
                            }}
                          >
                            <IconButton color="inherit">
                              <Edit />
                            </IconButton>
                          </Button>
                        )}
                        {(leaveTypePermission.Delete === true || isAdmin) && (
                          <Button
                            color="error"
                            onClick={() => handleDelete(index)}
                            sx={{
                              padding: '1px',
                              minWidth: '24px',
                              height: '24px'
                            }}
                          >
                            <IconButton color="inherit">
                              <Delete />
                            </IconButton>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                : <TableRow>
                        <TableCell colSpan={6} align="center">
                          No Data Found
                        </TableCell>
                      </TableRow> }
              </Table>
            </Box>
          </CardContent>
        </Card>
    </div>
  );
};

export default LeaveType;

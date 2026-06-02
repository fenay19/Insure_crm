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
  Box,
  MenuItem
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const Holiday = () => {
  const [form, setForm] = useState({ holidayName: '', date: '', holidayTypeId: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [holidayTypes, setHolidayTypes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [holidayPermission, setHolidayPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.holidayName.trim()) newErrors.holidayName = 'Holiday name is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.holidayTypeId) newErrors.holidayTypeId = 'Holiday type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchHolidays = async () => {
    try {
      const response = await get('holiday');
      setData(response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHolidayTypes = async () => {
    try {
      const response = await get('holidayType');
      setHolidayTypes(response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') setAdmin(true);
    if (systemRights?.actionPermissions?.['holiday']) {
      setHolidayPermission(systemRights.actionPermissions['holiday']);
    }
    fetchHolidays();
    fetchHolidayTypes();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ holidayName: '', date: '', holidayTypeId: '' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        const id = data[editIndex]._id;
        await put(`holiday/${id}`, form);
      } else {
        await post('holiday', form);
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ holidayName: '', date: '', holidayTypeId: '' });
      fetchHolidays();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    const holiday = data[index];
    setForm({
      holidayName: holiday.holidayName,
      date: holiday.date.split('T')[0],
      holidayTypeId: holiday.holidayTypeId?._id || holiday.holidayTypeId
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`holiday/${id}`);
      fetchHolidays();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Holidays
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Holiday Master</Typography>
        {(holidayPermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Holiday
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Holiday' : 'Add Holiday'}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Holiday Name"
                name="holidayName"
                value={form.holidayName}
                onChange={handleChange}
                error={!!errors.holidayName}
                helperText={errors.holidayName}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Holiday Type"
                name="holidayTypeId"
                value={form.holidayTypeId}
                onChange={handleChange}
                error={!!errors.holidayTypeId}
                helperText={errors.holidayTypeId}
                fullWidth
              >
                {holidayTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.holidayTypeName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained" color="error" sx={{ minWidth: '40px', padding: '2px' }}>
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
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
      {data?.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Holiday Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Holiday Type</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.holidayName}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.holidayTypeId?.holidayTypeName || 'N/A'}</TableCell>
                      <TableCell>
                        {(holidayPermission.Edit === true || isAdmin) && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(index)}
                            sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                          >
                            <IconButton color="inherit">
                              <Edit />
                            </IconButton>
                          </Button>
                        )}
                        {(holidayPermission.Delete === true || isAdmin) && (
                          <Button
                            color="error"
                            onClick={() => handleDelete(index)}
                            sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
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
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Holiday;

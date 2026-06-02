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
import value from 'assets/scss/_themes-vars.module.scss';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const HolidayType = () => {
  const [form, setForm] = useState({ HolidayType: '', color: '#1976d2' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [holidayTypePermission, setHolidayTypePermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });

  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.HolidayType.trim()) {
      newErrors.HolidayType = 'Holiday Type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all holiday types
  const fetchHolidayTypes = async () => {
    try {
      const response = await get('holidayType');
      const result = response?.data?.map((item) => ({
        HolidayType: item.holidayTypeName,
        color: item.color || '#1976d2',
        _id: item._id
      }));
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') setAdmin(true);
    if (systemRights?.actionPermissions?.['holidayType']) setHolidayTypePermission(systemRights.actionPermissions['holidayType']);
    fetchHolidayTypes();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ HolidayType: '', color: '#1976d2' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        const id = data[editIndex]._id;
        await put(`holidayType/${id}`, {
          holidayTypeName: form.HolidayType,
          color: form.color
        });
      } else {
        await post('holidayType', {
          holidayTypeName: form.HolidayType,
          color: form.color
        });
      }
      setOpen(false);
      setEditIndex(null);
      fetchHolidayTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setForm({
      HolidayType: data[index].HolidayType,
      color: data[index].color
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`holidayType/${id}`);
      fetchHolidayTypes();
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
          Holiday Type
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Holiday Type</Typography>
        {(holidayTypePermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Holiday Type
          </Button>
        )}
      </Grid>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Holiday Type' : 'Add Holiday Type'}
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
                label="Holiday Type"
                name="HolidayType"
                value={form.HolidayType}
                onChange={handleChange}
                error={!!errors.HolidayType}
                helperText={errors.HolidayType}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select Color
              </Typography>
              <input
                type="color"
                name="color"
                value={form.color}
                onChange={handleChange}
                style={{
                  width: '100%',
                  height: '50px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setOpen(false)}>
            <CancelIcon />
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: value.primaryLight
            }}
          >
            {editIndex !== null ? <EditIcon /> : <SaveIcon />}
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
                    <TableCell>Holiday Type</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.HolidayType}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: row.color,
                            border: '1px solid #ccc'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {(holidayTypePermission.Edit === true || isAdmin) && (
                          <IconButton color="primary" onClick={() => handleEdit(index)}>
                            <Edit />
                          </IconButton>
                        )}
                        {(holidayTypePermission.Delete === true || isAdmin) && (
                          <IconButton color="error" onClick={() => handleDelete(index)}>
                            <Delete />
                          </IconButton>
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

export default HolidayType;

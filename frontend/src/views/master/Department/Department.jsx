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
  IconButton
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';

// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const Department = () => {
  const [form, setForm] = useState({ department: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [departmentPermission, setDepartmentPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.department) newErrors.department = 'department Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await get('department');
      console.log('Department data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');

    if (loginRole === 'admin') {
      setAdmin(true);
    }

    if (loginRole === 'super-admin') {
      setDepartmentPermission({
        View: true,
        Add: true,
        Edit: true,
        Delete: true
      });
    } else if (systemRights?.actionPermissions?.['departments']) {
      setDepartmentPermission(systemRights.actionPermissions['departments']);
    }

    fetchDepartments();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ department: '' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // CRUD handlers using axiosInstance
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`department/${id}`, form);
      } else {
        // Create new
        await post('department', form);
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ department: '' });
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`department/${id}`);
      fetchDepartments();
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
          department
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Department</Typography>
        {(departmentPermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add department
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit department' : 'Add department'}
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
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            label="department Name"
            name="department"
            value={form.department}
            onChange={handleChange}
            error={!!errors.department}
            helperText={errors.department}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ minWidth: '40px', padding: '2px' }}>
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>

          <Button onClick={handleSubmit} variant="contained" sx={{ minWidth: '40px', padding: '2px', backgroundColor: value.primaryLight }}>
            <IconButton color="inherit">{editIndex !== null ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell>Department Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              {data?.length > 0 ?
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>
                      {(departmentPermission.Edit === true || isAdmin) && (
                        <Button
                          size="small"
                          onClick={() => handleEdit(index)}
                          sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                        >
                          <IconButton color="inherit">
                            <Edit />
                          </IconButton>
                        </Button>
                      )}
                      {(departmentPermission.Delete === true || isAdmin) && (
                        <Button color="error" onClick={() => handleDelete(index)} sx={{ padding: '1px', minWidth: '24px', height: '24px' }}>
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
                      <TableCell colSpan={3} align="center">
                        No Data Found
                      </TableCell>
                    </TableRow> }
            </Table>
          </CardContent>
        </Card>
    </div>
  );
};

export default Department;

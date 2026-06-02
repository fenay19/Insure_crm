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

const Position = () => {
  const [form, setForm] = useState({ position: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [positionPermission, setPositionPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.position) newErrors.position = 'position Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all positions from backend
  const fetchPositions = async () => {
    try {
      const response = await get('position');
      console.log('Position data: ', response.data);
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
      setPositionPermission({
        View: true,
        Add: true,
        Edit: true,
        Delete: true
      });
    } else if (systemRights?.actionPermissions?.['position']) {
      setPositionPermission(systemRights.actionPermissions['position']);
    }

    fetchPositions();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ position: '' });
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
        await put(`position/${id}`, form);
      } else {
        // Create new
        await post('position', form);
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ position: '' });
      fetchPositions();
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
      await remove(`position/${id}`);
      fetchPositions();
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
          Position
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Position</Typography>
        {(positionPermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add position
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit position' : 'Add position'}
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
            label="position Name"
            name="position"
            value={form.position}
            onChange={handleChange}
            error={!!errors.position}
            helperText={errors.position}
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
                  <TableCell>Position Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              {data?.length > 0 ?
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>
                      {(positionPermission.Edit === true || isAdmin) && (
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
                      {(positionPermission.Delete === true || isAdmin) && (
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

export default Position;

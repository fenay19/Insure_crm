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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';

// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const FuelType = () => {
  const [form, setForm] = useState({ fuelType: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const newErrors = {};
    if (!form.fuelType) newErrors.fuelType = 'Fuel Type Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Fetch all Insurance departments from backend
  const fetchFuelType = async () => {
    try {
      const response = await get('fuelType');
      // console.log('BrokerageRate data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFuelType();
  }, []);

  const handleSubmit = async () => {
    console.log('Submit editIndex ', editIndex);
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`fuelType/${id}`, form);
        fetchFuelType();
        toast.success('Record Edited Sucessfully');
      } else {
        console.log('post ', form);
        // Create new
        await post('fuelType', form);
        fetchFuelType();
        toast.success('Record Saved Sucessfully');
      }
      setOpen(false);
      setForm({ fuelType: '' });
      setEditIndex(null);
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
      await remove(`fuelType/${id}`);
      fetchFuelType();
      toast.success('Record Deleted Sucessfully');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Masters
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Fuel Type
        </Typography>
      </Breadcrumb>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Fuel Type</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Fuel Type
        </Button>
        {/* {(positionPermission.Add === true || isAdmin) && (
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                      Add position
                    </Button>
                  )} */}
      </Grid>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SN</TableCell>
                <TableCell>Fuel Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            {data?.length > 0 ? (
              <TableBody>
                {data?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.fuelType}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleEdit(index)}
                        sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                      >
                        <IconButton color="inherit">
                          <Edit />
                        </IconButton>
                      </Button>
                      <Button color="error" onClick={() => handleDelete(index)} sx={{ padding: '1px', minWidth: '24px', height: '24px' }}>
                        <IconButton color="inherit">
                          <Delete />
                        </IconButton>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </Table>
        </CardContent>
      </Card>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Add Fuel Type
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
            label="Fuel Type Name"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            error={!!errors.fuelType}
            helperText={errors.fuelType}
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
      <ToastContainer />
    </div>
  );
};

export default FuelType;

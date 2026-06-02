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

const LicenceValidity = () => {
  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);

  function initialState() {
    return {
      licenseName: '',
      brokerName: '',
      licenseNumber: '',
      startDate: '',
      endDate: '',
      description: ''
    };
  }

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const newErrors = {};
    if (!form.licenseName) newErrors.licenseName = 'License Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch License validity from backend
  const fetchLicenseValidity = async () => {
    try {
      const response = await get('licenseValidity');
      console.log('licenseValidity data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLicenseValidity();
  }, []);

  const handleSubmit = async () => {
    console.log('Submit ', editIndex);
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`licenseValidity/${id}`, form);
        fetchLicenseValidity();
        toast.success('Record Edited Sucessfully');
      } else {
        console.log('Submot', form);
        // Create new
        await post('licenseValidity', form);
        fetchLicenseValidity();
        toast.success('Record Saved Sucessfully');
      }
      setOpen(false);
      setForm({ insDepartment: '' });
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
      await remove(`licenseValidity/${id}`);
      fetchLicenseValidity();
      toast.success('Record Deleted Sucessfully');
    } catch (error) {
      console.error(error);
      toast.error('Record Deletion Failed ');
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Masters
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          License Validity
        </Typography>
      </Breadcrumb>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">License Validy</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add License
        </Button>
        {/* {(positionPermission.Add === true || isAdmin) && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                          Add position
                        </Button>
                      )} */}
      </Grid>
      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Add License Validity
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
          {[
            { label: 'Name of License', name: 'licenseName' },
            { label: 'Broker Name', name: 'brokerName' },
            { label: 'License Number', name: 'licenseNumber' }
          ].map((field) => (
            <Grid item xs={12} sm={3} py={1} key={field.name}>
              <TextField
                label={field.label}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                fullWidth
                required={field.required || false} // 👈 only show star for required fields
              />
            </Grid>
          ))}
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
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
                <TableCell>License Name</TableCell>
                <TableCell>Broker Name</TableCell>
                <TableCell>License Number</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
{ data?.length > 0 ?
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.licenseName}</TableCell>
                  <TableCell>{item.brokerName}</TableCell>
                  <TableCell>{item.licenseNumber}</TableCell>
                  <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{item.description}</TableCell>
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
            : <TableRow>
        <TableCell colSpan={8} align="center">
          No Data Found
        </TableCell>
      </TableRow> }
          </Table>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default LicenceValidity;

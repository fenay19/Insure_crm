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
import { Add, Edit, Delete, Close, ContactSupportOutlined } from '@mui/icons-material';
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
import { Shrink } from 'lucide-react';

const FinancialYear = () => {
  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);

  function initialState() {
    return {
      fromDate: '',
      toDate: ''
    };
  }

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch all Financial Year from backend
  const fetchFinancialYears = async () => {
    try {
      const response = await get('financialYear');
      console.log('financialYear data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    if (form.fromDate) {
      const startDate = new Date(form.fromDate);
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const date = startDate.getDate();
      if (month != 3 && date != 1) {
        alert('Please enter valid Date');
      } else {
        const newToDate = `${year + 1}-03-31`;
        setForm((prev) => ({ ...prev, toDate: newToDate }));
      }
    }
    // if (form.toDate) console.log(form.toDate);
  }, [form.fromDate, form.toDate]);

  const validate = () => {
    const newErrors = {};
    if (!form.fromDate) newErrors.fromDate = 'From Date Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submit ', editIndex);
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`financialYear/${id}`, form);
        fetchFinancialYears();
        toast.success('Record Edited Sucessfully');
      } else {
        console.log('save ', form);
        // Create new
        await post('financialYear', form);
        fetchFinancialYears();
        toast.success('Record Saved Sucessfully');
      }
      setOpen(false);
      setForm(initialState());
      setEditIndex(null);
    } catch (error) {
      console.error(error);
    }
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleEdit = (index) => {
    const selectedRecord = data[index];

    setForm({
      ...selectedRecord,
      fromDate: formatDateForInput(selectedRecord.fromDate),
      toDate: formatDateForInput(selectedRecord.toDate)
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`financialYear/${id}`);
      fetchFinancialYears();
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
          Financial Year
        </Typography>
      </Breadcrumb>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Financial Year</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add New Year
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
          Add Financial Year
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
            type="date"
            label="From Date"
            name="fromDate"
            value={form.fromDate}
            onChange={handleChange}
            error={!!errors.fromDate}
            helperText={errors.fromDate}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="dense"
          />
          <TextField
            type="date"
            label="To Date"
            name="toDate"
            value={form.toDate}
            onChange={handleChange}
            error={!!errors.toDate}
            helperText={errors.toDate}
            fullWidth
            inputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
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
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {data?.length > 0 ? (
              <TableBody>
                {data?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{new Date(item.fromDate).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>{new Date(item.toDate).toLocaleDateString('en-GB')}</TableCell>
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
                <TableCell colSpan={4} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </Table>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default FinancialYear;




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
import { get,post,put,remove } from '../../../api/api.js';
import { toast } from 'react-toastify';

const TypeOfClient = () => {
  // const [form, setForm] = useState({
  //   TypeOfClient: ''
  // });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ typeOfClient: '' });

  const fetchTypeOfClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get('typeOfClient');
      if (res.data && res.status === 'true') {
        setData(res.data);
      } else {
        setData([]);
        setError('No data found');
      }
    } catch (err) {
      setData([]);
      setError('Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypeOfClients();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.typeOfClient) newErrors.typeOfClient = 'Type Of Client is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ typeOfClient: '' });
    setErrors({});
    setSelectedId(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // const handleSubmit = () => {
  //   if (validate()) {
  //     const updated = [...data];
  //     if (editIndex !== null) {
  //       updated[editIndex] = form; // Edit existing lead reference
  //     } else {
  //       updated.push(form); // Add new lead reference
  //     }
  //     setData(updated);
  //     setOpen(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (selectedId) {
        await put(`typeOfClient/${selectedId}`, form);
        toast.success('Type Of Client updated!');
      } else {
        await post('typeOfClient', form);
        toast.success('Type Of Client added!');
      }
      setOpen(false);
      fetchTypeOfClients();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (index) => {
    setForm({ typeOfClient: data[index].typeOfClient });
    setSelectedId(data[index]._id);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    const id = data[index]._id;
    try {
      await remove(`typeOfClient/${id}`);
      toast.success('Type Of Client deleted!');
      fetchTypeOfClients();
    } catch (err) {
      toast.error('Delete failed');
    }
  };
  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primaryDark" className="link-breadcrumb">
          Type Of Client
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Type Of Client</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Type Of Client
        </Button>
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Type Of Client' : 'Add Type Of client'}
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Type Of Client"
                name="typeOfClient"
                value={form.typeOfClient}
                onChange={handleChange}
                error={!!errors.typeOfClient}
                helperText={errors.typeOfClient}
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
              padding: '2px'
            }}
          >
            <IconButton color="inherit">{editIndex !== null ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      {data.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Type Of Client</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row._id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.typeOfClient}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleEdit(index)}
                          sx={{
                            padding: '1px',
                            minWidth: '24px',
                            height: '24px',
                            mr: '5px'
                          }}
                        >
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(index)}
                          sx={{
                            padding: '1px',
                            minWidth: '24px',
                            height: '24px'
                          }}
                        >
                          <IconButton>
                            <Delete />
                          </IconButton>
                        </Button>
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

export default TypeOfClient;
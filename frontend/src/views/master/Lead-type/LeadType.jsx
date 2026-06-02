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

// axiosInstance fetch data from the server
// import { axiosInstance } from '../../../api/api.js';
// import axios from 'axios'
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const LeadType = () => {
  const [form, setForm] = useState({ LeadType: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([{ LeadType: 'Type' }]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [leadTypePermission, setLeadTypePermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.LeadType.trim()) {
      newErrors.LeadType = 'Lead Type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all lead types from backend
  const fetchLeadTypes = async () => {
    try {
      const response = await get('leadType');
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
    if (systemRights?.actionPermissions?.['lead-type']) {
      setLeadTypePermission(systemRights.actionPermissions['lead-type']);
    }
    fetchLeadTypes();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ LeadType: '' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // CRUD handlers using axiosInstance
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`leadType/${id}`, form);
      } else {
        // Create new
        await post('leadType', form);
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ LeadType: '' });
      fetchLeadTypes();
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
      await remove(`leadType/${id}`);
      fetchLeadTypes();
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
          Lead Type
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Lead Type</Typography>
        {(leadTypePermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Lead Type
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Lead Type' : 'Add Lead Type'}
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
                sx={{
                  width: '100%'
                }}
                label="Lead Type"
                name="LeadType"
                value={form.LeadType}
                onChange={handleChange}
                error={!!errors.LeadType}
                helperText={errors.LeadType}
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
                    <TableCell>Lead Type</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.LeadType}</TableCell>
                      <TableCell>
                        {(leadTypePermission.Edit === true || isAdmin) && (
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
                        {(leadTypePermission.Delete === true || isAdmin) && (
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
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadType;

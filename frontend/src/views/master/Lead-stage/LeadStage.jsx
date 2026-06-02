import React, { useState, useEffect } from 'react';
import {
  Grid, TextField, Button, Typography, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Box
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';

// Import API methods
import { get, post, put, remove } from '../../../api/api.js';

const LeadStage = () => {
  const [form, setForm] = useState({
    LeadStage: '',
    shortForm: '',
    colorCode: ''
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!form.LeadStage) newErrors.LeadStage = 'Lead Stage is required';
    if (!form.shortForm) newErrors.shortForm = 'Short Form is required';
    if (!form.colorCode) newErrors.colorCode = 'Color Code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchLeadStages = async () => {
    try {
      const response = await get('leadStage');
      console.log(response)
      setData(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching lead stages:', error);
    }
  };

  useEffect(() => {
    fetchLeadStages();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ LeadStage: '', shortForm: '', colorCode: '' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        const id = data[editIndex]._id;
        await put(`leadStage/${id}`, form);
      } else {
        await post('leadStage', form);
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ LeadStage: '', shortForm: '', colorCode: '' });
      fetchLeadStages();
    } catch (error) {
       
      console.error('Error saving lead stage:', error);
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
      await remove(`leadStage/${id}`);
      fetchLeadStages();
    } catch (error) {
      console.error('Error deleting lead stage:', error);
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Lead Stage
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Lead Stage</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Lead Stage
        </Button>
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Lead Stage' : 'Add Lead Stage'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Lead Stage"
                name="LeadStage"
                value={form.LeadStage}
                onChange={handleChange}
                error={!!errors.LeadStage}
                helperText={errors.LeadStage}
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
                label="Color Code"
                name="colorCode"
                value={form.colorCode}
                onChange={handleChange}
                error={!!errors.colorCode}
                helperText={errors.colorCode}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ minWidth: 40, padding: '2px' }}>
            <IconButton color="inherit"><CancelIcon /></IconButton>
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ minWidth: 40, padding: '2px', backgroundColor: theme.primaryLight }}>
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
                  <TableCell>Lead Stage</TableCell>
                  <TableCell>Short Form</TableCell>
                  <TableCell>Color Code</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.LeadStage}</TableCell>
                      <TableCell>{row.shortForm}</TableCell>
                      <TableCell>{row.colorCode}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleEdit(index)}
                          sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                        >
                          <IconButton color="inherit"><Edit /></IconButton>
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDelete(index)}
                          sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
                        >
                          <IconButton color="inherit"><Delete /></IconButton>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadStage;

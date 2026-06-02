import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close, Save, Cancel } from '@mui/icons-material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Breadcrumb from 'component/Breadcrumb';

import { get, post, put, remove } from '../../../api/api';
import { useSelector } from 'react-redux';

const Priority = () => {
  const [form, setForm] = useState({ Priority: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin,setAdmin]=useState(false);
  const [priorityPermission,setPriorityPermission]=useState({
        View: false,
        Add: false,
        Edit: false,
        Delete: false
      });
  const systemRights = useSelector((state)=>state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.Priority.trim()) {
      newErrors.Priority = 'Priority is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ Priority: '' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ Priority: '' });
    setErrors({});
    setEditIndex(null);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = { priorityName: form.Priority };

      if (editIndex !== null) {
        const id = data[editIndex]._id;
await put(`priority/update/${id}`, payload); // ✅

      } else {
        await post('priority', payload);
      }

      handleClose();
      fetchPriorities();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleEdit = (index) => {
    setForm({ Priority: data[index].Priority });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`priority/${id}`);
      fetchPriorities();
    } catch (error) {
      console.error('Failed to delete priority:', error);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await get('priority');
      setData(response.data.map(item => ({
        Priority: item.priorityName,
        _id: item._id
      })));
    } catch (error) {
      console.error('Failed to fetch priorities:', error);
    }
  };

  React.useEffect(() => {
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.Priority) {
      setPriorityPermission(systemRights.actionPermissions.Priority);
    }
    fetchPriorities();
  }, [systemRights]);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        title={
          <>
            {/* <PriorityHighIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> */}
            Priority
          </>
        }
      >
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Priority
        </Typography>
      </Breadcrumb>

      {/* Page Header */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Task Priorities</Typography>
        {(priorityPermission.Add===true || isAdmin) &&  <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Priority
        </Button>}
      </Grid>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Priority' : 'Add Priority'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Priority"
            name="Priority"
            value={form.Priority}
            onChange={handleChange}
            error={!!errors.Priority}
            helperText={errors.Priority}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={editIndex !== null ? <Edit /> : <Save />}
          >
            {editIndex !== null ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Table */}
      <Card>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.Priority}</TableCell>
                      <TableCell align="center">
                        {(priorityPermission.Edit===true || isAdmin) &&<IconButton color="primary" onClick={() => handleEdit(index)}>
                          <Edit />
                        </IconButton>}
                        {(priorityPermission.Delete===true || isAdmin) &&<IconButton color="error" onClick={() => handleDelete(index)}>
                          <Delete />
                        </IconButton>}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No priorities available.
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

export default Priority;

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

// import { axiosInstance } from "../../../api/api.js"
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const Network = () => {
  const [form, setForm] = useState({ Network: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [networkPermission, setNetworkPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.Network.trim()) {
      newErrors.Network = 'Network is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all networks from backend
  const fetchNetworks = async () => {
    try {
      const response = await get('network');

      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        setData(
          response.data.map((item) => ({
            Network: item.networkName,
            _id: item._id
          }))
        );
      } else {
        setData([]); // no data case
      }

      console.log('Network:', response);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData([]); // important: always reset to []
        console.warn('No networks found (404). Setting data to empty array.');
      } else {
        console.error('Error fetching networks:', error);
        setData([]); // fallback safety
      }
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['network']) {
      setNetworkPermission(systemRights.actionPermissions['network']);
    }
    fetchNetworks();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ Network: '' });
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
        await put(`network/${id}`, { networkName: form.Network });
      } else {
        // Create new
        await post('network', { networkName: form.Network });
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ Network: '' });
      fetchNetworks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setForm({ Network: data[index].Network });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      const res = await remove(`network/${id}`);
      if (res.status) {
        fetchNetworks();
      }
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
          Network
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Network</Typography>
        {(networkPermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Network
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Network' : 'Add Network'}
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
                label="Network"
                name="Network"
                value={form.Network}
                onChange={handleChange}
                error={!!errors.Network}
                helperText={errors.Network}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            flexWrap: 'nowrap'
          }}
        >
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
      {data.length > 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Network</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.Network}</TableCell>
                      <TableCell>
                        {' '}
                        {(networkPermission.Edit === true || isAdmin) && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(index)}
                            sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                          >
                            {' '}
                            <IconButton color="inherit">
                              {' '}
                              <Edit />{' '}
                            </IconButton>{' '}
                          </Button>
                        )}{' '}
                        {(networkPermission.Delete === true || isAdmin) && (
                          <Button
                            color="error"
                            onClick={() => handleDelete(index)}
                            sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
                          >
                            {' '}
                            <IconButton color="inherit">
                              {' '}
                              <Delete />{' '}
                            </IconButton>{' '}
                          </Button>
                        )}{' '}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No Networks Found
        </Typography>
      )}
    </div>
  );
};

export default Network;

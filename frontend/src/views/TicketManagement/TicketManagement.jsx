import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Select
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'config';
import { get, post, put, remove } from 'api/api';
import { Visibility } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import TicketDetailView from './TicketDetailView';

const TicketManagement = () => {
  const [form, setForm] = useState({
    clientName: '',
    phoneNumber: '',
    product: '',
    serviceType: '',
    installDate: null,
    expiryDate: null,
    description: '',
    urgency: '',
    AssignTo: '',
    createdBy: localStorage.getItem('Id')
  });
  const [formList, setFormList] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const serviceTypes = ['Installation', 'Repair'];
  const urgencyLevels = ['Low', 'Medium', 'High'];
  const [statusOptions, setStatusOptions] = useState([]);
  const [clientList, setClientData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [assignToList, setAssignToList] = useState([]); // Corrected variable name

  const [isAdmin, setAdmin] = useState(false);
  const [ticketManagementPermission, setTicketManagementPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedList = formList.map((row) => (row._id === id ? { ...row, status: newStatus } : row));
      setFormList(updatedList);

      // Call backend to update the status
      await put(`ticket-management/${id}`, { status: newStatus });
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.clientName) newErrors.clientName = 'Client Name is required';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!form.product) newErrors.product = 'Product is required';
    if (!form.serviceType) newErrors.serviceType = 'Service Type is required';
    if (!form.installDate) newErrors.installDate = 'Installation Date is required';
    if (!form.expiryDate) newErrors.expiryDate = 'Service Expiry Date is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.urgency) newErrors.urgency = 'Urgency is required';
    if (!form.AssignTo) newErrors.AssignTo = 'Assign To is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = () => {
    setForm({
      clientName: '',
      phoneNumber: '',
      product: '',
      serviceType: '',
      installDate: null,
      expiryDate: null,
      description: '',
      urgency: '',
      AssignTo: '',
      createdBy: localStorage.getItem('Id')
    });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const refreshData = async () => {
    try {
      const response = await get('ticket-management');
      console.log('Fetched Tickets:', response);
      if (response) {
        if (localStorage.getItem('loginRole') === 'admin') {
          setFormList(response);
        } else {
          // Filter tickets based on user role
          const filteredResponse = response.filter(
            (ticket) => ticket.createdBy === localStorage.getItem('Id') || ticket?.AssignTo?._id === localStorage.getItem('refId')
          );
          setFormList(filteredResponse);
        }
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleEdit = (index) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    const ticket = formList[index];
    setForm({
      ...ticket,
      installDate: ticket.installDate || null,
      expiryDate: ticket.expiryDate || null,
      AssignTo: ticket.AssignTo?._id || ticket.AssignTo || '' // fix!
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    try {
      await remove(`ticket-management/${id}`);
      refreshData();
      toast.success('Ticket deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    if (validate()) {
      if (editIndex !== null) {
        const updatedList = [...formList];
        updatedList[editIndex] = form;
        setFormList(updatedList);
        const id = updatedList[editIndex]._id;
        await put(`ticket-management/${id}`, updatedList[editIndex]);
        toast.success('Ticket updated successfully!');
        refreshData();
      } else {
        try {
          const response = await post('ticket-management', form);
          if (response) {
            toast.success('Ticket Created Successfully!');
            refreshData();
          }
        } catch (error) {
          toast.error('Failed to create ticket');
        }
      }
      setOpen(false);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['ticket-management']) {
      setTicketManagementPermission(systemRights.actionPermissions['ticket-management']);
    }
    const fetchClientDetails = async () => {
      const res = await get('admin-clientRegistration');
      if (res.data && res.status === 'true') {
        // const filteredData = res.data.filter(
        //   (client) => client.createdBy === localStorage.getItem('Id')
        // );
        setClientData(res.data);
      }
    };
    const fetchProductCategory = async () => {
      const response = await get('productOrServiceCategory');
      if (response.status === 'true') {
        setAllProducts(response.data);
      }
    };
    const getStaffName = async () => {
      const response = await get('administrative');
      if (response.data) {
        // AssignTo should be the unique _id or staffId, but display full name
        const dataStaff = response.data.map((item) => ({
          id: item._id || item.staffId || item.basicDetails?.email || item.basicDetails?.firstName,
          name: ((item.basicDetails?.firstName || '') + ' ' + (item.basicDetails?.lastName || '')).trim()
        }));
        setAssignToList(dataStaff);
      }
    };
    const getAllTickets = async () => {
      try {
        const response = await get('ticket-management');
        console.log('ticket response is', response);
        if (response) {
          if (localStorage.getItem('loginRole') === 'admin') {
            setFormList(response);
          } else {
            // Filter tickets based on user role
            const filteredResponse = response.filter(
              (ticket) => ticket.createdBy === localStorage.getItem('Id') || ticket?.AssignTo?._id === localStorage.getItem('refId')
            );
            setFormList(filteredResponse);
          }
        }
      } catch (err) {
        console.log('error', err);
      }
    };
    const fetchStatusOptions = async () => {
      try {
        const res = await get('ticketStatus');
        if (res.data) setStatusOptions(res.data); // expects [{ TicketStatus, colorCode }]
      } catch (error) {
        console.error('Failed to fetch status options', error);
      }
    };

    fetchStatusOptions();
    fetchClientDetails();
    fetchProductCategory();
    getStaffName();
    getAllTickets();
    // eslint-disable-next-line
  }, [systemRights]);

  return (
    <>
      <Breadcrumb title="Ticket Management">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Ticket Management
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Ticket Details</Typography>
            {(ticketManagementPermission.Add === true || isAdmin) && (
              <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                Add Ticket
              </Button>
            )}
          </Grid>
          {formList?.length > 0 && (
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SN</TableCell>
                        <TableCell>Ticket Number</TableCell>
                        <TableCell>Client Name</TableCell>
                        <TableCell>Phone No</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Service Type</TableCell>
                        <TableCell>Installation Date</TableCell>
                        <TableCell>Expiry Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Urgency</TableCell>
                        <TableCell>Assign To</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formList?.map((entry, index) => (
                        <TableRow key={entry._id || index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{entry.TicketNo}</TableCell>
                          <TableCell>
                            <Typography
                              component={Link}
                              to={`/ticket-details/${entry._id}`}
                              variant="subtitle2"
                              sx={{ textDecoration: 'none', color: '#2563eb' }}
                            >
                              {entry.clientName}
                            </Typography>
                          </TableCell>
                          <TableCell>{entry.phoneNumber}</TableCell>
                          <TableCell>{entry.product}</TableCell>
                          <TableCell>{entry.serviceType}</TableCell>
                          <TableCell>{entry.installDate ? new Date(entry.installDate).toLocaleDateString('en-US') : ''}</TableCell>
                          <TableCell>{entry.expiryDate ? new Date(entry.expiryDate).toLocaleDateString('en-US') : ''}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{entry.urgency}</TableCell>
                          <TableCell>{entry?.AssignTo?.basicDetails?.firstName + ' ' + entry?.AssignTo?.basicDetails?.lastName}</TableCell>
                          <TableCell>
                            <Select
                              value={entry.status || statusOptions[0]?.TicketStatus || 'Pending'}
                              onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                              sx={{
                                width: 150,
                                backgroundColor: statusOptions.find((opt) => opt.TicketStatus === entry.status)?.colorCode || '#f0f0f0',
                                color: '#fff',
                                borderRadius: 1
                              }}
                              renderValue={(selected) => <span style={{ color: '#fff' }}>{selected}</span>}
                            >
                              {statusOptions.map((option, i) => (
                                <MenuItem key={option.TicketStatus} value={option.TicketStatus} sx={{ bgcolor: option.colorCode }}>
                                  {option.TicketStatus}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="History" arrow>
                                <IconButton color="primary" component={Link} to={`/ticket-details/${entry._id}`}>
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              {(ticketManagementPermission.Edit === true || isAdmin) && (
                                <IconButton size="small" color="primary" onClick={() => handleEdit(index)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              )}
                              {(ticketManagementPermission.Delete === true || isAdmin) && (
                                <IconButton size="small" color="error" onClick={() => handleDelete(entry._id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Ticket' : 'Add Ticket'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ mx: 'auto', mt: 4 }}>
            <CardContent>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Client Name"
                      name="clientName"
                      value={form.clientName}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.clientName}
                      helperText={errors.clientName}
                    >
                      {clientList?.map((client, i) => (
                        <MenuItem key={client._id || i} value={client.clientName}>
                          {client.clientName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Product"
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.product}
                      helperText={errors.product}
                    >
                      {products?.map((p, i) => (
                        <MenuItem key={p._id || i} value={p.productName}>
                          {p.productName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Service Type"
                      name="serviceType"
                      value={form.serviceType}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.serviceType}
                      helperText={errors.serviceType}
                    >
                      {serviceTypes.map((type, i) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Date of Installation"
                      value={form.installDate}
                      onChange={(value) => handleDateChange('installDate', value)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.installDate,
                          helperText: errors.installDate
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Service Expiry Date"
                      value={form.expiryDate}
                      onChange={(value) => handleDateChange('expiryDate', value)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.expiryDate,
                          helperText: errors.expiryDate
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.description}
                      helperText={errors.description}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Urgency"
                      name="urgency"
                      value={form.urgency}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.urgency}
                      helperText={errors.urgency}
                    >
                      {urgencyLevels.map((level, i) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Assign To"
                      name="AssignTo"
                      value={form.AssignTo}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.AssignTo}
                      helperText={errors.AssignTo}
                    >
                      {assignToList.map((staff) => (
                        <MenuItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default TicketManagement;

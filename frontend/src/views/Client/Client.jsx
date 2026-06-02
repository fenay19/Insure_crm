import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Divider,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import value from 'assets/scss/_themes-vars.module.scss';
import { get, post, put, remove } from '../../api/api.js';
import axios from 'axios';
import TemporaryClientTable from '../Client/Tables/TemporaryClientTable.jsx';
import PermanentClientTalble from 'views/Client/Tables/PermanentClientTable.jsx';
import AdminClientsTable from './Tables/AdminClientsTable.jsx';
import { useSelector } from 'react-redux';
const initialState = {
  clientName: '',
  officialPhoneNo: '',
  altPhoneNo: '',
  officialMailId: '',
  altMailId: '',
  emergencyContactPerson: '',
  emergencyContactNo: '',
  website: '',
  gstNo: '',
  panNo: '',
  logo: null,
  officeAddress: '',
  pincode: '',
  city: '',
  state: '',
  country: '',
  clientType: '',
  startDate: '',
  endDate: '',
  contactPerson: {
    name: '',
    department: '',
    position: '',
    email: '',
    phone: ''
  }
};

const Client = () => {
  const [logoPreview, setLogoPreview] = useState('');
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [typeOfClientList, setTypeOfClientList] = useState([]);
  const [role, setRole] = useState('');

  const [clientList, setClientList] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [departmentList, setDepartmentList] = useState([]);
  const [positionList, setPositionList] = useState([]);

  const navigate = useNavigate();
  // console.log('Token:', document.cookie);

  const [isAdmin, setAdmin] = useState(false);
  const [clientPermission, setClientPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const fetchClients = async () => {
    try {
      const role = localStorage.getItem('loginRole');
      let url = role === 'super-admin' ? 'clientRegistration' : 'admin-clientRegistration';
      const res = await get(url);
      console.log('super admin client', role);
      console.log('super admin client', res);
      if (res.data) {
        const data = res.data.status === 'true' ? res.data.data || res.data : res.data;
        const filteredData = role === 'admin' ? data.filter((client) => client.createdBy === localStorage.getItem('Id')) : data;
        setClientList(filteredData);
      }
      // if (res.data) {
      //   const data = res.data.status === 'true' ? res.data.data || res.data : res.data;
      //   const filteredData = role === 'admin' ? data.filter((client) => client.createdBy === localStorage.getItem('Id')) : data;
      //   setClientList(filteredData);
      // }
    } catch (err) {
      console.error('Error fetching clients:', err);
      toast.error('Failed to fetch clients');
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await get('department');
        console.log('admin department', res);
        if (res.data?.status === 'true') {
          setDepartmentList(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };

    const fetchPositions = async () => {
      try {
        const res = await get('position');
        // console.log('admin position data', res);
        if (res.data?.status === 'true') {
          setPositionList(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching positions:', err);
      }
    };

    fetchDepartments();
    fetchPositions();
  }, []);
  useEffect(() => {
    get('department').then((res) => setDepartmentList(res.data));
    get('position').then((res) => setPositionList(res.data));
  }, []);

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['client']) {
      setClientPermission(systemRights.actionPermissions['client']);
    }
    const role = localStorage.getItem('loginRole');
    setRole(role);
    if (role === 'super-admin') {
      fetchClients();
      const fetchTypeOfClientList = async () => {
        try {
          const res = await get('typeOfClient');
          if (res.data && res.data.status === 'true') {
            setTypeOfClientList(res.data.data);
          }
        } catch (err) {}
      };
      fetchTypeOfClientList();
    } else if (role === 'admin') {
      const fetchAdminClients = async () => {
        try {
          const res = await get('admin-clientRegistration');
          console.log('admin data', res);
          // if (res.data && res.status === 'true') {
          // const filteredData = res.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
          setClientList(res.data);
          // console.log('filteredData data', filteredData);
          // }
        } catch (err) {}
      };
      const fetchTypeOfAdminClientList = async () => {
        try {
          const res = await get('typeOfClient');
          if (res.data && res.data.status === 'true') {
            setTypeOfClientList(res.data.data);
          }
        } catch (err) {}
      };

      fetchTypeOfAdminClientList();
      fetchAdminClients();
    }
  }, [systemRights]);

  const refreshClients = async () => {
    try {
      const role = localStorage.getItem('loginRole');
      if (role === 'super-admin') {
        const res = await get('clientRegistration');
        console.log(' super admin clientRegistrationa data', res);
        if (res.data && res.status === 'true') {
          setClientList(res.data);
        }
      } else if (role === 'admin') {
        const res = await get('admin-clientRegistration');
        console.log('admin registration data', res);
        if (res.data && res.status === 'true') {
          const filteredData = res.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
          setClientList(filteredData);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!form.clientName) newErrors.clientName = 'Client Name is ';
    if (!form.officialPhoneNo) newErrors.officialPhoneNo = 'Official Phone Number is ';
    else if (!form.officialPhoneNo.match(/^[0-9]{10}$/)) newErrors.officialPhoneNo = 'Must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form with data:', form);

    if (!validateForm()) {
      toast.error('Please fix the form errors.');
      return;
    }

    try {
      const clientPayload = {
        ...form,
        contactPerson: [form.contactPerson]
      };

      // Admin does not send clientType
      if (role === 'admin') delete clientPayload.clientType;

      const hasLogo = form.logo && form.logo instanceof File;
      let res;
      const url = editClientId ? `admin-clientRegistration/${editClientId}` : 'admin-clientRegistration';

      if (hasLogo) {
        const formData = new FormData();
        Object.keys(clientPayload).forEach((key) => {
          if (key !== 'logo') {
            if (typeof clientPayload[key] === 'object') {
              formData.append(key, JSON.stringify(clientPayload[key]));
            } else {
              formData.append(key, clientPayload[key]);
            }
          }
        });
        formData.append('logo', form.logo);

        res = editClientId
          ? await put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          : await post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = editClientId ? await put(url, clientPayload) : await post(url, clientPayload);
      }

      console.log('Server response:', res.data);

      if (res.data && res.data._id) {
        // Show dynamic success message
        if (editClientId) {
          toast.success(`Client "${res.data.clientName}" updated successfully!`);
          setClientList((prev) => prev.map((c) => (c._id === editClientId ? res.data : c)));
        } else {
          toast.success(`Client "${res.data.clientName}" added successfully!`);
          setClientList((prev) => [...prev, res.data]);
        }

        setForm(initialState);
        setLogoPreview('');
        setErrors({});
        setEditClientId(null);
        setOpen(false);
      } else {
        console.error('Failed to save client. Unexpected response:', res.data);
        toast.error('Failed to save client');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Error submitting client data');
    }
  };

  const handleEditClient = (client) => {
    const contactPerson = client.contactPerson?.[0] || {};

    setForm({
      ...form,
      clientName: client.clientName || '',
      officialPhoneNo: client.officialPhoneNo || '',
      altPhoneNo: client.altPhoneNo || '',
      officialMailId: client.officialMailId || '',
      altMailId: client.altMailId || '',
      emergencyContactPerson: client.emergencyContactPerson || '',
      emergencyContactNo: client.emergencyContactNo || '',
      website: client.website || '',
      gstNo: client.gstNo || '',
      panNo: client.panNo || '',
      logo: null,
      officeAddress: client.officeAddress || '',
      pincode: client.pincode || '',
      city: client.city || '',
      state: client.state || '',
      country: client.country || '',
      clientType: '', // Admin does not use clientType
      startDate: client.startDate ? new Date(client.startDate) : '',
      endDate: client.endDate ? new Date(client.endDate) : '',
      contactPerson: {
        name: contactPerson.name || '',
        department: contactPerson.department || '', // admin already stores ID
        position: contactPerson.position || '', // admin already stores ID
        email: contactPerson.email || null,
        phone: contactPerson.phone || ''
      }
    });

    setEditClientId(client._id);
    setOpen(true);
    setSelectedClient(client);
    setEditDialogOpen(true);
  };

  const handleDeleteClient = async (id) => {
    try {
      const role = localStorage.getItem('loginRole');

      const url = role === 'super-admin' ? `clientRegistration/${id}` : role === 'admin' ? `admin-clientRegistration/${id}` : null;

      if (!url) {
        toast.error('Unauthorized action');
        return;
      }

      await remove(url);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (err) {
      toast.error('Delete failed');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.includes('.')) {
      // nested field, jaise contactPerson.name
      const keys = name.split('.');
      setForm((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // fetchClients
  const handleDeleteLogo = () => {
    setForm({ ...form, logo: null });
    setLogoPreview('');
  };

  const handlePincodeBlur = async () => {
    if (form.pincode && form.pincode.match(/^[0-9]{6}$/)) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${form.pincode}`);
        const apiData = res.data && res.data[0];
        if (apiData && apiData.Status === 'Success' && apiData.PostOffice && apiData.PostOffice.length > 0) {
          setForm((prev) => ({
            ...prev,
            city: apiData.PostOffice[0].District || '',
            state: apiData.PostOffice[0].State || '',
            country: apiData.PostOffice[0].Country || 'India'
          }));
          setErrors((prev) => ({ ...prev, pincode: undefined }));
        } else {
          setForm((prev) => ({
            ...prev,
            city: '',
            state: '',
            country: ''
          }));
          setErrors((prev) => ({ ...prev, pincode: 'Invalid or not found' }));
          toast.error('Pincode not found. Please enter a valid pincode.');
        }
      } catch (err) {
        setForm((prev) => ({
          ...prev,
          city: '',
          state: '',
          country: ''
        }));
        setErrors((prev) => ({ ...prev, pincode: 'Error fetching pincode details' }));
        toast.error('Error fetching pincode details, Please try again.');
      }
    }
  };
  const handleDateChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fieldGroups = [
    [
      { label: 'Client Name', name: 'clientName' },
      { label: 'Official Phone No.', name: 'officialPhoneNo' },
      { label: 'Alternate Phone No.', name: 'altPhoneNo' },
      { label: 'Official Mail ID', name: 'officialMailId' }
    ],
    [
      { label: 'Alternate Mail ID', name: 'altMailId' },
      { label: 'Emergency Contact Person', name: 'emergencyContactPerson' },
      { label: 'Emergency Contact No.', name: 'emergencyContactNo' }
      // { label: 'Website', name: 'website' }
    ],
    [
      { label: 'GST No.', name: 'gstNo' },
      { label: 'PAN No.', name: 'panNo' },
      { label: 'Pincode', name: 'pincode' },
      { label: 'City', name: 'city' }
    ],
    [],
    [
      { label: 'State', name: 'state' },
      { label: 'Country', name: 'country' }
      // { label: 'Type Of Client', name: 'clientType' },
      // { label: 'Office Address', name: 'officeAddress'}
    ]
  ];

  const contactPersonFields = [
    [
      { label: 'Name', name: 'contactPerson.name' },
      { label: 'Department', name: 'contactPerson.department' },
      { label: 'Position', name: 'contactPerson.position' }
    ],
    [
      { label: 'Email', name: 'contactPerson.email' },
      { label: 'Phone No.', name: 'contactPerson.phone' }
    ]
  ];

  const [selectedType, setSelectedType] = useState('temporary');

  const radioOptions = [
    { label: 'Temporary', value: 'temporary' },
    { label: 'Permanent', value: 'permanent' }
  ];

  const handleRadioChange = (e) => {
    setSelectedType(e.target.value);
  };
  const renderTable = () => {
    switch (selectedType) {
      case 'temporary':
        return (
          <TemporaryClientTable
            clientList={clientList}
            refreshClients={refreshClients}
            handleEditClient={handleEditClient}
            handleDeleteClient={handleDeleteClient}
            clientPermission={clientPermission}
            isAdmin={isAdmin}
          />
        );
      case 'permanent':
        return (
          <PermanentClientTalble
            clientList={clientList}
            refreshClients={refreshClients}
            handleEditClient={handleEditClient}
            handleDeleteClient={handleDeleteClient}
            clientPermission={clientPermission}
            isAdmin={isAdmin}
          />
        );
      default:
        return null;
    }
  };
  const renderAdminClientsTable = () => {
    return (
      <AdminClientsTable
        clientList={clientList}
        refreshClients={refreshClients}
        handleEditClient={handleEditClient}
        handleDeleteClient={handleDeleteClient}
      />
    );
  };
  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Client
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Client Details</Typography>
            {(clientPermission.Add === true || isAdmin || localStorage.getItem('loginRole') === 'super-admin') && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  if (localStorage.getItem('expired') === 'true') {
                    toast.error('Subscription has ended. Please subscribe to continue working.');
                    return;
                  }
                  navigate('/client/AddClient');
                }}
              >
                Add Client
              </Button>
            )}
          </Grid>
          {role === 'super-admin' && (
            <RadioGroup row value={selectedType} onChange={handleRadioChange}>
              {radioOptions.map((opt) => (
                <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
              ))}
            </RadioGroup>
          )}

          <Card>
            {role === 'super-admin' && renderTable()}
            {role === 'admin' && renderAdminClientsTable()}
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditClientId(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editClientId ? 'Edit Client' : 'Add Client'}
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpen(false);
              setEditClientId(null);
            }}
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
          <Typography variant="h5" gutterBottom>
            Client Registration
          </Typography>
          <Card>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {fieldGroups.map((group, idx) => (
                  <React.Fragment key={idx}>
                    {group.map((field) => {
                      if (field.name === 'pincode') {
                        return (
                          <Grid item xs={12} sm={3} key={field.name}>
                            <TextField
                              label={field.label}
                              name={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              onBlur={handlePincodeBlur}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]}
                              fullWidth
                              required={['clientName', 'officialPhoneNo', 'officialMailId'].includes(field.name)}
                            />
                          </Grid>
                        );
                      }
                      if (field.name === 'clientType') {
                        return (
                          <Grid item xs={12} sm={3} key={field.name}>
                            {/* <TextField
                              select
                              label={field.label}
                              name={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]}
                              fullWidth
                              
                            >
                              <MenuItem value="">
                                <em>Select Type Of Client</em>
                              </MenuItem>
                              {typeOfClientList.map((type) => (
                                <MenuItem key={type._id} value={type._id}>
                                  {type.typeOfClient}
                                </MenuItem>
                              ))}
                            </TextField> */}
                            <TextField
                              select
                              label="Type Of Client"
                              name="clientType"
                              value={form.clientType || ''} // must be _id of type
                              onChange={handleChange}
                              error={!!errors.clientType}
                              helperText={errors.clientType}
                              fullWidth
                            >
                              <MenuItem value="">
                                <em>Select Type Of Client</em>
                              </MenuItem>
                              {typeOfClientList.map((type) => (
                                <MenuItem key={type._id} value={type._id}>
                                  {type.typeOfClient}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        );
                      }
                      return (
                        <Grid item xs={12} sm={3} key={field.name}>
                          <TextField
                            label={field.label}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            fullWidth={!['altPhoneNo', 'altMailId', 'panNo'].includes(field.name)}
                            multiline={field.multiline}
                            rows={field.multiline ? 2 : 1}
                          />
                        </Grid>
                      );
                    })}
                  </React.Fragment>
                ))}
                <Grid item xs={12} sm={3}>
                  <TextField type="file" label="Logo" name="logo" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                  {logoPreview && (
                    <Box position="relative" mt={2}>
                      <img src={logoPreview} alt="Logo" style={{ width: 100, borderRadius: 4 }} />
                      <IconButton
                        size="small"
                        onClick={handleDeleteLogo}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          left: -8,
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          boxShadow: 1,
                          '&:hover': { backgroundColor: '#f8d7da', color: 'red' }
                        }}
                      >
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <ToastContainer />

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Contact Person
          </Typography>
          <Card>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {contactPersonFields.map((group, idx) => (
                  <React.Fragment key={idx}>
                    {group.map((field) => (
                      <Grid item xs={12} sm={4} key={field.name}>
                        {field.name === 'contactPerson.department' ? (
                          <TextField
                            select
                            label={field.label}
                            name={field.name}
                            value={form.contactPerson.department}
                            onChange={handleChange}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>Select Department</em>
                            </MenuItem>
                            {departmentList?.map((dept) => (
                              <MenuItem key={dept._id} value={dept._id}>
                                {dept.department}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : field.name === 'contactPerson.position' ? (
                          <TextField
                            select
                            label={field.label}
                            name={field.name}
                            value={form.contactPerson.position}
                            onChange={handleChange}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>Select Position</em>
                            </MenuItem>
                            {positionList?.map((pos) => (
                              <MenuItem key={pos._id} value={pos._id}>
                                {pos.position}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <TextField
                            label={field.label}
                            name={field.name.split('.')[1]}
                            value={form.contactPerson[field.name.split('.')[1]]}
                            onChange={handleChange}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            fullWidth
                          />
                        )}
                      </Grid>
                    ))}
                  </React.Fragment>
                ))}
                {/* <Grid item xs={12}>
                  <Button onClick={handleClientSubmit} variant="contained" color="primary">
                    {editClientId ? 'Update' : 'Submit'}
                  </Button>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpen(false);
              setEditClientId(null);
            }}
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
            onClick={handleClientSubmit}
            variant="contained"
            sx={{
              minWidth: '40px',
              padding: '2px',
              backgroundColor: value.primaryLight
            }}
          >
            <IconButton color="inherit">{<SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Client;

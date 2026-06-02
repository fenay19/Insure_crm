import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableHead,
  Table,
  TableCell,
  TableRow,
  MenuItem,
  TableBody,
  Box,
  TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast, ToastContainer } from 'react-toastify';
import { get, post, put, remove } from '../../api/api.js';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Refresh } from '@mui/icons-material';

const Contacts = () => {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    phoneNo: '',
    email: '',
    designation: '',
    department: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [positions, setPosition] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [contactsPermission, setContactsPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['contacts']) {
      setContactsPermission(systemRights.actionPermissions['contacts']);
    }
    fetchContacts();
    fetchDepartments();
  }, [systemRights]);

  const fetchContacts = async () => {
    try {
      const res = await get('contact');
      // console.log('Contact data:', res.data);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load contacts');
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await get('department');
      const dres = await get('position');
      setPosition(dres.data || []);
      setDeptOptions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load departments');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // if (!form.companyName) newErrors.companyName = 'Required';
    if (!form.contactName) newErrors.contactName = 'Required';
    if (!/^[0-9]{10}$/.test(form.phoneNo)) newErrors.phoneNo = '10 digits only';
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    // if (!form.designation) newErrors.designation = 'Required';
    // if (!form.department) newErrors.department = 'Select a department';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      companyName: form.companyName,
      name: form.contactName,
      phone: form.phoneNo,
      email: form.email,
      designation: form.designation,
      department: form.department
    };

    try {
      if (editIndex !== null) {
        const toUpdate = data[editIndex];
        await put(`contact/${toUpdate._id}`, payload);
        toast.success('Contact updated');
      } else {
        await post('contact', payload);
        toast.success('Contact added');
      }
      fetchContacts();
      handleClose();
    } catch (e) {
      console.error(e);
      toast.error('Submission failed');
    }
  };

  const handleDelete = async (index) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    try {
      const toDelete = data[index];
      await remove(`contact/${toDelete._id}`);
      toast.success('Deleted');
      fetchContacts();
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    }
  };

  const filteredData =
    data?.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  const handleEdit = (index) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    const c = data[index];
    setForm({
      companyName: c.companyName || '',
      contactName: c.name || '',
      phoneNo: c.phone || '',
      email: c.email || '',
      designation: typeof c.designation === 'object' ? c.designation.designation : c.designation || '',
      department: typeof c.department === 'object' ? c.department.department : c.department || ''
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleOpen = () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    setForm({
      companyName: '',
      contactName: '',
      phoneNo: '',
      email: '',
      designation: '',
      department: ''
    });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/">
          Home
        </Typography>
        <Typography>Contacts</Typography>
      </Breadcrumb>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editIndex != null ? 'Edit Contact' : 'Add Contact'}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              ['companyName', 'Company Name'],
              ['contactName', 'Contact Name'],
              ['phoneNo', 'Phone Number'],
              ['email', 'Email']
              // ['designation', 'Designation']
            ].map(([name, label]) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  error={!!errors[name]}
                  helperText={errors[name]}
                  fullWidth
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                error={!!errors.designation}
                helperText={errors.designation}
                fullWidth
              >
                {positions.length > 0 ? (
                  positions.map((d) => (
                    <MenuItem key={d._id} value={d.position}>
                      {d.position}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No position found</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                error={!!errors.department}
                helperText={errors.department}
                fullWidth
              >
                {deptOptions.length > 0 ? (
                  deptOptions.map((d) => (
                    <MenuItem key={d._id} value={d.department}>
                      {d.department}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No departments found</MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            <CancelIcon />
          </Button>
          <Button onClick={handleSubmit}>
            <SaveIcon />
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Contact List
            </Typography>

            <Box display="flex" gap={2}>
              <TextField
                label="Search"
                size="small"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Button variant="outlined" color="primary" startIcon={<Refresh />}>
                Refresh
              </Button>
              {(contactsPermission.Add === true || isAdmin) && (
                <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
                  Add Contact
                </Button>
              )}
            </Box>
          </Box>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c, i) => (
                  <TableRow sx={{ verticalAlign: 'top' }} key={c._id || i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{c.companyName}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.designation}</TableCell>
                    <TableCell>{typeof c.department === 'object' ? c.department.department : c.department || 'N/A'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {(contactsPermission.Edit === true || isAdmin) && (
                          <IconButton color="primary" onClick={() => handleEdit(i)}>
                            <EditIcon />
                          </IconButton>
                        )}
                        {(contactsPermission.Delete === true || isAdmin) && (
                          <IconButton color="error" onClick={() => handleDelete(i)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

export default Contacts;

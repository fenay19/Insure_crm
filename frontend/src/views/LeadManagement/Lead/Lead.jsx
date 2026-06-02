import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableHead,
  MenuItem,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Await, Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Edit, Delete, Info as InfoIcon, PersonAdd } from '@mui/icons-material';

import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';
// import LeadStatus from '../../master/Lead-status/LeadStatus.jsx';

const Lead = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [addFollowIndex, setAddFollowIndex] = useState(null);
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    followupDate: '',
    followupTime: '',
    leadstatus: '',
    comment: '',
    leadId: ''
  });
  const [followUpData, setFollowUpData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [openAddFollowUp, setOpenAddFollowUp] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [done, setDone] = useState(false);
  const [editFollowUpId, setEditFollowUpId] = useState(null);
  const [isDisableConvertClient, setDisableConvertClient] = useState(null);

  const [isAdmin, setAdmin] = useState(false);
  const [leadPermission, setLeadPermission] = useState({
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
    if (systemRights?.actionPermissions?.['lead']) {
      setLeadPermission(systemRights.actionPermissions['lead']);
    }
    fetchLeadStatusOptions();
  }, [systemRights]);

  const fetchLeadStatusOptions = async () => {
    try {
      const response = await get('leadstatus');
      setStatusOptions(response.data || []);
    } catch (err) {
      toast.error('Failed to load leadstatus options');
      console.error(err);
    }
  };

  const fetchFollowUps = async (leadId) => {
    try {
      const response = await get(`lead/followup`);
      setFollowUpData(response.data || []);
    } catch (err) {
      console.error('Error loading followups:', err);
      toast.error('Unable to fetch follow-up data');
    }
  };

  async function getLeadData() {
    try {
      const loginRole = localStorage.getItem('loginRole');
      const employeeId = localStorage.getItem('empId');

      let url = 'lead';
      if (loginRole === 'staff' && employeeId) {
        url += `/${employeeId}`;
        console.log('is staff');
      }

      // console.log(url);

      const response = await get(url);
      // console.log('response data is', response);

      const sortedData = (response.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setData(sortedData);
    } catch (error) {
      toast.error('Failed to fetch lead data');
      console.error(error);
    }
  }

  const handleDeleteLead = async (id) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await remove(`lead/${id}`);

      setData((prevData) => prevData.filter((item) => item._id !== id));
      toast.success('Lead deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete lead');
    }
  };

  useEffect(() => {
    getLeadData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInfoClose = () => {
    setOpenAddFollowUp(false);
    setForm({
      followupDate: '',
      followupTime: '',
      leadstatus: '',
      comment: ''
    });
    setAddFollowIndex(null);
    setEditFollowUpId(null);
    setIsEditMode(false);
  };

  const handleopenAddFollowUp = (leadId) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    console.log(leadId);
    setAddFollowIndex(leadId);
    fetchFollowUps(leadId);
    setOpenAddFollowUp(true);
    const selectedLead = followUpData.find((lead) => String(lead._id) === String(leadId));
    setDone(selectedLead?.status === 'LS' || selectedLead?.status === 'LW');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFollowUp = (id, data) => {
    setEditFollowUpId(id);
    setIsEditMode(true);
    setForm({
      followupDate: data.followupDate || '',
      followupTime: data.followupTime || '',
      leadstatus: data.leadstatus?._id || data.leadstatus || '',
      comment: data.comment || ''
    });
    // const selectedLead = followUpData.find((lead) => String(lead._id) === String(addFollowIndex));
    // setDone(selectedLead?.status === 'ls' || selectedLead?.status === 'lw');
  };

  const handleDeleteFollowUp = async (followUpId) => {
    try {
      await remove(`lead/followup/${followUpId}`);
      toast.success('Follow-up deleted');
      setFollowUpData((prev) => prev.filter((item) => item._id !== followUpId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete follow-up');
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && editFollowUpId) {
        await put(`lead/followup/${editFollowUpId}`, form);
        toast.success('Follow-up updated successfully');
      } else {
        const payload = { ...form, leadId: addFollowIndex };
        await post('lead/followup', payload);
        toast.success('Follow-up added successfully');
      }

      await fetchFollowUps(addFollowIndex);
      await getLeadData();

      setForm({
        followupDate: '',
        followupTime: '',
        leadstatus: '',
        comment: ''
      });
      setEditFollowUpId(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save follow-up');
    }
  };

  const handleCoverToClient = async (data, index) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    try {
      // Step 1: Generate current date and +6 months
      const today = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(today.getMonth() + 6);

      const formatCustomDate = (date) =>
        date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        });

      // console.log('data', data);

      const formattedStartDate = formatCustomDate(today);
      const formattedEndDate = formatCustomDate(sixMonthsLater);
      const formData = {
        clientName: data?.Prospect?.companyName || data.Client?.clientName || data.newCompanyName,
        officialPhoneNo: data.phoneNo,
        altPhoneNo: data.altPhoneNo,
        officialMailId: data.email,
        altMailId: data.altEmail,
        emergencyContactPerson: '',
        emergencyContactNo: '',
        website: '',
        gstNo: '',
        panNo: '',
        logo: null,
        officeAddress: data.address,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        createdBy: localStorage.getItem('Id') || '',
        contactPerson: (data.contact || []).map((c) => ({
          name: c.name || '',
          department: c.department || '',
          position: c.designation || c.position || '',
          email: c.email || '',
          phone: c.phone || ''
        }))
      };
      setDisableConvertClient(index);
      // console.log('form data is conver to client', formData);
      const res = await post('admin-clientRegistration', formData);
      if (res.status === true) {
        setDisableConvertClient(null);
        toast.success('converted to client!');
      }
    } catch (err) {
      toast.error('convert to client failed!');
    }
  };

  // color helper for leadstatus
  const getLeadStatusColor = (leadstatus) => {
    if (!leadstatus) return '#9e9e9e';
    // leadstatus can be populated object or string id
    const statusObj = typeof leadstatus === 'object' ? leadstatus : statusOptions.find((s) => s._id === leadstatus);
    return statusObj?.colorCode || '#9e9e9e';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((row) =>
    (row.Prospect?.companyName || row.Client?.clientName || row.newCompanyName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const getValue = (row, key) => {
      switch (key) {
        case 'organization':
          return row.Prospect?.companyName || row.Client?.clientName || row.newCompanyName || '';
        case 'number':
          return row.phoneNo || '';
        case 'city':
          return row.city || '';
        case 'category':
          return row.Client ? 'Client' : row.Prospect ? 'Prospect' : 'New Lead';
        case 'leadstatus':
          return row.leadstatus?.LeadStatus || '';
        case 'product':
          return row.productService?.subProductName || productsLabel(row.productService) || '';
        default:
          return '';
      }
    };

    const aVal = getValue(a, sortConfig.key);
    const bVal = getValue(b, sortConfig.key);

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const leadStatusChange = async (status) => {
    try {
      const selectedLead = followUpData.find((lead) => String(lead._id) === String(addFollowIndex));

      if (!selectedLead) {
        toast.error('No lead selected');
        return;
      }

      const confirmAction = window.confirm(`Are you sure you want to mark this lead as ${status === 'LW' ? 'Won' : 'Lost'}?`);

      if (!confirmAction) return;

      const response = await put(`lead/leadban/${selectedLead._id}`, { status }, { params: { companyId: selectedLead.companyId } });

      console.log(response);

      if (response.success) {
        toast.success(`Lead marked as ${status === 'LW' ? 'Won' : 'Lost'}`);
      } else {
        toast.error(response.message || 'Failed to update lead status');
      }
      handleInfoClose();
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Breadcrumb title="Lead Details">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Lead Details
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Divider />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Lead List
                </Typography>
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="Search by organization"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {(leadPermission.Add === true || isAdmin) && (
                    <Button variant="contained" color="primary" component={Link} to="/lead-management/AddLead">
                      <AddIcon /> Add Lead
                    </Button>
                  )}
                </Box>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell onClick={() => handleSort('organization')}>Organization</TableCell>
                    <TableCell onClick={() => handleSort('number')}>Number</TableCell>
                    <TableCell onClick={() => handleSort('city')}>City</TableCell>
                    <TableCell onClick={() => handleSort('category')}>Category</TableCell>
                    <TableCell onClick={() => handleSort('leadstatus')}>Leadstatus</TableCell>
                    <TableCell onClick={() => handleSort('product')}>Product</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No leads found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow key={row._id}>
                        <TableCell>{index + 1}</TableCell>
                        {/* <TableCell>
                          {row.firstName} {row.lastName}
                        </TableCell> */}
                        <TableCell>{row.Prospect?.companyName || row.Client?.clientName || row.newCompanyName || 'N/A'}</TableCell>
                        <TableCell>{row.phoneNo}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell> {row.Client ? 'Client' : row.Prospect ? 'Prospect' : 'New Lead' || 'N/A'}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor:
                                row.status === 'LS'
                                  ? '#ffcccc' // light red
                                  : row.status === 'LW'
                                    ? '#ccffcc' // light green
                                    : getLeadStatusColor(row.leadstatus),
                              color:
                                row.status === 'LS'
                                  ? '#b30000' // dark red
                                  : row.status === 'LW'
                                    ? '#006600' // dark green
                                    : '#000000',
                              padding: '4px 10px',
                              borderRadius: '10px',
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              minWidth: '80px',
                              textAlign: 'center'
                            }}
                          >
                            {row.status === 'LS'
                              ? 'Lead Lost'
                              : row.status === 'LW'
                                ? 'Lead Won'
                                : row.leadstatus?.LeadStatus ||
                                  statusOptions.find((opt) => opt._id === row.leadstatus)?.LeadStatus ||
                                  'N/A'}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {/* handle both populated and raw id */}
                          {row.productService?.subProductName || productsLabel(row.productService) || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            {(leadPermission.Edit === true || isAdmin) && (
                              <Button
                                size="small"
                                component={Link}
                                to={`/lead-management/EditLead/${row._id}`}
                                startIcon={<Edit color="primary" />}
                                sx={{ minWidth: '32px', height: '32px' }}
                              />
                            )}
                            {(leadPermission.Delete === true || isAdmin) && (
                              <Button
                                size="small"
                                startIcon={<Delete color="error" />}
                                sx={{ minWidth: '32px', height: '32px' }}
                                onClick={() => handleDeleteLead(row._id)}
                              />
                            )}
                            <IconButton onClick={() => handleopenAddFollowUp(row._id)}>
                              <InfoIcon sx={{ color: 'primary.main' }} />
                            </IconButton>
                            <Tooltip title="Convert to Client" arrow onClick={() => handleCoverToClient(row, index)}>
                              <IconButton
                                size="medium"
                                variant="contained"
                                color="success"
                                disabled={isDisableConvertClient === index || row.Client}
                              >
                                <PersonAdd />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ToastContainer />

      {/* Follow-Up Modal */}
      <Dialog open={openAddFollowUp} onClose={handleInfoClose} maxWidth="lg" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Follow-Up' : 'Add Follow-Up'}</DialogTitle>
        <Divider />
        <DialogContent>
          {addFollowIndex !== null && (
            <Box>
              <Card
                sx={{
                  mb: 2,
                  // p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: 'background.paper'
                }}
              >
                <CardContent>
                  {(() => {
                    const selectedLead = followUpData.find((lead) => String(lead._id) === String(addFollowIndex));

                    if (!selectedLead) return <Typography>No lead data found</Typography>;

                    return (
                      <Box>
                        <Typography variant="h5" fontWeight="600" gutterBottom color="primary">
                          {selectedLead.companyName || 'Unnamed Lead'}
                        </Typography>

                        <Divider sx={{ mb: 1.5 }} />

                        <Grid container spacing={1.5}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Contact Name:</strong> {selectedLead?.contact?.[0]?.name || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Phone:</strong> {selectedLead.phoneNo || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Product/Service:</strong> {selectedLead.productService?.subProductName || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Category:</strong> {selectedLead.leadCategory || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Box
                              sx={{
                                mt: 1,
                                p: 1,
                                borderRadius: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor:
                                  selectedLead?.status === 'LW'
                                    ? '#d4edda' // light green background
                                    : selectedLead?.status === 'LS'
                                      ? '#f8d7da' // light red background
                                      : selectedLead?.leadstatus?.colorCode
                                        ? selectedLead?.leadstatus?.colorCode + '20'
                                        : 'grey.100',
                                color:
                                  selectedLead?.status === 'LW'
                                    ? '#155724' // dark green text
                                    : selectedLead?.status === 'LS'
                                      ? '#721c24' // dark red text
                                      : selectedLead?.leadstatus?.colorCode || 'text.primary'
                              }}
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  bgcolor:
                                    selectedLead?.status === 'LW'
                                      ? '#28a745' // solid green dot
                                      : selectedLead?.status === 'LS'
                                        ? '#dc3545' // solid red dot
                                        : selectedLead?.leadstatus?.colorCode || 'grey.500'
                                }}
                              />
                              <Typography variant="body2">
                                <strong>Lead Status:</strong>{' '}
                                {selectedLead?.status === 'LS'
                                  ? 'Lead Lost'
                                  : selectedLead?.status === 'LW'
                                    ? 'Lead Won'
                                    : selectedLead?.leadstatus?.LeadStatus || 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        name="followupDate"
                        value={form.followupDate || ''}
                        label="Follow Up Date"
                        type="date"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                        disabled={done}
                      />
                      <TextField
                        fullWidth
                        name="followupTime"
                        value={form.followupTime || ''}
                        label="Follow Up Time"
                        type="time"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                        disabled={done}
                      />
                      <TextField
                        fullWidth
                        select
                        name="leadstatus"
                        value={form.leadstatus || ''}
                        label="Leadstatus"
                        onChange={handleChange}
                        margin="dense"
                        disabled={done}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option._id} value={option._id}>
                            {option.LeadStatus}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        name="comment"
                        value={form.comment || ''}
                        label="Comment"
                        onChange={handleChange}
                        multiline
                        rows={5}
                        margin="dense"
                        disabled={done}
                      />
                      <Button variant="contained" color="primary" disabled={done} onClick={handleSubmit} sx={{ mt: 2, mr: 2 }}>
                        {isEditMode ? 'Update' : 'Submit'}
                      </Button>
                      <Button
                        variant="contained"
                        disabled={done}
                        color="success"
                        onClick={() => leadStatusChange('LW')}
                        sx={{ mt: 2, mr: 2 }}
                      >
                        Lead Won
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        disabled={done}
                        onClick={() => leadStatusChange('LS')}
                        sx={{ mt: 2, mr: 2 }}
                      >
                        Lead Lost
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Follow-Up History
                          </Typography>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Leadstatus</TableCell>
                                <TableCell>Comments</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Array.isArray(followUpData) && followUpData.length > 0 ? (
                                (followUpData.find((d) => String(d._id) === String(addFollowIndex))?.followups || [])
                                  .slice() // make a shallow copy
                                  .reverse()
                                  .map((data, index) => (
                                    <TableRow key={data._id || index}>
                                      <TableCell>{data.followupDate || 'N/A'}</TableCell>
                                      <TableCell>{data.followupTime || 'N/A'}</TableCell>
                                      <TableCell>
                                        {statusOptions.find((opt) => opt._id === data.leadstatus)?.LeadStatus ||
                                          data.leadstatus?.LeadStatus ||
                                          'N/A'}
                                      </TableCell>
                                      <TableCell>{data.comment || 'N/A'}</TableCell>
                                      <TableCell>
                                        <Box display="flex" alignItems="center">
                                          <IconButton
                                            onClick={() =>
                                              handleEditFollowUp(data._id, {
                                                followupDate: data.followupDate,
                                                followupTime: data.followupTime,
                                                leadstatus: data.leadstatus?._id || data.leadstatus,
                                                comment: data.comment
                                              })
                                            }
                                          >
                                            <Edit color="primary" />
                                          </IconButton>
                                          <IconButton onClick={() => handleDeleteFollowUp(data._id)}>
                                            <Delete color="error" />
                                          </IconButton>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} align="center">
                                    No follow-ups found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Helper to fetch product name for table cell (if not populated)
  function productsLabel(prod) {
    if (!prod) return '';
    // prod populated: {productName: ...}
    if (prod.productName) return prod.productName;
    // fallback: raw id, try lookup (if you can access all products in state)
    // ... implement as needed ...
    return prod;
  }
};

export default Lead;

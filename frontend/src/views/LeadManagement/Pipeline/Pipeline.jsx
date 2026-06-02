import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { toast, ToastContainer } from 'react-toastify';
import { get, post, put, remove } from '../../../api/api.js';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { Table } from 'react-bootstrap';
import { Delete, Edit } from '@mui/icons-material';

const Pipeline = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [data, setData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [editFollowUpId, setEditFollowUpId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [followUpData, setFollowUpData] = useState([]);
  const [filters, setFilters] = useState({
    staffName: '',
    productName: '',
    prospects: '',
    status: ''
  });
  const [draggedLead, setDraggedLead] = useState(null);
  const [openAddFollowUp, setOpenAddFollowUp] = useState(false);
  const [form, setForm] = useState({
    followupDate: '',
    followupTime: '',
    leadstatus: '',
    comment: '',
    leadId: ''
  });
  const [addFollowIndex, setAddFollowIndex] = useState(null);
  const navigate = useNavigate();
  // Fetch statuses
  const fetchLeadStatuses = async () => {
    try {
      const response = await get('leadStatus');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await get('lead');
      setLeads(response.data || []);
      setFilteredData(response.data || []); // Initialize filteredData with all leads
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeadStatuses();
    fetchLeads();
  }, []);

  // Apply filters when "Get" button is clicked
  const applyFilters = () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    const { staffName, productName, prospects, status } = filters;

    const filtered = leads.filter((lead) => {
      const leadStaff = `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.toLowerCase();
      const leadProduct = lead.productService?.subProductName?.toLowerCase() || '';
      const leadProspects = (lead.Client ? 'client' : lead.Prospect ? 'prospect' : 'new lead').toLowerCase();
      const leadStatus = typeof lead.leadstatus === 'object' ? lead.leadstatus?.LeadStatus?.toLowerCase() : lead.leadstatus?.toLowerCase();

      return (
        (!staffName || leadStaff.includes(staffName.toLowerCase())) &&
        (!productName || leadProduct.includes(productName.toLowerCase())) &&
        (!prospects || leadProspects === prospects.toLowerCase()) &&
        (!status || leadStatus === status.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  // Clear filters and reset the filteredData to all leads
  const handleReset = () => {
    setFilters({
      staffName: '',
      productName: '',
      prospects: '',
      status: ''
    });
    setFilteredData(leads);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Group leads by status id for display
  // Group leads by status id for display and sort by next follow-up date
  // const groupedLeadsByStatus = Object.fromEntries(
  //   (data || []).map((status) => {
  //     const statusId = status._id;
  //     const matchingLeads = (filteredData || [])
  //       .filter((lead) => {
  //         const leadStatusId = typeof lead.leadstatus === 'object' ? lead.leadstatus._id : lead.leadstatus;
  //         return leadStatusId === statusId;
  //       })
  //       .sort((a, b) => {
  //         const dateA = a.followups?.length ? new Date(a.followups[a.followups.length - 1].followupDate) : new Date(0);
  //         const dateB = b.followups?.length ? new Date(b.followups[b.followups.length - 1].followupDate) : new Date(0);
  //         return dateA - dateB; // closest date first
  //       });

  //     return [statusId, matchingLeads];
  //   })
  // );

  const groupedLeadsByStatus = Object.fromEntries(
    (data || []).map((status) => {
      const statusId = status._id;
      const matchingLeads = (filteredData || [])
        .filter((lead) => {
          // Ignore leads whose status is 'LS' or 'LW'
          if (lead.status === 'LS' || lead.status === 'LW') return false;

          // Match by leadstatus id
          const leadStatusId = typeof lead.leadstatus === 'object' ? lead.leadstatus._id : lead.leadstatus;
          return leadStatusId === statusId;
        })
        .sort((a, b) => {
          const dateA = a.followups?.length ? new Date(a.followups[a.followups.length - 1].followupDate) : new Date(0);
          const dateB = b.followups?.length ? new Date(b.followups[b.followups.length - 1].followupDate) : new Date(0);
          return dateA - dateB; // closest date first
        });

      return [statusId, matchingLeads];
    })
  );

  const groupedLS = (filteredData || []).filter((lead) => lead.status === 'LS');
  const groupedLW = (filteredData || []).filter((lead) => lead.status === 'LW');

  // Drag logic
  const onDragStart = (e, lead) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, statusId) => {
    e.preventDefault();
    if (!draggedLead) return;

    try {
      const newLead = {
        ...draggedLead,
        leadstatus: statusId
      };
      delete newLead._id;

      const response = await post('lead', newLead);
      if (response && response.data) {
        setLeads((prevLeads) => [...prevLeads, response.data]);
        setFilteredData((prevLeads) => [...prevLeads, response.data]);
        toast.success('Lead copied to new status successfully!');
      } else {
        toast.error('No data returned from server');
      }
    } catch (error) {
      toast.error('Failed to copy lead.');
      console.error(error);
    }

    setDraggedLead(null);
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
  const fetchFollowUps = async (leadId) => {
    try {
      const response = await get(`lead/followup`);
      setFollowUpData(response.data || []);
    } catch (err) {
      console.error('Error loading followups:', err);
      toast.error('Unable to fetch follow-up data');
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && editFollowUpId) {
        await put(`lead/followup/${editFollowUpId}`, form);
        toast.success('Follow-up updated successfully');
      } else {
        // console.log(form, addFollowIndex);
        const payload = { ...form, leadId: addFollowIndex };
        await post('lead/followup', payload);
        toast.success('Follow-up added successfully');
      }

      await fetchFollowUps(addFollowIndex);
      // await getLeadData();

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
  // console.log(groupedLeadsByStatus);
  const handleopenAddFollowUp = (leadId) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    setAddFollowIndex(leadId);
    fetchFollowUps(leadId);
    setOpenAddFollowUp(true);
  };
  // Delete lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await remove(`lead/${leadId}`);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
      setFilteredData((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
      toast.success('Lead deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete lead.');
      console.error(error);
    }
  };
  const fetchLeadStatusOptions = async () => {
    try {
      const response = await get('leadstatus');
      setStatusOptions(response.data || []);
    } catch (err) {
      toast.error('Failed to load leadstatus options');
      console.error(err);
    }
  };

  function calculateTotalAmount(arr) {
    if (!Array.isArray(arr)) return 0;

    return arr.reduce((sum, item) => {
      const value = Number(item.projectValue) || 0; // convert string to number, fallback to 0
      return sum + value;
    }, 0);
  }

  useEffect(() => {
    fetchLeadStatusOptions();
  }, []);

  console.log(groupedLeadsByStatus);

  return (
    <>
      <Breadcrumb title="Pipeline" className="breadcrumb">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Pipeline
        </Typography>
      </Breadcrumb>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <Grid container spacing={2}>
                  {/* Staff Name Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Staff Name
                    </Box>
                    <TextField select label="Staff Name" name="staffName" value={filters.staffName} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {[
                        ...new Set(
                          leads.map((lead) =>
                            `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim()
                          )
                        )
                      ]
                        .filter(Boolean)
                        .map((name, idx) => (
                          <MenuItem key={idx} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  {/* Product Name Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Product Name
                    </Box>
                    <TextField
                      select
                      label="Product"
                      name="productName"
                      value={filters.productName}
                      onChange={handleFilterChange}
                      fullWidth
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(leads.map((lead) => lead.productService?.subProductName).filter(Boolean))].map((product, idx) => (
                        <MenuItem key={idx} value={product}>
                          {product}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Prospects Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Type Of Lead
                    </Box>
                    <TextField
                      select
                      label="Type Of Lead"
                      name="prospects"
                      value={filters.prospects}
                      onChange={handleFilterChange}
                      fullWidth
                    >
                      <MenuItem value="">All</MenuItem>
                      {/* Use lowercase values for consistency */}
                      {['client', 'prospect', 'new lead'].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Status Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Status
                    </Box>
                    <TextField select label="Status" name="status" value={filters.status} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {data?.map((s) => (
                        <MenuItem key={s._id} value={s.LeadStatus}>
                          {s.LeadStatus}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Buttons */}
                  <Grid item xs={12} sm={6} md={3} display="flex" alignItems="flex-end" gap={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ width: '60px', height: '40px' }}
                      onClick={applyFilters} // Trigger filtering
                    >
                      Get
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        backgroundColor: 'red',
                        width: '60px',
                        height: '40px',
                        color: 'white',
                        borderColor: 'red',
                        '&:hover': {
                          backgroundColor: '#cc0000',
                          borderColor: '#cc0000'
                        }
                      }}
                      onClick={handleReset} // Reset filters
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                                bgcolor: selectedLead?.leadstatus?.colorCode
                                  ? selectedLead?.leadstatus?.colorCode + '20' // faint background
                                  : 'grey.100',
                                color: selectedLead?.leadstatus?.colorCode || 'text.primary'
                              }}
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  bgcolor: selectedLead?.leadstatus?.colorCode || 'grey.500'
                                }}
                              />
                              <Typography variant="body2">
                                <strong>Lead Status:</strong> {selectedLead?.leadstatus?.LeadStatus || 'N/A'}
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
                      />
                      <TextField
                        fullWidth
                        select
                        name="leadstatus"
                        value={form.leadstatus || ''}
                        label="Leadstatus"
                        onChange={handleChange}
                        margin="dense"
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
                      />
                      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                        {isEditMode ? 'Update' : 'Submit'}
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

      <Box sx={{ overflowX: 'auto', mt: 2 }}>
        <Stack direction="row" spacing={2}>
          {(data ? [...data].reverse() : []).map((status) => (
            <Box
              key={status._id}
              sx={{ minWidth: 340, maxWidth: 340, flexShrink: 0 }}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status._id)}
            >
              <Card sx={{ bgcolor: status.colorCode, display: 'flex', flexDirection: 'column', height: '900px' }}>
                <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderBottom: 1,
                      borderColor: 'divider',
                      color: '#003366',
                      mb: 1
                    }}
                  >
                    {status.LeadStatus} ( {groupedLeadsByStatus[status._id]?.length} Lead | INR{' '}
                    {calculateTotalAmount(groupedLeadsByStatus[status._id])})
                  </Typography>

                  {(groupedLeadsByStatus[status._id] || []).map((lead) => (
                    <Box
                      key={lead._id}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        backgroundColor: '#fff',
                        boxShadow: 2,
                        cursor: 'grab',
                        position: 'relative'
                      }}
                      draggable="true"
                      onDragStart={(e) => onDragStart(e, lead)}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteLead(lead._id)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: 'red',
                          zIndex: 10,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)'
                          }
                        }}
                      >
                        {/* Delete icon if needed */}
                      </IconButton>

                      {/* Edit Icon */}
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/lead-management/EditLead/${lead._id}`)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 36, // offset from delete icon
                          color: 'blue',
                          zIndex: 10,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 255, 0.1)'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      {/* Info Icon */}
                      <IconButton
                        size="small"
                        onClick={() => handleopenAddFollowUp(lead._id)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 6, // offset from edit icon
                          color: 'green',
                          zIndex: 10,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 128, 0, 0.1)'
                          }
                        }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>

                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#006400', mb: 1, fontSize: '1rem' }}>
                        {lead?.companyName}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>PRODUCT / SERVICES:</strong> {lead.productService?.subProductName || 'N/A'}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>Next Follow-Up Date :</strong>{' '}
                        {lead.followups?.length > 0 ? lead.followups[lead.followups.length - 1].followupDate : 'N/A'}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>STAFF NAME:</strong>{' '}
                        {lead.assignTo?.basicDetails?.firstName || lead.assignTo?.basicDetails?.lastName
                          ? `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim()
                          : 'N/A'}
                      </Typography>

                      {/* <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>STATUS:</strong> {typeof lead.leadstatus === 'object' ? lead.leadstatus.LeadStatus : lead.leadstatus}
                      </Typography> */}

                      <Typography variant="body2" sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MonetizationOnIcon sx={{ fontSize: '1rem', color: '#003366' }} />: ₹{lead.projectValue || 'N/A'}
                      </Typography>

                      {/* <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.75rem' }}>
                        <span>Category : </span>
                        {lead.Client ? 'Client' : lead.Prospect ? 'Prospect' : 'New Lead' || 'N/A'}
                      </Typography> */}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          ))}
          {/* Lead Lost Container */}
          <Box sx={{ mt: 4 }}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ minWidth: 340, maxWidth: 340, flexShrink: 0 }}>
                <Card sx={{ bgcolor: '#ffebee', display: 'flex', flexDirection: 'column', height: '900px' }}>
                  <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderBottom: 1,
                        borderColor: 'divider',
                        color: '#d32f2f',
                        mb: 1
                      }}
                    >
                      Lead Lost ({groupedLS.length} Lead | INR {calculateTotalAmount(groupedLS)})
                    </Typography>

                    {groupedLS.length > 0 ? (
                      groupedLS.map((lead) => (
                        <Box
                          key={lead._id}
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            backgroundColor: '#fff',
                            boxShadow: 2,
                            cursor: 'grab',
                            position: 'relative'
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#b71c1c', mb: 1 }}>
                            {lead.companyName}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <strong>PRODUCT / SERVICES:</strong> {lead.productService?.subProductName || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <strong>STAFF NAME:</strong>{' '}
                            {lead.assignTo?.basicDetails
                              ? `${lead.assignTo.basicDetails.firstName || ''} ${lead.assignTo.basicDetails.lastName || ''}`.trim()
                              : 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <MonetizationOnIcon sx={{ fontSize: '1rem', color: '#b71c1c' }} /> ₹{lead.projectValue || 'N/A'}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#888' }}>
                        No lost leads yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Box>

          {/* Lead Won Container */}
          <Box sx={{ mt: 4 }}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ minWidth: 340, maxWidth: 340, flexShrink: 0 }}>
                <Card sx={{ bgcolor: '#e8f5e9', display: 'flex', flexDirection: 'column', height: '900px' }}>
                  <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderBottom: 1,
                        borderColor: 'divider',
                        color: '#388e3c',
                        mb: 1
                      }}
                    >
                      Lead Won ({groupedLW.length} Lead | INR {calculateTotalAmount(groupedLW)})
                    </Typography>

                    {groupedLW.length > 0 ? (
                      groupedLW.map((lead) => (
                        <Box
                          key={lead._id}
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            backgroundColor: '#fff',
                            boxShadow: 2,
                            cursor: 'grab',
                            position: 'relative'
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                            {lead.companyName}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <strong>PRODUCT / SERVICES:</strong> {lead.productService?.subProductName || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <strong>STAFF NAME:</strong>{' '}
                            {lead.assignTo?.basicDetails
                              ? `${lead.assignTo.basicDetails.firstName || ''} ${lead.assignTo.basicDetails.lastName || ''}`.trim()
                              : 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <MonetizationOnIcon sx={{ fontSize: '1rem', color: '#1b5e20' }} /> ₹{lead.projectValue || 'N/A'}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#888' }}>
                        No won leads yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <ToastContainer />
    </>
  );
};

export default Pipeline;

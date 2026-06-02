import React, { useState, useEffect } from 'react';
import { get, remove } from '../../api/api';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  TextField,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonIcon from '@mui/icons-material/Person';
import { Edit, Delete, Refresh, ContactPhone, Business, LocationOn, PersonAdd } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { post } from '../../api/api';

const Company = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [companyPermission, setCompanyPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  // Fetch companies on component mount
  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['prospects']) {
      setCompanyPermission(systemRights.actionPermissions['prospects']);
    }
    fetchCompanies();
  }, [systemRights]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get('prospect');

      console.log('prospect data:', response);
      if (response && response.status === 'true' && Array.isArray(response.data)) {
        setCompanies(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again.');
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    navigate(`/prospects/editCompany/${id}`);
  };

  const handleDelete = async (id) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    try {
      await remove(`prospect/${id}`);
      toast.success('Prospect deleted successfully');
      fetchCompanies(); // Refresh the list
    } catch (err) {
      toast.error('Failed to delete prospect');
    }
  };

  const [isDisableConvertClient, setDisableConvertClient] = useState(null);

  const handleConvertToClient = async (company, index) => {
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

      const formattedStartDate = formatCustomDate(today);
      const formattedEndDate = formatCustomDate(sixMonthsLater);

      const formData = {
        clientName: company.companyName || '',
        officialPhoneNo: company.phoneNo || '',
        altPhoneNo: company.altPhoneNo || '',
        officialMailId: company.email || '',
        altMailId: company.altEmail || '',
        emergencyContactPerson: '',
        emergencyContactNo: '',
        website: company.website || '',
        gstNo: company.gstNo || '',
        panNo: company.panNo || '',
        logo: null,
        officeAddress: company.address || '',
        pincode: company.pincode || '',
        city: company.city || '',
        state: company.state || '',
        country: company.country || '',
        startDate: formattedStartDate, // ✅ formatted properly
        endDate: formattedEndDate, // ✅ formatted properly
        createdBy: localStorage.getItem('Id') || '',
        contactPerson: (company.contacts && company.contacts.length > 0 ? company.contacts : []).map((c) => ({
          name: c.name || '',
          department: c.department || '',
          position: c.designation || c.position || '',
          email: c.email || '',
          phone: c.phone || ''
        }))
      };

      setDisableConvertClient(index);
      const response = await post('admin-clientRegistration', formData);

      console.log('Payload contactPerson:', response.data);
      if (response.status === true) {
        toast.success('Converted to client successfully');
        fetchCompanies();
      } else {
        toast.error('Failed to convert to client');
      }
    } catch (error) {
      console.error('Convert error:', error);
      toast.error('Error while converting to client');
    } finally {
      setDisableConvertClient(null);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Breadcrumb title="Prospect Details">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Prospects
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Divider />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Prospect List
                </Typography>

                <Box display="flex" gap={2}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    // value={searchTerm}
                    // onChange={handleSearch}
                  />
                  <Button variant="outlined" color="primary" onClick={fetchCompanies} startIcon={<Refresh />} disabled={loading}>
                    Refresh
                  </Button>
                  {(companyPermission.Add === true || isAdmin) && (
                    <Button variant="contained" color="primary" component={Link} to="/prospects/AddCompany" startIcon={<AddIcon />}>
                      Add Prospect
                    </Button>
                  )}
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ verticalAlign: 'top' }}>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Company Name</TableCell>
                        <TableCell>Contact Info</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Registration</TableCell>
                        <TableCell>Network</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companies.length > 0 ? (
                        companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company, index) => (
                          <TableRow key={company._id} sx={{ verticalAlign: 'top' }}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {company.companyName || 'N/A'}
                                </Typography>
                                {/* <Typography variant="caption" color="text.secondary">
                                  {company.firstName} {company.lastName}
                                </Typography> */}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2">
                                  {/* <Tooltip title={company.email || 'N/A'} placement="top">
                                    <span>{company.email || 'N/A'}</span>
                                  </Tooltip> */}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  <ContactPhone fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                                  {company.phoneNo || 'N/A'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2">
                                  {company.city || 'N/A'}, {company.state || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  <LocationOn fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                                  {company.country || 'N/A'} {company.pincode ? `- ${company.pincode}` : ''}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2">
                                  <Tooltip title="Date of Incorporation" placement="top">
                                    <span>Inc: {formatDate(company.dateOfIncorporation)}</span>
                                  </Tooltip>
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  <Business fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                                  Created: {formatDate(company.createdAt)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {company.network ? (
                                <Chip label={company.network} size="small" color={company.network === 'WhatsApp' ? 'success' : 'primary'} />
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" justifyContent="center">
                                {(companyPermission.Edit === true || isAdmin) && (
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEdit(company._id)}
                                    // component={Link}
                                    // to={`/Company/editCompany/${company._id}`}

                                    sx={{ height: '24px', whiteSpace: 'nowrap', minWidth: '12px' }}
                                  >
                                    <Edit />
                                  </Button>
                                )}
                                {(companyPermission.Delete === true || isAdmin) && (
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(company._id)}
                                    sx={{ height: '24px', whiteSpace: 'nowrap', minWidth: '12px' }}
                                  >
                                    <Delete />
                                  </Button>
                                )}
                                <Tooltip title="Convert to Client" arrow>
                                  {/* <Button
                                  size="small"
                                  color="success"
                                  onClick={() => handleConvertToLead(company._id)}
                                  sx={{ height: '32px', whiteSpace: 'nowrap' }}
                                >
                                  <PersonIcon />
                                </Button> */}
                                  <IconButton
                                    size="medium"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleConvertToClient(company, index)}
                                    disabled={isDisableConvertClient === index}
                                  >
                                    <PersonAdd />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No companies found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={companies.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Company;

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { Business, ContactPhone, Delete, Edit, Language, LocationOn } from '@mui/icons-material';
import { get, remove } from '../../api/api.js';
import { useSelector } from 'react-redux';
import EmailIntegration from './EmailIntegration.jsx';
import { toast } from 'react-toastify';

const CompanySettings = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [clientList, setClientList] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [companySettingPermission, setCompanySettingPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const handleEditClick = (clientId) => {
    navigate(`/company-settings/${clientId}`); // Navigate to the edit page with the client ID
    // navigate(`/clientRegistration/${clientId}`);
  };
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

  const fetchClient = async () => {
    try {
      // Use companyId (admin's own _id) — the backend resolves admin → refId → clientRegistration
      const companyId = localStorage.getItem('companyId');

      if (!companyId) {
        console.error('❌ No companyId found in localStorage');
        return;
      }

      console.log('🔗 Fetching client data for admin:', companyId);
      const response = await get(`clientRegistration/by-admin/${companyId}`);
      console.log('✅ Response is:', response);

      if (response.status === 'true' && response.data) {
        setClientList(response.data);
      } else {
        console.error('❌ Unexpected response format:', response);
      }
    } catch (error) {
      console.error('❌ Error in fetchClient:', error);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['company-settings']) {
      setCompanySettingPermission(systemRights.actionPermissions['company-settings']);
    }
    fetchClient();
  }, [systemRights]);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Company Settings
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Company Details</Typography>
          </Grid>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ verticalAlign: 'top' }}>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Contact Info</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Registration</TableCell>
                      <TableCell>GST No</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ verticalAlign: 'top' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {clientList?.clientName || 'N/A'}
                          </Typography>
                          {/* <Typography variant="caption" color="text.secondary">
                                                  {company.firstName} {company.lastName}
                                                </Typography> */}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            <Tooltip title={clientList?.officialMailId || 'N/A'} placement="top">
                              <span>{clientList?.officialMailId || 'N/A'}</span>
                            </Tooltip>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <ContactPhone fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                            {clientList?.officialPhoneNo || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <ContactPhone fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                            Alt: {clientList?.altPhoneNo || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <Language fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                            {clientList?.website ? (
                              <a
                                href={clientList.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                              >
                                Website
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            {clientList?.city || 'N/A'}, {clientList?.state || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <LocationOn fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                            {clientList?.country || 'N/A'} {clientList?.pincode ? `- ${clientList?.pincode}` : ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            <Tooltip title="Date of Incorporation" placement="top">
                              <span>Inc: {formatDate(clientList?.startDate)}</span>
                            </Tooltip>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <Business fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-bottom' }} />
                            Created: {formatDate(clientList?.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{clientList?.gstNo || 'N/A'}</TableCell>
                      {/* <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            onClick={() => handleEditClick(clientList?._id)}
                            // component={Link}
                            // to={`/Company/editCompany/${company._id}`}

                            sx={{ height: '32px', whiteSpace: 'nowrap' }}
                          >
                            <Edit />
                          </Button>
                        </Box>
                      </TableCell> */}
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 1 }}>
                          {(companySettingPermission.Edit === true || isAdmin) && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                if (localStorage.getItem('expired') === 'true') {
                                  toast.error('Subscription has ended. Please subscribe to continue working.');
                                  return;
                                }
                                handleEditClick(clientList?._id);
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          )}

                          <IconButton
                            size="small"
                            color="error"
                            sx={{ padding: '4px' }}
                            onClick={() => {
                              if (localStorage.getItem('expired') === 'true') {
                                toast.error('Subscription has ended. Please subscribe to continue working.');
                                return;
                              }
                              // Add your delete handler here if applicable
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
          <EmailIntegration
            onSave={(config) => {
              if (localStorage.getItem('expired') === 'true') {
                toast.error('Subscription has ended. Please subscribe to continue working.');
                return;
              }
              console.log('Saved email integration config:', config);
              // Make API call to save
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CompanySettings;

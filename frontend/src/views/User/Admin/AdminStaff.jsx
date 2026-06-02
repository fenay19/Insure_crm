import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box
} from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { get, put } from '../../../api/api.js';
import REACT_APP_API_URL from '../../../api/api.js';
import Loader from 'component/Loader/Loader';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import ViewBtn from 'component/buttons/ViewBtn';
import { toast, ToastContainer } from 'react-toastify';
import SuspendUser from 'views/HR/User/SuspendUser';
import { useSelector } from 'react-redux';

const AdminStaff = () => {
  const [administrativeData, setAdministrativeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [staffPermission, setStaffPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const navigate = useNavigate();

  function goToAddPage() {
    navigate('/users/administrativeAddPage');
  }

  const fetchAdministrativeData = async () => {
    setLoading(true);
    try {
      const response = await get('administrative');
      console.log('staff adminstrative details: ', response.data);
      setAdministrativeData(response.data || []);
      setFilteredData(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsDataFetched(true);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = administrativeData.filter(
      (item) =>
        item?.basicDetails?.firstName?.toLowerCase().includes(query) ||
        item?.basicDetails?.lastName?.toLowerCase().includes(query) ||
        item?.basicDetails?.email?.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) {
      toast.error('No item selected for deletion');
      return;
    }

    try {
      const response = await put(`administrative/delete/${selectedItem._id}`);
      if (response?.success) {
        toast.success(response?.message || 'Item deleted successfully');
        fetchAdministrativeData();
      } else {
        toast.error(response?.message || 'Failed to delete the item');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the item.');
      console.error('Delete error:', error.message);
    } finally {
      setDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['company-staff']) {
      setStaffPermission(systemRights.actionPermissions['company-staff']);
    }
    fetchAdministrativeData();
  }, [systemRights]);

  const [activeData, setActiveData] = useState([]);

  useEffect(() => {
    const filterSuspended = async () => {
      const results = [];
      for (const item of filteredData) {
        const response = await get(`admin/fetch-user-suspension-status/${item._id}`);
        if (!response.isSuspended) {
          results.push(item);
        }
      }
      setActiveData(results);
    };

    if (filteredData.length) {
      filterSuspended();
    }
  }, [filteredData]);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          User
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Add User
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    {(staffPermission.Add === true || isAdmin) && (
                      <Button variant="contained" color="primary" onClick={goToAddPage}>
                        Add
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Search"
                      variant="outlined"
                      value={searchQuery}
                      onChange={handleSearch}
                      size="small"
                      style={{ width: '300px' }}
                    />
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <CardContent>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {isDataFetched && filteredData.length === 0 ? (
                    <Typography variant="h6" align="center" color="textSecondary">
                      No Records Found
                    </Typography>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ verticalAlign: 'top' }}>
                            <TableCell>Sr.No</TableCell>
                            <TableCell>Profile Picture</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Contact No.</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Suspend User</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {activeData.map((item, index) => {
                            // const isSuspended = checkifsuspended(item._id);
                            const firstName = item?.basicDetails?.firstName || 'N/A';
                            const lastName = item?.basicDetails?.lastName || '';
                            const profilePhoto = item?.basicDetails?.profilePhoto || '';
                            const contactNumber = item?.basicDetails?.contactNumber || 'N/A';
                            const gender = item?.basicDetails?.gender || 'N/A';
                            const department = item?.employmentDetails?.department?.department || 'N/A';
                            const position = item?.employmentDetails?.position?.position || 'N/A';

                            return (
                              <TableRow sx={{ verticalAlign: 'top' }} key={item._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  <Avatar
                                    alt={`${firstName} ${lastName}`}
                                    src={`${REACT_APP_API_URL}images/${profilePhoto}`}
                                    style={{ width: 50, height: 50 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {firstName} {lastName}
                                </TableCell>
                                <TableCell>{department}</TableCell>
                                <TableCell>{position}</TableCell>
                                <TableCell>{contactNumber}</TableCell>
                                <TableCell>{gender}</TableCell>
                                <TableCell>
                                  <SuspendUser userId={item._id} />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 1 }}>
                                    {(staffPermission.Edit === true || isAdmin) && (
                                      <EditBtn onClick={() => navigate(`/users/administrativeUpdatePage/${item._id}`)} />
                                    )}
                                    {(staffPermission.Delete === true || isAdmin) && <DeleteBtn onClick={() => handleDeleteClick(item)} />}
                                    <ViewBtn onClick={() => navigate(`/users/viewUserDetails/administrative/${item._id}`)} />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this record?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default AdminStaff;

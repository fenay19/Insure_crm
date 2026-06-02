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
  DialogTitle
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { get, put } from 'api/api';
import REACT_APP_API_URL from 'api/api';
import Loader from 'component/Loader/Loader';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import ViewBtn from 'component/buttons/ViewBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useGetDepartmentsQuery } from 'services/endpoints/departmentApi';

const NursingAndParamedicalMainPage = () => {
  const [data, setData] = useState([]);
  const { data: departmentData = [] } = useGetDepartmentsQuery();
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();

  const goToAddPage = () => {
    navigate('/users/add-nursing-paramedical');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await get('nursingAndParamedical');
      console.log(response);
      setData(response.data || []);
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
    const filtered = data.filter(
      (item) =>
        item.basicDetails.firstName.toLowerCase().includes(query) ||
        item.basicDetails.lastName.toLowerCase().includes(query) ||
        item.basicDetails.email.toLowerCase().includes(query)
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
      // Make the delete request
      const response = await put(`nursingAndParamedical/delete/${selectedItem._id}`);

      // Check response for success
      if (response?.success === true) {
        toast.success(response?.message || 'Item deleted successfully');
        fetchData(); // Refresh the data after successful deletion
      } else {
        // Handle unexpected response formats or failures
        toast.error(response?.message || 'Failed to delete the item. Please try again.');
        console.warn('Unexpected response:', response);
      }
    } catch (error) {
      // Handle network or server errors
      if (error.response && error.response.data) {
        // Specific error message from the backend
        toast.error(error.response.data.message || 'Server error occurred');
      } else {
        // Generic error message
        toast.error('Error deleting item, please try again later');
      }
      console.error('Error during delete request:', error.message);
    } finally {
      // Reset modal state regardless of success or failure
      setDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };
  function returnDepartment(department) {
    const departments = department?.map((data) => data?.departmentName);
    if (departments?.length === departmentData?.length) {
      return 'All Departments';
    } else {
      return departments?.join(',');
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Nursing and Paramedical
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={goToAddPage}>
                      Add
                    </Button>
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
                          <TableRow>
                            <TableCell>Sr.No</TableCell>
                            <TableCell>Profile Picture</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Contact No.</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.map((item, index) => (
                            <TableRow key={item._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Avatar
                                  alt={`${item.basicDetails.firstName} ${item.basicDetails.lastName}`}
                                  src={`${REACT_APP_API_URL}images/${item.basicDetails.profilePhoto}`}
                                  style={{ width: 50, height: 50 }}
                                />
                              </TableCell>
                              <TableCell>
                                {item.basicDetails.firstName} {item.basicDetails.lastName}
                              </TableCell>
                              <TableCell>{returnDepartment(item.employmentDetails?.departmentOrSpeciality || []) || 'NA'}</TableCell>
                              <TableCell>{item.employmentDetails?.designation?.designationName || 'NA'}</TableCell>
                              <TableCell>{item.basicDetails.contactNumber || 'NA'}</TableCell>
                              <TableCell>{item.basicDetails.gender || 'NA'}</TableCell>

                              <TableCell>
                                <EditBtn onClick={() => navigate(`/users/edit-nursing-paramedical/${item._id}`)} />
                                <DeleteBtn onClick={() => handleDeleteClick(item)} />
                                <ViewBtn onClick={() => navigate(`/users/viewUserDetails/nursingAndParamedical/${item._id}`)} />
                              </TableCell>
                            </TableRow>
                          ))}
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

export default NursingAndParamedicalMainPage;

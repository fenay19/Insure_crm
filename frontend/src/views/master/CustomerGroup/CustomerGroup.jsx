import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api.js';
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

const CustomerGroup = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const [clientList, setClientList] = useState([]);

  const navigate = useNavigate();
  // console.log('Token:', document.cookie);

  const [isAdmin, setAdmin] = useState(false);
  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    console.log('add clicleked');
    navigate('/addCustomerGroup');
  };

  const fetchCustomerGroups = async () => {
    try {
      console.log('get data ');
      const res = await get('customerGroup');
      setClientList(res.data);
      console.log('data fetched ', res);
    } catch (e) {
      toast.error('Failed in loading data');
    }
  };
  useEffect(() => {
    fetchCustomerGroups();
  }, []);

  const handleDelete = async (index) => {
    setLoading(true);
    try {
      const id = index;
      await remove(`customerGroup/${id}`);
      toast.success('Record Deleted Sucessfully');
    } catch (error) {
      console.error(error);
      toast.error('Record Deletion Failed');
    } finally {
      setLoading(false);
      // fetchCustomerGroups();
    }
  };

  // const systemRights = useSelector((state) => state.systemRights.systemRights);

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Paper elevation={6} sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="h6">Loading Policies...</Typography>
          </Paper>
        </Box>
      )}
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Masters
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Customer Group
        </Typography>
      </Breadcrumb>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Customer Group</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Customer Group
        </Button>
        {/* {(positionPermission.Add === true || isAdmin) && (
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                      Add position
                    </Button>
                  )} */}
      </Grid>
      {/* Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SN</TableCell>
                <TableCell>Customer ID</TableCell>
                <TableCell>Customer Group Name</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {clientList?.length > 0 ? 
            <TableBody>
              {clientList?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.customerGroupId}</TableCell>
                  <TableCell>{item.customerGroupName}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  <TableCell>
                    <IconButton color="primary" component={Link} to={`/EditCustomerGroup/${item?._id}`}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item?._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            :  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Data Found
                    </TableCell> 
                  </TableRow>
}
          </Table>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

export default CustomerGroup;

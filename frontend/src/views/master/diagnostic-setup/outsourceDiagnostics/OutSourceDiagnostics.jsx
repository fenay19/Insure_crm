import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  RadioGroup,
  Input,
  Select,
  InputLabel,
  MenuItem,
  FormControlLabel,
  Radio,
  DialogActions
} from '@mui/material';
import { gridSpacing } from 'config.js';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import AddOutSourceDiagnostics from './forms/AddOutSourceDiagnostics';
import EditOutSourceDiagnostics from './forms/EditOutSourceDiagnostics';
import OtherLabs from './forms/OtherLabs';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { get, put } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Label } from '@mui/icons-material';
import { FormControl } from 'react-bootstrap';
import SharingModule from './SharingModule';

const OutSourceDiagnostics = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openOtherLabsModal, setOpenOtherLabsModal] = useState(false); // State for OtherLabs modal
  const [editData, setEditData] = useState({});
  const [otherLabsData, setOtherLabsData] = useState({}); // State for OtherLabs data
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [inputType, setInputType] = useState('value'); // "value" or "percentage"
  const [inputValue, setInputValue] = useState('');
  const [percentage, setPercentage] = useState('');
  // Fetch data
  const fetchData = async () => {
    await get('outsourceDiagnostic-master')
      .then((result) => {
        setData(result.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle save for delete
  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`outsourceDiagnostic-master/delete/${deleteId}`).then(
        (response) => toast.success(response.msg),
        setOpenDeleteModal(false),
        fetchData()
      );
    }
  };

  // Open Delete Modal
  const openDeleteModalFun = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  // Open Registration Modal
  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType('add');
  };

  // Open Edit Registration Modal
  const openEditRegistration = (item) => {
    setType('edit');
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  // Close Registration Modal
  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  // Open OtherLabs Modal
  const openOtherLabs = (item) => {
    setOtherLabsData(item); // Pass the selected row's data
    setOpenOtherLabsModal(true);
  };

  // Close OtherLabs Modal
  const closeOtherLabs = () => {
    setOpenOtherLabsModal(false);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data for search
  const filteredData = data.filter((item) => {
    return (
      item.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Columns and data mapping
  const columns = ['SN', 'Lab Name', 'Address', 'Contact Number', 'Departments', 'Outsource Lab Details', 'Action'];
  const showData = filteredData.map((item, ind) => {
    const data = item.departmentId.map((department) => department);

    return {
      SN: ind + 1,
      'Lab Name': item.labName,
      Address: item.address,
      'Contact Number': item.contact,
      Departments: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.map((department, index) => (
            <div
              key={index}
              style={{
                minWidth: '30%',
                textAlign: 'left',
                wordBreak: 'break-word',
                padding: '3px',
                border: '1px solid #ccc',
                backgroundColor: '#f9f9f9'
              }}
            >
              {department.departmentName}
            </div>
          ))}
        </div>
      ),
      'Outsource Lab Details': (
        <Button variant="outlined" size="small" onClick={() => openOtherLabs(item)}>
          View Labs
        </Button>
      ),
      Action: (
        <Box display="flex" alignItems={'center'} gap={1} p={0}>
          <Button variant={'outlined'} onClick={() => setOpen(true)}>
            Rate
          </Button>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </Box>
      )
    };
  });

  const handleSubmit = () => {
    console.log(inputType === 'value' ? `Value: ${inputValue}` : `Percentage: ${percentage}%`);
    setOpen(false);
  };

  return (
    <>
      <Breadcrumb title="Outsource Diagnostics">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Outsource Diagnostics
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems="center" justifyContent="space-between">
                  <Button variant="contained" color="primary" onClick={openRegistration}>
                    Add
                  </Button>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search..."
                    style={{ width: 200, border: '1px solid black' }}
                  />
                </Grid>
              }
            />
            <Divider />
            {/* Registration Modal */}
            <Modal open={openRegistrationModal} onClose={closeRegistration}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '30px', maxWidth: '900px' }}>
                {type === 'add' ? (
                  <AddOutSourceDiagnostics handleClose={closeRegistration} getData={fetchData} />
                ) : (
                  <EditOutSourceDiagnostics handleClose={closeRegistration} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            {/* Delete Modal */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
                <Typography>Are you sure you want to delete this Unit?</Typography>
                <Button onClick={handleSave}>Delete</Button>
                <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
              </Box>
            </Modal>
            {/* Outsource Lab details Modal */}
            <Modal open={openOtherLabsModal} onClose={closeOtherLabs}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '900px', padding: '20px' }}>
                <OtherLabs data={otherLabsData} handleClose={closeOtherLabs} />
              </Box>
            </Modal>
            {loader ? (
              <Loader />
            ) : (
              <CardContent style={{ width: '100%' }}>
                <DataTable data={showData} columns={columns} />
              </CardContent>
            )}
          </Card>
        </Grid>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Sharing Amount</DialogTitle>
          <DialogContent>
            <SharingModule setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </Grid>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default OutSourceDiagnostics;

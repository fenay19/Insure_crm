import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Modal, TextField, Typography } from '@mui/material';
import Breadcrumbs from 'component/Breadcrumb';
import { gridSpacing } from 'config';
import { Link } from 'react-router-dom';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import DeleteBtn from 'component/buttons/DeleteBtn';
import { get, put } from 'api/api';
import EditBtn from 'component/buttons/EditBtn';
import { toast, ToastContainer } from 'react-toastify';
import AddAgeGroup from './forms/AddAge';
import EditAgeGroup from './forms/EditAge';

const AgeGroup = () => {
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [loader, setLoader] = useState(true);

  const closeModal = () => {
    setOpenModal(false);
    setOpenDeleteModal(false);
  };

  const fetchData = async () => {
    setLoader(true);
    try {
      const response = await get('age-group');
      setData(response?.data || []);
      setFilteredData(response?.data || []);
    } catch (error) {
      toast.error('Failed to fetch data.');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditRegistration = (item) => {
    setType('edit');
    setOpenModal(true);
    setEditData(item);
  };

  const openDeleteModalFun = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await put(`age-group/delete/${deleteId}`);
      if (response) {
        toast.success('Age group deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete the age group');
      }
    } catch (error) {
      toast.error('Something went wrong while deleting');
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const openRegistration = () => {
    setOpenModal(true);
    setType('add');
  };

  useEffect(() => {
    const filtered = data?.filter(
      (item) => item?.age?.toString().includes(searchTerm) || item?.group?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const columns = ['SN', 'Age Range', 'Group', 'Action'];
  const showData = filteredData?.map((item, ind) => ({
    SN: ind + 1,
    'Age Range': item?.age,
    Group: item?.group,
    Action: (
      <Box display="flex" gap={1} p={0}>
        <EditBtn onClick={() => openEditRegistration(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
      </Box>
    )
  }));

  return (
    <>
      <Breadcrumbs title="Age Group">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Age Group
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={openRegistration}>
                      Add Age Group
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Search"
                      variant="outlined"
                      placeholder="Search Age Group"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <Modal open={openModal} onClose={closeModal}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '400px' }}>
                {type === 'add' ? (
                  <AddAgeGroup handleClose={closeModal} getData={fetchData} />
                ) : (
                  <EditAgeGroup handleClose={closeModal} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '400px' }}>
                <Typography>Are you sure you want to delete this Age Group?</Typography>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
              </Box>
            </Modal>
            {loader ? (
              <Loader />
            ) : (
              <CardContent>
                {filteredData.length > 0 ? (
                  <DataTable data={showData} columns={columns} />
                ) : (
                  <Typography align="center" variant="body1">
                    No Data Found
                  </Typography>
                )}
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default AgeGroup;

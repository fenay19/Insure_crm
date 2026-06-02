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
import AddVitals from './forms/AddVitals';
import EditVitals from './forms/EditVitals';
import VitalMaster from 'views/master/vital-master';

const Vitals = () => {
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
    const response = await get('vital-master');
    setData(response?.data || []);

    setFilteredData(response?.data || []);
    setLoader(false);
  };

  console.log('data', data);
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
    if (openDeleteModal) {
      const response = await put(`vital-master/delete/${deleteId}`);
      if (response) {
        toast.success('Vital deleted Successfully');
        setOpenDeleteModal(false);
        fetchData();
      } else {
        toast.error('something went wrong !');
      }
    }
  };
  const openRegistration = () => {
    setOpenModal(true);
    setType('add');
  };

  useEffect(() => {
    const filtered = data?.filter((item) => item?.vital?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const columns = ['SN', 'Vitals Name', 'Unit', 'Age Range', 'Group', 'Range', 'Action'];
  const showData = filteredData?.map((item, ind) => ({
    SN: ind + 1,
    'Vitals Name': item?.vital,
    Unit: item?.unit,
    'Age Range': item?.age,
    Group: item?.group,
    Range: item?.range,
    Action: (
      <Box display="flex" gap={1} p={0}>
        <EditBtn onClick={() => openEditRegistration(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
      </Box>
    )
  }));

  return (
    <>
      <Breadcrumbs title="Vital Master">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Vital Master
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
                      Add Vital
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Search"
                      variant="outlined"
                      placeholder="Search Vitals"
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
                  <AddVitals handleClose={closeModal} getData={fetchData} />
                ) : (
                  <EditVitals handleClose={closeModal} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '600px' }}>
                <Typography>Are you sure you want to delete this vitals?</Typography>
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
      {/* <VitalMaster/> */}
    </>
  );
};

export default Vitals;

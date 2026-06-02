import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box, TextField } from '@mui/material';
import { gridSpacing } from 'config.js';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import AddSpecimen from './specimenMasterForms/AddSpecimen';
import EditSpecimen from './specimenMasterForms/EditSpecimen';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { get, put } from 'api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImportExport from 'component/ImportExport';

const Specimen = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loader, setLoader] = useState(true);

  const fetchData = async () => {
    try {
      const result = await get('specimen-pathology-master');
      setData(result?.specimen || []);
      setFilteredData(result?.specimen || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredData(data.filter((item) => item.name.toLowerCase().includes(value)));
  };

  const handleDelete = async () => {
    try {
      const response = await put(`specimen-pathology-master/delete/${deleteId}`);
      toast.success(response?.msg);
      fetchData();
    } catch {
      toast.error('Error deleting specimen');
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const openEditRegistration = (item) => {
    setType('edit');
    setEditData(item);
    setOpenRegistrationModal(true);
  };

  const closeModals = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  const columns = ['SN', 'Specimen', 'Action'];
  const showData = filteredData.map((item, index) => ({
    SN: index + 1,
    Specimen: item?.name,
    Action: (
      <Box display="flex" gap={1}>
        <EditBtn onClick={() => openEditRegistration(item)} />
        <DeleteBtn
          onClick={() => {
            setDeleteId(item._id);
            setOpenDeleteModal(true);
          }}
        />
      </Box>
    )
  }));

  const headerFields = ['Specimen'];
  const downheaderFields = ['Specimen'];

  const fileValidationHandler = fileData => {
    const newData = []

    fileData.forEach(val => {
      let d = {}

      if (val['Specimen'] !== '' && val['Specimen'] !== undefined) {
        d = {
          name: val['Specimen']
        }
        newData.push(d)
      }
    })
    return newData
  }

  const exportDataHandler = () =>
    showData.map((val, index) => ({
      SN: index + 1,
      Specimen: val.Specimen?.trim()
    }));

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setType('add');
                        setOpenRegistrationModal(true);
                      }}
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <TextField
                          size="small"
                          label="Search"
                          variant="outlined"
                          placeholder="Search Unit"
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </Grid>
                      <Grid item>
                        <ImportExport
                          update={fetchData}
                          headerFields={headerFields}
                          downheaderFields={downheaderFields}
                          name="Specimen"
                          fileValidationHandler={fileValidationHandler}
                          exportDataHandler={exportDataHandler}
                          api="specimen-pathology-master/import"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
            <Divider />

            <Modal open={openRegistrationModal} onClose={closeModals}>
              <Box sx={{ backgroundColor: 'white', margin: 'auto', mt: '10%', maxWidth: 400 }}>
                {type === 'add' ? (
                  <AddSpecimen handleClose={closeModals} getData={fetchData} />
                ) : (
                  <EditSpecimen handleClose={closeModals} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>

            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} sx={{ backgroundColor: 'white', margin: 'auto', mt: '15%', maxWidth: 400 }}>
                <Typography>Are you sure you want to delete this Specimen?</Typography>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button color="error" variant="contained" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>

            {loader ? (
              <Loader />
            ) : (
              <CardContent>
                <DataTable data={showData} columns={columns} />
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default Specimen;

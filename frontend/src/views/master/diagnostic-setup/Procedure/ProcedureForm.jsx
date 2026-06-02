import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box, TextField } from '@mui/material';
import { gridSpacing } from 'config.js';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { get, put } from 'api/api';
import { ToastContainer, toast } from 'react-toastify';
import ImportExport from 'component/ImportExport';
import AddProcedure from './forms/AddForm';
import EditProcedure from './forms/EditForm';

const ProcedureForm = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [loader, setLoader] = useState(true);

  const headerFields = ['Procedure Name'];
  const downheaderFields = ['Procedure Name'];

  const fetchData = async () => {
    setLoader(true);
    try {
      const result = await get('procedure-master');
      setData(result?.data ?? []);
    } catch (err) {
      console.error('Error fetching procedures:', err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => item?.procedureName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, data]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await put(`procedure-master/delete/${deleteId}`);
      toast.error(response.msg || 'Procedure deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Error deleting procedure');
    } finally {
      setOpenDeleteModal(false);
      setDeleteId('');
    }
  };

  const openDeleteModalFun = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType('add');
    setEditData({});
  };

  const openEditRegistration = (item) => {
    setType('edit');
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const closeModals = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  // Validate imported data
  const fileValidationHandler = (fileData) => {
    return fileData
      .filter((val) => val['Procedure Name']?.trim())
      .map((val) => ({ procedureName: val['Procedure Name'].trim() }));
  };

  // Prepare data for export
  const exportDataHandler = () => {
    return filteredData.map((val, ind) => ({
      SN: ind + 1,
      'Procedure Name': val.procedureName?.trim(),
    }));
  };

  const columns = ['SN', 'Procedure Name', 'Action'];
  const showData = filteredData.map((item, ind) => ({
    SN: ind + 1,
    'Procedure Name': item.procedureName,
    Action: (
      <Box display="flex" gap={1} p={0}>
        <EditBtn onClick={() => openEditRegistration(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
      </Box>
    ),
  }));

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={openRegistration}>
                      Add
                    </Button>
                  </Grid>
                  <Grid item>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <TextField
                          size="small"
                          label="Search"
                          variant="outlined"
                          placeholder="Search Procedure"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <ImportExport
                          update={fetchData}
                          headerFields={headerFields}
                          downheaderFields={downheaderFields}
                          name="Procedure"
                          fileValidationHandler={fileValidationHandler}
                          exportDataHandler={exportDataHandler}
                          api="procedure-master/import"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
            <Modal open={openRegistrationModal} onClose={closeModals}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '400px' }}>
                {type === 'add' ? (
                  <AddProcedure handleClose={closeModals} getData={fetchData} />
                ) : (
                  <EditProcedure handleClose={closeModals} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '400px' }}>
                <Typography>Are you sure you want to delete this Procedure?</Typography>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
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

export default ProcedureForm;

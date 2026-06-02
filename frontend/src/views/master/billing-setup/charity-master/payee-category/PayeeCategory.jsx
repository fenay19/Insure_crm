import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Modal, TablePagination, TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Cancel, Save } from '@mui/icons-material';
import { get, post, put } from 'api/api';
import { toast } from 'react-toastify';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import Loader from 'component/Loader/Loader';
import DataTable from 'component/DataTable';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import ImportExport from 'component/ImportExport';
import axios from 'axios';
import REACT_APP_BASE_URL from '../../../../../api/api';
import tokenHandler from '../../../../../token/TokenHandler';

const ParentCategory = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [parentGroupName, setParentGroupName] = useState('');
  const [error, setError] = useState('');
  const token = tokenHandler();

  const headerFields = ['Payee Category'];

  const handleSave = (event) => {
    if (openRegistrationModal) {
      handleSubmit(event);
    }
    if (openEditModal) {
      handleEditSubmit(event);
    }
    if (openDeleteModal) {
      deleteParentGroup(data._id);
    }
  };

  const handleCancel = () => {
    closeRegistration();
  };

  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = filterData.filter((item) => {
      return item.parentGroupName.toLowerCase().includes(searchValue);
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setParentGroupName(value);
    setError('');
  };
  const fetchParentGroup = async () => {
    setLoader(true);
    await get('category/parent-group').then((response) => {
      let addsr = [];
      response.data.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setFilterData(addsr);
      setLoader(false);
    });
  };

  const deleteParentGroup = async (id) => {
    await put(`charity/parent-group/delete/${id}`)
      .then((response) => {
        fetchParentGroup();
        toast.error(` Payee Category deleted!!`);
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
  };

  const openEditModalFun = (s) => {
    setData(s);
    setParentGroupName(s.parentGroupName);
    setOpenEditModal(true);
  };

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setParentGroupName('');
    setError('');
  };

  const validation = () => {
    if (parentGroupName === '') {
      setError('payee Category Name is required');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();

    if (parentGroupName !== '') {
      await post('charity/parent-group', { parentGroupName: parentGroupName })
        .then(() => {
          setOpenRegistrationModal(false);
          fetchParentGroup();
          setParentGroupName('');
          toast.success('payee Category Added!!');
        })
        .catch((error) => {
          if (error.response.data.msg !== undefined) {
            toast({
              title: 'Error!!',
              status: 'error',
              description: error.response.data.msg,
              duration: 4000,
              isClosable: true,
              position: 'bottom'
            });
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
        });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    validation();

    if (parentGroupName !== '') {
      await put(`charity/parent-group/${data._id}`, { parentGroupName: parentGroupName })
        .then(() => {
          setOpenEditModal(false);
          fetchParentGroup();
          toast.success(`payee Category Updated!!`);
          setParentGroupName('');
        })
        .catch((error) => {
          if (error.response.data.msg !== undefined) {
            toast({
              title: 'Error!!',
              status: 'error',
              description: error.response.data.msg,
              duration: 4000,
              isClosable: true,
              position: 'bottom'
            });
          } else {
            toast({
              title: 'Something went wrong, Please try later!!',
              status: 'error',
              duration: 4000,
              isClosable: true,
              position: 'bottom'
            });
          }
        });
    }
  };

  // IMPORT EXPORT
  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData?.forEach((val) => {
      let d = {};

      if (val['Payee Category'] !== '' && val['Payee Category'] !== undefined) {
        d = {
          parentGroupName: val['Payee Category']
        };
        newData.push(d);
      }
    });
    return newData;
  };

  const exportDataHandler = () => {
    let data = [];
    showData?.forEach((val, ind) => {
      data.push({
        SN: ind + 1,
        'Payee Category': val?.parentGroupName
      });
    });
    return data;
  };

  useEffect(() => {
    fetchParentGroup();
    // eslint-disable-next-line
  }, []);

  const columns = ['SN', 'Payee Category', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Payee Category': item.parentGroupName,
        Action: (
          <div className="action_btn">
            <EditBtn onClick={() => openEditModalFun(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      };
    });

  return (
    <>
      <div className="">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Button variant="contained" className="global_btn" onClick={openRegistration}>
            + Add
          </Button>

          <div style={{ display: 'flex', justifyContent: '', alignItems: 'center' }}>
            <input
              style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
              className="search_input"
              type="search"
              placeholder="Search..."
              onChange={filterDataHandler}
            />
            <ImportExport
              update={fetchParentGroup}
              headerFields={headerFields}
              downheaderFields={headerFields}
              name="Payee Category"
              fileValidationHandler={fileValidationHandler}
              exportDataHandler={exportDataHandler}
              api="charity/parent-group/import"
            />
          </div>
        </div>
        <Modal open={openRegistrationModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <div className="modal">
            <h2 className="popupHead">Add payee Category</h2>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="payee Category Name"
                    variant="outlined"
                    name="parentGroupName"
                    value={parentGroupName}
                    onChange={handleInputChange}
                    error={error !== '' ? true : false}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="btnGroup">
                    <IconButton type="submit" title="Save" className="btnPopup btnSave">
                      <Save />
                    </IconButton>
                    <IconButton type="submit" title="Cancel" onClick={closeRegistration} className="btnPopup btnCancel">
                      <Cancel />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </Modal>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper>{showData.length <= 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finalData} />}</Paper>
      )}
      <Modal open={openEditModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">Update payee Categoty</h2>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="payee Group Name"
                  variant="outlined"
                  name="parentGroupName"
                  value={parentGroupName}
                  onChange={handleInputChange}
                  error={error !== '' ? true : false}
                  helperText={error}
                />
              </Grid>
              <Grid item xs={12}>
                <div className="btnGroup">
                  <IconButton type="submit" title="Update" className="btnPopup btnSave">
                    <Save />
                  </IconButton>
                  <IconButton type="submit" title="Cancel" onClick={closeRegistration} className="btnPopup btnCancel">
                    <Cancel />
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
      <Modal open={openDeleteModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">Delete {data.parentGroupName} payee Category?</h2>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => deleteParentGroup(data._id)}>Delete</Button>
            <Button onClick={() => closeRegistration()}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ParentCategory;

import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Container } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  FormControl,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cancel, Save } from '@mui/icons-material';
import { get, post, put } from 'api/api';
import { toast } from 'react-toastify';
import Loader from 'component/Loader/Loader';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import DataTable from 'component/DataTable';
import ImportExport from 'component/ImportExport';
import REACT_APP_BASE_URL from '../../../../../api/api';
import tokenHandler from '../../../../../token/TokenHandler';
import axios from 'axios';

const ParentPayee = () => {
  const [allData, setAllData] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});

  const token = tokenHandler();
  const [loader, setLoader] = useState(true);

  const headerFields = ['Payee Parent', 'Rate Chart', 'Parent Category'];

  const [inputData, setInputData] = useState({
    payeeParentName: '',
    parentGroup: '',
    parentGroupId: '',
    rateChart: ''
  });
  const [error, setError] = useState({
    payeeParentName: '',
    parentGroup: '',
    rateChart: ''
  });

  const handleSave = (event) => {
    if (openRegistrationModal) {
      handleSubmit(event);
    }
    if (openEditModal) {
      handleEditSubmit(event);
    }
    if (openDeleteModal) {
      deleteData(data._id);
    }
  };

  const handleCancel = () => {
    closeRegistration();
  };

  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = filterData.filter((item) => {
      return (
        item.payeeParentName.toLowerCase().includes(searchValue) ||
        item.parentGroup.toLowerCase().includes(searchValue) ||
        item.rateChart.toLowerCase().includes(searchValue)
      );
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'parentGroup') {
      let dep = '';
      allData.forEach((v) => {
        if (v._id === value) {
          dep = v.parentGroupName;
        }
      });

      setInputData((prev) => {
        return { ...prev, parentGroupId: value, parentGroup: dep };
      });
    } else {
      setInputData((prev) => {
        return { ...prev, [name]: value };
      });
    }
    setError((prev) => {
      return { ...prev, [name]: '' };
    });
  };

  const fetchData = async () => {
    setLoader(true);
    await get('category/payee-group').then((response) => {
      let addsr = [];
      response.data.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setFilterData(addsr);
      setLoader(false);
    });

    await get('category/parent-group').then((response) => {
      setAllData(response.data);
    });
  };

  const deleteData = async (id) => {
    await put(`category/payee-group/delete/${id}`)
      .then(() => {
        fetchData();
        toast.error(`${data.payeeParentName} Payee Parent Master deleted!!`);
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
    setInputData(s);
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
    setInputData({
      payeeParentName: '',
      parentGroup: '',
      parentGroupId: '',
      rateChart: ''
    });
    setError({
      payeeParentName: '',
      parentGroup: '',
      rateChart: ''
    });
  };

  const validation = () => {
    if (inputData.payeeParentName === '') {
      setError((prev) => {
        return { ...prev, payeeParentName: 'Payee Parent is required' };
      });
    }
    if (inputData.parentGroupId === '') {
      setError((prev) => {
        return { ...prev, parentGroup: 'Parent Category is required' };
      });
    }
    if (inputData.rateChart === '') {
      setError((prev) => {
        return { ...prev, rateChart: 'Rate Chart is required' };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();
    if (inputData.payeeParentName !== '' && inputData.parentGroup !== '' && inputData.parentGroupId !== '' && inputData.rateChart !== '') {
      await post('category/payee-group', inputData)
        .then(() => {
          fetchData();
          setOpenRegistrationModal(false);
          setInputData({
            payeeParentName: '',
            parentGroup: '',
            parentGroupId: '',
            rateChart: ''
          });
          toast.success('Payee Parent Master Added!!');
        })
        .catch((error) => {
          if (error.response.data.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
        });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    validation();
    if (inputData.payeeParentName !== '' && inputData.parentGroup !== '' && inputData.parentGroupId !== '' && inputData.rateChart !== '') {
      await put(`category/payee-group/${data._id}`, inputData)
        .then(() => {
          fetchData();
          setOpenEditModal(false);
          toast({
            title: `${data.payeeParentName} Payee Parent Master Updated!!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
          setInputData({
            payeeParentName: '',
            parentGroup: '',
            parentGroupId: '',
            rateChart: ''
          });
        })
        .catch((error) => {
          if (error.response.data.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
        });
    }
  };

  // IMPORT EXPORT
  const fileValidationHandler = (fileData) => {
    console.log('file Data', fileData);
    const newData = [];

    fileData?.forEach((val) => {
      let d = {};

      if (!headerFields?.some((field) => val[field].trim() === '')) {
        d = {
          payeeParentName: val['Payee Parent'],
          rateChart: val['Rate Chart'],
          parentGroup: val['Parent Category']
        };
        newData.push(d);
      }
    });

    return newData;
  };

  const exportDataHandler = () => {
    let data = [];
    showData?.forEach((val, ind) => {
      console.log('DATATATAT', val);
      data?.push({
        SN: ind + 1,
        'Payee Parent': val?.payeeParentName,
        'Rate Chart': val?.rateChart,
        'Parent Category': val?.parentGroup
      });
    });
    return data;
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const columns = ['SN', 'Payee Parent', 'Rate Chart', 'Parent Category', 'Actions'];

  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Payee Parent': item.payeeParentName,
        'Rate Chart': item.rateChart,
        'Parent Category': item.parentGroup,
        Actions: (
          <div className="action_btn">
            <EditBtn onClick={() => openEditModalFun(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      };
    });

  return (
    <>
      <div className="top_bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              update={fetchData}
              headerFields={headerFields}
              downheaderFields={headerFields}
              name="Parent Payee"
              fileValidationHandler={fileValidationHandler}
              exportDataHandler={exportDataHandler}
              api="category/parent-payee/import"
            />
          </div>
        </div>
        <Modal open={openRegistrationModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-rateChart">
          <div className="modal">
            <h2 className="popupHead">Add Payee Parent Master</h2>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={error.parentGroup !== '' ? true : false}>
                    <InputLabel htmlFor="parentGroup">payee Category</InputLabel>
                    <Select
                      label="payee Category"
                      name="parentGroup"
                      value={inputData.parentGroupId}
                      onChange={handleInputChange}
                      variant="outlined"
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                    >
                      {allData.map((r, ind) => {
                        return (
                          <MenuItem value={r._id} key={ind}>
                            {r.parentGroupName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.parentGroup}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Parent Payee Name"
                    variant="outlined"
                    name="payeeParentName"
                    value={inputData.payeeParentName}
                    onChange={handleInputChange}
                    error={error.payeeParentName !== '' ? true : false}
                    helperText={error.payeeParentName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Rate Chart"
                    variant="outlined"
                    name="rateChart"
                    value={inputData.rateChart}
                    onChange={handleInputChange}
                    error={error.rateChart !== '' ? true : false}
                    helperText={error.rateChart}
                  />
                </Grid>
              </Grid>
              <div className="btnGroup">
                <IconButton title="Save" className="btnPopup btnSave" type="submit">
                  <Save />
                </IconButton>
                <IconButton type="submit" title="Cancel" onClick={closeRegistration} className="btnPopup btnCancel">
                  <Cancel />
                </IconButton>
              </div>
            </form>
          </div>
        </Modal>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper>{showData.length <= 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finalData} />}</Paper>
      )}
      <Modal open={openEditModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-rateChart">
        <div className="modal">
          <h2 className="popupHead">Update Payee Parent Master</h2>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                <FormControl fullWidth error={error.parentGroup !== '' ? true : false}>
                  <InputLabel htmlFor="parentGroup">payee Category</InputLabel>
                  <Select
                    label="payee Category"
                    name="parentGroup"
                    value={inputData.parentGroupId}
                    onChange={handleInputChange}
                    variant="outlined"
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                  >
                    {allData.map((r, ind) => {
                      return (
                        <MenuItem value={r._id} key={ind}>
                          {r.parentGroupName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{error.parentGroup}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payee Parent"
                  variant="outlined"
                  name="payeeParentName"
                  value={inputData.payeeParentName}
                  onChange={handleInputChange}
                  error={error.payeeParentName !== '' ? true : false}
                  helperText={error.payeeParentName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rate Chart"
                  variant="outlined"
                  name="rateChart"
                  value={inputData.rateChart}
                  onChange={handleInputChange}
                  error={error.rateChart !== '' ? true : false}
                  helperText={error.rateChart}
                />
              </Grid>
            </Grid>
            <div className="btnGroup">
              <IconButton title="Update" className="btnPopup btnSave" type="submit">
                <Save />
              </IconButton>
              <IconButton type="submit" title="Cancel" onClick={closeRegistration} className="btnPopup btnCancel">
                <Cancel />
              </IconButton>
            </div>
          </form>
        </div>
      </Modal>
      <Modal open={openDeleteModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-rateChart">
        <div className="modal">
          <h2 className="popupHead">Delete {data.payeeParentName} Payee Parent Master?</h2>
          <div style={{ marginTop: '1rem' }}>
            <Button title="Save" onClick={() => deleteData(data._id)}>
              Delete
            </Button>
            <Button type="submit" title="Cancel" onClick={closeRegistration}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ParentPayee;

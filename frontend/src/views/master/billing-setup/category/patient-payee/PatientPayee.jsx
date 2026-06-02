import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Container } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
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
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import REACT_APP_BASE_URL from '../../../../../api/api';
import tokenHandler from '../../../../../token/TokenHandler';
import axios from 'axios';
import ImportExport from 'component/ImportExport';

const PatientPayee = () => {
  const [payeeParent, setPayeeParent] = useState([]);
  const [payeeParenta, setPayeeParenta] = useState([]);
  const [parentGroup, setParentGroup] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const token = tokenHandler();
  const headerFields = [
    'Patient Payee',
    'Rate Chart',
    'Charity Category',
    'Payee Parent',
    'Address',
    'Lic NO',
    'Date of Incorporate',
    'Date of Mou',
    'Renewal Date'
  ];
  const [inputData, setInputData] = useState({
    payeeName: '',
    payeeParent: '',
    payeeParentId: '',
    rateChart: '',
    parentGroup: '',
    parentGroupId: '',
    address: '',
    licNo: '',
    dateIncorporate: '',
    dateMou: '',
    dateRenewal: ''
  });
  const [error, setError] = useState({
    payeeName: '',
    payeeParent: '',
    rateChart: '',
    parentGroup: '',
    address: '',
    licNo: '',
    dateIncorporate: '',
    dateMou: '',
    dateRenewal: ''
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
        item.payeeName.toLowerCase().includes(searchValue) ||
        item.parentGroup.toLowerCase().includes(searchValue) ||
        item.payeeParent.toLowerCase().includes(searchValue) ||
        item.rateChart.toLowerCase().includes(searchValue) ||
        item.address.toLowerCase().includes(searchValue) ||
        item.licNo.toLowerCase().includes(searchValue) ||
        item.dateIncorporate.toLowerCase().includes(searchValue) ||
        item.dateMou.toLowerCase().includes(searchValue) ||
        item.dateRenewal.toLowerCase().includes(searchValue)
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
    if (name === 'payeeParent') {
      let dep = '';
      payeeParent.forEach((v) => {
        if (v._id === value) {
          dep = v.payeeParentName;
        }
      });
      setInputData((prev) => {
        return { ...prev, payeeParentId: value, payeeParent: dep };
      });
    } else if (name === 'parentGroup') {
      let dep = '';
      parentGroup.forEach((v) => {
        if (v._id === value) {
          dep = v.parentGroupName;
        }
      });
      let pay = [];
      payeeParenta.forEach((v) => {
        if (v.parentGroupId === value) {
          pay.push(v);
        }
      });
      setPayeeParent(pay);
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
    await get('category/patient-payee').then((response) => {
      let addsr = [];
      response.data.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setFilterData(addsr);
      setLoader(false);
    });

    await get('category/payee-group').then((response) => {
      setPayeeParenta(response.data);
    });

    await get('category/parent-group').then((response) => {
      setParentGroup(response.data);
    });
  };

  const deleteData = async (id) => {
    await put(`category/patient-payee/delete/${id}`)
      .then(() => {
        fetchData();
        toast.error(`${data.payeeName} Patient Payee deleted!!`);
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
    let pay = [];
    payeeParenta.forEach((v) => {
      if (v.parentGroupId === s.parentGroupId) {
        pay.push(v);
      }
    });
    setPayeeParent(pay);
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
      payeeName: '',
      payeeParent: '',
      payeeParentId: '',
      rateChart: '',
      parentGroup: '',
      parentGroupId: '',
      address: '',
      licNo: '',
      dateIncorporate: '',
      dateMou: '',
      dateRenewal: ''
    });
    setError({
      payeeName: '',
      payeeParent: '',
      rateChart: '',
      parentGroup: '',
      address: '',
      licNo: '',
      dateIncorporate: '',
      dateMou: '',
      dateRenewal: ''
    });
    setPayeeParent([]);
  };

  const validation = () => {
    const fieldsToValidate = [
      { field: 'payeeName', message: 'Payee Name is required' },
      { field: 'payeeParent', message: 'Payee Parent is required' },
      { field: 'parentGroup', message: 'Charity Category is required' },
      { field: 'rateChart', message: 'Rate Chart is required' },
      { field: 'address', message: 'Address is required' },
      { field: 'licNo', message: 'Lic No. is required' }
    ];

    if (inputData.parentGroup.toLowerCase() !== 'cash') {
      fieldsToValidate.push(
        {
          field: 'dateIncorporate',
          message: 'Date of Incorporate is required'
        },
        { field: 'dateMou', message: 'Date of MOU is required' },
        { field: 'dateRenewal', message: 'Renewal Date is required' }
      );
    }

    let allValid = true;

    fieldsToValidate.forEach(({ field, message }) => {
      if (!inputData[field]) {
        setError((prev) => ({
          ...prev,
          [field]: message
        }));
        allValid = false;
      }
    });

    return allValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validation();

    if (isFormValid) {
      await post('category/patient-payee', inputData)
        .then(() => {
          setOpenRegistrationModal(false);
          fetchData();
          setInputData({
            payeeName: '',
            payeeParent: '',
            payeeParentId: '',
            rateChart: '',
            parentGroup: '',
            parentGroupId: '',
            address: '',
            licNo: '',
            dateIncorporate: '',
            dateMou: '',
            dateRenewal: ''
          });
          toast.error('Patient Payee Added!!');
        })
        .catch((error) => {
          if (error.response?.data?.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
        });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validation();

    if (isFormValid) {
      await put(`category/patient-payee/${data._id}`, inputData)
        .then(() => {
          setOpenEditModal(false);
          fetchData();
          toast.success(`${data.payeeName} Patient Payee Updated!!`);
          setInputData({
            payeeName: '',
            payeeParent: '',
            payeeParentId: '',
            rateChart: '',
            parentGroup: '',
            parentGroupId: '',
            address: '',
            licNo: '',
            dateIncorporate: '',
            dateMou: '',
            dateRenewal: ''
          });
        })
        .catch((error) => {
          if (error.response?.data?.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
        });
    }
  };

  // IMPORT EXPORT
  // const fileValidationHandler = (fileData) => {
  //   const newData = [];
  //   fileData?.forEach((val) => {
  //     if (!headerFields?.some((field) => val[field].trim() === '')) {
  //       const d = {};
  //       headerFields?.map((i) => (d[i] = val[i]));
  //       newData.push(d);
  //     }
  //   });
  //   console.log('FileData', fileData);
  //   return newData;
  // };

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};

      if (
        val['Patient Payee'] !== '' &&
        val['Rate Chart'] !== '' &&
        val['Charity Category'] !== undefined &&
        val['Address'] !== undefined &&
        val['Lic NO'] !== undefined &&
        val['Date of Incorporate'] !== undefined &&
        val['Date of Mou'] !== undefined &&
        val['Renewal Date'] !== undefined
      ) {
        d = {
          payeeName: val['Patient Payee'],
          rateChart: val['Rate Chart'],
          payeeParent: val['Payee Parent'],
          parentGroup: val['Charity Category'],
          address: val['Address'],
          licNo: val['Lic NO'],
          dateIncorporate: val['Date of Incorporate'],
          dateMou: val['Date of Mou'],
          dateRenewal: val['Renewal Date']
        };

        newData.push(d);
      }
    });
    return newData;
  };

  const exportDataHandler = () => {
    let data = [];
    showData?.forEach((val, ind) => {
      data?.push({
        SN: ind + 1,
        'Patient Payee': val?.payeeName,
        'Rate Chart': val?.rateChart,
        'Charity Category': val?.parentGroup,
        'Payee Parent': val?.payeeParent,
        Address: val?.address,
        'LIC NO': val?.licNo,
        'Date Of Incorporate': val?.dateIncorporate,
        'Date Of MOU': val?.dateMou,
        'Renewal Date': val?.dateRenewal
      });
    });
    return data;
  };

  const getData = async () => {
    setLoader(true);
    try {
      await axios
        .get(`${REACT_APP_BASE_URL}category/patient-payee`, {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then((response) => {
          let addsr = [];
          response.data.data.forEach((val, index) => {
            addsr.push({ ...val, sr: index + 1 });
          });
          setShowData(addsr);
          setFilterData(addsr);
          setLoader(false);
        });
    } catch (error) {
      console.error('Error fetching unit:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const columns = [
    'SN',
    'Patient Payee',
    'Rate Chart',
    'payee Category',
    'Payee Parent',
    'Address',
    'LIC No',
    'Date of Incorporate',
    'Date of MOU',
    'Renewal Date',
    'Actions'
  ];

  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Patient Payee': item.payeeName,
        'Rate Chart': item.rateChart,
        'payee Category': item.parentGroup,
        'Payee Parent': item.payeeParent,
        Address: item.address,
        'LIC No': item.licNo,
        'Date of Incorporate': item.dateIncorporate,
        'Date of MOU': item.dateMou,
        'Renewal Date': item.dateRenewal,
        Actions: (
          <div className="action_btn">
            <EditBtn onClick={() => openEditModalFun(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      };
    });

  return (
    <Container maxWidth="xl" style={{ marginTop: '10px', padding: '0' }}>
      <div className="top_bar">
        {/* <Button
          variant='contained'
          onClick={openRegistration}
          className='global_btn'
        >
          + Add
        </Button>
        <div className='searchImport'>
          <input
            className='search_input'
            type='search'
            placeholder='Search...'
            onChange={filterDataHandler}
          />
        </div> */}
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
              update={getData}
              headerFields={headerFields}
              downheaderFields={headerFields}
              name="Patient Payee"
              fileValidationHandler={fileValidationHandler}
              exportDataHandler={exportDataHandler}
              api="category/patient-payee/import"
            />
          </div>
        </div>
        <Modal open={openRegistrationModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-rateChart">
          <div className="modal">
            <h2 className="popupHead">Add Patient Payee</h2>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient Payee"
                    variant="outlined"
                    name="payeeName"
                    value={inputData.payeeName}
                    onChange={handleInputChange}
                    error={error.payeeName !== '' ? true : false}
                    helperText={error.payeeName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={error.parentGroup !== '' ? true : false}>
                    <InputLabel htmlFor="parentGroup">Charity Category</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      label="Charity Category"
                      name="parentGroup"
                      value={inputData.parentGroupId}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {parentGroup.map((r, ind) => {
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
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={error.payeeParent !== '' ? true : false}>
                    <InputLabel htmlFor="payeeParent">Parent Payee</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Parent Payee"
                      name="payeeParent"
                      value={inputData.payeeParentId}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {payeeParent.map((r, ind) => {
                        return (
                          <MenuItem value={r._id} key={ind}>
                            {r.payeeParentName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.payeeParent}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    name="address"
                    value={inputData.address}
                    onChange={handleInputChange}
                    error={error.address !== '' ? true : false}
                    helperText={error.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LIC No."
                    variant="outlined"
                    name="licNo"
                    value={inputData.licNo}
                    onChange={handleInputChange}
                    error={error.licNo !== '' ? true : false}
                    helperText={error.licNo}
                  />
                </Grid>

                {inputData.parentGroup.toLowerCase() !== 'cash' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Incorporate"
                        type="date"
                        variant="outlined"
                        name="dateIncorporate"
                        value={inputData.dateIncorporate}
                        onChange={handleInputChange}
                        error={error.dateIncorporate !== '' ? true : false}
                        helperText={error.dateIncorporate}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of MOU"
                        type="date"
                        variant="outlined"
                        name="dateMou"
                        value={inputData.dateMou}
                        onChange={handleInputChange}
                        error={error.dateMou !== '' ? true : false}
                        helperText={error.dateMou}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Renewal Date"
                        type="date"
                        variant="outlined"
                        name="dateRenewal"
                        value={inputData.dateRenewal}
                        onChange={handleInputChange}
                        error={error.dateRenewal !== '' ? true : false}
                        helperText={error.dateRenewal}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              <div className="btnGroup">
                <Button title="Save" className="btnPopup btnSave" type="submit">
                  <Save />
                </Button>
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
          <h2 className="popupHead">Update Patient Payee</h2>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Patient Payee"
                  variant="outlined"
                  name="payeeName"
                  value={inputData.payeeName}
                  onChange={handleInputChange}
                  error={error.payeeName !== '' ? true : false}
                  helperText={error.payeeName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={error.parentGroup !== '' ? true : false}>
                  <InputLabel htmlFor="parentGroup">Charity Category</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Charity Category"
                    name="parentGroup"
                    value={inputData.parentGroupId}
                    onChange={handleInputChange}
                    variant="outlined"
                  >
                    {parentGroup.map((r, ind) => {
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={error.payeeParent !== '' ? true : false}>
                  <InputLabel htmlFor="payeeParent">Payee Parent</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Payee Parent"
                    name="payeeParent"
                    value={inputData.payeeParentId}
                    onChange={handleInputChange}
                    variant="outlined"
                  >
                    {payeeParent.map((r, ind) => {
                      return (
                        <MenuItem value={r._id} key={ind}>
                          {r.payeeParentName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{error.payeeParent}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  name="address"
                  value={inputData.address}
                  onChange={handleInputChange}
                  error={error.address !== '' ? true : false}
                  helperText={error.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LIC No."
                  variant="outlined"
                  name="licNo"
                  value={inputData.licNo}
                  onChange={handleInputChange}
                  error={error.licNo !== '' ? true : false}
                  helperText={error.licNo}
                />
              </Grid>

              {inputData.parentGroup.toLowerCase() !== 'cash' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Incorporate"
                      type="date"
                      variant="outlined"
                      name="dateIncorporate"
                      value={inputData.dateIncorporate}
                      onChange={handleInputChange}
                      error={error.dateIncorporate !== '' ? true : false}
                      helperText={error.dateIncorporate}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of MOU"
                      type="date"
                      variant="outlined"
                      name="dateMou"
                      value={inputData.dateMou}
                      onChange={handleInputChange}
                      error={error.dateMou !== '' ? true : false}
                      helperText={error.dateMou}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Renewal Date"
                      type="date"
                      variant="outlined"
                      name="dateRenewal"
                      value={inputData.dateRenewal}
                      onChange={handleInputChange}
                      error={error.dateRenewal !== '' ? true : false}
                      helperText={error.dateRenewal}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                </>
              )}
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
          <h2 className="popupHead">Delete {data.payeeName} Patient Payee?</h2>
          <div className="btnGroup">
            <Button title="Save" className="btnPopup btnDelete" onClick={() => deleteData(data._id)}>
              Delete
            </Button>
            <Button type="submit" title="Cancel" onClick={closeRegistration}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default PatientPayee;

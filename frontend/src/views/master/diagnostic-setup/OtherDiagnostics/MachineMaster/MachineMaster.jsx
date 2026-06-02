import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Typography } from '@mui/material';
import { Paper, IconButton, InputLabel, Select, FormHelperText, MenuItem, FormControl, Grid } from '@mui/material';

import NoDataPlaceholder from '../../../../../component/NoDataPlaceholder';
import { Cancel, Save } from '@mui/icons-material';
import ImportExport from '../../../../../component/ImportExport';
import { get, post, put } from 'api/api';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import { toast } from 'react-toastify';

const MachineMaster = () => {
  const [allData, setAllData] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});
  // const toast = useToast()

  const headerFields = ['Machine Name', 'Method Name', 'Department', 'Manufacturer', 'Model Number', 'Serial Number'];
  const [inputData, setInputData] = useState({
    machineName: '',
    methodName: '',
    department: '',
    departmentId: '',
    make: '',
    modelNumber: '',
    serialNumber: ''
  });
  const [error, setError] = useState({
    machineName: '',
    methodName: '',
    department: '',
    make: '',
    modelNumber: '',
    serialNumber: ''
  });
  const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [loader, setLoader] = useState(true);

  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = filterData.filter((item) => {
      return (
        item.machineName.toLowerCase().includes(searchValue) ||
        item.methodName.toLowerCase().includes(searchValue) ||
        item.department.toLowerCase().includes(searchValue) ||
        item.make.toLowerCase().includes(searchValue) ||
        item.modelNumber.toLowerCase().includes(searchValue) ||
        item.serialNumber.toLowerCase().includes(searchValue)
      );
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      let dep = '';
      allData.forEach((v) => {
        if (v._id === value) {
          dep = v.departmentName;
        }
      });

      setInputData((prev) => {
        return { ...prev, departmentId: value, department: dep };
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
    await get('other-diagnostics-machine-master').then((response) => {
      let addsr = [];
      response.machines.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setFilterData(addsr);
      setLoader(false);
    });

    await get('department-setup').then((response) => {
      let dept = [];
      response.data.forEach((v) => {
        if (v?.departmentFunction?.isRadiology === true&&v?.departmentType?.toLowerCase()?.trim() === 'clinical') {
          dept.push(v);
        }
      });
      setAllData(dept);
    });
  };

  const deleteData = async (id) => {
    await put(`other-diagnostics-machine-master/delete/${id}`)
      .then((response) => {
        fetchData();
        toast({
          title: `${data.machineName} Machine Master deleted!!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong, Please try later!!',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
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
      machineName: '',
      methodName: '',
      department: '',
      departmentId: '',
      make: '',
      modelNumber: '',
      serialNumber: ''
    });
    setError({
      machineName: '',
      methodName: '',
      department: '',
      make: '',
      modelNumber: '',
      serialNumber: ''
    });
  };

  const validation = () => {
    if (inputData.machineName === '') {
      setError((prev) => {
        return { ...prev, machineName: 'Machine Name is required' };
      });
    }
    if (inputData.methodName === '') {
      setError((prev) => {
        return { ...prev, methodName: 'Method Name is required' };
      });
    }
    if (inputData.departmentId === '') {
      setError((prev) => {
        return { ...prev, department: 'Department is required' };
      });
    }
    if (inputData.make === '') {
      setError((prev) => {
        return { ...prev, make: 'Manufacturer is required' };
      });
    }
    if (inputData.modelNumber === '') {
      setError((prev) => {
        return { ...prev, modelNumber: 'Model Number is required' };
      });
    }
    if (inputData.serialNumber === '') {
      setError((prev) => {
        return { ...prev, serialNumber: 'Serial Number is required' };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();
    if (
      inputData.machineName !== '' &&
      inputData.methodName !== '' &&
      inputData.department !== '' &&
      inputData.make !== '' &&
      inputData.modelNumber !== '' &&
      inputData.serialNumber !== ''
    ) {
      await post('other-diagnostics-machine-master', inputData)
        .then((response) => {
          setOpenRegistrationModal(false);
          fetchData();
          setInputData({
            machineName: '',
            methodName: '',
            department: '',
            departmentId: '',
            make: '',
            modelNumber: '',
            serialNumber: ''
          });
          toast({
            title: 'Machine Master Added!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    validation();
    if (
      inputData.machineName !== '' &&
      inputData.methodName !== '' &&
      inputData.department !== '' &&
      inputData.make !== '' &&
      inputData.modelNumber !== '' &&
      inputData.serialNumber !== ''
    ) {
      await put(`other-diagnostics-machine-master/${data._id}`, inputData)
        .then((res) => {
          setOpenEditModal(false);
          fetchData();
          toast({
            title: `${data.machineName} Method/Machine Master Updated!!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
          setInputData({
            machineName: '',
            methodName: '',
            department: '',
            departmentId: '',
            make: '',
            modelNumber: '',
            serialNumber: ''
          });
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};
      if (
        // val['Machine Name'] !== '' &&
        // val['Method Name'] !== '' &&
        // val['Department'] !== '' &&
        // val['Manufacturer'] !== '' &&
        // val['Model Number'] !== '' &&
        // val['Serial Number'] !== '' &&
        // val['Machine Name'] !== undefined &&
        // val['Method Name'] !== undefined &&
        // val['Department'] !== undefined &&
        // val['Manufacturer'] !== undefined &&
        // val['Model Number'] !== undefined &&
        // val['Serial Number'] !== undefined
        true
      ) {
        let dep = '';
        allData.forEach((v) => {
          if (v.departmentName === val['Department']) {
            dep = v._id;
          }
        });
        d = {
          machineName: val['Machine Name'],
          departmentId: dep||null,
          department: val['Department'],
          methodName: val['Method Name'],
          make: val['Manufacturer'],
          modelNumber: val['Model Number'],
          serialNumber: val['Serial Number']
        };

        newData.push(d);
      }
    });
    return newData;
  };

  const exportDataHandler = () => {
    let datadd = [];
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Machine Name': val.machineName.replace(/,/g, ' '),
        'Method Name': val.methodName.replace(/,/g, ' '),
        Department: val.department.replace(/,/g, ' '),
        Manufacturer: val.make.replace(/,/g, ' '),
        'Model Number': val.modelNumber.replace(/,/g, ' '),
        'Serial Number': val.serialNumber.replace(/,/g, ' ')
      });
    });
    return datadd;
  };

  const columns = ['Sr. No', 'Machine Name', 'Method Name', 'Department', 'Manufacturer', 'Model Number', 'Serial Number', 'Actions'];

  const finalData = showData.map((item, index) => ({
    'Sr. No': index + 1,
    'Machine Name': item.machineName,
    'Method Name': item.methodName,
    Department: item.department,
    Manufacturer: item.make,
    'Model Number': item.modelNumber,
    'Serial Number': item.serialNumber,
    Actions: (
      <div>
        <EditBtn variant="contained" onClick={() => openEditModalFun(item)} />
        <DeleteBtn variant="contained" onClick={() => openDeleteModalFun(item)} />
      </div>
    )
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" onClick={openRegistration} className="global_btn">
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
            name="Other Diagnostics Machine Master"
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api="other-diagnostics-machine-master/import"
          />
        </div>
        <Modal open={openRegistrationModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <div className="modal">
            <h2 className="popupHead">Add Method / Machine Master</h2>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Machine Name"
                    variant="outlined"
                    name="machineName"
                    value={inputData.machineName}
                    onChange={handleInputChange}
                    error={error.machineName !== '' ? true : false}
                    helperText={error.machineName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Method Name"
                    variant="outlined"
                    name="methodName"
                    value={inputData.methodName}
                    onChange={handleInputChange}
                    error={error.methodName !== '' ? true : false}
                    helperText={error.methodName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={error.department !== '' ? true : false}>
                    <InputLabel htmlFor="department">Department</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Department"
                      name="department"
                      value={inputData.departmentId}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {allData.map((r, ind) => {
                        return (
                          <MenuItem value={r._id} key={ind}>
                            {r.departmentName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.department}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Manufacturer"
                    variant="outlined"
                    name="make"
                    value={inputData.make}
                    onChange={handleInputChange}
                    error={error.make !== '' ? true : false}
                    helperText={error.make}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Model Number"
                    variant="outlined"
                    name="modelNumber"
                    value={inputData.modelNumber}
                    onChange={handleInputChange}
                    error={error.modelNumber !== '' ? true : false}
                    helperText={error.modelNumber}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Serial Number"
                    variant="outlined"
                    name="serialNumber"
                    value={inputData.serialNumber}
                    onChange={handleInputChange}
                    error={error.serialNumber !== '' ? true : false}
                    helperText={error.serialNumber}
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
          <h2 className="popupHead">Update Method/Machine Master</h2>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Machine Name"
                  variant="outlined"
                  name="machineName"
                  value={inputData.machineName}
                  onChange={handleInputChange}
                  error={error.machineName !== '' ? true : false}
                  helperText={error.machineName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Method Name"
                  variant="outlined"
                  name="methodName"
                  value={inputData.methodName}
                  onChange={handleInputChange}
                  error={error.methodName !== '' ? true : false}
                  helperText={error.methodName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={error.department !== '' ? true : false}>
                  <InputLabel htmlFor="department">Department</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Department"
                    name="department"
                    value={inputData.departmentId}
                    onChange={handleInputChange}
                    variant="outlined"
                  >
                    {allData.map((r, ind) => {
                      return (
                        <MenuItem value={r._id} key={ind}>
                          {r.departmentName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{error.department}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  variant="outlined"
                  name="make"
                  value={inputData.make}
                  onChange={handleInputChange}
                  error={error.make !== '' ? true : false}
                  helperText={error.make}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model Number"
                  variant="outlined"
                  name="modelNumber"
                  value={inputData.modelNumber}
                  onChange={handleInputChange}
                  error={error.modelNumber !== '' ? true : false}
                  helperText={error.modelNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  variant="outlined"
                  name="serialNumber"
                  value={inputData.serialNumber}
                  onChange={handleInputChange}
                  error={error.serialNumber !== '' ? true : false}
                  helperText={error.serialNumber}
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
          <Typography>
            Are you sure you want to delete <strong>{data.machineName}</strong> Investigation Master?
          </Typography>
          <Button onClick={() => deleteData(data._id)}>Delete</Button>
          <Button onClick={closeRegistration}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MachineMaster;

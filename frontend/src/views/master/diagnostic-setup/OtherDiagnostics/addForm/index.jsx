import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Typography } from '@mui/material';
import { Paper, IconButton, InputLabel, Select, FormHelperText, MenuItem, FormControl, Grid } from '@mui/material';
import NoDataPlaceholder from '../../../../../component/NoDataPlaceholder';
import { Cancel, Close, Save } from '@mui/icons-material';
import { get, post, put, remove } from 'api/api';
import DataTable from 'component/DataTable';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import ImportExport from 'component/ImportExport';
import Loader from 'component/Loader/Loader';
import Editor from '../../../../../component/editor/editor/Editor';
import { toast } from 'react-toastify';
// import EditorTextParser from 'component/editor/editor-parser/EditorTextParser';

const AddForm = () => {
  const [allData, setAllData] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machinesa, setMachinesa] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [viewDescriptionModal, setViewDescriptionModal] = useState(false);
  const [description, setDescription] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [billGroup, setAllBillGroup] = useState([]);
  const [dataToEdit, setDataToEdit] = useState({});
  // const toast = useToast()
  // const token = tokenHandler()
  const headerFields = ['Test Name', 'Department', 'Service/Bill Group', 'Machine Name', 'Test Type', 'Test Range'];
  const downheaderFields = ['Test Name', 'Department', 'Service/Bill Group', 'Machine Name', 'Test Type', 'Test Range'];

  const [inputData, setInputData] = useState({
    testName: '',
    department: [],
    departmentId: [],
    billGroup: '',
    billGroupId: '',
    machineName: '',
    machineId: '',
    testType: 'Numeric',
    testRangeStart: '',
    testRangeEnd: '',
    description: []
  });
  const [error, setError] = useState({
    testName: '',
    department: '',
    billGroup: '',
    machineName: '',
    testType: '',
    testRangeStart: '',
    testRangeEnd: '',
    description: ''
  });

  const handleSave = (event) => {
    if (openDescriptionModal) {
      setInputData((prev) => {
        return {
          ...prev,
          description: description !== null && Object.entries(description).length > 0 ? [{ ...description }] : []
        };
      });
      setOpenDescriptionModal(false);
    }
    if (openRegistrationModal && !openDescriptionModal) {
      handleSubmit(event);
    }
    if (openEditModal && !openDescriptionModal) {
      handleEditSubmit(event);
    }
    if (openDeleteModal) {
      deleteData(data._id);
    }
  };

  // Use the custom hook
  // useSaveOnCtrlS(handleSave);

  const handleCancel = () => {
    if (openDescriptionModal) {
      setOpenDescriptionModal(false);
    } else {
      closeRegistration();
    }
  };

  // Use the custom hook
  // useCancelEsc(handleCancel);

  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
  
    const filteredData = filterData.filter((item) => {
      return (
        item.testName?.toLowerCase().includes(searchValue) ||
        item.machineName?.toLowerCase().includes(searchValue) ||
        item.testType?.toLowerCase().includes(searchValue) ||
        (item.testRange && typeof item.testRange === "string" && item.testRange.toLowerCase().includes(searchValue)) ||
        (item.description && typeof item.description === "string" && item.description.toLowerCase().includes(searchValue)) ||
        (Array.isArray(item.department) && item.department.some(dep => dep.toLowerCase().includes(searchValue))) // ✅ Handle department array
      );
    });
  
    // Assign serial numbers
    const updatedData = filteredData.map((val, index) => ({
      ...val,
      sr: index + 1,
    }));
  
    setShowData(updatedData);
  };
  
  const handleDescription = () => {
    setError((prev) => {
      return { ...prev, description: '' };
    });
    setOpenDescriptionModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'machineName') {
      let dep = '';
      machinesa.forEach((v) => {
        if (v._id === value) {
          dep = v.machineName;
        }
      });

      setInputData((prev) => {
        return { ...prev, machineId: value, machineName: dep };
      });
    } else if (name === 'billGroup') {
      let dep = '';
      billGroup?.forEach((v) => {
        if (v?._id === value) {
          dep = v.billGroupName;
        }
      });
      setInputData((prev) => {
        return { ...prev, billGroupId: value, billGroup: dep };
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
    await get('department-setup').then((response) => {
      setLoader(false);
      let dept = [];
      response.data.forEach((v) => {
        if (v.departmentFunction.isRadiology === true&&v?.departmentType?.toLowerCase()?.trim() === 'clinical') {
          dept.push(v);
        }
      });
      setAllData(dept);
    });

    await get('other-diagnostics-machine-master').then((response) => {
      setMachinesa(response.machines);
    });
    await get('billgroup-master').then((response) => {
      setAllBillGroup(response?.data);
    });

    setLoader(true);
    await get('other-diagnostics-master').then((response) => {
      setShowData(response?.diagnostics || []);
      setFilterData(response?.diagnostics || []);
      setLoader(false);
    });
  };

  const deleteData = async (id) => {
    await remove(`other-diagnostics-master/${id}`)
      .then(() => {
        fetchData();
        toast.success('Deleted Successfully');
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something wrong');
      });
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setInputData({
      testName: '',
      department: '',
      departmentId: '',
      machineName: '',
      machineId: '',
      testType: 'Numeric',
      testRangeStart: '',
      testRangeEnd: '',
      description: []
    });
    setError({
      testName: '',
      department: '',
      billGroup: '',
      machineName: '',
      testType: '',
      testRangeStart: '',
      testRangeEnd: '',
      description: ''
    });
    setDescription({});
  };

  const validation = () => {
    if (inputData.testName === '') {
      setError((prev) => {
        return { ...prev, testName: 'Test Name is required' };
      });
    }
    if (inputData.departmentId === '') {
      setError((prev) => {
        return { ...prev, department: 'Department is required' };
      });
    }
    // if (inputData.billGroup === '') {
    //   setError((prev) => {
    //     return { ...prev, billGroup: 'BillGroup is required' };
    //   });
    // }

    if (inputData.testType === '') {
      setError((prev) => {
        return { ...prev, testType: 'Test type is required' };
      });
    } else {
      // if (inputData.testType === 'Numeric' && inputData.testRangeStart === '') {
      //   setError((prev) => {
      //     return { ...prev, testRangeStart: 'Minimum Test Range is required' };
      //   });
      // }
      // if (inputData.testType === 'Numeric' && inputData.testRangeEnd === '') {
      //   setError((prev) => {
      //     return { ...prev, testRangeEnd: 'Maximum Test Range is required' };
      //   });
      // }
      // if (
      //   inputData.testType === 'Descriptive' &&
      //   (inputData.description.length === 0 ||
      //     (inputData.description.length > 0 && inputData.description[0].blocks.length === 0) ||
      //     inputData.description === null)
      // ) {
      //   setError((prev) => {
      //     return { ...prev, description: 'Description is required' };
      //   });

      // }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();

    const isValid =
      inputData.testName !== '' &&
      inputData.department !== '' &&
      inputData.departmentId !== '' &&
      inputData.billGroup !== '' &&
      inputData.billGroupId !== '';

    if (isValid) {
      let datatoSend = {
        testName: inputData.testName,
        department: inputData.department,
        departmentId: inputData.departmentId,
        billGroup: inputData.billGroup,
        billGroupId: inputData.billGroupId,
        machineName: inputData.machineName,
        machineId: inputData.machineId,
        testType: inputData.testType
      };

      if (inputData.testType === 'Numeric') {
        datatoSend.testRange = `${inputData.testRangeStart} - ${inputData.testRangeEnd}`;
      } else if (inputData.testType === 'Descriptive') {
        datatoSend.description = inputData.description;
      }

      await post('other-diagnostics-master', datatoSend)
        .then(() => {
          setOpenRegistrationModal(false);
          setDescription({});
          fetchData();
          setInputData({
            testName: '',
            department: '',
            departmentId: '',
            billGroup: '',
            billGroupId: '',
            machineName: '',
            machineId: '',
            testType: 'Numeric',
            testRangeStart: '',
            testRangeEnd: '',
            description: {}
          });
          toast.success('Other Diagnostics Master Added!!');
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    validation();

    // Determine if input is valid based on test type
    const isValid =
      inputData.testName !== '' &&
      inputData.department !== '' &&
      inputData.departmentId !== '' &&
      inputData.billGroup !== '' &&
      inputData.billGroupId !== '';
    // inputData.testType !== ''

    if (isValid) {
      let datatoSend = {
        testName: inputData.testName,
        department: inputData.department,
        departmentId: inputData.departmentId,
        billGroup: inputData.billGroup,
        billGroupId: inputData.billGroupId,
        machineName: inputData.machineName,
        machineId: inputData.machineId,
        testType: inputData.testType,
        description: inputData.testType === 'Descriptive' ? inputData.description : [],
        testRange: inputData.testType === 'Numeric' ? `${inputData.testRangeStart} - ${inputData.testRangeEnd}` : null
      };

      await put(`other-diagnostics-master/${data._id}`, datatoSend)
        .then(() => {
          setOpenEditModal(false);
          fetchData();
          toast.success(`${data.testName} Investigation Master Updated!!`);
          setInputData({
            testName: '',
            department: '',
            departmentId: '',
            billGroup: '',
            billGroupId: '',
            machineName: '',
            machineId: '',
            testType: 'Numeric',
            testRangeStart: '',
            testRangeEnd: '',
            description: {}
          });
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
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
        // val['Test Name'] !== '' &&
        // val['Department'] !== '' &&
        // val['Service/Bill Group'] !== '' &&
        // val['Machine Name'] !== '' &&
        // val['Test Name'] !== undefined &&
        // val['Department'] !== undefined &&
        // val['Machine Name'] !== undefined &&
        // val['Test Range'] !== undefined
        true
      ) {
        // ✅ Updated department logic (returning arrays)
        let departmentNames = [];
        let departmentIds = [];
  
        const departmentField = val['Department']?.toLowerCase()?.trim();
  
        if (departmentField === 'all departments') {
          const allDepartments = (allData || []);
  
          allDepartments.forEach((curr) => {
            if (curr?.departmentName && curr?._id) {
              departmentNames.push(curr.departmentName);
              departmentIds.push(curr._id);
            }
          });
        } else {
          const departmentRaw = val['Department'];
  
          if (!departmentRaw || departmentRaw.trim() === '') {
            departmentNames = [];
            departmentIds = [];
          } else {
            const depSet = new Set(departmentRaw.split(',').map((dep) => dep.trim()));
  
            (allData || []).forEach((currObj) => {
              if (depSet.has(currObj?.departmentName)) {
                departmentNames.push(currObj.departmentName);
                departmentIds.push(currObj._id);
              }
            });
          }
        }
  
        // ✅ Machine mapping remains unchanged
        let mac = '';
        machinesa.forEach((v) => {
          if (v.machineName === val['Machine Name']) {
            mac = v._id;
          }
        });
  
        // ✅ Final object with department & departmentId as arrays
        d = {
          testName: val['Test Name'],
          department: departmentNames,
          billGroup: val['Service/Bill Group'],
          departmentId: departmentIds,
          machineName: val['Machine Name'],
          machineId: mac,
          testType:
            val['Test Range'] !== null && val['Test Range'] !== ''
              ? 'Numeric'
              : val['Description'] !== null && val['Description'] !== ''
                ? 'Descriptive'
                : 'none',
          testRange: val['Test Range']
          // description: val['Description']
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
        'Test Name': val.testName ? val.testName.replace(/,/g, ' ') : null,
        Department: Array.isArray(val.department)
          ? val.department.join(' / ')
          : (val.department || null),
        'Service/Bill Group': val.billGroup ? val.billGroup.replace(/,/g, ' ') : null,
        'Machine Name': val.machineName ? val.machineName.replace(/,/g, ' ') : null,
        'Test Type': val.testType ? val.testType.replace(/,/g, ' ') : null,
        'Test Range': val.testType === 'Numeric' && val.testRange
          ? val.testRange.replace(/,/g, ' ')
          : null
      });
    });
  
    return datadd;
  };
  

  const openEditModalFun = (s) => {
    setDescription(s.description);
    let dd = {};
    if (s.testRange !== null) {
      dd = {
        ...s,
        testRangeStart: s.testRange.split('-')[0],
        testRangeEnd: s.testRange.split('-')[1],
        description: []
      };
    } else {
      dd = {
        ...s,
        testRangeStart: '',
        testRangeEnd: '',
        description: [{ ...s.description }]
      };
    }
    let mac = [];
    machinesa.forEach((v) => {
      if (v.departmentId === s.departmentId) {
        mac.push(v);
      }
    });
    setMachines(mac);
    setData(dd);
    setInputData(dd);
    setOpenEditModal(true);
  };

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const columns = ['Sr. No', 'Test Name', 'Department', 'Service/Bill Group', 'Machine', 'Test Type', 'Test Range', 'Actions'];

  const finnalData = showData.map((data, ind) => ({
    'Sr. No': ind + 1,
    'Test Name': data.testName,
    Department: Array.isArray(data?.department) && data?.department.length > 0 && allData?.length === data?.department?.length
    ? 'All Department'
    : data?.department.join(','),
    'Service/Bill Group': data.billGroup,
    Machine: data.machineName,
    'Test Type': data.testType,
    'Test Range':
      data.testType === 'Numeric' && data.testRange
        ? `${data.testRange}`
        : data.testType === 'Descriptive' && data.description?.blocks?.[0]?.data?.text
          ? data.description.blocks[0].data.text
          : null,
    Actions: (
      <div className="action_btn">
        <EditBtn
          onClick={() => {
            setOpenEditModal(true);
            openEditModalFun(data);
          }}
        />
        <DeleteBtn
          onClick={() => {
            openDeleteModalFun(data);
            // deleteData(data._id);
          }}
        />
      </div>
    )
  }));

  const selectedDepartments = Array.isArray(inputData.departmentId) ? inputData.departmentId : [];
  const allDepartmentIds = allData.map((r) => r._id);

  const handleChange = (event) => {
    let value = event.target.value;

    if (value.includes('all')) {
      // If all are selected, unselect all; otherwise, select all
      value = selectedDepartments.length === allDepartmentIds.length ? [] : allDepartmentIds;
    }

    // Get the corresponding department names based on selected IDs
    const selectedDepartmentNames = allData.filter((dept) => value.includes(dept._id)).map((dept) => dept.departmentName);

    setInputData((prev) => ({
      ...prev,
      departmentId: value,
      department: selectedDepartmentNames
    }));
  };

  console.log('inputd', inputData);
  console.log('machines', machines);

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
            downheaderFields={downheaderFields}
            name="Other Diagnostics Master"
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api="other-diagnostics-master/import"
          />
        </div>
        <Modal open={openRegistrationModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <div className="modal">
            <h2 className="popupHead">Add Other Diagnostics Master</h2>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Test Name"
                    variant="outlined"
                    name="testName"
                    value={inputData.testName}
                    onChange={handleInputChange}
                    error={error.testName !== '' ? true : false}
                    helperText={error.testName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!error.department}>
                    <InputLabel htmlFor="department">Department</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Department"
                      name="departmentId"
                      multiple
                      value={selectedDepartments}
                      onChange={handleChange}
                      variant="outlined"
                      renderValue={(selected) =>
                        selected.length === allDepartmentIds.length
                          ? 'All Departments'
                          : allData
                              .filter((r) => selected.includes(r._id))
                              .map((r) => r.departmentName)
                              .join(', ')
                      }
                    >
                      {/* Select All Option */}
                      <MenuItem value="all">
                        <em>{inputData.departmentId.length === allDepartmentIds.length ? 'Deselect All' : 'Select All'}</em>
                      </MenuItem>

                      {/* Dynamic Department Options */}
                      {allData.map((r) => (
                        <MenuItem key={r._id} value={r._id}>
                          {r.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{error.department}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={error.billGroup !== '' ? true : false}>
                    <InputLabel htmlFor="Service/Bill Group">Service/Bill Group</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Service/Bill Group"
                      name="billGroup"
                      value={inputData.billGroupId || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {billGroup?.map((group, ind) => {
                        return (
                          <MenuItem value={group._id} key={ind}>
                            {group?.billGroupName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.billGroup}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="machine">Machine Name</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Machine Name"
                      name="machineName"
                      value={inputData.machineId}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {machinesa.map((r, ind) => {
                        return (
                          <MenuItem value={r._id} key={ind}>
                            {r.machineName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText></FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={error.testType !== '' ? true : false}>
                    <InputLabel htmlFor="testType">Test Type</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Test Type"
                      name="testType"
                      value={inputData.testType}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Numeric">Numeric</MenuItem>
                      <MenuItem value="Descriptive">Descriptive</MenuItem>
                    </Select>
                    <FormHelperText>{error.testType}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  {inputData.testType === 'Numeric' ? (
                    <div>
                      <label>Test Range</label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '2px'
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Minimum"
                          variant="outlined"
                          name="testRangeStart"
                          value={inputData.testRangeStart}
                          onChange={handleInputChange}
                        />
                        <span>-</span>
                        <TextField
                          fullWidth
                          label="Maximum"
                          variant="outlined"
                          name="testRangeEnd"
                          value={inputData.testRangeEnd}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    inputData.testType === 'Descriptive' && (
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={
                          inputData?.description?.length > 0 && inputData.description[0]?.blocks?.length > 0
                            ? inputData.description[0]?.blocks[0].data.text + '...'
                            : ''
                        }
                        // onChange={handleInputChange}
                        error={error.description !== '' ? true : false}
                        helperText={error.description}
                        onClick={handleDescription}
                      />
                    )
                  )}
                </Grid>
                <div></div>
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
        <Paper>{showData.length <= 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finnalData} />}</Paper>
      )}
      <Modal open={openEditModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">Update Other Diagnostics</h2>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Test Name"
                  variant="outlined"
                  name="testName"
                  value={inputData.testName}
                  onChange={handleInputChange}
                  error={error.testName !== '' ? true : false}
                  helperText={error.testName}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}

              <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!error.department}>
                    <InputLabel htmlFor="department">Department</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 } // Adjust maxHeight as needed
                        }
                      }}
                      label="Department"
                      name="departmentId"
                      multiple
                      value={selectedDepartments}
                      onChange={handleChange}
                      variant="outlined"
                      renderValue={(selected) =>
                        selected.length === allDepartmentIds.length
                          ? 'All Departments'
                          : allData
                              .filter((r) => selected.includes(r._id))
                              .map((r) => r.departmentName)
                              .join(', ')
                      }
                    >
                      {/* Select All Option */}
                      <MenuItem value="all">
                        <em>{inputData.departmentId.length === allDepartmentIds.length ? 'Deselect All' : 'Select All'}</em>
                      </MenuItem>

                      {/* Dynamic Department Options */}
                      {allData.map((r) => (
                        <MenuItem key={r._id} value={r._id}>
                          {r.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{error.department}</FormHelperText>
                  </FormControl>
                </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={error.billGroup !== '' ? true : false}>
                  <InputLabel htmlFor="Service/Bill Group">Service/Bill Group</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Service/Bill Group"
                    name="billGroup"
                    value={inputData.billGroupId}
                    onChange={handleInputChange}
                    variant="outlined"
                  >
                    {billGroup?.map((r, ind) => {
                      return (
                        <MenuItem value={r._id} key={ind}>
                          {r?.billGroupName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{error.billGroup}</FormHelperText>
                </FormControl>
              </Grid>
              {/* PRABAY */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={error.machineName !== '' ? true : false}>
                  <InputLabel htmlFor="machine">Machine Name</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Machine Name"
                    name="machineName"
                    value={inputData.machineId}
                    onChange={handleInputChange}
                    variant="outlined"
                  >
                    {machinesa.map((r, ind) => {
                      return (
                        <MenuItem value={r._id} key={ind}>
                          {r.machineName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{error.machineName}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={error.testType !== '' ? true : false}>
                  <InputLabel htmlFor="testType">Test Type</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Test Type"
                    name="testType"
                    value={inputData.testType}
                    onChange={handleInputChange}
                    variant="outlined"
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Numeric">Numeric</MenuItem>
                    <MenuItem value="Descriptive">Descriptive</MenuItem>
                  </Select>
                  <FormHelperText>{error.testType}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                {inputData.testType === 'Numeric' ? (
                  <div>
                    <label>Test Range</label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '2px'
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Minimum"
                        variant="outlined"
                        name="testRangeStart"
                        value={inputData.testRangeStart}
                        onChange={handleInputChange}
                        error={error.testRangeStart !== '' ? true : false}
                      />
                      <span>-</span>
                      <TextField
                        fullWidth
                        label="Maximum"
                        variant="outlined"
                        name="testRangeEnd"
                        value={inputData.testRangeEnd}
                        onChange={handleInputChange}
                        error={error.testRangeEnd !== '' ? true : false}
                      />
                    </div>
                    <div
                      style={{
                        color: '#d32f2f',
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}
                    >
                      {error.testRangeStart !== '' && error.testRangeEnd !== ''
                        ? 'Test Range is required'
                        : error.testRangeStart !== ''
                          ? error.testRangeStart
                          : error.testRangeEnd !== '' && error.testRangeEnd}
                    </div>
                  </div>
                ) : (
                  inputData.testType === 'Descriptive' && (
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      name="description"
                      value={
                        inputData?.description?.[0]?.blocks?.[0]?.data?.text ? inputData.description[0].blocks[0].data.text + '...' : ''
                      }
                      error={!!error.description}
                      helperText={error.description}
                      onClick={handleDescription}
                    />
                  )
                )}
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

      <Modal open={openDeleteModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <Typography>
            Are you sure you want to delete <strong>{data.testName}</strong> Investigation Master?
          </Typography>
          <Button onClick={() => deleteData(data._id)}>Delete</Button>
          <Button onClick={closeRegistration}>Cancel</Button>
        </div>
      </Modal>
      <Modal open={openDescriptionModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <div className="start_end_btn_group">
            <h2 className="popupHead" style={{ marginBottom: '10px' }}>
              Description
            </h2>
            <IconButton title="Close" onClick={() => setOpenDescriptionModal(false)} className="btnPopup btnCancel">
              <Close />
            </IconButton>
          </div>
          <Editor description={description} setDescription={setDescription} />

          <IconButton
            title="Save"
            className="btnPopup btnSave"
            onClick={() => {
              setInputData((prev) => {
                return {
                  ...prev,
                  description: description !== null && Object.entries(description).length > 0 ? [{ ...description }] : []
                };
              });
              setOpenDescriptionModal(false);
            }}
            style={{ marginTop: '10px' }}
          >
            <Save />
          </IconButton>
        </div>
      </Modal>

      <Modal open={viewDescriptionModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="desmodal">
          <div className="start_end_btn_group" style={{ marginBottom: '-20px' }}>
            <h2 className="popupHead">Description</h2>
            <IconButton
              title="Close"
              onClick={() => {
                setViewDescriptionModal(false);
                setDescription({});
              }}
              className="btnPopup btnCancel"
            >
              <Close />
            </IconButton>
          </div>

          {/* <EditorTextParser description={description} /> */}
        </div>
      </Modal>
    </div>
  );
};

export default AddForm;

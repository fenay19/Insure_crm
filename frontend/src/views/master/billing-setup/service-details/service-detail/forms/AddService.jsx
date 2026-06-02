import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Autocomplete,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Popover,
  FormControlLabel,
  FormGroup,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { get, post } from 'api/api';
import { toast } from 'react-toastify';

const AddService = ({ handleClose, getData, serverData, whichService, serviceName }) => {
  const [allData, setAllData] = useState([]);
  const [patientPayee, setPatientPayee] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [subLedger, setSubLedger] = useState([]);
  const [billGroupData, setBillGroupData] = useState([]);

  const [inputData, setInputData] = useState({
    // patientPayee: '',
    // patientPayeeId: '',
    // payeeCategory: '',
    // payeeCategoryId: '',
    patientEncounter: [],
    detailServiceName: '',
    alternateServiceName: '',
    serviceGroupOrBillGroup: '',
    serviceGroupOrBillGroupId: '',
    serviceCode: '',
    ledger: '',
    ledgerId: '',
    subLedger: '',
    subLedgerId: '',
    department: [],
    departmentId: []
  });
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState({
    // patientPayee: '',
    // payeeCategory: '',
    patientEncounter: '',
    detailServiceName: '',
    serviceCode: '',
    ledger: '',
    ledgerId: '',
    subLedger: '',
    subLederId: '',
    department: ''
  });
  const [priceHistory, setPriceHistory] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [popoverData, setPopoverData] = useState({});
  const [payeeCategoryData, setPayeeCategoryData] = useState([]);

  async function FetchData() {
    await get('department-setup').then((response) => {
      const clinicalDep = (response?.data || [])?.filter((department) => department?.departmentType?.toLowerCase()?.trim() === 'clinical');
      setAllData(clinicalDep ?? []);
    });

    await get('category/patient-payee').then((response) => {
      setPatientPayee(response.data);
    });

    await get('category/parent-group').then((response) => {
      setPayeeCategoryData(response.data);
    });

    await get('billgroup-master').then((response) => {
      setBillGroupData(response.data);
    });
  }

  const fetchLedgerData = async () => {
    try {
      const response = await get(`ledger`);
      setLedger(response.allLedger);
    } catch (error) {
      console.error('Error fetching sub ledger:', error);
    }
  };

  const fetchSubLedgerData = async () => {
    try {
      const response = await get(`ledger/sub-ledger`);
      if (response) {
        const filteredData = response.allSubLedger.filter((item) => item.ledger === inputData.ledger);
        setSubLedger(filteredData);
      } else {
        console.error('Failed to fetch sub-ledger data');
      }
    } catch (error) {
      console.error('Error fetching sub-ledger data:', error);
    }
  };

  console.log('INPUT', inputData);

  useEffect(() => {
    if (inputData.ledger) {
      const selectedLedger = ledger.find((item) => item.ledger === inputData.ledger);
      if (selectedLedger) {
        setInputData((prevData) => ({
          ...prevData,
          ledgerId: selectedLedger._id
        }));
      }
    }
  }, [inputData.ledger, ledger]);

  useEffect(() => {
    if (inputData.ledgerId) {
      fetchSubLedgerData();
    }
  }, [inputData.ledgerId]);

  useEffect(() => {
    if (inputData.subLedger) {
      const filterSubLedgerId = subLedger.find((item) => item.subLedger === inputData.subLedger);
      if (filterSubLedgerId) {
        setInputData((prev) => ({
          ...prev,
          subLedgerId: filterSubLedgerId._id
        }));
      }
    }
  }, [inputData.subLedger, subLedger]);

  useEffect(() => {
    FetchData();
    fetchLedgerData();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setInputData((prev) => ({
      ...prev,
      patientEncounter: checked ? [...prev.patientEncounter, value] : prev.patientEncounter.filter((mode) => mode !== value)
    }));
    setError((prev) => ({ ...prev, patientEncounter: '' }));
  };

  function handleParentGroupChange(e) {
    let id = e.target.value;
    let selectedParentGroup = payeeCategoryData.find((payee) => payee._id === id);
    if (selectedParentGroup) {
      setInputData((prev) => ({
        ...prev,
        payeeCategory: selectedParentGroup.parentGroupName,
        payeeCategoryId: selectedParentGroup._id
      }));
    }
  }

  function handleServiceGroupOrBillGroup(e) {
    const id = e.target.value;
    const selectedValue = billGroupData.find((item) => item._id === id);

    if (selectedValue) {
      setInputData((prev) => ({
        ...prev,
        serviceGroupOrBillGroup: selectedValue.billGroupName,
        serviceGroupOrBillGroupId: selectedValue._id
      }));
    }
  }

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'patientPayee') {
      let dep = '';
      patientPayee.forEach((v) => {
        if (v._id === value) {
          dep = v.payeeName;
        }
      });
      setInputData((prev) => {
        return { ...prev, [name]: dep, patientPayeeId: value };
      });
    } else if (name === 'detailServiceName') {
      if (whichService === 'Service') {
        if (value === '') {
          setInputData((prev) => {
            return {
              ...prev,
              [name]: value,
              serviceCode: '',
              investigationId: ''
            };
          });
        } else {
          let sdata = [];
          serverData.forEach((sD) => {
            if (value.toLowerCase() === sD.detailServiceName.toLowerCase()) {
              sdata.push(sD);
            }
          });
          setPriceHistory(sdata);
          setInputData((prev) => {
            return {
              ...prev,
              [name]: value,
              investigationId: ''
            };
          });
        }
      } else if (whichService === 'Radiology' || whichService === 'Pathology') {
        let sName = '';
        serviceName.forEach((sN) => {
          if (sN.investigationId === value) {
            sName = sN.detailServiceName;
          }
        });
        if (value === '') {
          setInputData((prev) => {
            return {
              ...prev,
              [name]: sName,
              investigationId: value,
              serviceCode: ''
            };
          });
          setPriceHistory([]);
        } else {
          let sdata = [];
          serverData.forEach((sD) => {
            if (sName.toLowerCase() === sD.detailServiceName.toLowerCase()) {
              sdata.push(sD);
            }
          });
          setPriceHistory(sdata);
          setInputData((prev) => {
            return {
              ...prev,
              [name]: sName,
              investigationId: value,
              serviceCode:
                sName.substring(0, 2).toUpperCase() +
                '_' +
                Math.floor(Math.random() * 1000) +
                '_' +
                sName.substring(sName.length - 2).toUpperCase()
            };
          });
        }
      }
    } else {
      setInputData((prev) => {
        return { ...prev, [name]: value };
      });
    }
    setError((prev) => {
      return {
        ...prev,
        [name]: ''
      };
    });
  };

  const validation = () => {
    let fieldsToValidate = [
      // { field: 'patientPayee', message: 'Patient Payee is required' },
      // { field: 'payeeCategory', message: 'Payee category is required' },
      { field: 'patientEncounter', message: 'Parent Encounter' },
      { field: 'detailServiceName', message: 'Service name is required' },
      { field: 'ledger', message: 'Ledger is required' },
      { field: 'subLedger', message: 'Sub Ledger is required' },
      { field: 'department', message: 'Department is required' }
    ];

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

  const fetchLatestCode = async () => {
    try {
      const result = await get('service-details-master');
      const codes = result.service.map((dept) => dept.serviceCode);
      if (codes.length > 0) {
        const numericCodes = codes.map((code) => parseInt(code.match(/\d+$/), 10)).filter((num) => !isNaN(num));
        const maxCode = Math.max(...numericCodes);
        const newCode = String(maxCode + 1).padStart(6, '0');

        setInputData((prev) => ({
          ...prev,
          serviceCode: newCode
        }));
      } else {
        setInputData((prev) => ({
          ...prev,
          serviceCode: '000001'
        }));
      }
    } catch (err) {
      console.log('Error fetching code:', err);
    }
  };

  useEffect(() => {
    fetchLatestCode();
  }, []);

  const handleSubmitData = async (e) => {
    e.preventDefault();

    const isValid = validation();

    const dataSend = {
      ...inputData,
      status: 'active',
      whichService: whichService
    };

    try {
      const response = await post(`service-details-master`, dataSend);
      if (response) {
        toast.success('Service Added!!');
        handleClose();
        getData(dataSend);
      } else {
        toast.error('Something went wrong, Please try later!!');
      }
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  const handleSelectAll = () => {
    const allDepartmentIds = allData.map((r) => r._id);
    const allDepartmentNames = allData.map((r) => r.departmentName);

    if (selectAll) {
      // Deselect all departments
      handleInputChange({ target: { name: 'departmentId', value: [] } });
      handleInputChange({ target: { name: 'department', value: [] } });
    } else {
      // Select all departments
      handleInputChange({ target: { name: 'departmentId', value: allDepartmentIds } });
      handleInputChange({ target: { name: 'department', value: allDepartmentNames } });
    }

    setSelectAll(!selectAll); // Toggle selectAll state
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value.includes('select-all')) {
      handleSelectAll();
      return;
    }

    // Get selected departments
    const selectedDepartments = allData.filter((dept) => value.includes(dept._id));

    // Update state with department names and IDs
    handleInputChange({
      target: {
        name: 'departmentId',
        value: selectedDepartments.map((dept) => dept._id)
      }
    });

    handleInputChange({
      target: {
        name: 'department',
        value: selectedDepartments.map((dept) => dept.departmentName)
      }
    });

    // Update selectAll state dynamically
    setSelectAll(selectedDepartments.length === allData.length);
  };

  const handleSelectAllEncounter = (event) => {
    setInputData((prevState) => ({
      ...prevState,
      patientEncounter: event.target.checked ? patientEncounterOptions : [] // Select all or clear all
    }));
  };

  const patientEncounterOptions = ['IPD', 'OPD', 'Walk In', 'Casualty', 'Daycare'];
  return (
    <div className="modal">
      <h2 className="popupHead">Add Service</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          {/* {whichService === 'Service' && ( */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Service Name"
              variant="outlined"
              name="detailServiceName"
              value={inputData.detailServiceName}
              onChange={handleInputChange}
              error={error.detailServiceName !== '' ? true : false}
              helperText={error.detailServiceName}
            />
          </Grid>
          {/* )} */}

          {/* {(whichService === 'Radiology' || whichService === 'Pathology') && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={error.detailServiceName !== '' ? true : false}>
                <InputLabel htmlFor="detailServiceName">Service Name</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label="Service Name"
                  name="detailServiceName"
                  value={inputData.investigationId}
                  onChange={handleInputChange}
                  variant="outlined"
                >
                  {serviceName.map((r, ind) => {
                    return (
                      <MenuItem value={r.investigationId} key={ind}>
                        {r.detailServiceName}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{error.department}</FormHelperText>
              </FormControl>
            </Grid>
          )} */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Alternate Service Name"
              variant="outlined"
              name="alternateServiceName"
              value={inputData.alternateServiceName}
              onChange={handleInputChange}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={error.payeeCategory !== '' ? true : false}>
              <InputLabel htmlFor="payeeCategory">Payee Category</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 }
                  }
                }}
                label="Payee Category"
                name="payeeCategory"
                value={inputData.payeeCategoryId}
                onChange={handleParentGroupChange}
                variant="outlined"
              >
                {payeeCategoryData.map((r, ind) => {
                  return (
                    <MenuItem value={r._id} key={ind}>
                      {r.parentGroupName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.payeeCategory}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={error.patientPayee !== '' ? true : false}>
              <InputLabel htmlFor="patientPayee">Patient Payee</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 }
                  }
                }}
                label="Patient Payee"
                name="patientPayee"
                value={inputData.patientPayeeId}
                onChange={handleInputChange}
                variant="outlined"
              >
                {patientPayee.map((r, ind) => {
                  return (
                    <MenuItem value={r._id} key={ind}>
                      {r.payeeName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.patientPayee}</FormHelperText>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <strong>Patient Encounter</strong>
            <FormGroup style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              {/* Select All Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputData.patientEncounter.length === patientEncounterOptions.length}
                    indeterminate={
                      inputData.patientEncounter.length > 0 && inputData.patientEncounter.length < patientEncounterOptions.length
                    }
                    onChange={handleSelectAllEncounter}
                  />
                }
                label="Select All"
              />

              {/* Individual Checkboxes */}
              {patientEncounterOptions.map((patientEncounter) => (
                <FormControlLabel
                  key={patientEncounter}
                  control={
                    <Checkbox
                      checked={inputData.patientEncounter.includes(patientEncounter)}
                      value={patientEncounter}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={patientEncounter}
                />
              ))}
            </FormGroup>
            <FormHelperText style={{ marginLeft: 0 }}>{error.patientEncounter}</FormHelperText>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="ServiceGroup/BillGroup">Service Group/Bill Group</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 }
                  }
                }}
                label="Service Group/Bill Group"
                name="serviceGroupOrBillGroup"
                value={inputData.serviceGroupOrBillGroupId}
                onChange={handleServiceGroupOrBillGroup}
                variant="outlined"
              >
                {billGroupData.map((r, ind) => {
                  return (
                    <MenuItem value={r._id} key={ind}>
                      {r.billGroupName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Service Code"
              variant="outlined"
              name="serviceCode"
              value={inputData.serviceCode}
              onChange={handleInputChange}
              error={error.serviceCode !== '' ? true : false}
              helperText={error.serviceCode}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={error.ledger !== '' ? true : false}>
              <InputLabel>Ledger</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 } // Adjust maxHeight as needed
                  }
                }}
                name="ledger"
                label="Ledger"
                value={inputData.ledger}
                onChange={handleInputChange}
              >
                {ledger.map((index, ind) => {
                  return (
                    <MenuItem value={index.ledger} key={ind}>
                      {index.ledger}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.ledger}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={error.subLedger !== '' ? true : false}>
              <InputLabel>Sub Ledger</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 } // Adjust maxHeight as needed
                  }
                }}
                name="subLedger"
                label="Sub Ledger"
                value={inputData.subLedger}
                onChange={handleInputChange}
              >
                {subLedger.map((index, ind) => {
                  return (
                    <MenuItem value={index.subLedger} key={ind}>
                      {index.subLedger}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.ledger}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={error.department !== '' ? true : false}>
              <InputLabel htmlFor="department">Department</InputLabel>
              <Select
                label="Department"
                name="department"
                value={inputData.departmentId || []}
                onChange={handleDepartmentChange}
                multiple
                variant="outlined"
                renderValue={(selected) => {
                  if (selected.length === allData.length) {
                    return 'All Departments';
                  }
                  return selected
                    .map((id) => {
                      const department = allData.find((d) => d._id === id);
                      return department ? department.departmentName : '';
                    })
                    .join(', ');
                }}
              >
                {/* Select All Option */}
                <MenuItem value="select-all" onClick={handleSelectAll}>
                  <Checkbox checked={selectAll} />
                  Select All
                </MenuItem>

                {/* Departments List */}
                {allData.map((r) => (
                  <MenuItem key={r._id} value={r._id}>
                    <Checkbox checked={inputData.departmentId?.includes(r._id)} />
                    <ListItemText primary={r.departmentName} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.department}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton title="Save" className="btnPopup btnSave" type="submit">
                <Save />
              </IconButton>
              <IconButton title="Cancel" className="btnPopup btnCancel" onClick={handleClose}>
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddService;

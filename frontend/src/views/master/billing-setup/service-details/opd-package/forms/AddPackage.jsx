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
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Box,
  Button,
  Typography
} from '@mui/material';

import { Add, Cancel, Save } from '@mui/icons-material';
import { get, post } from 'api/api';
import { toast } from 'react-toastify';
import { use } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const AddPackage = ({ handleClose, getData, serviceName }) => {
  console.log('serviceName', handleClose, getData, serviceName);

  const [serviceData, setServiceData] = useState(serviceName || []);

  const [selectedPathologiesTest, setSelectedPathologiesTest] = useState([]);
  const [selectedPathologiesProfile, setSelectedPathologiesProfile] = useState([]);
  const [selectedRadiologies, setSelectedRadiologies] = useState([]);
  const [selectedDiagnostics, setSelectedDiagnostics] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [pathologyTestData, setPathologyTestData] = useState([]);
  const [pathologyProfileData, setPathologyProfileData] = useState([]);
  const [radiologyData, setRadiologyData] = useState([]);
  const [diagnosticData, setDiagnosticData] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [selectedTestsByConsultant, setSelectedTestsByConsultant] = useState({});
  // -------------------------------
  const [finalSelectedConsultants, setFinalSelectedConsultants] = useState([]);

  const [allData, setAllData] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [subLedger, setSubLedger] = useState([]);
  const [filteredSubLedgers, setFilteredSubLedgers] = useState([]);
  // const [patientPayee, setPatientPayee] = useState([]);
  const [billGroupData, setBillGroupData] = useState([]);
  // const [payeeCategoryData, setPayeeCategoryData] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [inputData, setInputData] = useState({
    patientType: '',
    patientEncounter: [],
    opdPackageName: '',
    visit: '',
    duration: '',
    serviceGroupOrBillGroup: '',
    serviceGroupOrBillGroupId: '',
    serviceCode: '',
    ledger: '',
    ledgerId: '',
    subLedger: '',
    subLedgerId: '',
    department: [],
    departmentId: [],
    services: [
      {
        serviceId: '',
        detailServiceName: ''
        // existingAmount: '',
        // proposedAmount: ''
      }
    ]
  });
  const [error, setError] = useState({
    patientType: '',

    patientEncounter: '',
    opdPackageName: '',
    visit: '',
    duration: '',
    serviceCode: '',
    ledger: '',
    ledgerId: '',
    subLedger: '',
    subLedgerId: '',
    department: '',
    services: [
      {
        detailServiceName: '',
        proposedAmount: ''
      }
    ]
  });

  const addService = () => {
    setInputData((prev) => {
      return {
        ...prev,
        services: [
          ...inputData.services,
          {
            serviceId: '',
            detailServiceName: ''
            // existingAmount: '',
            // proposedAmount: ''
          }
        ]
      };
    });
    setError((prev) => {
      return {
        ...prev,
        services: [
          ...error.services,
          {
            detailServiceName: '',
            proposedAmount: ''
          }
        ]
      };
    });
  };

  // //remove the one Service input field
  // const removeService = (index) => {
  //   const rows = [...inputData.services];
  //   rows.splice(index, 1);
  //   setInputData((prev) => {
  //     return { ...prev, services: rows };
  //   });
  //   const e = [...error.services];
  //   e.splice(index, 1);
  //   setError((prev) => {
  //     return { ...prev, services: e };
  //   });
  // };

  async function FetchData() {
    await get('department-setup').then((response) => {
      const clinicalDep = (response?.data || [])?.filter((department) => department?.departmentType?.toLowerCase()?.trim() === 'clinical');
      setAllData(clinicalDep ?? []);
    });

    // await get(`category/patient-payee`).then((response) => {
    //   setPatientPayee(response.data);
    // });

    await get(`billgroup-master`).then((response) => {
      setBillGroupData(response.data);
    });

    // await get('category/parent-group').then((response) => {
    //   setPayeeCategoryData(response.data);
    // });
  }
  async function FetchConsultant() {
    console.log("inputData?.departmentId", inputData?.departmentId);
    if (!Array.isArray(inputData?.departmentId)) return;

    try {
      const responses = await Promise.all(
        inputData.departmentId.map((departmentId) =>
          get(`/consultant/department/${departmentId}`)
        )
      );

      console.log("All consultant responses:", responses);

      // Filter out only the valid data responses
      const consultantData = responses
        .filter((res) => res?.data && !res?.msg)
        .map((res) => res.data);

      console.log("Filtered consultant data:", consultantData);
      // Now set this filtered data to your state
      setConsultantList(consultantData); // make sure setConsultantList is your state updater

    } catch (error) {
      console.error("Error fetching consultants:", error);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (Array.isArray(inputData?.departmentId) && inputData.departmentId.length > 0) {
        FetchConsultant();
      }
    }, 500); // Delay in ms

    return () => clearTimeout(delayDebounce); // Cleanup timeout on change
  }, [inputData?.departmentId]);

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
        setSubLedger(response.allSubLedger);
      } else {
        console.error('Failed to fetch sub-ledger data');
      }
    } catch (error) {
      console.error('Error fetching sub-ledger data:', error);
    }
  };

  const servicesData = async () => {
    try {
      const pathologyTest = await get('investigation-pathology-master');
      const pathologyProfile = await get('investigation-pathology-master/profile');
      const radiology = await get('investigation-radiology-master');
      const diagnostics = await get('other-diagnostics-master');


      console.log('pathology---------', pathologyProfile.data);
      // console.log('radiology', radiology.investigation);
      // console.log('diagnostics', diagnostics.diagnostics);
      setPathologyTestData(pathologyTest?.investigations);
      setPathologyProfileData(pathologyProfile?.data);
      setRadiologyData(radiology?.investigation);
      setDiagnosticData(diagnostics?.diagnostics);

    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Something went wrong');

    }
  };

  const handleLedgerChange = (e) => {
    const ledgerId = e.target.value;
    const selectedLedger = ledger.find((item) => item._id === ledgerId);

    setInputData((prev) => ({
      ...prev,
      ledgerId: ledgerId,
      ledger: selectedLedger.ledger
    }));
  };

  const handleSubLedgerChange = (e) => {
    const subLedgerId = e.target.value;
    const selectedSubLedger = subLedger.find((item) => item._id === subLedgerId);

    setInputData((prev) => ({
      ...prev,
      subLedgerId: subLedgerId,
      subLedger: selectedSubLedger ? selectedSubLedger.subLedger : ''
    }));
  };

  //useEffect for filtering subLedger when use selects ledger
  useEffect(() => {
    if (inputData.ledger) {
      const filteredSubLedger = subLedger.filter((item) => item.ledgerId === inputData.ledgerId);
      setFilteredSubLedgers(filteredSubLedger);
    }
  }, [inputData.ledger]);



  useEffect(() => {
    FetchData();
    fetchLedgerData();
    fetchSubLedgerData();
    servicesData()

  }, [serviceName]);

  const handleConsultantChange = (departmentId, departmentName, newValue) => {
    setSelectedTestsByConsultant((prev) => ({
      ...prev,
      [departmentName]: newValue,
    }));

    // Extract consultant names
    console.log("newValue--------", newValue)
    const consultantId = newValue.map((c) =>
      c._id

    );

    // Update or insert into finalSelectedConsultants
    setFinalSelectedConsultants((prev) => {
      const existing = prev.find((item) => item.departmentName === departmentName);
      if (existing) {
        return prev.map((item) =>
          item.departmentName === departmentName
            ? { ...item, consultants: consultantId }
            : item
        );
      } else {
        return [...prev, { departmentId, consultants: consultantId }];
      }
    });
  };
  // useEffect(() => {
  //   setInputData((prev) => {
  //     return {
  //       ...prev,
  //       totalAmount: inputData.services.reduce((accumulator, currentValue) => {
  //         return (Number(accumulator) + Number(currentValue.proposedAmount)).toFixed(2);
  //       }, 0)
  //     };
  //   });
  // }, [inputData.services]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setInputData((prev) => ({
      ...prev,
      patientEncounter: checked ? [...prev.patientEncounter, value] : prev.patientEncounter.filter((mode) => mode !== value)
    }));
    setError((prev) => ({ ...prev, patientEncounter: '' }));
  };

  const handleInputChange = (index, e) => {
    let { name, value } = e.target;
    if (name === 'detailServiceName') {
      if (value === '') {
        const list = [...inputData.services];
        list[index].serviceId = '';
        // list[index].proposedAmount = '';
        list[index].detailServiceName = '';
        // list[index].existingAmount = '';
        setInputData((prev) => {
          return { ...prev, services: list };
        });
      } else {
        const list = [...inputData.services];
        list[index].serviceId = value;
        // list[index].proposedAmount = '';
        serviceName.forEach((aN) => {
          if (aN.serviceId === value) {
            list[index].detailServiceName = aN.detailServiceName;
            // list[index].existingAmount = aN.existingAmount;
          }
        });
        setInputData((prev) => {
          return { ...prev, services: list };
        });
        const e = [...error.services];
        e[index][name] = '';
        setError((prev) => {
          return { ...prev, services: e };
        });
      }
    } else if (name === 'proposedAmount') {
      const list = [...inputData.services];
      list[index][name] = value;
      setInputData((prev) => {
        return { ...prev, services: list };
      });
      const e = [...error.services];
      e[index][name] = '';
      setError((prev) => {
        return { ...prev, services: e };
      });
    } else if (name === 'opdPackageName') {
      if (value === '') {
        setInputData((prev) => {
          return {
            ...prev,
            [name]: value,
            serviceCode: ''
          };
        });
      } else {
        setInputData((prev) => {
          return {
            ...prev,
            [name]: value
          };
        });
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

  const fetchLatestCode = async () => {
    try {
      const result = await get('opd-package');
      const codes = result.package.map((dept) => dept.serviceCode);

      if (codes.length > 0) {
        const numericCodes = codes
          .map((code) => parseInt(code.match(/\d+$/)?.[0], 10)) // Use optional chaining
          .filter((num) => !isNaN(num));

        if (numericCodes.length > 0) {
          const maxCode = Math.max(...numericCodes); // Get the largest numeric code
          const newCode = String(maxCode + 1).padStart(6, '0'); // Increment and pad

          setInputData((prev) => ({
            ...prev,
            serviceCode: newCode
          }));
        } else {
          setInputData((prev) => ({
            ...prev,
            serviceCode: '000001' // Default code when no valid numeric codes exist
          }));
        }
      } else {
        setInputData((prev) => ({
          ...prev,
          serviceCode: '000001' // Default code when no service codes exist
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
    if (inputData.patientType === '' || inputData.patientType === null) {
      setError((prev) => {
        return { ...prev, patientType: 'Patient Type is required' };
      });
    }

    if (inputData.patientEncounter === '' || inputData.patientEncounter === null) {
      setError((prev) => {
        return { ...prev, patientEncounter: 'Patient Encounter is required' };
      });
    }
    if (inputData.opdPackageName === '') {
      setError((prev) => {
        return { ...prev, opdPackageName: 'OPD Package Name is required' };
      });
    }

    if (inputData.visit === '') {
      setError((prev) => {
        return { ...prev, visit: 'Total Visit is required' };
      });
    }
    if (inputData.duration === '') {
      setError((prev) => {
        return { ...prev, duration: 'Total Days is required' };
      });
    }

    if (inputData.department === '') {
      setError((prev) => {
        return { ...prev, department: 'Department is required' };
      });
    }

    // inputData.services.forEach((val, ind) => {
    //   if (val.serviceId === '') {
    //     const e = [...error.services];
    //     e[ind].detailServiceName = 'Service Name is required...';
    //     setError((prev) => {
    //       return { ...prev, services: e };
    //     });
    //   }
    //   // if (val.proposedAmount === '') {
    //   //   const e = [...error.services];
    //   //   e[ind].proposedAmount = 'Proposed Amount is required...';
    //   //   setError((prev) => {
    //   //     return { ...prev, services: e };
    //   //   });
    //   // }
    // });
    console.log(" in handle submit data -1",)
    let result = true;
    for (let i = 0; i < inputData.services.length; i++) {
      let data = inputData.services[i];
      let t = data.serviceId;

      if (!t) {
        result = false;
        break; // Exit the loop early since we've already found a falsy value
      }
    }

    // console.log(" in handle submit data -2",  inputData.serviceCode,"result:-",result, "inputData.patientType:-",inputData.patientType, "inputData.patientEncounter:-",inputData.patientEncounter, "inputData.opdPackageName:-",inputData.opdPackageName," inputData.visit:-", inputData.visit, "inputData.duration:-",inputData.duration, "inputData.serviceCode:-",inputData.serviceCode, "inputData.department:-",inputData.department)   





    if (
      // result &&
      // inputData.patientType !== '' &&
      // inputData.patientEncounter !== null &&
      // inputData.opdPackageName !== '' &&
      // inputData.visit !== '' &&
      // inputData.duration !== '' &&
      // inputData.serviceCode !== '' &&
      // inputData.department !== ''
      true
    ) {
      const dataSend = {
        ...inputData,
        services: selectedServices.map(item => ({
          serviceId: item.serviceId,
          detailServiceName: item.detailServiceName
        })),
        diagnostics: selectedDiagnostics.map(item => ({
          serviceId: item._id,
          detailServiceName: item.testName
        })),
        radiologies: selectedRadiologies.map(item => ({
          serviceId: item._id,
          detailServiceName: item.testName
        })),
        pathologyTest: selectedPathologiesTest.map(item => ({
          serviceId: item._id,
          detailServiceName: item.testName
        })),
        pathologyProfile: selectedPathologiesProfile.map(item => ({
          serviceId: item._id,
          detailServiceName: item.profileName
        })),

        DepartmentConsultants: finalSelectedConsultants,


        status: 'active'
      };
      console.log(" in handle submit data -3", dataSend)
      try {

        console.log(" in handle submit data", dataSend)
        const response = await post(`opd-package`, dataSend);

        if (response) {
          toast.success('OPD Package Added!!');
          handleClose();
          getData(dataSend);
        } else {
          toast.error('Something went wrong, Please try later!!');
        }
      } catch (error) {
        toast.error('Something went wrong, Please try later!!');
      }
    }
  };

  // function handleParentGroupChange(e) {
  //   let id = e.target.value;

  //   let selectedParentGroup = payeeCategoryData.find((payee) => payee._id === id);
  //   console.log(selectedParentGroup)
  //   if (selectedParentGroup) {
  //     setInputData((prev) => ({
  //       ...prev,
  //       payeeCategory: selectedParentGroup.parentGroupName,
  //       payeeCategoryId: selectedParentGroup._id
  //     }));
  //   }
  // }

  function handleServiceGroupOrBillGroup(e) {
    const id = e.target.value; //this id is objectId of billGroup master
    const selectedValue = billGroupData.find((item) => item._id === id);

    if (selectedValue) {
      setInputData((prev) => ({
        ...prev,
        serviceGroupOrBillGroup: selectedValue.billGroupName,
        serviceGroupOrBillGroupId: selectedValue._id
      }));
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all departments
      setInputData((prev) => ({
        ...prev,
        department: [],
        departmentId: []
      }));
    } else {
      // Select all departments
      setInputData((prev) => ({
        ...prev,
        department: allData.map((r) => r.departmentName),
        departmentId: allData.map((r) => r._id)
      }));
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
    setInputData((prev) => ({
      ...prev,
      department: selectedDepartments.map((dept) => dept.departmentName),
      departmentId: selectedDepartments.map((dept) => dept._id)
    }));


    // Update selectAll state dynamically
    setSelectAll(selectedDepartments.length === allData.length);

  };
  useEffect(() => {
    FetchConsultant()
  }, [inputData.departmentId])



  const handleSelectAllEncounter = (event) => {
    setInputData((prevState) => ({
      ...prevState,
      patientEncounter: event.target.checked ? patientEncounterOptions : [] // Select all or clear all
    }));
  };

  // async function handleChangeServices(url) {
  //   addService()
  //   console.log("url",url)

  //   try {
  //     const [radioLogyData, pathologyTestData, otherDiagnostics] = await Promise.allSettled([
  //       get(url),
  //       // get('investigation-pathology-master'),
  //       // get('other-diagnostics-master'),
  //     ]);

  //     console.log("radioLogyData", radioLogyData);
  //     console.log("pathologyTestData", pathologyTestData);
  //     console.log("otherDiagnostics", otherDiagnostics);
  //   } catch (err) {
  //     toast.error('Something went wrong');
  //   }
  // }
  const renderMultiSelect = (label, options, selected, setSelected) => {
    const isService = label.toLowerCase() === 'services';
    const isConsultant = label.toLowerCase().includes('consultant');

    return (
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options || []}
        getOptionLabel={(option) => {
          if (isService) return option.detailServiceName || option.profileName || '';
          if (isConsultant) {
            const { lastName = '', middleName = '', firstName = '' } = option.basicDetails || {};
            return `${firstName} ${middleName} ${lastName}`.trim();
          }
          return option.testName || '';
        }}
        value={selected}
        onChange={(event, newValue) => setSelected(newValue)}
        isOptionEqualToValue={(option, value) =>
          isService
            ? option.serviceId === value.serviceId
            : option._id === value._id
        }
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {isConsultant
              ? `${option.basicDetails?.firstName || ''} ${option.basicDetails?.middleName || ''} ${option.basicDetails?.lastName || ''}`.trim()
              : isService
                ? option.detailServiceName
                : option.testName || option.profileName}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const label = isConsultant
              ? `${option.basicDetails?.firstName || ''} ${option.basicDetails?.middleName || ''} ${option.basicDetails?.lastName || ''}`.trim()
              : isService
                ? option.detailServiceName || option.profileName
                : option.testName || option.profileName;
            return (
              <Box
                key={option._id || option.serviceId || index}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 6px',
                  margin: '2px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '16px',
                }}
              >
                {label}
                <CloseIcon
                  onClick={() => {
                    const updated = selected.filter(
                      (item) =>
                        (isService ? item.serviceId : item._id) !==
                        (isService ? option.serviceId : option._id)
                    );
                    setSelected(updated);
                  }}
                  fontSize="small"
                  sx={{ marginLeft: '6px', cursor: 'pointer' }}
                />
              </Box>
            );
          })
        }
        renderInput={(params) => (
          <TextField {...params} label={label} placeholder={`Select ${label}`} />
        )}
      />
    );
  };

  const patientEncounterOptions = ['IPD', 'OPD', 'Walk In', 'Casualty', 'Daycare'];


  console.log("finalSelectedConsultants----", finalSelectedConsultants)
  console.log("inputData--------------", inputData)
  return (
    <div className="modal" style={{ height: '90vh' }}>
      <h2 className="popupHead">Add OPD Package</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="OPD Package Name"
              variant="outlined"
              name="opdPackageName"
              value={inputData.opdPackageName}
              onChange={(evnt) => handleInputChange(1, evnt)}
              error={error.opdPackageName !== '' ? true : false}
              helperText={error.opdPackageName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Visit"
              variant="outlined"
              name="visit"
              value={inputData.visit}
              onChange={(evnt) => handleInputChange(1, evnt)}
              error={error.visit !== '' ? true : false}
              helperText={error.visit}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={error.duration !== ''}>
              <InputLabel>Total Days</InputLabel>
              <Select label="Total Days" name="duration" value={inputData.duration} onChange={(evnt) => handleInputChange(1, evnt)}>
                {Array.from({ length: 30 }, (_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {index + 1} {index === 0 ? 'day' : 'days'}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.duration}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                // disablePortal
                options={['Regular', 'Emergency']}
                name="patientType"
                value={inputData.patientType}
                onChange={(event, newValue) => {
                  handleInputChange(1, {
                    target: { name: 'patientType', value: newValue }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Patient Type"
                    variant="outlined"
                    error={error.patientType !== '' ? true : false}
                    helperText={error.patientType}
                  />
                )}
              />
            </FormControl>
          </Grid>

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
                    style: { maxHeight: 300 } // Adjust maxHeight as needed
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
              {/* <FormHelperText>{error.parentGroup}</FormHelperText> */}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Service Code"
              variant="outlined"
              name="serviceCode"
              value={inputData.serviceCode}
              onChange={(evnt) => handleInputChange(1, evnt)}
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
                value={inputData.ledgerId}
                onChange={handleLedgerChange}
              >
                {ledger.map((item, ind) => {
                  return (
                    <MenuItem value={item._id} key={item._id}>
                      {item.ledger}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.ledger}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={error.subLedger !== '' ? true : false}>
              <InputLabel>SubLedger</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 } // Adjust maxHeight as needed
                  }
                }}
                name="subLedger"
                label=" Sub Ledger"
                value={inputData.subLedgerId}
                onChange={handleSubLedgerChange}
                disabled={inputData.ledger === ''}
              >
                {filteredSubLedgers.map((item, ind) => {
                  return (
                    <MenuItem value={item._id} key={item._id}>
                      {item.subLedger}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.subLedger}</FormHelperText>
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
            <Divider style={{ margin: '1px 0 10px 0' }} />
            <Box mt={2}>
              <Box mt={2}>
                {
                  renderMultiSelect('Services', serviceData, selectedServices, setSelectedServices)}
              </Box>

              <Box mt={2}>
                {renderMultiSelect(
                  'Pathology Test',
                  pathologyTestData, // Use pathologyTestData for Pathology Test
                  selectedPathologiesTest,
                  setSelectedPathologiesTest
                )}
              </Box>
              <Box mt={2}>
                {renderMultiSelect(
                  'Pathology Profile',
                  pathologyProfileData, // Use pathologyProfileData for Pathology Profile
                  selectedPathologiesProfile,
                  setSelectedPathologiesProfile
                )}
              </Box>

              <Box mt={2}>
                {renderMultiSelect('Radiology', radiologyData, selectedRadiologies, setSelectedRadiologies)}
              </Box>

              <Box mt={2}>
                {renderMultiSelect('Other Diagnostics', diagnosticData, selectedDiagnostics, setSelectedDiagnostics)}
              </Box>
            </Box>

            {consultantList.map((consultantGroup, index) => {
              // Skip if consultantGroup is empty or not an array
              if (!Array.isArray(consultantGroup) || consultantGroup.length === 0) return null;

              const departmentName =
                consultantGroup[0]?.employmentDetails?.departmentOrSpeciality?.departmentName || `Consultant-${index}`;
              const departmentId =
                consultantGroup[0]?.employmentDetails?.departmentOrSpeciality?._id || "";

              return (
                <Box key={departmentName} mb={2} mt={2}>
                  <Typography variant="h6" mb={2}>
                    {departmentName}
                  </Typography>

                  {renderMultiSelect(
                    'Consultant Name',
                    consultantGroup || [],
                    selectedTestsByConsultant[departmentName] || [],
                    (newValue) => handleConsultantChange(departmentId, departmentName, newValue)
                  )}
                </Box>
              );
            })}


            <Grid item xs={12}>
              <IconButton onClick={addService} title="Add">
                <Add className="btnSave" />
              </IconButton>
            </Grid>
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

export default AddPackage;

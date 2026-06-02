import { Box, Button, Chip, Grid, IconButton, Input, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { Add, Close, Delete, Description, Edit, Search, Upload } from '@mui/icons-material';
import { useState } from 'react';
import { retrieveToken } from 'api/api';
import REACT_APP_BASE_URL from 'api/api';
import axios from 'axios';
import { useEffect } from 'react';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import Loader from 'component/Loader/Loader';
import { useSelector } from 'react-redux';
import { Stack } from 'react-bootstrap';

const ProvisionalDiagnosis = ({ selectedMenu, editData }) => {
  const departmentId = editData.departmentId._id;
  const token = retrieveToken();

  const [mostUsedProvisionalDiagnosis, setMostUsedProvisionalDiagnosis] = useState([]);
  const [allProvisionalDiagnosis, setAllProvisionalDiagnosis] = useState([]);
  const [showProvisionalDiagnosis, setShowProvisionalDiagnosis] = useState([]);
  const [error, setError] = useState('');
  const [patientProvisionalDiagnosis, setPatientProvisionalDiagnosis] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);
  const [openImportProvisional, setOpenImportProvisional] = useState(false);
  const [openAddProvisionalDiagnosisDetail, setOpenAddProvisionalDiagnosisDetail] = useState(false);

  const [diagnosis, setDiagnosis] = useState({ diagnosis: '', code: '' });
  const [alreadyExistId, setAlreadyExistId] = useState('');
  const [uploadErr, setUploadErr] = React.useState({
    file: '',
    department: ''
  });
  const [inputVal, setInputVal] = React.useState('');
  const [uploadDepartment, setUploadDepartment] = useState('');
  const [department, setDepartment] = React.useState([]);
  const patient = useSelector((state) => state.patient.selectedPatient);

  const getPatientProvisionalData = async () => {
    if (patient) {
      await axios
        .get(`${REACT_APP_BASE_URL}patient-provisional-diagnosis/${patient?.patientId?._id}`, {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then((response) => {
          let res = [];
          response.data.data.forEach((v) => {
            if (v.departmentId === departmentId) {
              res.push(v);
            }
          });
          if (res.length > 0) {
            setPatientProvisionalDiagnosis(res[res.length - 1].diagnosis);
            setAlreadyExistId(res[res.length - 1]._id);
          }
        })
        .catch((error) => {});
    }
  };

  const getProvisionalDiagnosis = async () => {
    setLoader(true);
    await getPatientProvisionalData();

    await axios
      .get(`${REACT_APP_BASE_URL}opd/provisional-diagnosis`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        // let res = [];
        // response.data.data.forEach((v) => {
        // if (
        //   v.departmentId.toString() ===
        //   JSON.parse(
        //     localStorage.getItem("patientConsult")
        //   ).departmentId.toString()
        // ) {
        // res.push(v);
        // }
        // });
        setAllProvisionalDiagnosis(response.data.data);
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/provisional-diagnosis/most-used`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        // let res = [];
        // response.data.data.forEach((v) => {
        // if (
        //   v.departmentId.toString() ===
        //   JSON.parse(
        //     localStorage.getItem("patientConsult")
        //   ).departmentId.toString()
        // ) {
        // res.push(v);
        // }
        // });
        setMostUsedProvisionalDiagnosis(response?.data?.data?.slice(0,10));
        setShowProvisionalDiagnosis(response?.data?.data?.slice(0,10));
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getProvisionalDiagnosis();

    axios
      .get(`${REACT_APP_BASE_URL}department-setup`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then((response) => {
        setDepartment(response.data.data);
      });
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedProvisionalDiagnosis.slice();

      patientProvisionalDiagnosis.forEach((vv) => {
        if (!medP.some((v) => v.diagnosis === vv.diagnosis)) {
          medP.unshift(vv);
        }
      });
      setShowProvisionalDiagnosis(medP);
    } else {
      let serchM = [];
      allProvisionalDiagnosis.forEach((v) => {
        if (
          v.diagnosis.toLowerCase().includes(e.target.value.toLowerCase()) ||
          v.code.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          serchM.push(v);
        }
      });
      setShowProvisionalDiagnosis(serchM);
    }
  };

  const addProvisionalDiagnosisHandler = () => {
    setDiagnosis({ diagnosis: '', code: '' });
    setOpenAddProvisionalDiagnosisDetail(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
    setOpenImportProvisional(false);
  };

  const editProvisionalDiagnosisHandler = () => {
    setOpenEditHandler(true);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
    setDiagnosis({ diagnosis: '', code: '' });
    setOpenAddProvisionalDiagnosisDetail(false);
    setOpenImportProvisional(false);
  };

  const deleteProvisionalDiagnosisHandler = () => {
    setOpenDeleteHandler(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setDiagnosis({ diagnosis: '', code: '' });
    setOpenAddProvisionalDiagnosisDetail(false);
    setOpenImportProvisional(false);
  };

  const handleChangeProvisionalDiagnosis = (e) => {
    let { name, value } = e.target;
    setDiagnosis((prev) => {
      return { ...prev, [name]: value };
    });
    setError('');
  };

  const handleSaveAddProvisionalDiagnosis = async () => {
  
    if (diagnosis.diagnosis.length === 0) {
      setError('Please enter diagnosis');
    } else {
      //call api to submit data in ProvisionalDiagnosis table and update list
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/provisional-diagnosis`,
          {
            ...diagnosis,
            departmentId,
            consultantId : patient.consultantId,
            opdPatientId : patient._id,
            patientId : patient.patientId, 
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getProvisionalDiagnosis();
          let sM = [response.data.data, ...showProvisionalDiagnosis];
          sM = [...new Map(sM.map((item) => [item['diagnosis'], item])).values()];
          setShowProvisionalDiagnosis(sM);
          setOpenAddProvisionalDiagnosisDetail(false);

          toast.success(`Provisional Diagnosis Created Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSaveUpdateProvisionalDiagnosis = async () => {
    if (diagnosis.diagnosis.length === 0) {
      setError('Please enter diagnosis');
    } else {
      //call api to submit data in ProvisionalDiagnosis table and update list
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/provisional-diagnosis/${diagnosis._id}`,
          {
            ...diagnosis,
            departmentId,
            consultantId : patient.consultantId,
            opdPatientId : patient._id,
            patientId : patient.patientId, 
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getProvisionalDiagnosis();

          setOpenEditDataDetail(false);

          toast({
            title: `Updated Successfully!!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
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
    }
  };

  const handleSaveProvisionalDiagnosis = (val) => {
    console.log('PROVISION', val);
    let sM = [...patientProvisionalDiagnosis, { _id: val._id, diagnosis: val.diagnosis, code: val.code }];
    sM = [...new Map(sM.map((item) => [item['diagnosis'] + item['_id'], item])).values()];

    if (patientProvisionalDiagnosis.length === 0) {
      handleSubmitProvisionalDiagnosis(sM);
    } else {
      handleSubmitEditProvisionalDiagnosis(sM);
    }
  };

  const handleSubmitProvisionalDiagnosis = (sM) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-provisional-diagnosis`,
        {
          patientId: patient?.patientId?._id,
          opdPatientId : patient?._id,
          consultantId : patient?.consultantId,
          departmentId,
          diagnosis: sM
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientProvisionalData();
        setDiagnosis({ diagnosis: '', code: '' });
        toast.success(`Provisional Diagnosis Successfully Submitted!!`);
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

  const handleSubmitEditProvisionalDiagnosis = (sM) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-provisional-diagnosis/${alreadyExistId}`,
        {
          // patientId: JSON.parse(localStorage.getItem("patientConsult"))._id,
          departmentId,
          diagnosis: sM
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientProvisionalData();
        setDiagnosis({ diagnosis: '', code: '' });
        toast(`Provisional Diagnosis Successfully Updated!!`);
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  const handleSaveDeleteProvisionalDiagnosis = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/provisional-diagnosis`, {
        headers,
        data
      })
      .then((response) => {
        getProvisionalDiagnosis();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast({
          title: 'Diagnosis Deleted Successfully!!',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
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

  const fileValidationHandler = (fileData) => {
    const newData = [];
    fileData.forEach((val) => {
      let d = {};
      if (val['Diagnosis'] !== '') {
        d = {
          diagnosis: val['Diagnosis'],
          code: val['Code']
        };

        newData.push(d);
      }
    });
    return newData;
  };

  const importProvisionalHandler = () => {
    setOpenImportProvisional(true);
    setOpenDeleteHandler(false);
    setOpenEditDataDetail(false);
    setOpenAddProvisionalDiagnosisDetail(false);
    setOpenEditHandler(false);
  };

  const uploadHandler = async (e) => {
    if (e.target.files[0] === undefined) {
      setUploadErr((prev) => {
        return { ...prev, file: '' };
      });
    } else {
      setUploadErr((prev) => {
        return { ...prev, file: '' };
      });
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          const fileData = await fileValidationHandler(results.data);
          if (fileData.length === 0) {
            setUploadErr((prev) => {
              return { ...prev, file: 'Invalid Data' };
            });
          } else {
            let er = false;
            fileData.forEach((val) => {
              Object.keys(val).forEach((v) => {
                if (v === undefined) {
                  setUploadErr((prev) => {
                    return { ...prev, file: 'Invalid Data' };
                  });
                  er = true;
                }
              });
            });

            if (!er) {
              setUploadErr((prev) => {
                return { ...prev, file: '' };
              });
            }
          }
          setInputVal(fileData);
        }
      });
    }
  };

  const handleImportDiagnosis = async () => {
    if (uploadDepartment === '') {
      setUploadErr((prev) => {
        return { ...prev, department: 'Department is required...' };
      });
    }
    if (inputVal.length === 0 && uploadErr.file === '') {
      setUploadErr((prev) => {
        return { ...prev, file: 'Select the file...' };
      });
    }
    if (inputVal.length > 0) {
      let aa = [];
      inputVal.forEach((v) => {
        aa.push({
          ...v,
          departmentId
        });
      });

      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/provisional-diagnosis/import`,
          {
            diagnosis: aa
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getProvisionalDiagnosis();
          setUploadDepartment('');
          setOpenImportProvisional(false);

          toast({
            title: `Diagnosis Uploaded Successfully!!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
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
    }
  };

  return (
    <Box className="paticularSection">
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={4} height="inherit" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid
            sx={{
              px: 2,
              height: 'inherit',
              '& .MuiButton-root': {
                textTransform: 'none',
                borderRadius: '8px'
              },
              '& .MuiChip-root': {
                m: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
              }
            }}
            item
            xs={5}
            height="inherit"
          >
            {selectedMenu !== 'All' && (
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                Provisional Diagnosis
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: 3,
                alignItems: 'center'
              }}
            >
              <Input
                sx={{
                  flex: 1,
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiInputBase-input': {
                    padding: '8px 0'
                  }
                }}
                className="search_patient_data"
                type="search"
                placeholder="Search diagnosis..."
                endAdornment={
                  <InputAdornment position="end">
                    <Search color="action" />
                  </InputAdornment>
                }
                onChange={handleSearch}
                value={searchValue}
              />

              <Button variant="contained" startIcon={<Add />} onClick={addProvisionalDiagnosisHandler} sx={{ minWidth: '100px' }}>
                Add
              </Button>

              {allProvisionalDiagnosis.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    title="Edit Diagnosis"
                    onClick={editProvisionalDiagnosisHandler}
                    sx={{
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                  >
                    <Edit fontSize="small" color="primary" />
                  </IconButton>

                  <IconButton
                    title="Delete Diagnosis"
                    onClick={deleteProvisionalDiagnosisHandler}
                    sx={{
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>

                  <IconButton
                    title="Sample Diagnosis"
                    onClick={() => {
                      const csvRows = [];
                      csvRows.push(['Diagnosis', 'Code'].join(','));
                      const csvContent = csvRows.join('\n');
                      const blob = new Blob([csvContent], {
                        type: 'text/csv;charset=utf-8;'
                      });
                      const link = document.createElement('a');
                      if (link.download !== undefined) {
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `Sample Diagnosis.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    sx={{
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                  >
                    <Description fontSize="small" color="primary" />
                  </IconButton>

                  <IconButton
                    title="Import Diagnosis"
                    onClick={importProvisionalHandler}
                    sx={{
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                  >
                    <Upload fontSize="small" color="primary" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {allProvisionalDiagnosis.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  border: '1px dashed grey.300'
                }}
              >
                <Typography color="text.secondary">Provisional Diagnosis Not Available, Please Add...</Typography>
              </Paper>
            ) : (
              <>
                {showProvisionalDiagnosis.length > 0 ? (
                  <Box
                    sx={{
                      width: '900px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1
                    }}
                  >
                    {showProvisionalDiagnosis.map((val, ind) => {
                      let pre = false;
                      patientProvisionalDiagnosis.forEach((v) => {
                        if (v.diagnosis === val.diagnosis && v._id === val._id) {
                          pre = true;
                        }
                      });

                      return (
                        <Chip
                          key={ind}
                          color="primary"
                          className={pre ? 'selectProblemActive' : 'selectProblem'}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>{val.diagnosis}</span>
                              {val.code !== '' && (
                                <Typography
                                  component="span"
                                  sx={{
                                    opacity: 0.8,
                                    fontSize: '0.85em'
                                  }}
                                >
                                  ({val.code})
                                </Typography>
                              )}
                            </Box>
                          }
                          onClick={() => {
                            setOpenAddProvisionalDiagnosisDetail(false);
                            handleSaveProvisionalDiagnosis(val);
                          }}
                          sx={{
                            '& .MuiChip-label': {
                              px: 1.5,
                              py: 0.75
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'grey.50'
                    }}
                  >
                    <Typography color="text.secondary">No matching diagnosis found</Typography>
                  </Paper>
                )}
              </>
            )}
          </Grid>

          {/* Right side panels - Add/Edit/Delete/Import */}
          <Grid item xs={4} lg={3} sx={{ height: selectedMenu !== 'All' && '100%' }}>
            {(openAddProvisionalDiagnosisDetail || openImportProvisional || openEditHandler || openEditDataDetail || openDeleteHandler) && (
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  boxShadow: 2,
                  borderRadius: 2
                }}
              >
                {openAddProvisionalDiagnosisDetail && (
                  <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Add Diagnosis
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="diagnosis"
                        label="Diagnosis"
                        value={diagnosis.diagnosis}
                        onChange={handleChangeProvisionalDiagnosis}
                        error={error !== ''}
                        helperText={error}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        name="code"
                        label="ICD-10 Code"
                        value={diagnosis.code}
                        onChange={handleChangeProvisionalDiagnosis}
                      />

                      <Button variant="contained" onClick={handleSaveAddProvisionalDiagnosis} sx={{ mt: 2 }}>
                        Save
                      </Button>
                    </Stack>
                  </>
                )}

                {openImportProvisional && (
                  <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Import Diagnosis
                    </Typography>
                    <Stack spacing={2}>
                      <Typography color="error" variant="caption">
                        *Only Accept csv file
                      </Typography>

                      <TextField
                        type="file"
                        inputProps={{ accept: '.csv' }}
                        fullWidth
                        onChange={uploadHandler}
                        variant="outlined"
                        error={uploadErr.file !== ''}
                        helperText={uploadErr.file}
                        name="csvfile"
                      />

                      <Button variant="contained" onClick={handleImportDiagnosis}>
                        Save
                      </Button>
                    </Stack>
                  </>
                )}

                {openEditHandler && (
                  <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Edit Diagnosis
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1
                      }}
                    >
                      {allProvisionalDiagnosis.map((val, ind) => (
                        <Chip
                          key={ind}
                          color="primary"
                          label={val.diagnosis}
                          onClick={() => {
                            setOpenEditHandler(false);
                            setOpenEditDataDetail(true);
                            setOpenAddProvisionalDiagnosisDetail(false);
                            setDiagnosis(val);
                            setOpenDeleteHandler(false);
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}

                {openEditDataDetail && (
                  <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Update Provisional Diagnosis
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="diagnosis"
                        label="Diagnosis"
                        value={diagnosis.diagnosis}
                        onChange={handleChangeProvisionalDiagnosis}
                        error={error !== ''}
                        helperText={error}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        name="code"
                        label="ICD-10 Code"
                        value={diagnosis.code}
                        onChange={handleChangeProvisionalDiagnosis}
                      />

                      <Button variant="contained" onClick={handleSaveUpdateProvisionalDiagnosis}>
                        Save Changes
                      </Button>
                    </Stack>
                  </>
                )}

                {openDeleteHandler && (
                  <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Delete Diagnosis
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        mb: 2
                      }}
                    >
                      {allProvisionalDiagnosis.map((val, ind) => {
                        let exist = deleteIds.includes(val._id);
                        return (
                          <Chip
                            key={ind}
                            color={exist ? 'error' : 'primary'}
                            label={val.diagnosis}
                            onClick={() => {
                              if (val._id) {
                                const newIds = exist ? deleteIds.filter((id) => id !== val._id) : [...deleteIds, val._id];
                                setDeletedIds(newIds);
                              }
                            }}
                            onDelete={
                              exist
                                ? () => {
                                    setDeletedIds(deleteIds.filter((id) => id !== val._id));
                                  }
                                : undefined
                            }
                            deleteIcon={exist ? <Close /> : undefined}
                          />
                        );
                      })}
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleSaveDeleteProvisionalDiagnosis}
                      disabled={deleteIds.length === 0}
                    >
                      Delete Selected
                    </Button>
                  </>
                )}
              </Paper>
            )}
            <Box mt={3}>
              {patientProvisionalDiagnosis.length > 0 && (
                <Box
                  item
                  sx={{
                    height: selectedMenu !== 'All' ? '100%' : 'auto',
                    '& .MuiChip-root': {
                      borderRadius: '16px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }
                    },
                    '& .MuiChip-label': {
                      padding: '8px 12px',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    },
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'rgba(255, 255, 255, 1)'
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      minHeight: '100px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignContent: 'flex-start'
                    }}
                  >
                    {patientProvisionalDiagnosis.map((val, ind) => (
                      <Chip
                        key={ind}
                        color="primary"
                        className="selectProblemActive"
                        label={
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {val.diagnosis}
                            {val.code !== '' && <span style={{ marginLeft: '4px', opacity: 0.8 }}>({val.code})</span>}
                          </span>
                        }
                        onDelete={() => {
                          setOpenAddProvisionalDiagnosisDetail(false);
                          let medPro = [];
                          patientProvisionalDiagnosis.forEach((vM) => {
                            if (vM.diagnosis !== val.diagnosis) {
                              medPro.push(vM);
                            }
                          });
                          handleSubmitEditProvisionalDiagnosis(medPro);
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
     
    </Box>
  );
};

export default ProvisionalDiagnosis;

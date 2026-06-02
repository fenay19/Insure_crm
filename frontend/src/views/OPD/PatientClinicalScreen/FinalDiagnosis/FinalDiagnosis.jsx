import { Box, Button, Chip, Grid, IconButton, Input, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import { useState } from 'react';
import REACT_APP_BASE_URL from 'api/api';
import axios from 'axios';
import { useEffect } from 'react';
import Loader from 'component/Loader/Loader';
import { retrieveToken } from 'api/api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Stack } from 'react-bootstrap';

const FinalDiagnosis = ({ selectedMenu, editData }) => {
  const departmentId = editData.departmentId._id;

  const token = retrieveToken();

  const [mostUsedFinalDiagnosis, setMostUsedFinalDiagnosis] = useState([]);
  const [allFinalDiagnosis, setAllFinalDiagnosis] = useState([]);
  const [showFinalDiagnosis, setShowFinalDiagnosis] = useState([]);
  const [error, setError] = useState('');
  const [patientFinalDiagnosis, setPatientFinalDiagnosis] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);

  const [openAddFinalDiagnosisDetail, setOpenAddFinalDiagnosisDetail] = useState(false);

  const [diagnosis, setDiagnosis] = useState({ diagnosis: '', code: '' });
  const [alreadyExistId, setAlreadyExistId] = useState('');
  const patient = useSelector((state) => state.patient.selectedPatient);

  const getPatientFinalData = async () => {
    if (patient) {
      await axios
        .get(`${REACT_APP_BASE_URL}patient-final-diagnosis/${patient?.patientId?._id}`, {
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
            setPatientFinalDiagnosis(res[res.length - 1].diagnosis);
            setAlreadyExistId(res[res.length - 1]._id);
          }
        })
        .catch((error) => {});
    }
  };

  const getFinalDiagnosis = async () => {
    setLoader(true);
    await getPatientFinalData();

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
        setAllFinalDiagnosis(response.data.data);
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
        setMostUsedFinalDiagnosis(response?.data?.data?.slice(0,10));
        setShowFinalDiagnosis(response?.data?.data?.slice(0,10));
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getFinalDiagnosis();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedFinalDiagnosis.slice();

      patientFinalDiagnosis.forEach((vv) => {
        if (!medP.some((v) => v.diagnosis === vv.diagnosis)) {
          medP.unshift(vv);
        }
      });
      setShowFinalDiagnosis(medP);
    } else {
      let serchM = [];
      allFinalDiagnosis.forEach((v) => {
        if (
          v.diagnosis.toLowerCase().includes(e.target.value.toLowerCase()) ||
          v.code.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          serchM.push(v);
        }
      });
      setShowFinalDiagnosis(serchM);
    }
  };

  const addFinalDiagnosisHandler = () => {
    setDiagnosis({ diagnosis: '', code: '' });
    setOpenAddFinalDiagnosisDetail(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
  };

  const editFinalDiagnosisHandler = () => {
    setOpenEditHandler(true);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
    setDiagnosis({ diagnosis: '', code: '' });
    setOpenAddFinalDiagnosisDetail(false);
  };

  const deleteFinalDiagnosisHandler = () => {
    setOpenDeleteHandler(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setDiagnosis({ diagnosis: '', code: '' });
    setOpenAddFinalDiagnosisDetail(false);
  };

  const handleChangeFinalDiagnosis = (e) => {
    let { name, value } = e.target;
    setDiagnosis((prev) => {
      return { ...prev, [name]: value };
    });
    setError('');
  };

  const handleSaveAddFinalDiagnosis = async () => {
    if (diagnosis.diagnosis.length === 0) {
      setError('Please enter diagnosis');
    } else {
      //call api to submit data in FinalDiagnosis table and update list
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/provisional-diagnosis`,
          {
            ...diagnosis,
            departmentId,
            patientId: patient?.patientId?._id,
            opdPatientId: patient?._id,
            consultantId: patient?.consultantId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getFinalDiagnosis();
          let sM = [response.data.data, ...showFinalDiagnosis];
          sM = [...new Map(sM.map((item) => [item['diagnosis'], item])).values()];
          setShowFinalDiagnosis(sM);
          setOpenAddFinalDiagnosisDetail(false);

          toast.success(`Final Diagnosis Created Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSaveUpdateFinalDiagnosis = async () => {
    if (diagnosis.diagnosis.length === 0) {
      setError('Please enter diagnosis');
    } else {
      //call api to submit data in FinalDiagnosis table and update list
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/provisional-diagnosis/${diagnosis._id}`,
          {
            ...diagnosis,
            departmentId,
            consultantId: patient?.consultantId,
            opdPatientId: patient?._id
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getFinalDiagnosis();

          setOpenEditDataDetail(false);

          toast(`Final Diagnosis Updated Successfully!!`);
        })
        .catch((error) => {
          toast('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSaveFinalDiagnosis = (val) => {
    let sM = [...patientFinalDiagnosis, { _id: val._id, diagnosis: val.diagnosis, code: val.code }];
    sM = [...new Map(sM.map((item) => [item['diagnosis'] + item['_id'], item])).values()];

    if (patientFinalDiagnosis.length === 0) {
      handleSubmitFinalDiagnosis(sM);
    } else {
      handleSubmitEditFinalDiagnosis(sM);
    }
  };

  const handleSubmitFinalDiagnosis = (sM) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-final-diagnosis`,
        {
          patientId: patient?.patientId?._id,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          departmentId,
          diagnosis: sM
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientFinalData();
        setDiagnosis({ diagnosis: '', code: '' });
        toast(`Final Diagnosis Successfully Submitted!!`);
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  const handleSubmitEditFinalDiagnosis = (sM) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-final-diagnosis/${alreadyExistId}`,
        {
          patientId: patient?.patientId?._id,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          departmentId,
          diagnosis: sM
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientFinalData();
        setDiagnosis({ diagnosis: '', code: '' });
        toast(`Final Diagnosis Successfully Updated!!`);
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  const handleSaveDeleteFinalDiagnosis = () => {
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
        getFinalDiagnosis();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast('Final Diagnosis Deleted Successfully!!');
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  return (
    <Box className="">
      {loader ? (
        <Loader />
      ) : (
        <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
          <Box
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
                Final Diagnosis
              </Typography>
            )}

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

            <Button
              variant="contained"
              startIcon={<Add />}
              title="Add Diagnosis"
              onClick={addFinalDiagnosisHandler}
              sx={{ minWidth: '100px' }}
            >
              Add
            </Button>

            {allFinalDiagnosis.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Edit Diagnosis"
                onClick={editFinalDiagnosisHandler}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <Edit fontSize="small" style={{ color: 'blue' }} />
              </IconButton>
            )}

            {allFinalDiagnosis.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Delete Diagnosis"
                onClick={deleteFinalDiagnosisHandler}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <Delete fontSize="small" style={{ color: 'red' }} />
              </IconButton>
            )}

            {allFinalDiagnosis.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  border: '1px dashed grey.300'
                }}
              >
                <Typography color="text.secondary">Final Diagnosis Not Available, Please Add...</Typography>
              </Paper>
            ) : (
              <>
                {showFinalDiagnosis.length > 0 ? (
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
                    {showFinalDiagnosis.map((val, ind) => {
                      let pre = false;
                      patientFinalDiagnosis.forEach((v) => {
                        if (v.diagnosis === val.diagnosis && v._id === val._id) {
                          pre = true;
                        }
                      });
                      return (
                        <Chip
                          color="primary"
                          style={{ margin: '5px' }}
                          key={ind}
                          className={pre ? 'selectProblemActive' : 'selectProblem'}
                          label={
                            <>
                              {val.diagnosis} {val.code !== '' && <>({val.code})</>}
                            </>
                          }
                          onClick={() => {
                            setOpenAddFinalDiagnosisDetail(false);
                            handleSaveFinalDiagnosis(val);
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
          </Box>

          <Grid item xs={4} lg={3} sx={{ height: selectedMenu !== 'All' && '100%' }}>
            {(openAddFinalDiagnosisDetail || openEditHandler || openDeleteHandler || openEditDataDetail) && (
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  boxShadow: 2,
                  borderRadius: 2
                }}
              >
                {openAddFinalDiagnosisDetail && (
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
                        onChange={handleChangeFinalDiagnosis}
                        error={error !== '' ? true : false}
                        helperText={error}
                        style={{ marginTop: '10px' }}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        name="code"
                        label="ICD-10 Code"
                        value={diagnosis.code}
                        onChange={handleChangeFinalDiagnosis}
                        style={{ marginTop: '10px' }}
                      />

                      <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveAddFinalDiagnosis}>
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
                      {allFinalDiagnosis.map((val, ind) => {
                        return (
                          <Chip
                            color="primary"
                            style={{ margin: '5px' }}
                            key={ind}
                            className="selectProblem"
                            label={val.diagnosis}
                            onClick={() => {
                              setOpenEditHandler(false);
                              setOpenEditDataDetail(true);
                              setOpenAddFinalDiagnosisDetail(false);
                              setDiagnosis(val);
                              setOpenDeleteHandler(false);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </>
                )}

                {openEditDataDetail && (
                  <>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Update Final Diagnosis
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="diagnosis"
                        label="Diagnosis"
                        value={diagnosis.diagnosis}
                        onChange={handleChangeFinalDiagnosis}
                        error={error !== '' ? true : false}
                        helperText={error}
                        style={{ marginTop: '10px' }}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        name="code"
                        label="ICD-10 Code"
                        value={diagnosis.code}
                        onChange={handleChangeFinalDiagnosis}
                        style={{ marginTop: '10px' }}
                      />

                      <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveUpdateFinalDiagnosis}>
                        Save
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
                      {allFinalDiagnosis.map((val, ind) => {
                        let exist = false;
                        deleteIds.forEach((v) => {
                          if (val._id === v) {
                            exist = true;
                          }
                        });
                        return (
                          <Chip
                            color="primary"
                            style={{ margin: '5px' }}
                            key={ind}
                            className={exist ? 'selectProblemDelete' : 'selectProblem'}
                            label={val.diagnosis}
                            onClick={() => {
                              let a = deleteIds;
                              if (val._id !== undefined) {
                                a.push(val._id);
                              }

                              let unique = [];
                              a.forEach((element) => {
                                if (!unique.includes(element)) {
                                  unique.push(element);
                                }
                              });

                              setDeletedIds(unique);
                            }}
                            onDelete={
                              exist
                                ? () => {
                                    let aa = [];
                                    deleteIds.forEach((vM) => {
                                      if (vM !== val._id) {
                                        aa.push(vM);
                                      }
                                    });
                                    setDeletedIds(aa);
                                  }
                                : undefined
                            }
                            deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                          />
                        );
                      })}
                    </Box>

                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteFinalDiagnosis}>
                      Save
                    </Button>
                  </>
                )}
              </Paper>
            )}

            <Box mt={4}>
              {patientFinalDiagnosis.length > 0 && (
                <Box
                  xs={3}
                  className="ptData"
                  style={{ height: selectedMenu !== 'All' && '100%' }}
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
                    className="selectedPtCategory"
                  >
                    {patientFinalDiagnosis.map((val, ind) => {
                      return (
                        <Chip
                          color="primary"
                          style={{ margin: '5px' }}
                          key={ind}
                          className="selectProblemActive"
                          label={
                            <>
                              {val.diagnosis} {val.code !== '' && <>({val.code})</>}
                            </>
                          }
                          onDelete={() => {
                            setOpenAddFinalDiagnosisDetail(false);
                            let medPro = [];
                            patientFinalDiagnosis.forEach((vM) => {
                              if (vM.diagnosis !== val.diagnosis) {
                                medPro.push(vM);
                              }
                            });
                            handleSubmitEditFinalDiagnosis(medPro);
                          }}
                        />
                      );
                    })}
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

export default FinalDiagnosis;

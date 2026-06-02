import { Box, Button, Chip, Grid, Input, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close, Search } from '@mui/icons-material';
import axios from 'axios';
import REACT_APP_BASE_URL, { retrieveToken } from 'api/api';
import Loader from 'component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const Diagnostics = ({ editData }) => {
  const token = retrieveToken();
  const departmentId = editData.departmentId._id;
  const [mostUsedDiagnostics, setMostUsedDiagnostics] = useState([]);
  const [allDiagnostics, setAllDiagnostics] = useState([]);
  const [showDiagnostics, setShowDiagnostics] = useState([]);
  const [patientDiagnostics, setPatientDiagnostics] = useState({ diagnostics: [], notes: '' });
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [exist, setExist] = useState(true);
  const [notes, setNotes] = useState('');
  const [alreadyExistId, setAlreadyExistId] = useState('');
  const [alreadyDiagnosticsExistId, setAlreadyDiagnosticsExistId] = useState('');

  const patient = useSelector((state) => state.patient.selectedPatient);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedDiagnostics.slice();
      patientDiagnostics.diagnostics.forEach((vv) => {
        if (!medP.some((v) => v.testName === vv.testName)) {
          medP.unshift(vv);
        }
      });
      setShowDiagnostics(medP);
    } else {
      let serchM = allDiagnostics.filter((v) => v.testName.toLowerCase().includes(e.target.value.toLowerCase()));
      setShowDiagnostics(serchM);
    }
  };

  const getPatientDiagnostics = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}patient-diagnostics/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setAlreadyDiagnosticsExistId(response?.data?.data?._id);
        setPatientDiagnostics(response?.data?.data);
        setExist(false);
      })
      .catch((error) => {});
  };

  const getDiagnostics = async () => {
    setLoader(true);
    await getPatientDiagnostics();
    await axios
      .get(`${REACT_APP_BASE_URL}other-diagnostics-master`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setAllDiagnostics(response?.data?.diagnostics ?? []);
      })
      .catch(() => {});

    await axios
      .get(`${REACT_APP_BASE_URL}other-diagnostics-master`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setMostUsedDiagnostics(response?.data?.diagnostics ?? []);
        setShowDiagnostics(response?.data?.diagnostics ?? []);
        setLoader(false);
      })
      .catch(() => {});
  };

  const handleCreatePatientDiagnostics = (diag) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-diagnostics`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...diag
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientDiagnostics();
        toast.success(`Diagnostics Successfully Submitted!!`);
        setExist(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!', {
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      });
  };

  const handleEditPatientDiagnostics = (diag) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-diagnostics/${alreadyDiagnosticsExistId}`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...diag
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientDiagnostics();
        toast.success('Diagnostics Successfully Updated!!');
        setExist(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleSubmitPatientDiagnostics = (pro) => {
    if (patientDiagnostics.diagnostics.length === 0) {
      handleCreatePatientDiagnostics(pro);
    } else {
      handleEditPatientDiagnostics(pro);
    }
  };

  useEffect(() => {
    getDiagnostics();
  }, []);

  return (
    <>
      <Box className="paticularSection">
        {loader ? (
          <Loader />
        ) : (
          <Grid container spacing={3} height="inherit">
            <Grid item xs={9} sm={9} md={8} height="inherit" mt={3}>
              <h2 className="popupHead" style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>
                Other Diagnostics
              </h2>

              <Input
                className="search_patient_data"
                type="search"
                placeholder="Search..."
                endAdornment={
                  <InputAdornment position="end">
                    <Search className="search_patient_data_icon" />
                  </InputAdornment>
                }
                onChange={handleSearch}
                value={searchValue}
                sx={{ borderRadius: '5px', border: '1px solid #ccc', padding: '8px 12px' }}
              />
              <Box className="selectedCategory" mt={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {showDiagnostics.length > 0 ? (
                  <Box className="selectedCategory" mt={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {showDiagnostics?.slice(0, 20)?.map((val, ind) => {
                      let pre = false;
                      patientDiagnostics.diagnostics.forEach((v) => {
                        if (v.testName === val.testName) {
                          pre = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          className={`${pre ? 'selectProblemActive' : 'selectProblem'}`}
                          label={val.testName}
                          sx={{
                            margin: '10px',
                            backgroundColor: pre ? '#303f9f' : '#126078',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: pre ? '#303f9f' : '#e0e0e0'
                            }
                          }}
                          onClick={() => {
                            let newDiag = { _id: val._id, testName: val.testName };
                            let updatedDiag = [...patientDiagnostics.diagnostics, newDiag];
                            updatedDiag = [...new Map(updatedDiag.map((item) => [item['testName'], item])).values()];
                            handleSubmitPatientDiagnostics({
                              diagnostics: updatedDiag,
                              notes: notes
                            });
                          }}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <h4 className="noFoundOPd" style={{ color: '#888', fontSize: '1.2rem', marginTop: '20px' }}>
                    Not Found
                  </h4>
                )}
              </Box>
            </Grid>

            <Grid item xs={3} sm={3} md={4}>
              {patientDiagnostics.diagnostics.length > 0 && (
                <Box mt={3} sx={{boxShadow:3,p:3}}>
                  <h4 style={{ fontSize: '1.2rem', color: '#333' }}>Selected Diagnostics</h4>
                  <Box className="selectedPtCategory" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {patientDiagnostics.diagnostics.map((val, ind) => (
                      <Chip
                        key={ind}
                        className="selectProblemActive"
                        label={val.testName}
                        sx={{
                          margin: '5px',
                          backgroundColor: '#3f51b5',
                          color: '#fff',
                          borderRadius: '20px',
                          padding: '8px 12px',
                          fontSize: '0.9rem',
                          '&:hover': {
                            backgroundColor: '#303f9f'
                          }
                        }}
                        onDelete={() => {
                          let updatedDiagnostics = patientDiagnostics.diagnostics.filter((item) => item.testName !== val.testName);
                          handleSubmitPatientDiagnostics({
                            diagnostics: updatedDiagnostics
                            // notes: notes
                          });
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </Box>
      <ToastContainer />
    </>
  );
};

export default Diagnostics;

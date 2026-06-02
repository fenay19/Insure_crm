import { Box, Button, Chip, Grid, Input, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Close, Search } from '@mui/icons-material';
import { useState } from 'react';
import REACT_APP_BASE_URL, { retrieveToken } from 'api/api';
import axios from 'axios';
import { useEffect } from 'react';
import LabTestList from '../LabRadiology/LabTestList';
import Loader from 'component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const Procedure = ({ nextMenu, selectedMenu, editData, consultMenu }) => {
  const token = retrieveToken();
  const departmentId = editData.departmentId._id;
  const [mostUsedProcedure, setMostUsedProcedure] = useState([]);
  const [allProcedure, setAllProcedure] = useState([]);
  const [showProcedure, setShowProcedure] = useState([]);
  const [patientProcedure, setPatientProcedure] = useState({
    procedure: [],
    notes: ''
  });
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [exist, setExist] = useState(true);
  const [notes, setNotes] = useState('');
  const [alreadyExistId, setAlreadyExistId] = useState('');
  const [alreadyProcedureExistId, setAlreadyProcedureExistId] = useState('');
  const [submittedInvestigation, setSubmittedInvestigtion] = useState([]);
  const [investigationRadiology, setInvestigationRadiology] = useState([]);
  const [investigationPathology, setInvestigationPathology] = useState([]);
  const [radiologyData, setRadiologyData] = useState([]);
  const [pathologyData, setPathologyData] = useState([]);
 
  const patient = useSelector((state) => state.patient.selectedPatient);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedProcedure.slice();

      patientProcedure.procedure.forEach((vv) => {
        if (!medP.some((v) => v.procedureName === vv.procedureName)) {
          medP.unshift(vv);
        }
      });
      setShowProcedure(medP);
    } else {
      let serchM = [];
      allProcedure.forEach((v) => {
        if (v.procedureName.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      setShowProcedure(serchM);
    }
  };

  const getPatientLabRadiology = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}patient-lab-radiology/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (
            v.departmentId === departmentId
            // &&
            // v.consultantId ===
            //   JSON.parse(localStorage.getItem("patientConsult")).consultantId
          ) {
            res.push(v);
          }
        });
        if (res.length > 0) {
          setSubmittedInvestigtion(res[res.length - 1].labRadiology);
          setAlreadyExistId(res[res.length - 1]._id);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const fetchRadiologyData = async () => {
      await axios
        .get(`${REACT_APP_BASE_URL}investigation-radiology-master`, {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then((response) => {
          let inv = [];
          response.data.investigation.forEach((v) => {
            if (JSON.parse(localStorage.getItem('patientConsult')).departmentId === v.departmentId) {
              inv.push(v);
            }
          });
          setInvestigationRadiology(inv);
        })
        .catch(() => {});
    };
    fetchRadiologyData();

    const fetchPathologyData = async () => {
      await axios
        .get(`${REACT_APP_BASE_URL}investigation-pathology-master`, {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then((response) => {
          let inv = [];
          response.data.investigation.forEach((v) => {
            if (JSON.parse(localStorage.getItem('patientConsult')).departmentId === v.departmentId) {
              inv.push(v);
            }
          });
          setInvestigationPathology(inv);
        })
        .catch(() => {});
    };
    fetchPathologyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (submittedInvestigation.length > 0) {
      let rD = [];
      let pD = [];
      investigationRadiology.forEach((v) => {
        submittedInvestigation.forEach((val) => {
          if (v._id === val.investigationId) {
            rD.push(val);
          }
        });
      });
      investigationPathology.forEach((v) => {
        submittedInvestigation.forEach((val) => {
          if (v._id === val.investigationId) {
            pD.push(val);
          }
        });
      });

      setRadiologyData(rD);
      setPathologyData(pD);
    }
  }, [submittedInvestigation, investigationRadiology, investigationPathology]);

  const getPatientProcedure = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}patient-procedure/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId && v.consultantId === patient?.consultantId) {
            res.push({ procedure: v.procedure, notes: v.notes });
            console.log('v', v);
            setAlreadyProcedureExistId(v._id);
          }
        });
        if (res.length > 0) {
          setPatientProcedure(res[res.length - 1]);
          setNotes(res[res.length - 1].notes);
          setExist(false);
        }
      })
      .catch((error) => {});
  };

  const getProcedure = async () => {
    setLoader(true);
    await getPatientProcedure();
    await axios
      .get(`${REACT_APP_BASE_URL}procedure-master`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setAllProcedure(response?.data?.data ?? []);
      })
      .catch(() => {});

    await axios
      .get(`${REACT_APP_BASE_URL}procedure-master`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setMostUsedProcedure(response?.data?.data ?? []);
        setShowProcedure(response?.data?.data ?? []);
        setLoader(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getProcedure();
    // eslint-disable-next-line
  }, []);

  const handleCreatePatientProcedure = (pro) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-procedure`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...pro
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientProcedure();
        toast.success(`Procedure Successfully Submitted!!`);
        setExist(false);
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

  const handleEditPatientProcedure = (pro) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-procedure/${alreadyProcedureExistId}`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...pro
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientProcedure();
        toast({
          title: `Procedure Successfully Updated!!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
        setExist(false);
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

  const handleSubmitProcedure = (pro) => {
    if (patientProcedure.procedure.length === 0) {
      handleCreatePatientProcedure(pro);
    } else {
      handleEditPatientProcedure(pro);
    }
  };

  const handleEditData = (dta) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-lab-radiology/${alreadyExistId}`,
        {
          patientId: JSON.parse(localStorage.getItem('patientConsult'))._id,
          departmentId: JSON.parse(localStorage.getItem('patientConsult')).departmentId,
          consultantId: JSON.parse(localStorage.getItem('patientConsult')).consultantId,
          labRadiology: dta
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        toast({
          title: `Investigation Successfully Updated!!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
        getPatientLabRadiology();
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

  useEffect(() => {
    getPatientProcedure();
    getPatientLabRadiology();
  }, []);





  return (
   <>



<Box className="paticularSection" mt={3}>
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={3} height="inherit">
          <Grid item xs={9} sm={9} md={8} height="inherit">
            {selectedMenu !== 'All' && (
              <h2 className="popupHead" style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>
                Procedure
              </h2>
            )}

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
              sx={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '8px 12px',
                '&:focus': {
                  borderColor: '#3f51b5'
                }
              }}
            />

            {allProcedure.length === 0 ? (
              <h4 className="noFoundOPd" style={{ color: '#888', fontSize: '1.2rem', marginTop: '20px' }}>
                Procedure Not Available...
              </h4>
            ) : (
              <>
                {showProcedure.length > 0 ? (
                  <Box className="selectedCategory" mt={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {showProcedure?.slice(0, 20)?.map((val, ind) => {
                      let pre = false;
                      patientProcedure.procedure.forEach((v) => {
                        if (v.procedureName === val.procedureName) {
                          pre = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          className={`${pre ? 'selectProblemActive' : 'selectProblem'}`}
                          label={val.procedureName}
                          sx={{
                            margin: '10px',
                            backgroundColor: pre ? '#3f51b5' : '#126078',
                            color: pre ? '#fff' : '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: pre ? '#303f9f' : '#e0e0e0'
                            }
                          }}
                          onClick={() => {
                            let dta = {
                              _id: val._id,
                              procedureName: val.procedureName
                            };
                            let sM = [...patientProcedure.procedure, dta];
                            sM = [...new Map(sM.map((item) => [item['procedureName'], item])).values()];
                            handleSubmitProcedure({
                              procedure: sM,
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
              </>
            )}
          </Grid>

          <Grid item xs={3} sm={3} md={4} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
            {submittedInvestigation.length > 0 && (
              <Grid style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#333' }}>Investigation</h4>

                {radiologyData.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginBottom: '15px',
                      backgroundColor: '#f9f9f9',
                      padding: '15px',
                      borderRadius: '8px',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4 style={{ color: '#3f51b5', fontSize: '1.1rem', marginBottom: '10px' }}>Radiology</h4>
                    <LabTestList
                      submittedInvestigation={submittedInvestigation}
                      singleData={radiologyData}
                      handleEditData={handleEditData}
                    />
                  </Grid>
                )}

                {pathologyData.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    style={{
                      backgroundColor: '#f9f9f9',
                      padding: '15px',
                      borderRadius: '8px',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4 style={{ color: '#3f51b5', fontSize: '1.1rem', marginBottom: '10px' }}>Pathology</h4>
                    <LabTestList
                      submittedInvestigation={submittedInvestigation}
                      singleData={pathologyData}
                      handleEditData={handleEditData}
                    />
                  </Grid>
                )}
              </Grid>
            )}

            {patientProcedure.procedure.length > 0 && (
              <Grid style={{ marginBottom: '2rem' }} sx={{boxShadow:3,p:3}}>
                <h4 style={{ margin: '5px 0', fontSize: '1.2rem', color: '#333' }}>Selected Procedure</h4>
                <Box className="selectedPtCategory" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {patientProcedure.procedure.map((val, ind) => {
                    return (
                      <Chip
                        key={ind}
                        className="selectProblemActive"
                        label={val.procedureName}
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
                          let medPro = [];
                          patientProcedure.procedure.forEach((vM) => {
                            if (vM.procedureName !== val.procedureName) {
                              medPro.push(vM);
                            }
                          });
                          handleSubmitProcedure({
                            procedure: medPro,
                            notes: notes
                          });
                        }}
                      />
                    );
                  })}

                  <TextField
                    fullWidth
                    variant="outlined"
                    name="notes"
                    label="Notes"
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setExist(true);
                    }}
                    multiline
                    rows={2}
                    style={{
                      marginTop: '15px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  {exist && (
                    <Button
                      variant="contained"
                      className="addBtn"
                      style={{
                        marginTop: '15px',
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        fontSize: '1rem'
                      }}
                      onClick={() =>
                        handleSubmitProcedure({
                          procedure: patientProcedure.procedure,
                          notes: notes
                        })
                      }
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
    <ToastContainer/>
   </>
  );
};

export default Procedure;


import { Box, Button, Chip, Grid, Input, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close, Search } from '@mui/icons-material';
import axios from 'axios';
import REACT_APP_BASE_URL, { retrieveToken } from 'api/api';
import Loader from 'component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const Pathology = ({ editData }) => {
  const token = retrieveToken();
  const departmentId = editData.departmentId._id;
  const [pathologyTests, setPathologyTests] = useState([]);
  const [pathologyProfiles, setPathologyProfiles] = useState([]);
  const [showPathology, setShowPathology] = useState([]);
  const [patientPathology, setPatientPathology] = useState({ pathology: [] });
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('tests');
  const [existingPathologyId, setExistingPathologyId] = useState('');

  const patient = useSelector((state) => state.patient.selectedPatient);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      setShowPathology(activeTab === 'tests' ? pathologyTests : pathologyProfiles);
    } else {
      let searchResults = (activeTab === 'tests' ? pathologyTests : pathologyProfiles).filter((v) =>
        (v.testName || v.profileName).toLowerCase().includes(e.target.value.toLowerCase())
      );
      setShowPathology(searchResults);
    }
  };

  const getPatientPathology = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}patient-pathology/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setExistingPathologyId(response?.data?.data?._id);
      setPatientPathology(response?.data?.data || { pathology: [] });
    } catch (error) {
      console.error('Error fetching patient pathology data', error);
    }
  };

  const getPathologyData = async () => {
    setLoader(true);
    try {
      await getPatientPathology();

      const testResponse = await axios.get(`${REACT_APP_BASE_URL}investigation-pathology-master`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setPathologyTests(testResponse?.data?.investigations ?? []);

      const profileResponse = await axios.get(`${REACT_APP_BASE_URL}investigation-pathology-master/profile`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setPathologyProfiles(profileResponse?.data?.data ?? []);

      setShowPathology(testResponse?.data?.investigations ?? []);
    } catch (error) {
      console.error('Error fetching pathology data', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getPathologyData();
  }, []);

  useEffect(() => {
    setShowPathology(activeTab === 'tests' ? pathologyTests : pathologyProfiles);
  }, [activeTab, pathologyTests, pathologyProfiles]);

  const handleCreatePatientPathology = (data) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-pathology`,
        {
          patientId: patient?.patientId?._id,
          departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...data
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(() => {
        getPatientPathology();
        toast.success('Pathology Successfully Submitted!!');
      })
      .catch(() => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleEditPatientPathology = (data) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-pathology/${existingPathologyId}`,
        {
          patientId: patient?.patientId?._id,
          departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...data
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(() => {
        getPatientPathology();
        toast.success('Pathology Successfully Updated!!');
      })
      .catch(() => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleSubmitPatientPathology = (data) => {
    if (patientPathology?.pathology.length === 0) {
      handleCreatePatientPathology(data);
    } else {
      handleEditPatientPathology(data);
    }
  };

  return (
    <Box className="paticularSection">
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={3} height="inherit">
          <Grid item xs={9} sm={9} md={8} height="inherit" mt={3}>
            <h2 className="popupHead">Pathology</h2>
            <Box display="flex" gap={2} my={2}>
              <Button variant={activeTab === 'tests' ? 'contained' : 'outlined'} onClick={() => setActiveTab('tests')}>
                Tests
              </Button>
              <Button variant={activeTab === 'profiles' ? 'contained' : 'outlined'} onClick={() => setActiveTab('profiles')}>
                Profiles
              </Button>
              <Input
                type="search"
                placeholder="Search..."
                endAdornment={
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                }
                onChange={handleSearch}
                value={searchValue}
              />
            </Box>

            <Box className="selectedCategory" mt={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {showPathology.length > 0 ? (
                showPathology.slice(0, 20).map((val, ind) => {
                  let selected = patientPathology?.pathology?.some((v) => v.testName === val.testName );
                  return (
                    <Chip
                      key={ind}
                      label={val.testName || val.profileName}
                      className={selected ? 'selectProblemActive' : 'selectProblem'}
                      sx={{
                        margin: '10px',
                        backgroundColor: selected ? '#3f51b5' : '#126078',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        let updatedInvestigations = selected
                          ? patientPathology.pathology.filter((item) => item.testName !== val.testName || val?.profileName)
                          : [...patientPathology.pathology, { _id: val._id, testName: val.testName || val?.profileName }];
                        handleSubmitPatientPathology({ pathology: updatedInvestigations });
                      }}
                    />
                  );
                })
              ) : (
                <h4 className="noFoundOPd">Not Found</h4>
              )}
            </Box>
          </Grid>

          <Grid item xs={3} sm={3} md={4}>
            {patientPathology.pathology.length > 0 && (
              <Box mt={3} sx={{boxShadow:3,p:3}}>
                <h4 style={{ fontSize: '1.2rem', color: '#333' }}>Selected Pathology Tests</h4>
                <Box className="selectedPtCategory" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {patientPathology.pathology.map((val, ind) => (
                    <Chip
                      key={ind}
                      className="selectProblemActive"
                      label={val.testName || val.profileName}
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
                        let updatedPathology = patientPathology.pathology.filter(
                          (item) => item.testName !== val.testName || val?.profileName
                        );
                        handleSubmitPatientPathology({
                          pathology: updatedPathology
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
      <ToastContainer />
    </Box>
  );
};

export default Pathology;

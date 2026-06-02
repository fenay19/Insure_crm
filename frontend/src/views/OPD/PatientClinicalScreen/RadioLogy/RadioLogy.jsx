import { Box, Chip, Grid, Input, InputAdornment } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import REACT_APP_BASE_URL, { retrieveToken } from 'api/api';
import Loader from 'component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const Radiology = ({ editData }) => {
  const token = retrieveToken();
  const departmentId = editData.departmentId._id;
  const [mostUsedRadiology, setMostUsedRadiology] = useState([]);
  const [allRadiology, setAllRadiology] = useState([]);
  const [showRadiology, setShowRadiology] = useState([]);
  const [patientRadiology, setPatientRadiology] = useState({ radiology: [] });
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [notes, setNotes] = useState('');
  const [alreadyRadiologyExistId, setAlreadyRadiologyExistId] = useState('');

  const patient = useSelector((state) => state.patient.selectedPatient);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedRadiology.slice();
      patientRadiology.investigation.forEach((vv) => {
        if (!medP.some((v) => v.testName === vv.testName)) {
          medP.unshift(vv);
        }
      });
      setShowRadiology(medP);
    } else {
      let serchM = allRadiology.filter((v) => v.testName.toLowerCase().includes(e.target.value.toLowerCase()));
      setShowRadiology(serchM);
    }
  };

  const getPatientRadiology = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}patient-radiology/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setAlreadyRadiologyExistId(response?.data?.data?._id);
        setPatientRadiology(response?.data?.data);
      })
      .catch(() => {});
  };

  const getRadiology = async () => {
    setLoader(true);
    await getPatientRadiology();
    await axios
      .get(`${REACT_APP_BASE_URL}investigation-radiology-master`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setAllRadiology(response?.data?.investigation ?? []);
        setMostUsedRadiology(response?.data?.investigation ?? []);
        setShowRadiology(response?.data?.investigation ?? []);
        setLoader(false);
      })
      .catch(() => {});
  };

  const handleSubmitPatientRadiology = (pro) => {
    if (patientRadiology?.radiology.length === 0) {
      handleCreatePatientRadiology(pro);
    } else {
      handleEditPatientRadiology(pro);
    }
  };

  const handleCreatePatientRadiology = (diag) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-radiology`,
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
      .then(() => {
        getPatientRadiology();
        toast.success(`Radiology Successfully Submitted!!`);
      })
      .catch(() => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleEditPatientRadiology = (diag) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-radiology/${alreadyRadiologyExistId}`,
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
      .then(() => {
        getPatientRadiology();
        toast.success('Radiology Successfully Updated!!');
      })
      .catch(() => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  useEffect(() => {
    getRadiology();
  }, []);

  return (
    <Box className="paticularSection">
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={3} height="inherit">
          <Grid item xs={9} sm={9} md={8} height="inherit">
            <h2 className="popupHead">Radiology</h2>
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
              sx={{ my: 3 }}
            />
            <Box className="selectedCategory" mt={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {showRadiology.length > 0 ? (
                showRadiology.slice(0, 20).map((val, ind) => {
                  let pre = patientRadiology?.radiology.some((v) => v.testName === val.testName);
                  return (
                    <Chip
                      key={ind}
                      className={pre ? 'selectProblemActive' : 'selectProblem'}
                      label={val.testName}
                      sx={{ margin: '10px', backgroundColor: pre ? '#3f51b5' : '#126078', color: '#fff' }}
                      onClick={() => {
                        let newDiag = { _id: val._id, testName: val.testName };
                        let updatedDiag = [...patientRadiology.radiology, newDiag];
                        updatedDiag = [...new Map(updatedDiag.map((item) => [item['testName'], item])).values()];
                        handleSubmitPatientRadiology({ radiology: updatedDiag, notes });
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
  {patientRadiology?.radiology.length > 0 && (
    <Box mt={3} sx={{boxShadow:3,p:3}}>
      <h4 style={{ fontSize: '1.2rem', color: '#333' }}>Selected Radiology Tests</h4>
      <Box className="selectedPtCategory" sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {patientRadiology.radiology.map((val, ind) => (
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
              let updatedRadiology = patientRadiology.radiology.filter(
                (item) => item.testName !== val.testName
              );
              handleSubmitPatientRadiology({
                radiology: updatedRadiology
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

export default Radiology;

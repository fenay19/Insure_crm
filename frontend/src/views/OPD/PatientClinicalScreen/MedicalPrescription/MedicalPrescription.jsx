import { Box, Tabs, Tab, AppBar, Grid, useMediaQuery, Paper } from '@mui/material';
import './MedicalPrescripiton.css';
import React, { useState } from 'react';
import NewMedicalPrescripiton from './NewMedicalPrescription';
import MedicineDose from './MedicineDose';
import OldMedicalPrescription from './OldMedicalPrescripiton';
import OldPrescriptionDetail from './OldPrescriptionDetail';
import SubmitMedicalPrescription from './SubmitMedicalPrescripiton';
import GlassPrescription from './GlassPrescription';
import REACT_APP_BASE_URL, { get } from 'api/api';
import axios from 'axios';
import { retrieveToken } from 'api/api';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import VisualAcuityForm from './VisiualActivity/VisualActivity';
import DisplayGlassPrescription from './PatientGlassPrescription/DisplayGlassPrescription';
import RemarkSection from './Remark';

const MedicalPrescription = ({ selectedMenu, editData }) => {
  const departmentId = editData.departmentId._id;
  const [value, setValue] = React.useState(0);
  const [selectedMed, setSelectedMed] = React.useState({});
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [oldPrescriptions, setOldPrescriptions] = React.useState({});
  const [glassPrescription, setGlassPrescripition] = React.useState(0);
  const patient = useSelector((state) => state.patient.selectedPatient);

  const [patientGlassP, setPatientGlassP] = React.useState([]);
  const [alreadyExist, setAlreadyExist] = React.useState('');

  const matches = useMediaQuery('(max-width:1199px)');

  const token = retrieveToken();
  const dep = window.localStorage.getItem('departmentName');
  const isOphthalmology =
    (dep?.toLowerCase().trim().includes('ophthalmology') && 'ophthalmology') ||
    (editData?.department?.toLowerCase().trim().includes('ophthalmology') && 'ophthalmology') ||
    '';

  const getPatientMedicalPrescription = async () => {
    if (patient) {
      await axios
        .get(`${REACT_APP_BASE_URL}patient-medical-prescription/${patient?.patientId?._id}`, {
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
            setPrescriptions(res[res.length - 1].prescription);
            setAlreadyExist(res[res.length - 1]._id);
          }
        })
        .catch((error) => {});
    }
  };

  const handleChange = (event, newValue) => {
    if (newValue === 1) {
      setSelectedMed({});
    }
    setValue(newValue);
  };
  const handleGlassChange = (event, newValue) => {
    if (newValue === 1) {
      setSelectedMed({});
    }
    setGlassPrescripition(newValue);
  };

  const selectedMedicineHandler = (data) => {
    setValue(0);
    let pre = {};
    prescriptions.forEach((v) => {
      if (v.brandName === data.brandName && v.dose === data.dose) {
        pre = v;
      }
    });
    if (Object.values(pre).length === 0) {
      setSelectedMed(data);
    } else {
      setSelectedMed(pre);
    }
  };

  const handleRemovePrescription = (val) => {
    let sM = prescriptions.filter((v) => v.brandName !== val.brandName || v.dose !== val.dose);
    handleEditPrescription(sM);
  };

  const getGlassPrescription = async () => {
    if (!patient) return;

    try {
      const response = await get(`patient-glass-prescription/${patient.patientId._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });

      if (response?.data) {
        setPatientGlassP(response.data);
      }
    } catch (error) {
      console.error('Error fetching glass prescription:', error);
    }
  };

  useEffect(() => {
    getGlassPrescription();
    // eslint-disable-next-line
  }, [patient]);

  const handleSubmitPrescription = (createDose) => {
    if (createDose.time === '' || createDose.when === '' || createDose.duration === '') {
      toast({
        title: `Please select ${createDose.intake === '' ? 'dose,' : ''} ${
          createDose.time === '' ? 'time,' : ''
        } ${createDose.when === '' ? 'when medicine get,' : ''} ${
          createDose.duration === '' ? 'duration,' : ''
        } for ${createDose.brandName} (${createDose.dose})!!`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
    } else {
      let doseArray = createDose.intake.split('/').map(Number);
      let dose = 0;
      if (createDose.intake === '1½') {
        dose = 1.5;
      } else if (createDose.intake === '2½') {
        dose = 2.5;
      } else if (doseArray.length === 1) {
        dose = createDose.intake;
      } else {
        dose = doseArray[0] / doseArray[1];
      }
      let time =
        createDose.time === '4 Hour'
          ? 6
          : createDose.time === '6 Hour'
            ? 4
            : createDose.time === '8 Hour'
              ? 3
              : createDose.time === '12 Hour'
                ? 2
                : createDose.time === '24 Hour'
                  ? 1
                  : createDose.time === '48 Hour'
                    ? 1 / 2
                    : createDose.time === 'Once'
                      ? 1
                      : createDose.time === 'Twice'
                        ? 2
                        : createDose.time === 'Thrice' && 3;
      let duration =
        createDose.duration === '1 Day'
          ? 1
          : createDose.duration === '2 Day'
            ? 2
            : createDose.duration === '3 Day'
              ? 3
              : createDose.duration === '4 Day'
                ? 4
                : createDose.duration === '5 Day'
                  ? 5
                  : createDose.duration === '1 Week'
                    ? 7
                    : createDose.duration === '2 Week'
                      ? 14
                      : createDose.duration === '3 Week'
                        ? 21
                        : createDose.duration === '4 Week'
                          ? 28
                          : createDose.duration === '1 Month'
                            ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                            : createDose.duration === '2 Month'
                              ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() +
                                new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).getDate()
                              : createDose.duration === '3 Month'
                                ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() +
                                  new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).getDate() +
                                  new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0).getDate()
                                : createDose.duration === '6 Month'
                                  ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() +
                                    new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).getDate() +
                                    new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0).getDate() +
                                    new Date(new Date().getFullYear(), new Date().getMonth() + 4, 0).getDate() +
                                    new Date(new Date().getFullYear(), new Date().getMonth() + 5, 0).getDate() +
                                    new Date(new Date().getFullYear(), new Date().getMonth() + 6, 0).getDate()
                                  : createDose.duration === '1 Year' && 365;

      let totalMed = dose * time * duration;

      let sM = [
        ...prescriptions,
        {
          ...createDose,
          totalMed:
            createDose.type.toLowerCase().includes('tab') ||
            createDose.type.toLowerCase().includes('cap') ||
            createDose.type.toLowerCase().includes('inj')
              ? Math.ceil(totalMed)
              : ''
        }
      ];
      sM = [...new Map(sM.map((item) => [item['_id'], item])).values()];

      if (prescriptions.length === 0 || alreadyExist === '') {
        handleCreatePrescription(sM);
      } else {
        handleEditPrescription(sM);
      }
    }
  };

  const handleCreatePrescription = (data) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-medical-prescription`,
        {
          patientId: patient?.patientId?._id,
          departmentId,
          prescription: data
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientMedicalPrescription();
        toast({
          title: `Medicine Prescription Save Successfully!!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
        setSelectedMed({});
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

  const handleEditPrescription = (data) => {
    //put api

    axios
      .put(
        `${REACT_APP_BASE_URL}patient-medical-prescription/${alreadyExist}`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          prescription: data
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientMedicalPrescription();
        toast({
          title: `Medicine Prescription Update Successfully!!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
        setSelectedMed({});
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

  return (
    <>
      <Grid container sx={{ height: '100%', p: 2, display: 'flex', justifyContent: 'space-between' }}>
        {/* Submit Prescription Section - Moved to Top */}
        {prescriptions.length > 0 && (
          <Grid item xs={12} md={3} lg={12} mb={3}>
            <Paper sx={{ boxShadow: 3 }}>
              <SubmitMedicalPrescription
                prescriptions={prescriptions}
                selectedMedicineHandler={selectedMedicineHandler}
                selectedMed={selectedMed}
                handleRemovePrescription={handleRemovePrescription}
                setSelectedMed={setSelectedMed}
              />
            </Paper>
          </Grid>
        )}

        {/* Left Section - Tabs & Prescription Content */}
        <Grid item xs={12} md={7} lg={8} sx={{ display: 'flex', gap: '1rem' }}>
          <Card sx={{ width: '100%', p: 1, boxShadow: 3 }}>
            <AppBar color="info" position="static" sx={{ width: '40vw' }}>
              <Tabs value={value} onChange={handleChange} sx={{ backgroundColor: 'primary', color: 'white' }}>
                <Tab label="Medical Prescription" />
                <Tab label="Old Prescription" />
              </Tabs>
            </AppBar>

            {/* Prescription Sections */}
            {value === 0 && (
              <NewMedicalPrescripiton
                selectedMedicineHandler={selectedMedicineHandler}
                selectedMed={selectedMed}
                setSelectedMed={setSelectedMed}
                prescriptions={prescriptions}
                glassPrescription={glassPrescription}
                setGlassPrescripition={setGlassPrescripition}
                getPatientMedicalPrescription={getPatientMedicalPrescription}
              />
            )}

            {value === 1 && (
              <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxShadow: 2 }}>
                <OldMedicalPrescription setOldPrescriptions={setOldPrescriptions} oldPrescriptions={oldPrescriptions} />
              </Box>
            )}
          </Card>
        </Grid>

        {/* Right Section - Prescription Details */}
        {value === 0 && Object.values(selectedMed).length > 0 && (
          <Grid item xs={12} md={5} lg={4}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <MedicineDose selectedMed={selectedMed} handleSubmitPrescription={handleSubmitPrescription} setSelectedMed={setSelectedMed} />
            </Paper>
          </Grid>
        )}

        {value === 1 && (
          <Grid item xs={12} md={5} lg={4}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <OldPrescriptionDetail
                oldPrescriptions={oldPrescriptions}
                handleSubmitPrescription={handleSubmitPrescription}
                prescriptions={prescriptions}
              />
            </Paper>
          </Grid>
        )}

        {isOphthalmology?.toLowerCase()?.trim() === 'ophthalmology' && (
          <Grid item xs={12} md={7} lg={8} sx={{ display: 'flex', gap: '1rem', mt: 6 }}>
            <Card sx={{ width: '100%', p: 2, boxShadow: 3 }}>
              <AppBar color="info" position="static" sx={{ width: '75vw', mx: 'auto' }}>
                <Tabs
                  value={glassPrescription}
                  onChange={handleGlassChange}
                  variant="fullWidth"
                  sx={{ backgroundColor: 'primary', color: 'white' }}
                >
                  <Tab label="Glass Prescription" />
                  <Tab label="Old Glass Prescription" />
                </Tabs>
              </AppBar>

              {/* Prescription Sections */}
              {glassPrescription === 0 && (
                <>
                  <GlassPrescription
                    patientGlassP={patientGlassP}
                    patient={patient}
                    departmentId={departmentId}
                    getGlassPrescription={getGlassPrescription}
                    isExamination={false}
                  />
                  <RemarkSection departmentId={departmentId} />
                </>
              )}

              {glassPrescription === 1 && (
                <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxShadow: 2 }}>
                  <OldMedicalPrescription setOldPrescriptions={setOldPrescriptions} oldPrescriptions={oldPrescriptions} />
                </Box>
              )}
            </Card>
          </Grid>
        )}

        {/* Glass Prescription Display */}
        {patientGlassP?.length > 0 && (
          <Grid item xs={12} md={3} lg={12} mt={3}>
            <Paper sx={{ boxShadow: 3 }}>
              <DisplayGlassPrescription editData={patientGlassP?.[0]} getGlassPrescription={getGlassPrescription} />
            </Paper>
          </Grid>
        )}
      </Grid>

      <ToastContainer />
    </>
  );
};

export default MedicalPrescription;

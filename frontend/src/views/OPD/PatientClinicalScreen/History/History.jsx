import * as React from 'react';
import { Box, Stepper, Button, Paper, Typography, Grid, Step, StepLabel, Dialog, DialogContent } from '@mui/material';
import './History.css';

import SelectedHistory from './SelectedHistory';
import { useState, useEffect } from 'react';
import { get, post, put } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import EditHistory from './EditHistory';
// const initialPatientHistory = {
//   medicalProblems: [],
//   drugHistory: [],
//   allergies: {
//     having: '',
//     which: { general: [], drug: [], food: [], other: '' }
//   },
//   familyHistory: [],
//   lifeStyle: [],
//   other: [],
//   obstetric: [],
//   pediatric: [],
//   nutritional: [],
//   procedure: { having: '', which: [] },
//   other: ''
// };

const History = ({ selectedMenu, editData, isDrProfile = false } = {}) => {
  const departmentId = editData.departmentId._id;
  const patient = useSelector((state) => state.patient.selectedPatient);
  const dep = window.localStorage.getItem('departmentName');
  const isOphthalmology =
    (dep?.toLowerCase().trim().includes('ophthalmology') && 'ophthalmology') ||
    (editData?.department?.toLowerCase().trim().includes('ophthalmology') && 'ophthalmology') ||
    '';
  const [initialPatientHistory, setInitialPatientHistory] = useState({
    medicalProblems: [],
    drugHistory: [],
    allergies: {
      having: '',
      which: { general: [], drug: [], food: [], other: '' }
    },
    familyHistory: [],
    lifeStyle: [],
    gynac: [],
    obstetric: [],
    pediatric: [],
    nutritional: [],
    procedure: { having: '', which: [] },
    other: []
  });

  const [medicalCategory, setMedicalCategory] = React.useState([
    { category: 'Past History', description: ``, data: 0 },
    { category: 'Family History', description: ``, data: 1 },
    { category: 'Personal History', description: ``, data: 2 },
    { category: 'Allergies', description: ``, data: 3 },
    { category: 'Procedure', description: ``, data: 4 },
    { category: 'Gynac History', description: ``, data: 5 },
    { category: 'Obstetric History', description: ``, data: 6 },
    { category: 'Pediatric History', description: ``, data: 7 },
    { category: 'Nutritional History', description: ``, data: 8 },
    { category: 'Drug/Medication History', description: ``, data: 9 },
    { category: `${isOphthalmology ? 'Optical History' : 'Other History'}`, description: ``, data: 10 }
  ]);

  const [activeStep, setActiveStep] = React.useState(0);
  const [patientHistory, setPatientHistory] = React.useState(initialPatientHistory);
  const [patientFinalHistory, setPatientFinalHistory] = React.useState(initialPatientHistory);
  const [patientShowData, setPatientShowData] = useState(initialPatientHistory);
  const [alreadyExistId, setAlreadyExistId] = useState('');
  const [allMedicalProblems, setAllMedicalProblems] = useState([]);
  const [allFamilyProblems, setAllFamilyProblems] = useState([]);
  const [allDrugHistory, setAllDrugHistory] = useState([]);
  const [allLifeStyle, setAllLifeStyle] = useState([]);
  const [allGynac, setAllGynac] = useState([]);
  const [allObstetric, setAllObstetric] = useState([]);
  const [allPediatric, setAllPediatric] = useState([]);
  const [allNutritional, setAllNutritional] = useState([]);
  const [allAllergies, setAllAllergies] = useState({ general: [], drug: [], food: [] });
  const [allProcedure, setAllProcedure] = useState([]);
  const [allOther, setAllOther] = useState([]);
  const [loader, setLoader] = useState(true);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openEditHistory, setOpenEditHistory] = useState({
    pastHistory: false,
    familyHistory: false,
    personalHistory: false,
    allergies: false,
    procedure: false,
    nutritionalHistory: false,
    gynacHistory: false,
    drugHistory: false,
    obstetricHistory: false,
    otherHistory: false,
    pediatric: false
  });
  const handleReset = () => {
    setActiveStep(0);
  };

  const isFemale = patient ? patient?.gender?.toLowerCase()?.trim() === 'female' : true;
  const isPed = patient ? patient?.age <= 18 : true;

  const getAllMasterData = async () => {
    setLoader(true);
    try {
      const responses = await Promise.all([
        get(`opd/medical-problem/most-used/${departmentId}`),
        get(`opd/family-problem/most-used/${departmentId}`),
        get(`opd/drug-history/most-used/${departmentId}`),
        get(`opd/life-style/most-used/${departmentId}`),
        get(`opd/gynac-history/most-used/${departmentId}`),
        get(`opd/obstetric-history/most-used/${departmentId}`),
        get(`opd/pediatric-history/most-used/${departmentId}`),
        get(`opd/nutritional-history/most-used/${departmentId}`),
        get(`opd/general-allergy/most-used/${departmentId}`),
        get(`opd/food-allergy/most-used/${departmentId}`),
        get(`opd/drug-allergy/most-used/${departmentId}`),
        get(`opd/procedure/most-used/${departmentId}`),
        get(`opd/other-history/most-used/${departmentId}`)
      ]);

      const [
        medicalProblems,
        familyProblems,
        drugHistory,
        lifeStyle,
        gynacHistory,
        obstetricHistory,
        pediatricHistory,
        nutritionalHistory,
        generalAllergy,
        foodAllergy,
        drugAllergy,
        procedure,
        otherHistory
      ] = responses.map((res) => res.data);

      setAllMedicalProblems(medicalProblems);
      setAllFamilyProblems(familyProblems);
      setAllDrugHistory(drugHistory);
      setAllLifeStyle(lifeStyle);
      setAllGynac(gynacHistory);
      setAllObstetric(obstetricHistory);
      setAllPediatric(pediatricHistory);
      setAllNutritional(nutritionalHistory);
      setAllAllergies({ general: generalAllergy, drug: drugAllergy, food: foodAllergy });
      setAllProcedure(procedure);
      setAllOther(otherHistory);
      setPatientHistory(initialPatientHistory);
      // setPatientHistory(medicalProblems);
      setPatientFinalHistory(initialPatientHistory);
    } catch (error) {
      console.error('Error fetching master data:', error);
    } finally {
      setLoader(false);
    }
  };

  const getPatientHistory = async () => {
    try {
      if (patient) {
        const response = await get(`patient-history/${patient?.patientId?._id}`);

        console.log('RESPONSEEEEE', response);
        const res = response.data.map((v) => ({
          medicalProblems: v.medicalProblems,
          drugHistory: v.drugHistory,
          allergies: v.allergies,
          familyHistory: v.familyHistory,
          lifeStyle: v.lifeStyle,
          gynac: v.gynac,
          obstetric: v.obstetric,
          nutritional: v.nutritional,
          pediatric: v.pediatric,
          procedure: v.procedure,
          other: v.other
        }));

        setPatientShowData(res?.[0]);

        if (res.length > 0) {
          const lastHistory = res[res.length - 1];
          setAlreadyExistId(response.data[response.data.length - 1]._id);
          setPatientFinalHistory(lastHistory);
          setPatientHistory(lastHistory);
        }
      }
    } catch (error) {
      console.error('Error fetching patient history:', error);
    }
  };

  const handleSubmitPatientHis = async () => {
    try {
      // Merge patientHistory with initialPatientHistory if any key is empty
      const mergedPatientHistory = Object.keys(patientHistory).reduce((acc, key) => {
        const patientValue = patientHistory[key];
        const initialValue = initialPatientHistory?.[key];

        // Check if the value is empty (for both array and object cases)
        if (
          (Array.isArray(patientValue) && patientValue.length === 0) ||
          (typeof patientValue === 'object' && Object.keys(patientValue).length === 0) ||
          patientValue === '' // Covers empty strings
        ) {
          acc[key] = initialValue; // Use initial value if empty
        } else {
          acc[key] = patientValue; // Otherwise, keep current value
        }

        return acc;
      }, {});

      if (alreadyExistId) {
        await put(`patient-history/${alreadyExistId}`, {
          patientId: patient?.patientId?._id,
          departmentId,
          opdPatientId: patient?._id,
          consultantId: patient?.consultantId,
          ...mergedPatientHistory // Use merged data
        });

        toast.success('History Successfully Updated!!');
      } else {
        await post(`patient-history`, {
          patientId: patient?.patientId?._id,
          departmentId,
          consultantId: patient?.consultantId,
          ...mergedPatientHistory // Use merged data
        });

        toast.success('History Successfully Submitted!!');
      }

      getPatientHistory();
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  // Function to check if an object has meaningful values
  const hasMeaningfulValues = (obj) => {
    if (!obj || typeof obj !== 'object') return false;

    return Object.values(obj).some((value) => {
      if (Array.isArray(value)) return value.length > 0; // Check non-empty arrays
      if (typeof value === 'object' && value !== null) return hasMeaningfulValues(value); // Recursively check nested objects
      return value !== ''; // Check non-empty strings
    });
  };

  // Function to compare two objects deeply
  const objectsAreEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true; // If both are the same reference, return true
    if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false; // If either is not an object, return false

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false; // If number of keys are different, return false

    return keys1.every((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === 'object' && typeof val2 === 'object') {
        return objectsAreEqual(val1, val2); // Recursively compare nested objects
      }

      return val1 === val2; // Compare primitive values
    });
  };

  const isPatientShowDataEmpty = (data) => {
    if (!data || typeof data !== 'object') return true;
    return Object.values(data).every((value) => {
      if (Array.isArray(value)) {
        return value.length === 0; // Check if array is empty
      } else if (typeof value === 'object' && value !== null) {
        return isPatientShowDataEmpty(value); // Recursively check nested objects
      } else {
        return value === ''; // Check if string is empty
      }
    });
  };

  // Usage
  const showDataIsEmpty = isPatientShowDataEmpty(patientShowData);
  console.log('ALL MEDICAL PRONLEMS', allMedicalProblems);
  useEffect(() => {
    if (hasMeaningfulValues(patientHistory) && !objectsAreEqual(patientHistory, patientFinalHistory)) {
      handleSubmitPatientHis();
    }
    // eslint-disable-next-line
  }, [patientHistory]);

  useEffect(() => {
    if (patientShowData) {
      setInitialPatientHistory((prev) => ({
        medicalProblems: patientShowData.medicalProblems || prev.medicalProblems,
        drugHistory: patientShowData.drugHistory || prev.drugHistory,
        allergies: patientShowData.allergies || prev.allergies,
        familyHistory: patientShowData.familyHistory || prev.familyHistory,
        lifeStyle: patientShowData.lifeStyle || prev.lifeStyle,
        gynac: patientShowData.gynac || prev.gynac,
        obstetric: patientShowData.obstetric || prev.obstetric,
        pediatric: patientShowData.pediatric || prev.pediatric,
        nutritional: patientShowData.nutritional || prev.nutritional,
        procedure: patientShowData.procedure || prev.procedure,
        other: patientShowData.other || prev.other
      }));
    }
  }, [patientShowData]);

  useEffect(() => {
    getAllMasterData();
  }, []);

  useEffect(() => {
    getPatientHistory();
  }, [patient?._id]);

  return (
    <>
      <Box className="paticularSection">
        {openEditPopup && (
          <Dialog open={openEditHistory}>
            <DialogContent>
              <EditHistory
                openEditHistory={openEditHistory}
                setOpenEditHistory={setOpenEditHistory}
                setOpenEditPopup={setOpenEditPopup}
                allMedicalProblems={allMedicalProblems}
              />
            </DialogContent>
          </Dialog>
        )}
        <Grid container spacing={2} height="inherit" sx={{ display: 'flex', justifyContent: 'space-between', width: '95%' }}>
          <Grid container item spacing={2} xs={9} px={2} height="inherit" style={{ width: '70vw', display: 'flex' }}>
            <Grid item sm={3} className="stepperHistory">
              <h2>{selectedMenu}</h2>
              <Stepper activeStep={activeStep} orientation="vertical">
                {medicalCategory.map((step, index) => {
                  const isGynacOrObstetric = step.category === 'Gynac History' || step.category === 'Obstetric History';

                  const isPediatric = step.category === 'Pediatric History';

                  const shouldShowStep = editData?.department?.toLowerCase()?.trim()?.includes('ophthalmology')
                    ? !isGynacOrObstetric // Hide Gynac/Obstetric if Dr Profile
                    : (!isGynacOrObstetric || isFemale) && (!isPediatric || isPed); // Show based on gender

                  if (!shouldShowStep) return null;

                  return (
                    <Step key={step.category}>
                      <StepLabel
                        optional={index === medicalCategory.length - 1 ? <Typography variant="caption">Last step</Typography> : null}
                        onClick={() => setActiveStep(step.data)}
                      >
                        {step.category}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              {activeStep === medicalCategory.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>All steps completed - you&apos;re finished</Typography>
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reset
                  </Button>
                </Paper>
              )}
            </Grid>
            <Grid item sm={7} className="historyDetail" sx={{ width: '75vw' }}>
              <SelectedHistory
                departmentId={departmentId}
                medicalCategory={medicalCategory}
                activeStep={activeStep}
                patientHistory={patientHistory}
                setPatientHistory={setPatientHistory}
                allMedicalProblems={allMedicalProblems}
                setAllMedicalProblems={setAllMedicalProblems}
                allFamilyProblems={allFamilyProblems}
                setAllFamilyProblems={setAllFamilyProblems}
                allDrugHistory={allDrugHistory}
                setAllDrugHistory={setAllDrugHistory}
                allLifeStyle={allLifeStyle}
                allGynac={allGynac}
                allObstetric={allObstetric}
                setAllObstetric={setAllObstetric}
                setAllGynac={setAllGynac}
                allOther={allOther}
                setAllOther={setAllOther}
                allPediatric={allPediatric}
                setAllPediatric={setAllPediatric}
                allNutritional={allNutritional}
                setAllNutritional={setAllNutritional}
                setAllLifeStyle={setAllLifeStyle}
                allAllergies={allAllergies}
                setAllAllergies={setAllAllergies}
                allProcedure={allProcedure}
                setAllProcedure={setAllProcedure}
                getAllMasterData={getAllMasterData}
                isFemale={isFemale}
                isPed={isPed}
              />
            </Grid>
          </Grid>
          <Grid item md={2}>
            {!showDataIsEmpty && (
              <Box className="selectedPtCategory ptHistory" style={{ width: '16vw' }}>
                <Box
                  className="selectedPtCategory ptHistory"
                  style={{ width: '100%' }}
                  display="flex"
                  flexDirection="column"
                  gap={4}
                  boxShadow={3}
                  borderRadius={2}
                  p={3}
                  sx={{
                    height: { sm: '60vh', md: '100vh' }, // or adjust as needed
                    overflow: 'auto'
                    // or adjust as needed
                  }}
                >
                  <Box>
                    {Array.isArray(allMedicalProblems) &&
                      Array.isArray(patientShowData?.medicalProblems) &&
                      patientShowData?.medicalProblems?.length > 0 && (
                        <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                          <span className="head">Past History: </span>

                          <Box>
                            <IconButton size="small" color="error" sx={{ p: 0.25 }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ p: 0.25 }}
                              onClick={() => {
                                setOpenEditPopup(true);
                                setOpenEditHistory({ pastHistory: true });
                              }}
                            >
                              <EditIcon fontSize="small" sx={{ color: 'blue' }} />
                            </IconButton>
                          </Box>
                          {allMedicalProblems.map((medicalProblem, inx) => {
                            // Find the corresponding problem in patientShowData
                            const patientProblem = patientShowData?.medicalProblems.find((p) => p._id === medicalProblem._id);
                            return (
                              <span key={inx}>
                                <b>
                                  {medicalProblem.problem} - {patientProblem ? patientProblem.having : 'No'}
                                  <Box></Box>
                                </b>{' '}
                                {patientProblem?.having === 'Yes' && <span>(Since: {patientProblem.since?.since || 'N/A'})</span>}
                              </span>
                            );
                          })}
                        </Box>
                      )}
                  </Box>
                  <Box>
                    {Array.isArray(allFamilyProblems) &&
                      Array.isArray(patientShowData?.familyHistory) &&
                      patientShowData?.familyHistory?.length > 0 && (
                        <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                          <span className="head">Family History: </span>

                          {allFamilyProblems?.map((familyProblem, inx) => {
                            // Find if the problem exists in patientShowData.familyHistory
                            const patientFamilyProblem = patientShowData.familyHistory.find((p) => p._id === familyProblem._id);

                            return (
                              <span key={inx}>
                                <b>{familyProblem.problem}</b> -{' '}
                                {patientFamilyProblem ? (
                                  patientFamilyProblem.option === 'No' ? ( // Explicitly check for "No"
                                    <b>No</b>
                                  ) : Array.isArray(patientFamilyProblem.familyMember) ? (
                                    patientFamilyProblem.familyMember.map((vv, inxx) => (
                                      <span style={{ display: 'inline' }} key={inxx}>
                                        <b>{patientFamilyProblem.option}</b> ( {vv.memberRelation} ) (Since-{vv.duration?.since || 'N/A'})
                                        {inxx !== patientFamilyProblem.familyMember.length - 1 && ', '}
                                      </span>
                                    ))
                                  ) : (
                                    <b>{patientFamilyProblem.option}</b>
                                  )
                                ) : (
                                  <b>No</b>
                                )}
                              </span>
                            );
                          })}
                        </Box>
                      )}
                  </Box>

                  <Box>
                    {patientShowData?.lifeStyle?.length > 0 && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Personal History:</span>
                        {patientShowData.lifeStyle.map((v, inx) => (
                          <span key={inx}>
                            <b>{v.problem.trim()}</b> -{' '}
                            {v.value
                              ? v.answerType === 'Calender'
                                ? (() => {
                                    const dateParts = v.value.split('-');
                                    return dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : v.value;
                                  })()
                                : v.value
                              : v.objective?.length > 0
                                ? v.objective.map((vv, indx) => (
                                    <span key={indx}>
                                      {vv.data}{' '}
                                      {vv.innerData?.length > 0 && (
                                        <span>
                                          (
                                          {vv.innerData.map((vi, vinx) => (
                                            <span key={vinx}>
                                              {vi.data}
                                              {vinx < vv.innerData.length - 1 && ', '}
                                            </span>
                                          ))}
                                          )
                                        </span>
                                      )}
                                      {indx < v.objective.length - 1 && ', '}
                                    </span>
                                  ))
                                : 'No details available'}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    {patientShowData?.allergies?.having && (
                      <>
                        <Box
                          className="detailHistory"
                          style={{
                            border: patientShowData?.allergies.having !== 'No' ? 'none' : undefined
                          }}
                        >
                          <span className="head">Allergies: </span>
                          {patientShowData?.allergies.having && (
                            <b style={{ marginRight: '10px' }}>
                              {patientShowData?.allergies.having}
                              {['general', 'food', 'drug'].some((type) => patientShowData?.allergies.which?.[type]?.length > 0) && ', '}
                            </b>
                          )}
                        </Box>

                        {patientShowData?.allergies.having !== 'No' && (
                          <Box className="innerdetailHistory">
                            {['general', 'food', 'drug'].map((type) =>
                              patientShowData?.allergies.which?.[type]?.length > 0 ? (
                                <div key={type} style={{ display: 'inline' }}>
                                  <p style={{ fontWeight: '700', marginBottom: '5px' }}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)} Allergies:
                                  </p>
                                  {patientShowData?.allergies.which[type].map((v, ind) => (
                                    <li key={ind} style={{ marginLeft: '10px' }}>
                                      <span style={{ fontWeight: '600' }}>{v.allergyName}</span> - Since: {v.since?.since ?? 'Unknown'}
                                    </li>
                                  ))}
                                </div>
                              ) : null
                            )}

                            {patientShowData?.allergies.which?.other && (
                              <div style={{ marginTop: '10px' }}>
                                <b>Other:</b> {patientShowData?.allergies.which.other}
                              </div>
                            )}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>

                  <Box>
                    {patientShowData?.procedure?.having && (
                      <>
                        <Box
                          style={{
                            border: patientShowData.procedure.having !== 'No' ? 'none' : ''
                          }}
                          className="detailHistory"
                        >
                          <span className="head">Procedure: </span>
                          {patientShowData.procedure.having !== undefined && (
                            <b style={{ marginRight: '10px' }}>
                              {patientShowData.procedure.having}
                              {patientShowData.procedure.which?.length > 0 && ', '}
                            </b>
                          )}
                        </Box>
                        {patientShowData.procedure.having !== 'No' && (
                          <Box className="innerdetailHistory">
                            {patientShowData.procedure.which?.map((v, ind) => (
                              <div key={ind} style={{ display: 'inline' }}>
                                <b>{v.surgery}</b> - {v.when?.since || 'Unknown'}
                              </div>
                            ))}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>

                  <Box>
                    {patientShowData?.gynac?.length > 0 && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Gynac History: </span>
                        {patientShowData.gynac.map((v, inx) => (
                          <span key={inx}>
                            <b>{v.problem.trim()}</b> -{' '}
                            {v.value
                              ? v.answerType === 'Calender'
                                ? (() => {
                                    const dateParts = v.value.split('-');
                                    return dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : v.value;
                                  })()
                                : v.value
                              : v.objective?.length > 0
                                ? v.objective.map((vv, indx) => (
                                    <span key={indx}>
                                      {vv.data}{' '}
                                      {vv.innerData?.length > 0 && (
                                        <span>
                                          (
                                          {vv.innerData.map((vi, vinx) => (
                                            <span key={vinx}>
                                              {vi.data}
                                              {vinx < vv.innerData.length - 1 && ', '}
                                            </span>
                                          ))}
                                          )
                                        </span>
                                      )}
                                      {indx < v.objective.length - 1 && ', '}
                                    </span>
                                  ))
                                : 'No details available'}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box>
                    {patientShowData?.obstetric?.length > 0 && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Obstetric History: </span>
                        {patientShowData?.obstetric.map((v, inx) => (
                          <span key={inx}>
                            <b>{v.problem}</b> -{' '}
                            {v.value ? (
                              v.answerType === 'Calender' ? (
                                <>
                                  {(() => {
                                    const [year, month, day] = v.value.split('-');
                                    return `${day}-${month}-${year}`;
                                  })()}
                                </>
                              ) : (
                                v.value
                              )
                            ) : (
                              v.objective?.map((vv, indx) => (
                                <span key={indx}>
                                  {vv.data}{' '}
                                  {vv.innerData?.length > 0 && (
                                    <span>
                                      (
                                      {vv.innerData.map((vi, vinx) => (
                                        <span key={vinx}>
                                          {vi.data}
                                          {vinx < vv.innerData.length - 1 && ', '}
                                        </span>
                                      ))}
                                      )
                                    </span>
                                  )}
                                  {indx < v.objective.length - 1 && ', '}
                                </span>
                              ))
                            )}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    {patientShowData?.pediatric?.length > 0 && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Pediatric History: </span>
                        {patientShowData.pediatric.map((v, inx) => (
                          <span key={inx}>
                            <b>{v.problem}</b> -{' '}
                            {v.value ? (
                              v.answerType === 'Calender' ? (
                                <>
                                  {(() => {
                                    const [year, month, day] = v.value.split('-');
                                    return `${day}-${month}-${year}`;
                                  })()}
                                </>
                              ) : (
                                v.value
                              )
                            ) : (
                              v.objective?.map((vv, indx) => (
                                <span key={indx}>
                                  {vv.data}{' '}
                                  {vv.innerData?.length > 0 && (
                                    <span>
                                      (
                                      {vv.innerData.map((vi, vinx) => (
                                        <span key={vinx}>
                                          {vi.data}
                                          {vinx < vv.innerData.length - 1 && ', '}
                                        </span>
                                      ))}
                                      )
                                    </span>
                                  )}
                                  {indx < v.objective.length - 1 && ', '}
                                </span>
                              ))
                            )}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    {patientShowData?.nutritional?.length > 0 && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Nutritional History: </span>
                        {patientShowData.nutritional.map((v, inx) => (
                          <span key={inx}>
                            <b>{v.problem}</b> -{' '}
                            {v.value ? (
                              v.answerType === 'Calender' ? (
                                <>
                                  {(() => {
                                    const [year, month, day] = v.value.split('-');
                                    return `${day}-${month}-${year}`;
                                  })()}
                                </>
                              ) : (
                                v.value
                              )
                            ) : (
                              v.objective?.map((vv, indx) => (
                                <span key={indx}>
                                  {vv.data}{' '}
                                  {vv.innerData?.length > 0 && (
                                    <span>
                                      (
                                      {vv.innerData.map((vi, vinx) => (
                                        <span key={vinx}>
                                          {vi.data}
                                          {vinx < vv.innerData.length - 1 && ', '}
                                        </span>
                                      ))}
                                      )
                                    </span>
                                  )}
                                  {indx < v.objective.length - 1 && ', '}
                                </span>
                              ))
                            )}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box>
                    {patientShowData?.drugHistory?.some((obj) => obj.option === 'Yes') && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Drug History: </span>
                        {patientShowData.drugHistory.map((p, inx) =>
                          p.option === 'Yes' ? (
                            <span key={inx}>
                              <b>{p.problem}</b> - Since: {typeof p.since === 'object' && p.since.since ? p.since.since : 'Unknown'}
                            </span>
                          ) : null
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    {patientShowData?.other?.length > 0 && (
                      <Box className="detailHistory" style={{ flexDirection: 'column' }}>
                        <span className="head">Other History: </span>
                        {patientShowData.other.map((v, inx) => (
                          <span key={inx}>
                            <b>{v.problem.trim()}</b> -{' '}
                            {v.value
                              ? v.answerType === 'Calender'
                                ? (() => {
                                    const dateParts = v.value.split('-');
                                    return dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : v.value;
                                  })()
                                : v.value
                              : v.objective?.length > 0
                                ? v.objective.map((vv, indx) => (
                                    <span key={indx}>
                                      {vv.data}{' '}
                                      {vv.innerData?.length > 0 && (
                                        <span>
                                          (
                                          {vv.innerData.map((vi, vinx) => (
                                            <span key={vinx}>
                                              {vi.data}
                                              {vinx < vv.innerData.length - 1 && ', '}
                                            </span>
                                          ))}
                                          )
                                        </span>
                                      )}
                                      {indx < v.objective.length - 1 && ', '}
                                    </span>
                                  ))
                                : 'No details available'}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <ToastContainer />
    </>
  );
};

export default History;

import React, { useEffect } from 'react';
import { useState } from 'react';
import MedicalProblems from './MedicalProblems';
import FamilyHistory from './FamilyHistory';
import LifeStyle from './LifeStyle';
import Allergies from './Allergies';
import Procedure from './Procedure';
import Other from './Other';
import Gynac from './Gynac';
import Nutritional from './Nutritional';
import Pediatric from './Pediatric';
import DrugHistory from './DrugHistory';
import Obstetric from './Obstetric';
import { get } from 'api/api';
import { Box } from '@mui/material';

const SelectedHistory = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allMedicalProblems,
  setAllMedicalProblems,
  allLifeStyle,
  setAllLifeStyle,
  allGynac,
  setAllGynac,
  allObstetric,
  setAllObstetric,
  allPediatric,
  setAllPediatric,
  allNutritional,
  setAllNutritional,
  allAllergies,
  setAllAllergies,
  allProcedure,
  setAllProcedure,
  getAllMasterData,
  allDrugHistory,
  setAllDrugHistory,
  isFemale,
  isPed,
  setAllFamilyProblems,
  allFamilyProblems,
  allOther,
  setAllOther
}) => {
  // eslint-disable-next-line
  // const [since, setSince] = useState([
  //   "Recently Diagnosed",
  //   "1 Week",
  //   "2 Week",
  //   "3 Week",
  //   "4 Week",
  //   "1 Month",
  //   "2 Month",
  //   "3 Month",
  //   "6 Month",
  //   "8 Month",
  //   "10 Month",
  //   "1 Year",
  //   "2 Year",
  //   "3 Year",
  //   "4 Year",
  //   "5 Year",
  //   "6 Year",
  //   "7 Year",
  //   "8 Year",
  //   "9 Year",
  //   "10 Year",
  //   ">10 Year",
  // ]);

  const [since, setSince] = useState([]);

  // eslint-disable-next-line
  const [procedureDone, setProcedureDone] = useState([
    '1 Week',
    '2 Week',
    '3 Week',
    '4 Week',
    '1 Month',
    '2 Month',
    '3 Month',
    '6 Month',
    '8 Month',
    '10 Month',
    '1 Year',
    '2 Year',
    '3 Year',
    '4 Year',
    '5 Year',
    '6 Year',
    '7 Year',
    '8 Year',
    '9 Year',
    '10 Year',
    '>10 Year'
  ]);

  const sinceFunction = async () => {
    const sinceData = await get('since-master');
    setSince(sinceData.data);
    // console.log("sinceData",sinceData.data);
  };
  useEffect(() => {
    sinceFunction();
  }, []);

  return (
    <Box >
      {activeStep === 0 && (
        <MedicalProblems
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allMedicalProblems={allMedicalProblems}
          setAllMedicalProblems={setAllMedicalProblems}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
        />
      )}

      {activeStep === 1 && (
        <FamilyHistory
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          setAllFamilyProblems={setAllFamilyProblems}
          allFamilyProblems={allFamilyProblems}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
        />
      )}

      {activeStep === 2 && (
        <LifeStyle
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allLifeStyle={allLifeStyle}
          setAllLifeStyle={setAllLifeStyle}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
        />
      )}

      {activeStep === 3 && (
        <Allergies
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allAllergies={allAllergies}
          setAllAllergies={setAllAllergies}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
        />
      )}

      {activeStep === 4 && (
        <Procedure
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allProcedure={allProcedure}
          setAllProcedure={setAllProcedure}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
        />
      )}

      {activeStep === 5 && (
        <Gynac
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allGynac={allGynac}
          setAllGynac={setAllGynac}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
          isFemale={isFemale}
          isPed={isPed}
        />
      )}

      {activeStep === 6 && (
        <Obstetric
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allObstetric={allObstetric}
          setAllObstetric={setAllObstetric}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
          isFemale={isFemale}
          isPed={isPed}
        />
      )}

      {activeStep === 7 && (
        <Pediatric
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allPediatric={allPediatric}
          setAllPediatric={setAllPediatric}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
          isFemale={isFemale}
          isPed={isPed}
        />
      )}

      {activeStep === 8 && (
        <Nutritional
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allNutritional={allNutritional}
          setAllNutritional={setAllNutritional}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
          isFemale={isFemale}
          isPed={isPed}
        />
      )}

      {activeStep === 9 && (
        <DrugHistory
          departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allDrugHistory={allDrugHistory}
          setAllDrugHistory={setAllDrugHistory}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
          isFemale={isFemale}
          isPed={isPed}
        />
      )}


    
      {/* {activeStep === 10 && (
        <Other
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          isFemale={isFemale}
          isPed={isPed}
        /> 
      )} */}
      {activeStep === 10 && (
        <Other
         departmentId={departmentId}
          patientHistory={patientHistory}
          setPatientHistory={setPatientHistory}
          allGynac={allGynac}
          setAllGynac={setAllGynac}
          since={since}
          sinceFunction={sinceFunction}
          activeStep={activeStep}
          medicalCategory={medicalCategory}
          getAllMasterData={getAllMasterData}
          isFemale={isFemale}
          isPed={isPed}
          allOther={allOther}
          setAllOther={setAllOther}
        />
       
      )}
    </Box>
  );
};

export default SelectedHistory;

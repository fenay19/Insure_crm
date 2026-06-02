// import { Box } from '@mui/material'
// import { get } from 'api/api'
// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'

// const PrintFinalDiagnosis = ({ patientFinalDiagnosis }) => {
//   const [finalDiagnosisData, setFinalDiagnosisData] = useState({})
//   const selectedPatient = useSelector(state => state.patient.selectedPatient)
//  const getFinalDiagnosisData = async () => {
//   try {
//     // Make the API call to fetch final diagnosis data
//     const response = await get(
//       `patient-final-diagnosis/final-diagnosis/${selectedPatient?.consultantId}/${selectedPatient?._id}`
//     );

//     // If the API call is successful and data is returned, update the state
//     if (response.success) {
//       setFinalDiagnosisData(response.finalDiagnosis);
//     } else {
//       // Handle the case where the API call is successful but no data is returned
//       console.error("Failed to fetch final diagnosis:", response.message || "No data returned");
//       // Optionally, you can set an error state or show a notification to the user
//     }
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Error fetching final diagnosis:", error);

//     // Optionally, you can set an error state or show a notification to the user
//     // Example: setErrorState("Failed to fetch final diagnosis. Please try again later.");
//   }
// };


//   useEffect(() => {
//     if(selectedPatient?.consultantId && selectedPatient?._id) {
//       getFinalDiagnosisData()
//     }
//   }, [selectedPatient?.consultantId, selectedPatient?._id])


//   return (
//     <Box className='notranslate' sx={{ marginTop: '10px' }}>
//       <div className='printHead '>
//         <h5>Final Diagnosis: </h5>
//       </div>
//       <div className='printContent' style={{ marginLeft: '10px' }}>
//         {finalDiagnosisData?.diagnosis?.map((v, inx) => {
//           return (
//             <li key={inx}>
//               <span>
//                 {v.diagnosis}
//                 {v.code !== '' && <>({v.code})</>}
//                 {inx !== patientFinalDiagnosis.length - 1 && <span style={{ marginRight: '5px' }}>, </span>}
//               </span>
//             </li>
//           )
//         })}
//       </div>
//     </Box>
//   )
// }

// export default PrintFinalDiagnosis
import { Box } from '@mui/material';
import { get } from 'api/api';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PrintFinalDiagnosis = ({ patientFinalDiagnosis }) => {
  const [finalDiagnosisData, setFinalDiagnosisData] = useState({});
  const selectedPatient = useSelector(state => state.patient.selectedPatient);

  const getFinalDiagnosisData = async () => {
    try {
      const response = await get(
        `patient-final-diagnosis/final-diagnosis/${selectedPatient?.consultantId}/${selectedPatient?._id}`
      );

      if (response?.success) {
        setFinalDiagnosisData(response?.finalDiagnosis);
      } else {
        console.error("Failed to fetch final diagnosis:", response?.message || "No data returned");
      }
    } catch (error) {
      console.error("Error fetching final diagnosis:", error);
    }
  };

  useEffect(() => {
    if (selectedPatient?.consultantId && selectedPatient?._id) {
      getFinalDiagnosisData();
    }
  }, [selectedPatient?.consultantId, selectedPatient?._id]);

  const diagnosisList = finalDiagnosisData?.diagnosis || [];

  return (
    <Box className='notranslate' sx={{ marginTop: '10px' }}>
      <div className='printHead'>
        <h5>Final Diagnosis:</h5>
      </div>

      {diagnosisList?.length > 0 ? (
        <div className='printContent' style={{ marginLeft: '10px' }}>
          <ul>
            {diagnosisList.map((v, inx) => (
              <li key={inx}>
                <span>
                  {v?.diagnosis || "Unnamed Diagnosis"}
                  {v?.code?.trim() && <> ({v.code})</>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='printContent' style={{ marginLeft: '10px' }}>
          <i>No final diagnosis found.</i>
        </div>
      )}
    </Box>
  );
};

export default PrintFinalDiagnosis;

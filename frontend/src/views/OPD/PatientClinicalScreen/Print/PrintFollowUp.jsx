// import { Box } from '@mui/material'
// import { get } from 'api/api'
// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'

// const PrintFollowUp = ({ followUp }) => {
//   const [followUpData, setFollowUpData] = useState({})
//   const selectedPatient = useSelector(state => state.patient.selectedPatient)

//   const getFollowUpPatient = async () => {
//     try {
//       const response = await get(
//         `patient-followup/followup/${selectedPatient?.consultantId}/${selectedPatient?._id}`
//       );

//       if (!response || !response.followUp) {
//         throw new Error('No follow-up data received');
//       }

//       setFollowUpData(response.followUp);
//     } catch (error) {
//       console.error('Error fetching follow-up patient data:', error);
//     }
//   };

//   useEffect(() => {
//     if (selectedPatient?.consultantId && selectedPatient?._id) {
//       getFollowUpPatient()
//     }
//   }, [selectedPatient?.consultantId, selectedPatient?._id])

//   console.log('state followu', followUpData)

//   return (
//     <Box className='printDataSectionMargin'>
//       <Box className={'subSectionPrintColumn'}>
//         <div className='printHead notranslate'>
//           <h5>Follow Up: </h5>
//         </div>

//         <div className='printContent' style={{ marginLeft: '10px' }}>

//             <div>
//               <div className='notranslate'>
//                 <b>Date: </b>
//                 {followUpData?.followUp?.split('-')[2]}-{followUpData?.followUp?.split('-')[1]}-{followUpData?.followUp?.split('-')[0]}
//               </div>
//               {followUpData?.advice !== '' && (
//                 <span>
//                   <b className='notranslate'>Advice: </b>
//                   {followUpData?.advice}
//                 </span>
//               )}
//             </div>

//         </div>
//       </Box>
//     </Box>
//   )
// }

// export default PrintFollowUp
import { Box } from '@mui/material';
import { get } from 'api/api';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PrintFollowUp = ({ followUp }) => {
  const [followUpData, setFollowUpData] = useState({});
  const selectedPatient = useSelector((state) => state.patient.selectedPatient);

  const getFollowUpPatient = async () => {
    try {
      const response = await get(`patient-followup/followup/${selectedPatient?.consultantId}/${selectedPatient?._id}`);

      if (response?.followUp) {
        setFollowUpData(response.followUp);
      } else {
        console.warn('No follow-up data received');
      }
    } catch (error) {
      console.error('Error fetching follow-up patient data:', error);
    }
  };

  useEffect(() => {
    if (selectedPatient?.consultantId && selectedPatient?._id) {
      getFollowUpPatient();
    }
  }, [selectedPatient?.consultantId, selectedPatient?._id]);

  const followUpDate = followUpData?.followUp;
  const advice = followUpData?.advice;

  // Convert date safely from YYYY-MM-DD to DD-MM-YYYY
  const formattedDate = followUpDate ? followUpDate.split('-')?.reverse()?.join('-') : 'N/A';

  return (
    <Box className="printDataSectionMargin">
      <Box className="subSectionPrintColumn">
        <div className="printHead notranslate">
          <h5>Follow Up:</h5>
        </div>

        <div className="printContent" style={{ marginLeft: '10px' }}>
          <div className="notranslate">
            <b>Date: </b>
            {formattedDate}
          </div>

          {advice?.trim() && (
            <span className="notranslate">
              <b>Advice: </b>
              {advice}
            </span>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default PrintFollowUp;

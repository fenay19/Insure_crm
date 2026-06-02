// import { Box, Checkbox, Grid } from '@mui/material'
// import { fontWeight } from '@mui/system'
// import { get } from 'api/api'
// import { useState, useEffect } from 'react'
// import { useSelector } from 'react-redux'

// const PrintExamination = ({ patientExamination }) => {
//   const [patientExaminationData, setPatientExaminationData] = useState({})
//   const selectedPatient = useSelector(state => state.patient.selectedPatient)

//   const getPatientExamination = async () => {
//     try {
//       const response = await get(`patient-examination/examination/${selectedPatient?.consultantId}/${selectedPatient?._id}`)

//       if (response.success) {
//         setPatientExaminationData(response.patientExaminationData)
//       } else {
//         console.error('Failed to fetch patient examination:', response.message || 'Unknown error')
//       }
//     } catch (error) {
//       console.error('Error fetching patient examination:', error)
//     }
//   }

//   useEffect(() => {
//     if (selectedPatient?.consultantId && selectedPatient?._id) {
//       getPatientExamination()
//     }
//   }, [selectedPatient?.consultantId, selectedPatient?._id])

//   console.log('this is state', patientExaminationData)

//   return (
//     <Box className='printDataSectionMargin notranslate'>
//       <Box
//         className={
//           patientExaminationData.general !== undefined && patientExaminationData.general.length > 0
//             ? 'subSectionPrintColumn'
//             : 'subSectionPrint'
//         }
//         style={{ marginBottom: '5px' }}
//       >
//         <div className='printHead '>
//           <h5>General Examination: </h5>
//         </div>

//         <div className='printContent' style={{ marginLeft: '10px', width: '100%' }}>
//           {patientExaminationData?.general && Array.isArray(patientExaminationData.general) && (
//             <>
//               {patientExaminationData.general.length > 0 ? (
//                 <>
//                   {patientExaminationData.general.map((vv, ind) => (
//                     <Box key={ind}>
//                       <div>
//                         <h5 style={{ fontWeight: 'bold' }}>{vv.disorder}: </h5>
//                       </div>

//                       <Grid container spacing={2} style={{ marginTop: '0', marginBottom: '10px' }}>
//                         {vv.subDisorder.map((v, inx) => (
//                           <Grid item xs={12} sm={6} md={4} lg={3} key={inx} style={{ marginTop: '-16px' }}>
//                             <b style={{ marginRight: '5px' }}>{v.name}: </b>
//                             <span>
//                               {v.answerType !== 'Objective' ? (
//                                 v.answerType === 'Calender' ? (
//                                   <>
//                                     {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
//                                   </>
//                                 ) : (
//                                   v.value
//                                 )
//                               ) : (
//                                 v.objective.length > 0 &&
//                                 v.objective.map((vvv, indx) => (
//                                   <span key={indx}>
//                                     {vvv.data}{' '}
//                                     {vvv.innerData && vvv.innerData.length > 0 && (
//                                       <span>
//                                         (
//                                         {vvv.innerData.map((vi, vinx) => (
//                                           <span key={vinx}>
//                                             {vi.data}
//                                             {vvv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
//                                           </span>
//                                         ))}
//                                         )
//                                       </span>
//                                     )}{' '}
//                                     {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
//                                   </span>
//                                 ))
//                               )}
//                             </span>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Box>
//                   ))}
//                 </>
//               ) : (
//                 <p style={{ marginTop: '-8px' }}>NAD</p>
//               )}

//               {patientExaminationData.general.length > 0 && <p>Other NAD</p>}
//             </>
//           )}
//         </div>
//       </Box>

//       <Box
//         className={patientExaminationData?.local && patientExaminationData.local.length > 0 ? 'subSectionPrintColumn' : 'subSectionPrint'}
//       >
//         <div className='printHead'>
//           <h5>Local Examination: </h5>
//         </div>

//         <div className='printContent' style={{ marginLeft: '10px', width: '100%' }}>
//           {patientExaminationData?.local && Array.isArray(patientExaminationData.local) && (
//             <>
//               {patientExaminationData.local.length > 0 ? (
//                 <>
//                   {patientExaminationData.local.map((vv, ind) => (
//                     <Box key={ind}>
//                       <div>
//                         <h5 style={{ fontWeight: 'bold' }}>{vv.disorder}: </h5>
//                       </div>

//                       <Grid container spacing={2} style={{ marginTop: '0', marginBottom: '10px' }}>
//                         {vv.subDisorder?.map((v, inx) => (
//                           <Grid item xs={12} sm={6} md={4} lg={3} key={inx} style={{ marginTop: '-16px' }}>
//                             <b style={{ marginRight: '5px' }}>{v.name}: </b>
//                             <span>
//                               {v.answerType !== 'Objective' ? (
//                                 v.answerType === 'Calender' ? (
//                                   <>
//                                     {v.value?.split('-')[2]}-{v.value?.split('-')[1]}-{v.value?.split('-')[0]}
//                                   </>
//                                 ) : (
//                                   v.value
//                                 )
//                               ) : (
//                                 v.objective?.length > 0 &&
//                                 v.objective.map((vvv, indx) => (
//                                   <span key={indx}>
//                                     {vvv.data}{' '}
//                                     {vvv.innerData?.length > 0 && (
//                                       <span>
//                                         (
//                                         {vvv.innerData.map((vi, vinx) => (
//                                           <span key={vinx}>
//                                             {vi.data}
//                                             {vvv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
//                                           </span>
//                                         ))}
//                                         )
//                                       </span>
//                                     )}{' '}
//                                     {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
//                                   </span>
//                                 ))
//                               )}
//                             </span>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Box>
//                   ))}
//                 </>
//               ) : (
//                 <p style={{ marginTop: '-8px' }}>NAD</p>
//               )}

//               {patientExaminationData.local.length > 0 && <p>Other NAD</p>}
//             </>
//           )}
//         </div>
//       </Box>

//       <Box
//         className={
//           patientExaminationData?.systematic && patientExaminationData.systematic.length > 0 ? 'subSectionPrintColumn' : 'subSectionPrint'
//         }
//       >
//         <div className='printHead'>
//           <h5>Systemic Examination: </h5>
//         </div>

//         <div className='printContent' style={{ marginLeft: '10px', width: '100%' }}>
//           {patientExaminationData?.systematic && Array.isArray(patientExaminationData.systematic) && (
//             <>
//               {patientExaminationData.systematic.length > 0 ? (
//                 <>
//                   {patientExaminationData.systematic.map((vv, ind) => (
//                     <Box key={ind}>
//                       <div>
//                         <h5 style={{ fontWeight: 'bold' }}>{vv.disorder}: </h5>
//                       </div>

//                       <Grid container spacing={2} style={{ marginTop: '0', marginBottom: '10px' }}>
//                         {vv.subDisorder?.map((v, inx) => (
//                           <Grid item xs={12} sm={6} md={4} lg={3} key={inx} style={{ marginTop: '-16px' }}>
//                             <b style={{ marginRight: '5px' }}>{v.name}: </b>
//                             <span>
//                               {v.answerType !== 'Objective' ? (
//                                 v.answerType === 'Calender' ? (
//                                   <>
//                                     {v.value?.split('-')[2]}-{v.value?.split('-')[1]}-{v.value?.split('-')[0]}
//                                   </>
//                                 ) : (
//                                   v.value
//                                 )
//                               ) : (
//                                 v.objective?.length > 0 &&
//                                 v.objective.map((vvv, indx) => (
//                                   <span key={indx}>
//                                     {vvv.data}{' '}
//                                     {vvv.innerData?.length > 0 && (
//                                       <span>
//                                         (
//                                         {vvv.innerData.map((vi, vinx) => (
//                                           <span key={vinx}>
//                                             {vi.data}
//                                             {vvv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
//                                           </span>
//                                         ))}
//                                         )
//                                       </span>
//                                     )}{' '}
//                                     {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
//                                   </span>
//                                 ))
//                               )}
//                             </span>
//                           </Grid>
//                         ))}
//                       </Grid>

//                       {vv.diagram && (
//                         <div className='systematicDiagram'>
//                           <img src={vv.diagram} style={{ width: '150px' }} alt='Diagram' />
//                         </div>
//                       )}
//                     </Box>
//                   ))}
//                 </>
//               ) : (
//                 <p style={{ marginTop: '-8px' }}>NAD</p>
//               )}

//               {patientExaminationData.systematic.length > 0 && <p>Other NAD</p>}
//             </>
//           )}
//         </div>
//       </Box>

//       <Box
//         className={
//           patientExaminationData.other !== undefined && patientExaminationData.other.length > 0 ? 'subSectionPrintColumn' : 'subSectionPrint'
//         }
//       >
//         <div className='printHead '>
//           <h5>Other Examination: </h5>
//         </div>
//         <div className='printContent' style={{ marginLeft: '10px' }}>
//           <div className='examData'>
//             {patientExaminationData.other !== undefined && (
//               <>
//                 {patientExaminationData.other.length > 0 ? (
//                   <>
//                     {patientExaminationData.other.map((vv, ind) => {
//                       return (
//                         <Box key={ind}>
//                           <div
//                             style={{
//                               display: 'grid',
//                               gridTemplateColumns: '120px 1fr',
//                               alignItems: 'start',
//                               marginBottom: '10px'
//                             }}
//                           >
//                             <h6
//                               style={{
//                                 marginRight: '5px',
//                                 whiteSpace: 'nowrap'
//                               }}
//                             >
//                               {vv.exam}:
//                             </h6>
//                             <span
//                               style={{
//                                 whiteSpace: 'pre-wrap',
//                                 wordBreak: 'break-word',
//                                 textAlign: 'justify'
//                               }}
//                             >
//                               {vv.notes}
//                             </span>
//                           </div>
//                         </Box>
//                       )
//                     })}
//                   </>
//                 ) : (
//                   <></>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </Box>
//     </Box>
//   )
// }

// export default PrintExamination
import { Box, Grid } from '@mui/material';
import { get } from 'api/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PrintExamination = () => {
  const [patientExaminationData, setPatientExaminationData] = useState({});
  const selectedPatient = useSelector(state => state.patient.selectedPatient);

  const getPatientExamination = async () => {
    try {
      const response = await get(`patient-examination/examination/${selectedPatient?.consultantId}/${selectedPatient?._id}`);
      if (response.success) {
        setPatientExaminationData(response.patientExaminationData);
      } else {
        console.error('Failed to fetch patient examination:', response.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching patient examination:', error);
    }
  };

  useEffect(() => {
    if (selectedPatient?.consultantId && selectedPatient?._id) {
      getPatientExamination();
    }
  }, [selectedPatient?.consultantId, selectedPatient?._id]);

  const renderSubDisorders = (subDisorders = []) =>
    subDisorders.map((v, idx) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={idx} style={{ marginTop: '-16px' }}>
        <b style={{ marginRight: '5px' }}>{v.name}:</b>
        <span>
          {v.answerType === 'Calender' && v.value
            ? v.value.split('-').reverse().join('-')
            : v.answerType !== 'Objective'
            ? v.value
            : v.objective?.map((obj, objIdx) => (
                <span key={objIdx}>
                  {obj.data}
                  {obj.innerData?.length > 0 && (
                    <span>
                      (
                      {obj.innerData.map((inner, innerIdx) => (
                        <span key={innerIdx}>
                          {inner.data}
                          {innerIdx < obj.innerData.length - 1 && ', '}
                        </span>
                      ))}
                      )
                    </span>
                  )}
                  {objIdx < v.objective.length - 1 && ', '}
                </span>
              ))}
        </span>
      </Grid>
    ));

  const renderExaminationSection = (title, sectionData = [], extraContent = null) => (
    <Box className={sectionData.length > 0 ? 'subSectionPrintColumn' : 'subSectionPrint'} style={{ marginBottom: '5px' }}>
      <div className='printHead'>
        <h5>{title}</h5>
      </div>
      <div className='printContent' style={{ marginLeft: '10px', width: '100%' }}>
        {sectionData.length > 0 ? (
          sectionData.map((item, idx) => (
            <Box key={idx}>
              <h5 style={{ fontWeight: 'bold' }}>{item.disorder}:</h5>
              <Grid container spacing={2} style={{ marginTop: '0', marginBottom: '10px' }}>
                {renderSubDisorders(item.subDisorder)}
              </Grid>
              {item.diagram && title.includes('Systemic') && (
                <div className='systematicDiagram'>
                  <img src={item.diagram} style={{ width: '150px' }} alt='Diagram' />
                </div>
              )}
            </Box>
          ))
        ) : (
          <p style={{ marginTop: '-8px' }}>NAD</p>
        )}
        {sectionData.length > 0 && <p>Other NAD</p>}
        {extraContent}
      </div>
    </Box>
  );

  const renderOtherExaminations = () => (
    <Box className={patientExaminationData.other?.length > 0 ? 'subSectionPrintColumn' : 'subSectionPrint'}>
      <div className='printHead'>
        <h5>Other Examination:</h5>
      </div>
      <div className='printContent' style={{ marginLeft: '10px' }}>
        <div className='examData'>
          {patientExaminationData.other?.map((vv, idx) => (
            <Box key={idx}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  alignItems: 'start',
                  marginBottom: '10px',
                }}
              >
                <h6 style={{ marginRight: '5px', whiteSpace: 'nowrap' }}>{vv.exam}:</h6>
                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'justify' }}>
                  {vv.notes}
                </span>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </Box>
  );

  return (
    <Box className='printDataSectionMargin notranslate'>
      {renderExaminationSection('General Examination:', patientExaminationData.general)}
      {renderExaminationSection('Local Examination:', patientExaminationData.local)}
      {renderExaminationSection('Systemic Examination:', patientExaminationData.systematic)}
      {renderOtherExaminations()}
    </Box>
  );
};

export default PrintExamination;

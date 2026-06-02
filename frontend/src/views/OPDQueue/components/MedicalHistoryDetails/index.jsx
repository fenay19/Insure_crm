// import React from 'react';
// import { Box, Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';

// const renderHistoryWithObjectives = (title, items) =>
//   items?.length > 0 && (
//     <Box>
//       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//         {title}
//       </Typography>
//       {items.map((item, index) => (
//         <Box key={index} sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//           {/* Problem Name */}
//           <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//             {item.problem}
//           </Typography>

//           {/* Display Value if Available */}
//           {item.value && <Chip label={`${item.value}`} sx={{ mt: 1, backgroundColor: '#e0e0e0' }} />}

//           {/* Objective Data and Inner Data Nested */}
//           {item.objective?.length > 0 && (
//             <Box sx={{ mt: 1 }}>
//               {item.objective.map((obj, objIndex) => (
//                 <Box key={objIndex} sx={{ mb: 1, p: 1, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
//                   <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                     {obj.data || 'N/A'}
//                   </Typography>

//                   {/* Inner Data Nested Inside Objective */}
//                   {obj.innerData?.length > 0 && (
//                     <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mt: 1 }}>
//                       {obj.innerData.map((inner, innerIndex) => (
//                         <Chip key={`${objIndex}-${innerIndex}`} label={`${inner.data || 'N/A'}`} sx={{ backgroundColor: '#ffcc80' }} />
//                       ))}
//                     </Stack>
//                   )}
//                 </Box>
//               ))}
//             </Box>
//           )}
//         </Box>
//       ))}
//     </Box>
//   );

// const PatientDetailsCard = ({ details }) => {
//   if (!details || Object.keys(details).length === 0) return null;

//   const renderHistory = (title, items, keyExtractor = (item) => item, isObject = false) =>
//     items?.length > 0 && (
//       <Box>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//           {title}
//         </Typography>
//         <Stack direction="row" flexWrap="wrap" spacing={1}>
//           {items.map((item, index) => (
//             <Chip
//               key={index}
//               label={isObject ? `${item.problem || item.surgery}: ${item.value || item.since?.since || ''}` : keyExtractor(item)}
//               sx={{ backgroundColor: '#e0e0e0' }}
//             />
//           ))}
//         </Stack>
//       </Box>
//     );

//   return (
//     <Card sx={{ maxWidth: 600, mx: 'auto', my: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
//       <CardContent>
//         <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, color: '#1976d2' }}>
//           Patient Medical History
//         </Typography>
//         <Divider />

//         {/* Past History */}
//         {renderHistory('Past History', details.medicalProblems, (item) => `${item.problem} (${item.since?.since || 'Unknown'})`, true)}

//         {/* Family History */}
//         {details.familyHistory?.length > 0 && (
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//               Family History
//             </Typography>
//             <Stack direction="row" flexWrap="wrap" spacing={1}>
//               {details.familyHistory.map((history, index) =>
//                 history.familyMember.map((member, idx) => (
//                   <Chip
//                     key={`${index}-${idx}`}
//                     label={`${member.memberRelation} had ${history.problem} (${member.duration?.since || 'Unknown'})`}
//                     sx={{ backgroundColor: '#e0e0e0' }}
//                   />
//                 ))
//               )}
//             </Stack>
//           </Box>
//         )}

//         {/* Personal History */}
//         {details.lifeStyle?.length > 0 && (
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//               Personal History
//             </Typography>
//             <Stack direction="row" flexWrap="wrap" spacing={1}>
//               {details.lifeStyle.map((habit, idx) => (
//                 <Chip
//                   key={idx}
//                   label={`${habit.habit} - ${habit.quantity || 'N/A'} (${habit.since?.since || 'Unknown'})`}
//                   sx={{ backgroundColor: '#e0e0e0' }}
//                 />
//               ))}
//             </Stack>
//           </Box>
//         )}

//         {/* Allergies */}
//         {details.allergies?.having === 'Yes' && (
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//               Allergies
//             </Typography>
//             <Stack direction="row" flexWrap="wrap" spacing={1}>
//               {details.allergies.which.general.map((allergy, idx) => (
//                 <Chip key={`general-${idx}`} label={`General: ${allergy}`} sx={{ backgroundColor: '#e0e0e0' }} />
//               ))}
//               {details.allergies.which.food.map((allergy, idx) => (
//                 <Chip key={`food-${idx}`} label={`Food: ${allergy}`} sx={{ backgroundColor: '#e0e0e0' }} />
//               ))}
//               {details.allergies.which.drug.map((allergy, idx) => (
//                 <Chip key={`drug-${idx}`} label={`Drug: ${allergy}`} sx={{ backgroundColor: '#e0e0e0' }} />
//               ))}
//               {details.allergies.which.other && details.allergies.which.other.trim() !== '' && (
//                 <Chip label={`Other: ${details.allergies.which.other}`} sx={{ backgroundColor: '#e0e0e0' }} />
//               )}
//             </Stack>
//           </Box>
//         )}

//         {details.procedure?.having === 'Yes' && (
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//               Procedure
//             </Typography>
//             <Stack direction="row" flexWrap="wrap" spacing={1}>
//               {details.procedure.which.map((surgery, idx) => (
//                 <Chip key={idx} label={`${surgery.surgery} (${surgery.when?.since || 'Unknown'})`} sx={{ backgroundColor: '#e0e0e0' }} />
//               ))}
//             </Stack>
//           </Box>
//         )}

//         {/* Gynac History */}
//         {renderHistory('Gynac History', details.gynac, (item) => `${item.problem}: ${item.value || 'N/A'}`, true)}

//         {/* Obstetric History */}
//         {renderHistory('Obstetric History', details.obstetric, (item) => `${item.problem}: ${item.value || 'N/A'}`, true)}

//         {/* Pediatric History */}
//         {/* {renderHistory("Pediatric History", details.pediatric, (item) => `${item.problem}`, true)} */}
//         {/* Pediatric History with Objectives */}
//         {renderHistoryWithObjectives('Pediatric History', details.pediatric)}

//         {/* Nutritional History */}
//         {renderHistory('Nutritional History', details.nutritional, (item) => `${item.problem}`, true)}

//         {/* Drug History */}
//         {renderHistory('Drug History', details.drugHistory, (item) => `${item.problem} (${item.since?.since || 'Unknown'})`, true)}

//         {/* Other Notes */}
//         {details.other && details.other.trim() !== '' && (
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//               Other History
//             </Typography>
//             <Typography variant="body2">{details.other}</Typography>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PatientDetailsCard;

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';

// Helper function to render history with problem and value
const renderHistory = (title, items, formatItem) => {
  if (!items || items.length === 0) return null; // Ensure items exist and aren't empty

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
        {title}
      </Typography>
      {items.map((item, index) => (
        <Typography key={index} variant="body2" sx={{ mt: 1 }}>
          {formatItem(item)}
        </Typography>
      ))}
    </Box>
  );
};

const renderProcedures = (procedures) => {
  if (!procedures) return null; // Ensure procedures exist

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
        Procedures
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Having:</strong> {procedures.having}
      </Typography>
      {procedures.which?.map((procedure, index) => (
        <Box key={index} sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            <strong>Surgery:</strong> {procedure.surgery}
          </Typography>
          <Typography variant="body2">
            <strong>When:</strong> {procedure.when?.since || 'Unknown'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const renderPediatricHistory = (pediatricHistory) => {
  if (!pediatricHistory || pediatricHistory.length === 0) return null; // Ensure data exists

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
        Pediatric History
      </Typography>
      {pediatricHistory.map((item, index) => (
        <Box key={index} sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Problem:</strong> {item.problem}
          </Typography>

          {item.answerType === 'Objective' && item.objective?.length > 0 && (
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                <strong>Objective Data:</strong>
              </Typography>
              {item.objective.map((obj, idx) => (
                <Box key={idx} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Data:</strong> {obj.data}
                  </Typography>
                  {obj.innerData?.length > 0 && (
                    <Box sx={{ pl: 2 }}>
                      {obj.innerData.map((inner, innerIdx) => (
                        <Typography key={innerIdx} variant="body2">
                          <strong>Inner Data:</strong> {inner.data}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

const PatientDetailsCard = ({ details }) => {
  if (!details || Object.keys(details).length === 0) return null; // Ensure details are passed

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', my: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, color: '#1976d2' }}>
          Patient Medical History
        </Typography>
        <Divider />

        {/* Past History */}
        {renderHistory('Past History', details.medicalProblems, (item) => `${item.problem}: Since ${item.since?.since || 'Unknown'}`)}

        {/* Family History */}

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Family History
          </Typography>
          {details?.familyHistory?.map((history, index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {history.problem}:
                </Typography>
                {history.familyMember.map((member, idx) => (
                  <Typography key={idx} variant="body2">
                    {member.memberRelation} {member.duration?.since ? `(Since: ${member.duration.since})` : '(Since: Unknown)'}
                    {idx < history.familyMember.length - 1 ? ',' : ''}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        {/* Personal History */}
        {details?.lifeStyle?.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Personal History
            </Typography>
            {details.lifeStyle.map((habit, idx) => (
              <Box key={idx} sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {habit.habit}:
                  </Typography>
                  <Typography variant="body2">
                    {habit.option || 'N/A'} {habit.since?.since ? `(Since: ${habit.since.since})` : '(Since: Unknown)'}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        )}

        {/* Allergies */}
        {/* {renderAllergies(details.allergies)} */}

        {/* Procedures */}
        {renderProcedures(details.procedures)}

        {/* Pediatric History */}
        {renderPediatricHistory(details.pediatricHistory)}
      </CardContent>
    </Card>
  );
};

export default PatientDetailsCard;

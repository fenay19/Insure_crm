// import React from 'react';
// import { Box, Typography, Chip, Stack } from '@mui/material';

// const SavedData = ({ data }) => {
//   console.log("DARA",data)
//   if (!Array.isArray(data) || data.length === 0) return null;

//   // Merge Data while Filtering Out Empty Units
//   const mergedData = {};

//   data.forEach((item) => {
//     const { heading, Units, Groups, selectedCheckboxes, selectedRange, parameters } = item;

//     if (!mergedData[heading]) {
//       mergedData[heading] = {
//         units: new Set(),
//         groups: new Set(),
//         checkboxes: new Set(),
//         ranges: new Set(),
//         parameters: {},
//       };
//     }

//     if (Units) mergedData[heading].units.add(Units);
//     if (Groups) mergedData[heading].groups.add(Groups);
//     if (selectedRange && selectedRange !== "0") mergedData[heading].ranges.add(selectedRange);
//     if (selectedCheckboxes) selectedCheckboxes.forEach((checkbox) => mergedData[heading].checkboxes.add(checkbox));

//     // Merge Parameters
//     if (parameters) {
//       Object.entries(parameters).forEach(([key, value]) => {
//         if (!mergedData[heading].parameters[key]) {
//           mergedData[heading].parameters[key] = new Set();
//         }
//         mergedData[heading].parameters[key].add(value);
//       });
//     }
//   });

//   return (
//     <Box
//       sx={{
//         p: 3,
//         borderRadius: 2,
//         boxShadow: 3,
//         background: '#f8fbfd',
//         maxWidth: '50%',
//         mx: 'auto',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 2,
//         margin:'1rem auto'
//       }}
//     >
//       <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2, textAlign: 'center' }}>
//         Saved Data Summary
//       </Typography>

//       <Stack spacing={3}>
//         {Object.entries(mergedData).map(([heading, details], idx) => (
//           <Box
//             key={idx}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               boxShadow: 2,
//               background: '#ffffff',
//               maxWidth: '100%',
//             }}
//           >
//             {/* Heading */}
//             <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
//               {heading}
//             </Typography>

//             <Stack spacing={1}>
//               {/* Units */}
//               {details.units.size > 0 && (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Units:</Typography>
//                   {[...details.units].map((unit, idx) => <Chip key={idx} label={unit} color="primary" />)}
//                 </Box>
//               )}

//               {/* Groups */}
//               {details.groups.size > 0 && (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Groups:</Typography>
//                   {[...details.groups].map((group, idx) => <Chip key={idx} label={group} color="secondary" />)}
//                 </Box>
//               )}

//               {/* Parameters */}
//               {Object.entries(details.parameters).length > 0 && (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Parameters:</Typography>
//                   {Object.entries(details.parameters).map(([key, values]) =>
//                     [...values].map((val, idx) => <Chip key={idx} label={`${val}`} color="warning" />)
//                   )}
//                 </Box>
//               )}

//               {/* Selected Checkboxes */}
//               {details.checkboxes.size > 0 && (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Selected Checkboxes:</Typography>
//                   {[...details.checkboxes].map((checkbox, idx) => <Chip key={idx} label={checkbox} color="info" />)}
//                 </Box>
//               )}

//               {/* Selected Ranges */}
//               {details.ranges.size > 0 && (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Selected Ranges:</Typography>
//                   {[...details.ranges].map((range, idx) => <Chip key={idx} label={range} color="error" />)}
//                 </Box>
//               )}
//             </Stack>
//           </Box>
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default SavedData;

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';

const SavedData = ({ data }) => {
  console.log('DATA:', data);

  // Return null if no valid data
  if (!data || typeof data !== 'object') return null;

  // Extract data
  const { heading, Units, Groups, selectedCheckboxes, selectedRange, parameters } = data;

  // Process data
  const mergedData = {
    units: new Set(),
    groups: new Set(),
    checkboxes: new Set(),
    ranges: new Set(),
    parameters: {}
  };

  if (Units) mergedData.units.add(Units);
  if (Groups) mergedData.groups.add(Groups);
  if (selectedRange && selectedRange !== '0') mergedData.ranges.add(selectedRange);
  if (selectedCheckboxes) selectedCheckboxes.forEach((checkbox) => mergedData.checkboxes.add(checkbox));

  // Merge Parameters
  if (parameters) {
    Object.entries(parameters).forEach(([key, value]) => {
      if (!mergedData.parameters[key]) {
        mergedData.parameters[key] = new Set();
      }
      mergedData.parameters[key].add(value);
    });
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        background: '#f8fbfd',
        maxWidth: '50%',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        margin: '1rem auto'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2, textAlign: 'center' }}>
        Saved Vitals
      </Typography>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          background: '#ffffff',
          maxWidth: '100%'
        }}
      >
        {/* Heading */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          {heading}
        </Typography>

        <Stack spacing={1}>
          {/* Units */}
          {mergedData.units.size > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Units:
              </Typography>
              {[...mergedData.units].map((unit, idx) => (
                <Chip key={idx} label={unit} sx={{ background: '#E0E0E0' }} />
              ))}
            </Box>
          )}

          {/* Groups */}
          {mergedData.groups.size > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Groups:
              </Typography>
              {[...mergedData.groups].map((group, idx) => (
                <Chip key={idx} label={group} sx={{ background: '#E0E0E0' }} />
              ))}
            </Box>
          )}

          {/* Parameters */}
          {Object.entries(mergedData.parameters).length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Parameters:
              </Typography>
              {Object.entries(mergedData.parameters).map(([key, values]) =>
                [...values].map((val, idx) => <Chip key={idx} label={`${val}`} sx={{ background: '#E0E0E0' }} />)
              )}
            </Box>
          )}

          {/* Selected Checkboxes */}
          {mergedData.checkboxes.size > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Selected Checkboxes:
              </Typography>
              {[...mergedData.checkboxes].map((checkbox, idx) => (
                <Chip key={idx} label={checkbox} sx={{ background: '#E0E0E0' }} />
              ))}
            </Box>
          )}

          {/* Selected Ranges */}
          {mergedData.ranges.size > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Selected Ranges:
              </Typography>
              {[...mergedData.ranges].map((range, idx) => (
                <Chip key={idx} label={range} sx={{ background: '#E0E0E0' }} />
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default SavedData;

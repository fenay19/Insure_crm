import React from 'react';
import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem, InputBase, Box } from '@mui/material';

const VisualAcuityForm = () => {
  const visionOptions = ['6/12', '6/24', '6/36', '6/60'];
  const findingsOptions = ['Method 1', 'Method 2', 'Method 3'];

  return (
    <Card sx={{ maxWidth: '100%', mt: 3 }}>
      <CardContent>
        <Grid container spacing={4}>
          {/* Vision Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                boxShadow: 3, // Shadow effect for the box
                padding: 3,
                backgroundColor: '#fff',
                borderRadius: 2 // Optional: Add border-radius for rounded corners
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  borderBottom: 1,
                  paddingBottom: 1,
                  textAlign: 'center',
                  margin: 'auto',
                  color: '#fff',
                  backgroundColor: '#126078',
                  padding: 2
                }}
              >
                Vision
              </Typography>
              <Grid container spacing={2} direction="column" mt={2}>
                {/* Unaided */}
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Unaided
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size={'small'}>
                        <InputLabel id="unaided-re-select-label">RE</InputLabel>
                        <Select labelId="unaided-re-select-label" label="RE">
                          {visionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size={'small'}>
                        <InputLabel id="unaided-le-select-label">LE</InputLabel>
                        <Select labelId="unaided-le-select-label" label="LE">
                          {visionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Corrected */}
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Corrected
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size={'small'}>
                        <InputLabel id="corrected-re-select-label">RE</InputLabel>
                        <Select labelId="corrected-re-select-label" label="RE">
                          {visionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size={'small'}>
                        <InputLabel id="corrected-le-select-label">LE</InputLabel>
                        <Select labelId="corrected-le-select-label" label="LE">
                          {visionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Pinhole */}
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Pinhole
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size={'small'}>
                        <InputLabel id="pinhole-re-select-label">RE</InputLabel>
                        <Select labelId="pinhole-re-select-label" label="RE">
                          {visionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size={'small'}>
                        <InputLabel id="pinhole-le-select-label">LE</InputLabel>
                        <Select labelId="pinhole-le-select-label" label="LE">
                          {visionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Findings Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                boxShadow: 3, // Shadow effect for the box
                padding: 3,
                backgroundColor: '#fff',
                borderRadius: 2 // Optional: Add border-radius for rounded corners
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  borderBottom: 1,
                  paddingBottom: 1,
                  textAlign: 'center',
                  margin: 'auto',
                  color: '#fff',
                  backgroundColor: '#126078',
                  padding: 2
                }}
              >
                Findings
              </Typography>

              {/* IOP */}
              <Grid container spacing={2} alignItems="center" mt={2.01}>
                <Grid item xs={3}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    IOP
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="iop-method-select-label">Method</InputLabel>
                    <Select label="Method">
                      <MenuItem value="" disabled>
                        Method
                      </MenuItem>
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="iop-option-1-label">RE</InputLabel>
                    <Select label="">
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="iop-option-2-label">LE</InputLabel>
                    <Select label="LE">
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Color */}
              <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
                <Grid item xs={3}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Color
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="color-method-select-label">Method</InputLabel>
                    <Select label="Method">
                      <MenuItem value="" disabled>
                        Method
                      </MenuItem>
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="color-option-1-label">RE</InputLabel>
                    <Select label="">
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="color-option-2-label">LE</InputLabel>
                    <Select label="LE">
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Contrast */}
              <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
                <Grid item xs={3}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Contrast
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="contrast-method-select-label">Method</InputLabel>
                    <Select label="Method">
                      <MenuItem value="" disabled>
                        Method
                      </MenuItem>
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="contrast-option-1-label">RE</InputLabel>
                    <Select label="">
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size={'small'}>
                    <InputLabel id="contrast-option-2-label">LE</InputLabel>
                    <Select label="LE">
                      {findingsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VisualAcuityForm;
// import React, { useState } from 'react';
// import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// const VisualAcuityForm = () => {
//   const visionOptions = ['6/12', '6/24', '6/36', '6/60'];
//   const findingsOptions = ['Method 1', 'Method 2', 'Method 3'];

//   const [vision, setVision] = useState({
//     unaidedRE: '',
//     unaidedLE: '',
//     correctedRE: '',
//     correctedLE: '',
//     pinholeRE: '',
//     pinholeLE: ''
//   });

//   const [findings, setFindings] = useState({
//     iopMethod: '',
//     iopRE: '',
//     iopLE: '',
//     colorMethod: '',
//     colorRE: '',
//     colorLE: '',
//     contrastMethod: '',
//     contrastRE: '',
//     contrastLE: ''
//   });

//   const handleVisionChange = (event) => {
//     const { name, value } = event.target;
//     setVision((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleFindingsChange = (event) => {
//     const { name, value } = event.target;
//     setFindings((prevState) => ({ ...prevState, [name]: value }));
//   };

//   return (
//     <Card sx={{ maxWidth: '100%', backgroundColor: '#f9f9f9' }}>
//       <CardContent>
//         <Grid container spacing={4}>
//           {/* Vision Section */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', borderBottom: 1, paddingBottom: 1 }}>
//               Vision
//             </Typography>
//             <Grid container spacing={2} direction="column" mt={3}>
//               {['unaided', 'corrected', 'pinhole'].map((type) => (
//                 <Grid item key={type}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={6}>
//                       <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
//                         {type.charAt(0).toUpperCase() + type.slice(1)}
//                       </Typography>
//                     </Grid>
//                     {['RE', 'LE'].map((eye) => (
//                       <Grid item xs={3} key={eye}>
//                         <FormControl fullWidth size={'small'}>
//                           <InputLabel shrink>{eye}</InputLabel>
//                           <Select
//                             name={`${type}${eye}`}
//                             value={vision[`${type}${eye}`]}
//                             onChange={handleVisionChange}
//                           >
//                             {visionOptions.map((option) => (
//                               <MenuItem key={option} value={option}>
//                                 {option}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>

//           {/* Findings Section */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', borderBottom: 1, paddingBottom: 1 }}>
//               Findings
//             </Typography>
//             {['iop', 'color', 'contrast'].map((type) => (
//               <Grid container spacing={2} alignItems="center" mt={2} key={type}>
//                 <Grid item xs={3}>
//                   <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
//                     {type.charAt(0).toUpperCase() + type.slice(1)}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={3}>
//                   <FormControl fullWidth size={'small'}>
//                     <InputLabel shrink>Method</InputLabel>
//                     <Select
//                       name={`${type}Method`}
//                       value={findings[`${type}Method`]}
//                       onChange={handleFindingsChange}
//                     >
//                       {findingsOptions.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 {['RE', 'LE'].map((eye) => (
//                   <Grid item xs={3} key={eye}>
//                     <FormControl fullWidth size={'small'}>
//                       <InputLabel shrink>{eye}</InputLabel>
//                       <Select
//                         name={`${type}${eye}`}
//                         value={findings[`${type}${eye}`]}
//                         onChange={handleFindingsChange}
//                       >
//                         {findingsOptions.map((option) => (
//                           <MenuItem key={option} value={option}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 ))}
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default VisualAcuityForm;

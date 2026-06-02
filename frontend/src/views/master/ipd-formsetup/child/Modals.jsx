import React from 'react'
import { Modal, Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, TextField } from '@mui/material';


const Modals= ({ 
  openRouteModalIndex, 
  openDoseModalIndex, 
  openModalIndex, 
  openViewModal, 
  formData, 
  drugData, 
  routeOptions, 
  doseOptions, 
  medicineOptions, 
  handleSelectRoute, 
  handleSelectDose,
  handleSearch, 
  handleSearchRoute,
  handleSearchDose,
  handleSelectMedicine, 
  handleCloseViewModal, 
  setOpenRouteModalIndex, 
  setOpenDoseModalIndex, 
  setOpenModalIndex, 
  setOpenViewModal 
}) => {

  return (
    <>
      {/* Route Modal */}
      <Modal open={openRouteModalIndex !== null} onClose={() => setOpenRouteModalIndex(null)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 3, maxHeight: '80vh', overflowY: 'auto' }}>
          <Box sx={{display:'flex',justifyContent:'space-between',textAlign:"center"}}>
          <h2>Select a Route</h2>
          <TextField label="search" variant="outlined" size="small" sx={{width:120}}
           onChange={(e)=>handleSearchRoute(e.target.value)}/>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {routeOptions.map(route => (
              <Chip key={route.id} label={route.routeName} clickable onClick={() => handleSelectRoute(openRouteModalIndex, route.routeName)} sx={{ flex: '1 1 15%', minWidth: 80, maxWidth:120, bgcolor: '#0043a9', color: 'white', textAlign: 'center' }} />
            ))}
          </Box>
          <Button onClick={() => setOpenRouteModalIndex(null)} variant="contained"  sx={{ mt: 3, bgcolor: '#0043a9',width:120,display:'block',marginLeft:'auto',marginRight:'auto'}}>Cancel</Button>
        </Box>
      </Modal>
      {/* Dose Modal */}
      <Modal open={openDoseModalIndex !== null} onClose={() => setOpenDoseModalIndex(null)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 3, maxHeight: '60vh', overflowY: 'auto' }}>
          <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Select a Dose</h2>
          <TextField label="Search" varaint="outlined" size="small" sx={{width:180}} onChange={(e)=>handleSearchDose(e.target.value)}/>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2}}>
            {doseOptions.map(dose => (
              <Chip key={dose.id} label={dose.dose} clickable onClick={() => handleSelectDose(openDoseModalIndex, dose.dose)} sx={{ flex: '1 1 15%', minWidth: 80,maxWidth:120,bgcolor: '#0043a9', color: 'white', textAlign: 'center' }} />
            ))}
          </Box>
          <Button onClick={() => setOpenDoseModalIndex(null)} variant="contained"  sx={{ mt: 3, bgcolor: '#0043a9',width:120,display:'block',marginLeft:'auto',marginRight:'auto'}}>Cancel</Button>
        </Box>
      </Modal>
      {/* Medicine Modal */}
      <Modal open={openModalIndex !== null} onClose={() => setOpenModalIndex(null)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 3, maxHeight: '50vh', overflowY: 'auto' }}>
          <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Select a Drug</h2>
          <TextField 
            label="Search" 
            variant="outlined" 
            size="small"
            sx={{ width: 180 }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {medicineOptions.map(medicine => (
              <Chip key={medicine.id} label={medicine.genericName} clickable onClick={() => handleSelectMedicine(openModalIndex, medicine.genericName)} sx={{ flex: '1 1 15%', minWidth: 80,maxWidth:120,textAlign: 'center', bgcolor: '#0043a9', color: 'white' }} />
            ))}
          </Box>
          <Button onClick={() => setOpenModalIndex(null)} variant="contained"  sx={{ mt: 3, bgcolor: '#0043a9',width:140,display:'block',marginLeft:'auto',marginRight:'auto'}}>Cancel</Button>
        </Box>
      </Modal>
      {/* View Modal */}
      <Modal open={openViewModal} onClose={handleCloseViewModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 5, width: '90%', maxWidth: 1000,boxShadow:'none' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Diagnosis:</strong>{formData.diagnosis}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Allergy:</strong>{formData.allergy}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Post of Day:</strong> {formData.postofDay}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>ICU Day:</strong> {formData.icuDay}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Diet Orders:</strong> {formData.dietOrders}</Typography>
            </Grid>
          </Grid>
  <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 0 }}>
    <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ border: '1px solid black' }} colSpan={5} align="center"><strong>Doctor</strong></TableCell> {/* Spans across Name of Drug, Day, Route, Frequency */}
        <TableCell sx={{ border: '1px solid black' }} rowSpan={1} align="center"><strong>Nurse</strong></TableCell> {/* Nurse column */}
      </TableRow>
      <TableRow>
        <TableCell sx={{ border: '1px solid black' }}>Sr No.</TableCell>
        <TableCell sx={{ border: '1px solid black' }}>Name of Drug</TableCell>
        <TableCell sx={{ border: '1px solid black' }}>Day</TableCell>
        <TableCell sx={{ border: '1px solid black' }}>Route</TableCell>
        <TableCell sx={{ border: '1px solid black' }}>Frequency</TableCell>
        <TableCell sx={{ border: '1px solid black' }}>Time/Sign</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {drugData.map((drug, index) => (
        <TableRow key={index}>
          <TableCell sx={{ border: '1px solid black' }}>{index + 1}</TableCell>
          <TableCell sx={{ border: '1px solid black' }}>{drug.genericName}</TableCell>
          <TableCell sx={{ border: '1px solid black' }}>{drug.day}</TableCell>
          <TableCell sx={{ border: '1px solid black' }}>{drug.route}</TableCell>
          <TableCell sx={{ border: '1px solid black' }}>{drug.freq}</TableCell>
          <TableCell sx={{ border: '1px solid black' }}>
            {drug.adminRecords.map((record, index) => (
              <TextField key={index} label="Time" value={record.time} variant="outlined" size="small" sx={{ marginBottom: 1 }}
               />            
            ))}  
            </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</Box>
</Modal>
</>
);
};

export default Modals;


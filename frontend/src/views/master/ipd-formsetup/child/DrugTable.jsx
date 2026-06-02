import React, { useState } from 'react';
import { Table, TableContainer, TableRow, TableCell, TableHead, TableBody, TextField, Box, Checkbox,Modal,Stack,Chip} from "@mui/material";
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';

const DrugTable = ({ drugData, setDrugData, handleOpenModal, handleOpenDoseModal, handleOpenRouteModal, handleFreqChange, handleTimeCheckboxChange, handleTimeChange }) => {
  const [focusedTimeFields, setFocusedTimeFields] = useState({});
  const [signValue,setSignValue]=useState("");
  const [isFreqModalOpen, setIsFreqModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [customFreq, setCustomFreq] = useState('');
  const [isCustomFreqModalOpen, setIsCustomFreqModalOpen] = useState(false);
  const [freqOptions, setFreqOptions] = useState(['OD', 'BD', 'TDS']);



  const handleCheckboxChange = (rowIndex, recordIndex, checked) => {
    setFocusedTimeFields(prevState => ({
      ...prevState,
      [`${rowIndex}-${recordIndex}`]: checked
    }));
    handleTimeCheckboxChange(rowIndex, recordIndex, checked);
  };
  const handleAddCustomFreq = () => {
    if (customFreq && !freqOptions.includes(customFreq)) {
      setFreqOptions((prevState) => [...prevState, customFreq]);
    }
    setIsCustomFreqModalOpen(false);
    setCustomFreq('');
  };
  
  const handleOpenFreqModal = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setIsFreqModalOpen(true);
  };
  
  const handleFreqSelect = (freq) => {
    const updatedData = [...drugData];
    updatedData[selectedRowIndex].freq = freq;
    setDrugData(updatedData);
    setIsFreqModalOpen(false);
  };
  const handleDeleteCustomFreq = (freqToDelete) => {
    setFreqOptions((prevState) => prevState.filter((freq) => freq !== freqToDelete));
  };
  
  
  return (
    <div>
      <TableContainer sx={{ mt: 7 }}>
        <Table>
          <TableHead sx={{ border: '1px solid black', backgroundColor: '#F0F2F8' }}>
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid black' }}>
                Doctor
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid black' }}>
                Nurse
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }} />
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: '1px solid black' }}>Sr No.</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>Name of Drug</TableCell>
              <TableCell sx={{ border: '1px solid black', width: 90 }}>Day</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>Dose</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>Route</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>Freq</TableCell>
              <TableCell sx={{ border: '1px solid black' }} align="center">Time/Sign</TableCell>
              <TableCell sx={{ border: '1px solid black' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drugData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell sx={{ border: '1px solid black' }}>{rowIndex + 1}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  <div key={rowIndex}>
                    <TextField
                      label="Name of Drug"
                      value={row.genericName || ""}
                      onClick={() => handleOpenModal(rowIndex)}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  <TextField
                    value={row?.day || ''}
                    onChange={(e) => {
                      const updatedData = [...drugData];
                      updatedData[rowIndex].day = e.target.value;
                      setDrugData(updatedData);
                    }}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  <div key={rowIndex}>
                    <TextField
                      label="Dose"
                      value={row.dose || ""}
                      onClick={() => handleOpenDoseModal(rowIndex)}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  <div key={rowIndex}>
                    <TextField
                      label="Route"
                      value={row.route || ""}
                      onClick={() => handleOpenRouteModal(rowIndex)}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  <div key={rowIndex} style={{ marginBottom: '20px' }}>
                    <TextField
                      label="Frequency"
                      value={row.freq || ""}
                      onClick={() => handleOpenFreqModal(rowIndex)}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  {row.adminRecords.map((record, recordIndex) => (
                    <Box key={recordIndex} sx={{ display: 'flex' }}>
                      <Checkbox
                        checked={record.showCurrentTime}
                        onChange={(e) => handleCheckboxChange(rowIndex, recordIndex, e.target.checked)}
                      />
                      <TextField
                        variant="outlined"
                        size="small"
                        label="Time"
                        sx={{ padding: 1, width: 80 }}
                        value={record.time}
                        onChange={(e) => handleTimeChange(rowIndex, recordIndex, e.target.value)}
                        InputLabelProps={{
                          shrink: focusedTimeFields[`${rowIndex}-${recordIndex}`] || record.time ? true : false, // Set to true when checkbox is checked or time has value
                        }}
                      />
                      <TextField
                        variant="outlined"
                        size="small"
                        sx={{ padding: 1, textAlign: 'center', width: 80 }}
                        label="Sign"
                        value={signValue}
                        onChange={(e)=>setSignValue(e.target.value)}
                      />
                    </Box>
                  ))}
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  <DeleteBtn onClick={() => console.log('Delete')} style={{ padding: '4px' }} />
                  <EditBtn onClick={() => console.log('Edit')} style={{ marginLeft: 4 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isFreqModalOpen} onClose={() => setIsFreqModalOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
    <h3>Select Frequency</h3>
    <Stack direction="row" spacing={2} mt={2}>
      {freqOptions.map((freq) => (
        <Chip
          key={freq}
          label={freq}
          onClick={() => handleFreqSelect(freq)}
          clickable
          sx={{ bgcolor: '#0043a9', color: 'white', minWidth: 80, maxWidth: 120 }}
          variant="outlined"
          deleteIcon={
            freq.length > 3 ? (
              <IconButton size="small" onClick={() => handleDeleteCustomFreq(freq)} sx={{color:'white'}}>
                <DeleteIcon sx={{ color: 'white',bgcolor:'primary'}} />
              </IconButton>
            ) : null
          }
          onDelete={() => handleDeleteCustomFreq(freq)}
        />
      ))}
      {/* Plus Icon to Add Custom Frequency */}
      <Chip
        label="+"
        onClick={() => setIsCustomFreqModalOpen(true)}
        clickable
        sx={{ bgcolor: '#0043a9', color: 'white', minWidth: 80, maxWidth: 120 }}
        variant="outlined"
      />
    </Stack>
  </Box>
</Modal>
  <Modal open={isCustomFreqModalOpen} onClose={() => setIsCustomFreqModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <h3>Enter Custom Frequency</h3>
    <TextField
      label="Custom Frequency"
      value={customFreq}
      onChange={(e) => setCustomFreq(e.target.value)}
      fullWidth
      size="small"
    />
    <Box mt={2}>
      <button onClick={handleAddCustomFreq}>Add</button>
    </Box>
  </Box>
</Modal>
</div>
  );
};

export default DrugTable;

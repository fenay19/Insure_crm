import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, Paper, Select,MenuItem} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


const formattedTime = dayjs('14:30', 'HH:mm').format('h:mm A'); 

const DoctorsHandoverNotes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [customNamesList, setCustomNamesList] = useState([]);
  const [customName, setCustomName] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [time, setTime] = useState('');

  const [fixedShifts, setFixedShifts] = useState([
    { name: 'Morning Shift', instructions: '', takenBy: '', takenFrom: '', fromTime: '', toTime: '' ,sign:''},
  ]);

  const handleOpenModal = () => {
    setCustomName('');
    setEditIndex(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCustomNameChange = (event) => {
    setCustomName(event.target.value);
  };

  const handleSubmit = () => {
    if (customName.trim() === '') return;

    if (editIndex !== null) {
      const updatedList = [...customNamesList];
      updatedList[editIndex] = {
        ...updatedList[editIndex],
        name: customName,
      };
      setCustomNamesList(updatedList);
    } else {
      setCustomNamesList([
        ...customNamesList,
        { name: customName, instructions: '', takenBy: '', takenFrom: '', fromTime: '', toTime: '',sign:''},
      ]);
    }
    handleCloseModal();
  };

  const allSections = [...fixedShifts, ...customNamesList];

  const handleFieldChange = (index, field, value) => {
    if (index < 3) {
      const updatedFixed = [...fixedShifts];
      updatedFixed[index][field] = value;
      setFixedShifts(updatedFixed);
    } else {
      const updatedCustom = [...customNamesList];
      updatedCustom[index - 3][field] = value;
      setCustomNamesList(updatedCustom);
    }
  };

  return (
    <Paper sx={{ backgroundColor: 'white', p: 4 }}>
      <Box p={3}>
        {/* Add New Section Button */}
        <Button variant="contained" onClick={handleOpenModal}>
          Add New Section +
        </Button>

        {/* Title */}
        <Typography
          variant="h2"
          gutterBottom
          align="center"
          sx={{ mt: 2, borderBottom: '1px solid black' }}
        >
          Doctor's Handover Notes
        </Typography>

        {/* Add/Edit Custom Section Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              width: 300,
              bgcolor: 'white',
              p: 3,
              borderRadius: 5,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              {editIndex !== null ? 'Edit Custom Name' : 'Enter Custom Name'}
            </Typography>
            <TextField
              fullWidth
              label="Custom Name"
              variant="outlined"
              value={customName}
              onChange={handleCustomNameChange}
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
              {editIndex !== null ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Modal>

        {/* All Shift Sections */}
        {allSections.map((section, index) => (
          <Box
            key={index}
            sx={{
              marginTop: 3,
              backgroundColor: '#f1f1f1',
              padding: 4,
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', gap: 3, marginBottom: 1, p: 3 }}>
            <Select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              sx={{ width: 90,border:'1px solid black',borderRadius:2}}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select
              </MenuItem>
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="evening">Evening</MenuItem>
              <MenuItem value="night">Night</MenuItem>
            </Select>           
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="From"
                    sx={{border:'1px solid black',width:150,borderRadius:3}}
                    value={section.fromTime ? dayjs(section.fromTime) : null} // Ensure Dayjs object
                    onChange={(newValue) =>
                      handleFieldChange(index, 'fromTime', newValue ? newValue.format('HH:mm') : '')
                    }
                    ampm
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: 150,border:'1px solid black'}} />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="To"
                    sx={{border:'1px solid black',width:150,borderRadius:3}}
                    value={section.toTime ? dayjs(section.toTime) : null}
                    onChange={(newValue) =>
                      handleFieldChange(index, 'toTime', newValue ? newValue.format('HH:mm') : '')
                    }
                    ampm
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: 150,border:'1px solid black'}} />
                    )}
                  />
                </LocalizationProvider>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 5, p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body1">Hand Over taken by:</Typography>
                <TextField
                  size="small"
                  value={section.takenBy || ''}
                  onChange={(e) => handleFieldChange(index, 'takenBy', e.target.value)}
                  sx={{ border: '1px solid black', borderRadius: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body1">Hand Over taken from:</Typography>
                <TextField
                  size="small"
                  value={section.takenFrom || ''}
                  onChange={(e) => handleFieldChange(index, 'takenFrom', e.target.value)}
                  sx={{ border: '1px solid black', borderRadius: 2 }}
                />
              </Box>
            </Box>
            <TextField
              fullWidth
              label="Write your instructions here..."
              variant="outlined"
              multiline
              rows={4}
              value={section.instructions || ''}
              onChange={(e) => handleFieldChange(index, 'instructions', e.target.value)}
              sx={{ marginTop: 2, border: '1px solid black', borderRadius: 2 }}
            />
            <TextField
              label="Sign"
              size="small"
              value={section.sign || ''}
              onChange={(e) => handleFieldChange(index, 'sign', e.target.value)}
              sx={{
                border: '1px solid black',
                width: 95,
                marginTop: 2,
                display: 'block',
                marginLeft: 'auto',
              }}
              variant="outlined"
            />
          </Box>
        ))}
        {/* View All Notes Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setViewModalOpen(true)}
          sx={{ mt: 4 }}
        >
          View All Notes
        </Button>

        {/* View Modal */}
        <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
          <Box
            sx={{
              width: 1200,
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'white',
              p: 4,
              borderRadius: 5,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            >
            <Typography variant="h3" gutterBottom align="center">
              Doctor's Handover Summary
            </Typography>
            {allSections.map((section, idx) => (
              <Box
                key={idx}
                sx={{ mb: 3, p: 2, border: '1px solid black', borderRadius: 2 }}
              >
                <Box sx={{display:'flex',gap:1}}>
                <Typography variant="h5">{section.name}</Typography>
                <Typography sx={{display:'flex',gap:1}}>
                  (from {section.fromTime ? dayjs(section.fromTime, 'HH:mm').format('h:mm A') : '--'}
                  &nbsp;to&nbsp;{section.toTime ? dayjs(section.toTime, 'HH:mm').format('h:mm A') : '--'})
                </Typography>
                </Box>
                <Box sx={{display:'flex',gap:6,marginTop:3}}> 
                  <Typography variant="body2">
                    <strong>Handed Over By:</strong> {section.takenFrom || '-'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Handed Over To:</strong> {section.takenBy || '-'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{marginBottom:3,marginTop:3}}>
                  <strong>Instructions:</strong> {section.instructions || '-'}
                </Typography>              
                <Typography variant="body2">
                  <strong>Sign:</strong> {section.sign || '-'}
                </Typography>
              </Box>
            ))}
            <Button
              variant="contained"
              fullWidth
              onClick={() => setViewModalOpen(false)}
              sx={{ mt: 2,display:'block',marginLeft:'auto',marginRight:'auto',width:200}}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </Paper>
  );
};

export default DoctorsHandoverNotes;

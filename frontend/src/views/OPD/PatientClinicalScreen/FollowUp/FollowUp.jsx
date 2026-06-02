import { Box, Button, InputLabel, TextareaAutosize, TextField, IconButton, Card, CardContent, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import REACT_APP_BASE_URL from 'api/api';
import { retrieveToken } from 'api/api';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Loader from 'component/Loader/Loader';
import { useSelector } from 'react-redux';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FollowUp = ({ selectedMenu, editData }) => {
  const departmentId = editData.departmentId._id;
  const token = retrieveToken();
  const [error, setError] = useState('');
  const [followUp, setFollowUp] = useState({ followUp: '', advice: '', followUpTime: '' });
  const [loader, setLoader] = useState(true);
  const [followUpList, setFollowUpList] = useState([]);
  const patient = useSelector((state) => state.patient.selectedPatient);
  const getFollowUp = async () => {
    setLoader(false);
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}patient-followup/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setFollowUpList(response.data.data);
    } catch (error) {
      toast.error('Error fetching follow-up data');
    }
  };
  useEffect(() => {
    getFollowUp();
  }, [patient, token]);

  const handleSaveFollowUpDate = () => {
    if (followUp.followUp === '') {
      setError('Select the Follow Up Date...');
    } else {
      followUp._id ? handleEditPatientFollowUp() : handleAddPatientFollowUp();
    }
  };

  const handleAddPatientFollowUp = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}patient-followup`,
        {
          patientId: patient?.patientId?._id,
          opdPatientId: patient?._id,
          consultantId: patient?.consultantId,
          departmentId,
          followUp: followUp.followUp,
          followUpTime: followUp.followUpTime,
          advice: followUp.advice
        },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      if (response.data.success) {
        toast.success('Follow Up Date Successfully Submitted!!');
        getFollowUp();
      }
    } catch {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  const handleEditPatientFollowUp = async () => {
    try {
      const response = await axios.put(
        `${REACT_APP_BASE_URL}patient-followup/${followUp._id}`,
        {
          patientId: patient?.patientId?._id,
          opdPatientId: patient?._id,
          departmentId,
          consultantId: patient?.consultantId,
          followUp: followUp.followUp,
          followUpTime: followUp.followUpTime,
          advice: followUp.advice
        },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      if (response.data.success) {
        toast.success('Follow Up Date Successfully Updated!!');

        getFollowUp();
      }
      getFollowUp();
    } catch {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  const handleDeleteFollowUp = async (id) => {
    try {
      const response = await axios.delete(`${REACT_APP_BASE_URL}patient-followup/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setFollowUpList(followUpList.filter((item) => item._id !== id));
      getFollowUp();
      if (response.data.success) {
        toast.success('Follow Up Deleted Successfully');
        getFollowUp();
      }
    } catch {
      toast.error('Error deleting follow-up');
    }
  };

  return (
    <Box
      className="paticularSection"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        padding: 3,
        justifyContent: 'space-between'
      }}
    >
      {loader ? (
        <Loader />
      ) : (
        <>
          {/* Left Side - Input Fields */}
          <Box sx={{ flex: 1, minWidth: '400px' }}>
            {selectedMenu !== 'All' && <h2 className="popupHead">Follow Up</h2>}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3, mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                name="followUp"
                label="Follow Up Date"
                value={followUp.followUp}
                onChange={(e) => {
                  setFollowUp((prev) => ({ ...prev, followUp: e.target.value }));
                  setError('');
                }}
                error={Boolean(error)}
                helperText={error}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '150px' }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Follow Up Time"
                  value={followUp.followUpTime ? dayjs(followUp.followUpTime, 'HH:mm') : null}
                  onChange={(newTime) => {
                    setFollowUp((prev) => ({
                      ...prev,
                      followUpTime: newTime ? newTime.format('HH:mm') : ''
                    }));
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ flex: 1, minWidth: '150px' }}
                />
              </LocalizationProvider>
            </Box>

            <InputLabel sx={{ my: 1 }}>Advice</InputLabel>
            <TextareaAutosize
              minRows={3}
              placeholder="Write Your Advice..."
              value={followUp.advice}
              onChange={(e) => setFollowUp((prev) => ({ ...prev, advice: e.target.value }))}
              style={{
                width: '100%',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />

            <Button variant="contained" fullWidth onClick={handleSaveFollowUpDate} sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>

          {/* Right Side - Follow Up List */}
          <Box
            sx={{
              width: { xs: '100%', md: '400px' },
              maxHeight: '500px',
              overflowY: 'auto'
            }}
          >
            {followUpList.map((item) => (
              <Card key={item._id} sx={{ mb: 2, padding: 2, display: 'flex', justifyContent: 'space-between', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{item.followUp}</Typography>
                  <Typography variant="body2">Time: {item.followUpTime}</Typography>
                  <Typography variant="body2">Advice: {item.advice}</Typography>
                </CardContent>
                <Box>
                  <IconButton onClick={() => setFollowUp(item)} sx={{ color: 'blue' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteFollowUp(item._id)} sx={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}
      <ToastContainer />
    </Box>
  );
};

export default FollowUp;

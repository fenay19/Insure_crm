

import React, { useState } from 'react';
import { Grid, Card, TextField, Box, IconButton, Button } from '@mui/material';
import { AddBox, Cancel } from '@mui/icons-material';
import { post } from 'api/api';
import { toast } from 'react-toastify';

function PainChips({ chiefComplaint='', painType='', painScore='', departmentId='' ,getChiefComplaint=()=>{},setOpenChiefDialogue=()=>{}}={}) {
  // States for input values
  const [location, setLocation] = useState([{ data: '' }]);
  const [duration, setDuration] = useState([{ data: '' }]);
  const [natureOfPain, setNatureOfPain] = useState([{ data: '' }]);
  const [aggravatingFactors, setAggravatingFactors] = useState([{ data: '' }]);
  const [relievingFactors, setRelievingFactors] = useState([{ data: '' }]);
  const [quality, setQuality] = useState([{ data: '' }]);

  // States for error handling
  const [errLocation, setErrLocation] = useState([{ data: '' }]);
  const [errDuration, setErrDuration] = useState([{ data: '' }]);
  const [errNatureOfPain, setErrNatureOfPain] = useState([{ data: '' }]);
  const [errAggravatingFactors, setErrAggravatingFactors] = useState([{ data: '' }]);
  const [errRelievingFactors, setErrRelievingFactors] = useState([{ data: '' }]);
  const [errQuality, setErrQuality] = useState([{ data: '' }]);

  // Handlers for Location input
  const handleLocation = (index, event) => {
    const newData = [...location];
    newData[index].data = event.target.value;
    setLocation(newData);
  };

  const addLocation = () => {
    setLocation([...location, { data: '' }]);
    setErrLocation([...errLocation, { data: '' }]);
  };

  const removeLocation = (index) => {
    const newData = [...location];
    const newErr = [...errLocation];
    newData.splice(index, 1);
    newErr.splice(index, 1);
    setLocation(newData);
    setErrLocation(newErr);
  };

  // Handlers for Duration input
  const handleDuration = (index, event) => {
    const newData = [...duration];
    newData[index].data = event.target.value;
    setDuration(newData);
  };

  const addDuration = () => {
    setDuration([...duration, { data: '' }]);
    setErrDuration([...errDuration, { data: '' }]);
  };

  const removeDuration = (index) => {
    const newData = [...duration];
    const newErr = [...errDuration];
    newData.splice(index, 1);
    newErr.splice(index, 1);
    setDuration(newData);
    setErrDuration(newErr);
  };

  // Handlers for Nature of Pain input
  const handleNatureOfPain = (index, event) => {
    const newData = [...natureOfPain];
    newData[index].data = event.target.value;
    setNatureOfPain(newData);
  };

  const addNatureOfPain = () => {
    setNatureOfPain([...natureOfPain, { data: '' }]);
    setErrNatureOfPain([...errNatureOfPain, { data: '' }]);
  };

  const removeNatureOfPain = (index) => {
    const newData = [...natureOfPain];
    const newErr = [...errNatureOfPain];
    newData.splice(index, 1);
    newErr.splice(index, 1);
    setNatureOfPain(newData);
    setErrNatureOfPain(newErr);
  };

  // Handlers for Aggravating Factors input
  const handleAggravatingFactors = (index, event) => {
    const newData = [...aggravatingFactors];
    newData[index].data = event.target.value;
    setAggravatingFactors(newData);
  };

  const addAggravatingFactors = () => {
    setAggravatingFactors([...aggravatingFactors, { data: '' }]);
    setErrAggravatingFactors([...errAggravatingFactors, { data: '' }]);
  };

  const removeAggravatingFactors = (index) => {
    const newData = [...aggravatingFactors];
    const newErr = [...errAggravatingFactors];
    newData.splice(index, 1);
    newErr.splice(index, 1);
    setAggravatingFactors(newData);
    setErrAggravatingFactors(newErr);
  };

  // Handlers for Relieving Factors input
  const handleRelievingFactors = (index, event) => {
    const newData = [...relievingFactors];
    newData[index].data = event.target.value;
    setRelievingFactors(newData);
  };

  const addRelievingFactors = () => {
    setRelievingFactors([...relievingFactors, { data: '' }]);
    setErrRelievingFactors([...errRelievingFactors, { data: '' }]);
  };

  const removeRelievingFactors = (index) => {
    const newData = [...relievingFactors];
    const newErr = [...errRelievingFactors];
    newData.splice(index, 1);
    newErr.splice(index, 1);
    setRelievingFactors(newData);
    setErrRelievingFactors(newErr);
  };

  // Handlers for Quality input
  const handleQuality = (index, event) => {
    const newData = [...quality];
    newData[index].data = event.target.value;
    setQuality(newData);
  };

  const addQuality = () => {
    setQuality([...quality, { data: '' }]);
    setErrQuality([...errQuality, { data: '' }]);
  };

  const removeQuality = (index) => {
    const newData = [...quality];
    const newErr = [...errQuality];
    newData.splice(index, 1);
    newErr.splice(index, 1);
    setQuality(newData);
    setErrQuality(newErr);
  };

  // Handle Save
  const handleSave = async () => {
    // Example form data (you can get this data from your state or form inputs)
    const formData = {
      chiefComplaint,
      location,
      duration,
      natureOfPain,
      aggravatingFactors,
      relievingFactors,
      quality,
      painScore,
      painType,
      departmentId
    };

    try {
      const response = await post('opd/pain-chief-complaint', formData);
      if (response?.data) {
        toast.success(response?.message || 'Added Successfully');
        getChiefComplaint()
        setOpenChiefDialogue(false)
      } else {
        toast.error(response?.message || 'Failed');
      }
      // Handle the response after saving
      console.log('Form data saved', response.data);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
      <Card style={{ padding: '1rem' }}>
          <h4>Pain Details</h4>

          {/* Location Section */}
          <h5>Location:</h5>
          <Box>
            {location.map((data, index) => (
              <Grid container key={index} spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={data.data}
                    onChange={(evnt) => handleLocation(index, evnt)}
                    margin="dense"
                    error={errLocation[index].data !== '' ? true : false}
                    helperText={errLocation[index].data}
                  />
                </Grid>
                {location.length > 1 && (
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeLocation(index)} title="Remove Location">
                      <Cancel />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            <IconButton onClick={addLocation} title="Add Location">
              <AddBox />
            </IconButton>
          </Box>

          {/* Duration Section */}
          <h5>Duration:</h5>
          <Box>
            {duration.map((data, index) => (
              <Grid container key={index} spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={data.data}
                    onChange={(evnt) => handleDuration(index, evnt)}
                    margin="dense"
                    error={errDuration[index].data !== '' ? true : false}
                    helperText={errDuration[index].data}
                  />
                </Grid>
                {duration.length > 1 && (
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeDuration(index)} title="Remove Duration">
                      <Cancel />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            <IconButton onClick={addDuration} title="Add Duration">
              <AddBox />
            </IconButton>
          </Box>

          {/* Nature of Pain Section */}
          <h5>Nature of Pain:</h5>
          <Box>
            {natureOfPain.map((data, index) => (
              <Grid container key={index} spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={data.data}
                    onChange={(evnt) => handleNatureOfPain(index, evnt)}
                    margin="dense"
                    error={errNatureOfPain[index].data !== '' ? true : false}
                    helperText={errNatureOfPain[index].data}
                  />
                </Grid>
                {natureOfPain.length > 1 && (
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeNatureOfPain(index)} title="Remove Nature of Pain">
                      <Cancel />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            <IconButton onClick={addNatureOfPain} title="Add Nature of Pain">
              <AddBox />
            </IconButton>
          </Box>

          {/* Aggravating Factors Section */}
          <h5>Aggravating Factors:</h5>
          <Box>
            {aggravatingFactors.map((data, index) => (
              <Grid container key={index} spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={data.data}
                    onChange={(evnt) => handleAggravatingFactors(index, evnt)}
                    margin="dense"
                    error={errAggravatingFactors[index].data !== '' ? true : false}
                    helperText={errAggravatingFactors[index].data}
                  />
                </Grid>
                {aggravatingFactors.length > 1 && (
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeAggravatingFactors(index)} title="Remove Aggravating Factors">
                      <Cancel />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            <IconButton onClick={addAggravatingFactors} title="Add Aggravating Factors">
              <AddBox />
            </IconButton>
          </Box>

          {/* Relieving Factors Section */}
          <h5>Relieving Factors:</h5>
          <Box>
            {relievingFactors.map((data, index) => (
              <Grid container key={index} spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={data.data}
                    onChange={(evnt) => handleRelievingFactors(index, evnt)}
                    margin="dense"
                    error={errRelievingFactors[index].data !== '' ? true : false}
                    helperText={errRelievingFactors[index].data}
                  />
                </Grid>
                {relievingFactors.length > 1 && (
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeRelievingFactors(index)} title="Remove Relieving Factors">
                      <Cancel />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            <IconButton onClick={addRelievingFactors} title="Add Relieving Factors">
              <AddBox />
            </IconButton>
          </Box>

          {/* Quality Section */}
          <h5>Quality:</h5>
          <Box>
            {quality.map((data, index) => (
              <Grid container key={index} spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={data.data}
                    onChange={(evnt) => handleQuality(index, evnt)}
                    margin="dense"
                    error={errQuality[index].data !== '' ? true : false}
                    helperText={errQuality[index].data}
                  />
                </Grid>
                {quality.length > 1 && (
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeQuality(index)} title="Remove Quality">
                      <Cancel />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            <IconButton onClick={addQuality} title="Add Quality">
              <AddBox />
            </IconButton>
          </Box>

          {/* Save Button */}
          <Button onClick={handleSave} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Save
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PainChips;

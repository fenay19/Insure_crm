import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItem,
  ListItemText
} from '@mui/material';
import { get, put } from 'api/api';
import { toast } from 'react-toastify';
function Qualification({ setValue, setStoredAllData, storedAllData }) {
  const id = storedAllData?._id;
  const [diplomaData, setDiplomaData] = useState([]);
  const [graduationData, setGraduationData] = useState([]);
  const [postGraduationData, setPostGraduationData] = useState([]);
  const [superSpecialization, setSuperSpecialization] = useState([]);
  const [administrativeData, setAdministrativeData] = useState([]);

  // State for first form (Qualification Details)
  const [qualificationForm, setQualificationForm] = useState({});

  // State for second form (Additional Details)
  const [additionalDetailsForm, setAdditionalDetailsForm] = useState({});

  useEffect(() => {
    setQualificationForm(
      storedAllData?.qualification && Object.keys(storedAllData.qualification).length > 0
        ? storedAllData.qualification
        : {
            diploma: [],
            graduation: [],
            postGraduation: [],
            superSpecialization: [],
            otherQualification: ''
          }
    );
  }, [storedAllData?.qualification]);

  useEffect(() => {
    setAdditionalDetailsForm(
      storedAllData?.additionalDetails && Object.keys(storedAllData.additionalDetails).length > 0
        ? storedAllData.additionalDetails
        : {
            registrationNo: '',
            councilName: '',
            isVerified: false,
            verifiedBy: '',
            date: '',
            time: ''
          }
    );
  }, [storedAllData?.additionalDetails]);

  // Fetch data functions
  async function fetchDiploma() {
    const response = await get('diploma');
    setDiplomaData(response.data || []);
  }

  async function fetchGraduation() {
    const response = await get('graduation');
    setGraduationData(response.data || []);
  }

  async function fetchPostGraduation() {
    const response = await get('postGraduation');
    setPostGraduationData(response.data || []);
  }

  async function fetchSuperSpecialization() {
    const response = await get('superSpecialization');
    setSuperSpecialization(response.data || []);
  }

  async function fetchAdministrationData() {
    const response = await get('administrative');
    if (response.data.length > 0) {
      setAdministrativeData(response.data);
    } else {
      setAdministrativeData([]);
    }
  }

  const [allCouncils, setAllCouncils] = useState([]);
  const fetchListOfCouncil = async () => {
    const response = await get('listOfCouncils');
    setAllCouncils(response?.data ?? []);
  };

  useEffect(() => {
    fetchListOfCouncil();
    fetchDiploma();
    fetchGraduation();
    fetchPostGraduation();
    fetchSuperSpecialization();
    fetchAdministrationData();
  }, []);

  // Handlers for the first form
  const handleQualificationChange = (field, value) => {
    setQualificationForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalDetailsChange = (e) => {
    const { name, value } = e.target;

    setAdditionalDetailsForm((prev) => {
      const updatedForm = { ...prev, [name]: value || '' };

      if (name === 'verifiedBy') {
        if (value) {
          const today = new Date();
          updatedForm.date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${today.getFullYear()}`;
          updatedForm.time = today.toLocaleTimeString();
        } else {
          updatedForm.date = '';
          updatedForm.time = '';
        }
      }

      return updatedForm;
    });
  };

  const handleIsVerified = (e) => {
    setAdditionalDetailsForm((prev) => ({
      ...prev,
      isVerified: !prev.isVerified
    }));
  };
  const submitQualification = async (e) => {
    e.preventDefault();

    if (true) {
      const response = await put(`medicalOfficer/qualification/${id}`, { qualificationForm });
      if (response.success === true) {
        setStoredAllData((prev) => ({
          ...prev,
          qualification: response?.data?.qualification
        }));
        toast.success(response.message);
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    }
  };

  const submitAdditionalDetails = async (e) => {
    e.preventDefault();

    if (true) {
      const response = await put(`medicalOfficer/additionalDetails/${id}`, { additionalDetailsForm });
      if (response.success === true) {
        setStoredAllData((prev) => ({
          ...prev,
          additionalDetails: response?.data?.additionalDetails
        }));
        toast.success(response.message);
      }
      if (response.success === false) {
        toast.error(response.message);
      }
    }
  };

  console.log(additionalDetailsForm);

  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {/* First Form */}
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title="Qualification"
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={submitQualification}>
            <Typography variant="h6" gutterBottom>
              Qualification Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="diploma">Diploma</InputLabel>
                  <Select
                    labelId="diploma"
                    label="Diploma"
                    multiple
                    name="diploma"
                    value={qualificationForm.diploma || []}
                    onChange={(e) => handleQualificationChange('diploma', e.target.value)}
                    renderValue={(selected) =>
                      diplomaData
                        .filter((item) => selected.includes(item._id))
                        .map((item) => item.diploma)
                        .join(', ')
                    }
                  >
                    {diplomaData.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        <Checkbox checked={qualificationForm.diploma.includes(item._id)} />
                        <ListItemText primary={item.diploma} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="graduation">Graduation</InputLabel>
                  <Select
                    labelId="graduation"
                    label="Graduation"
                    multiple
                    name="graduation"
                    value={qualificationForm.graduation || []}
                    onChange={(e) => handleQualificationChange('graduation', e.target.value)}
                    renderValue={(selected) =>
                      graduationData
                        .filter((item) => selected.includes(item._id))
                        .map((item) => item.graduation)
                        .join(', ')
                    }
                  >
                    {graduationData.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        <Checkbox checked={qualificationForm.graduation.includes(item._id)} />
                        <ListItemText primary={item.graduation} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="postGraduation">Post Graduation</InputLabel>
                  <Select
                    labelId="postGraduation"
                    label="Post Graduation"
                    multiple
                    name="postGraduation"
                    value={qualificationForm.postGraduation || []}
                    onChange={(e) => handleQualificationChange('postGraduation', e.target.value)}
                    renderValue={(selected) =>
                      postGraduationData
                        .filter((item) => selected.includes(item._id))
                        .map((item) => item.postGraduation)
                        .join(', ')
                    }
                  >
                    {postGraduationData.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        <Checkbox checked={qualificationForm.postGraduation.includes(item._id)} />
                        <ListItemText primary={item.postGraduation} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="superSpecialization">Super Specialization</InputLabel>
                  <Select
                    labelId="superSpecialization"
                    label="Super Specialization"
                    multiple
                    name="superSpecialization"
                    value={qualificationForm.superSpecialization || []}
                    onChange={(e) => handleQualificationChange('superSpecialization', e.target.value)}
                    renderValue={(selected) =>
                      superSpecialization
                        .filter((item) => selected?.includes(item._id))
                        .map((item) => item.superSpecialization)
                        .join(', ')
                    }
                  >
                    {superSpecialization.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        <Checkbox checked={qualificationForm.superSpecialization.includes(item._id)} />
                        <ListItemText primary={item.superSpecialization} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Other Qualification"
                  name="otherQualification"
                  value={qualificationForm.otherQualification}
                  onChange={(e) => handleQualificationChange('otherQualification', e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Second Form */}
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title="Additional Details"
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Registration No"
                  name="registrationNo"
                  value={additionalDetailsForm.registrationNo}
                  onChange={handleAdditionalDetailsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Council Name</InputLabel>
                  <Select
                    name="councilName"
                    value={additionalDetailsForm.councilName || ''}
                    onChange={handleAdditionalDetailsChange}
                    label={'Council Name'}
                  >
                    {allCouncils.length > 0 &&
                      allCouncils?.map(({ council, _id }) => (
                        <MenuItem key={_id} value={_id}>
                          {council}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={additionalDetailsForm.isVerified || ''} onChange={handleIsVerified} name="isVerified" />}
                    label="Check to Verify"
                  />
                  <Button
                    type="button"
                    variant="contained"
                    sx={{
                      backgroundColor: additionalDetailsForm.isVerified ? 'green' : 'red',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: additionalDetailsForm.isVerified ? 'green' : 'red'
                      }
                    }}
                  >
                    {additionalDetailsForm.isVerified ? 'Verified' : 'Non-Verified'}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel id="verified-by-label">Verified By</InputLabel>
                    <Select
                      labelId="verified-by-label"
                      value={additionalDetailsForm.verifiedBy || ''}
                      name="verifiedBy"
                      onChange={handleAdditionalDetailsChange}
                      label="Verified By"
                    >
                      {administrativeData.length > 0 ? (
                        administrativeData.map((item, index) => (
                          <MenuItem value={item._id} key={index._id}>
                            {item.basicDetails.firstName} {item.basicDetails.lastName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </form>

          {/* Display Selected Details */}
          {additionalDetailsForm.verifiedBy && (
            <Box
              sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: 400,
                marginLeft: 'auto'
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                <strong>Date:</strong> {additionalDetailsForm.date}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                <strong>Time:</strong> {additionalDetailsForm.time}
              </Typography>
            </Box>
          )}

          <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" onClick={submitAdditionalDetails}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Qualification;

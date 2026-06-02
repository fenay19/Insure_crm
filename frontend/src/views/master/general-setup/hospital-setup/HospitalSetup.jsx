import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Divider,
  Modal,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { FaPlus, FaTrash } from 'react-icons/fa';
import REACT_APP_API_URL, { get, put, retrieveToken } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import { setHospitalData } from 'reduxSlices/hospitalData';
import { useSelector, useDispatch } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4
};

const HospitalSetup = ({ primaryHosHandler, setHospiDetail }) => {
  const [isPharmacy, setIsPharmacy] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [headerImagePreview, setHeaderImagePreview] = useState('');
  const [hospitalLogoPreview, setHospitalLogoPreview] = useState('');
  const [hospitalBranch, setHospitalBranch] = useState([]);
  const [hospitalId, setHospitalId] = useState('');
  const [branchDetails, setBranchDetails] = useState([{ branchName: '', address: '', pincode: '', registrationNumber: '' }]);
  const [form, setForm] = useState({
    hospitalName: '',
    hospitalAddress: '',
    State: '',
    City: '',
    District: '',
    Pincode: '',
    mobileNumber: '',
    landlineNumber: '',
    email: '',
    website: '',
    hospitalRegistrationNumber: '',
    gst: '',
    headerImage: null,
    hospitalLogo: null,
    isPharmacy: isPharmacy,
    isPrimary: false
  });
  const [pharmacyDetail, setPharmacyDetail] = useState({
    pharmacyName: '',
    pharmacyAddress: '',
    pincode: '',
    phoneNumber: '',
    gstNumber: '',
    logo: null,
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [fetchedHeaderImage, setFetchedHeaderImage] = useState('dfsd');
  const [fetchedHospitalLogo, setFetchedHospitalLogo] = useState('sdfd');
  const data = useSelector((state) => state.hospitalData);
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};
    if (!form.hospitalName) newErrors.hospitalName = 'Hospital Name is required';
    if (!form.hospitalAddress) newErrors.hospitalAddress = 'Hospital Address is required';
    if (!form.Pincode.match(/^[0-9]{6}$/)) newErrors.Pincode = 'Pincode should be 6 digits';
    if (!form.mobileNumber.match(/^[0-9]{10}$/)) newErrors.mobileNumber = 'Mobile Number should be 10 digits';
    if (form.landlineNumber && !form.landlineNumber.match(/^[0-9]{10}$/)) newErrors.landlineNumber = 'Landline should be 10 digits';
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Invalid email format';
    if (!form.website) newErrors.website = 'Invalid website URL';
    if (!form.hospitalRegistrationNumber) newErrors.hospitalRegistrationNumber = 'Hospital Registration Number is required';
    if (!form.gst) newErrors.gst = 'Invalid GST Format';

    branchDetails.forEach((branch, index) => {
      if (!branch.branchName) newErrors[`branchName${index}`] = 'Branch Name is required';
      if (!branch.address) newErrors[`address${index}`] = 'Address is required';
      if (!branch.pincode.match(/^[0-9]{6}$/)) newErrors[`pincode${index}`] = 'Pincode should be 6 digits';
      if (!branch.registrationNumber) newErrors[`registrationNumber${index}`] = 'Registration Number is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      if (name === 'headerImage') {
        setForm((prevForm) => ({
          ...prevForm,
          [name]: file
        }));
        setHeaderImagePreview(URL.createObjectURL(file));
      } else if (name === 'hospitalLogo') {
        setForm((prevForm) => ({
          ...prevForm,
          [name]: file
        }));
        setHospitalLogoPreview(URL.createObjectURL(file));
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleChangeBranch = (index, event) => {
    const { name, value } = event.target;
    const updatedBranchDetails = [...branchDetails];
    updatedBranchDetails[index][name] = value;
    setBranchDetails(updatedBranchDetails);
  };

  const handleAddBranch = () => {
    setBranchDetails([...branchDetails, { branchName: '', address: '', pincode: '', registrationNumber: '' }]);
  };

  const handleRemoveBranch = (index) => {
    setBranchDetails(branchDetails.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (form.Pincode > 5) {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${form.Pincode}`);
          const data = response.data[0].PostOffice[0];
          setForm({ ...form, City: data.District, District: data.District, State: data.State });
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
      }
    };
    fetchData();
  }, [form.Pincode]);

  const fetchHospitalSetup = async () => {
    try {
      const response = await get('company-setup');
      if (response && response.data && response.data.length > 0) {
        const companyData = response.data[0];
        dispatch(setHospitalData(companyData));
        setHospitalId(companyData._id);
        setForm((prevForm) => ({
          ...prevForm,
          hospitalName: companyData.hospitalName || '',
          hospitalAddress: companyData.hospitalAddress || '',
          Pincode: companyData.Pincode || '',
          mobileNumber: companyData.mobileNumber || '',
          landlineNumber: companyData.landlineNumber || '',
          email: companyData.email || '',
          website: companyData.website || '',
          hospitalRegistrationNumber: companyData.hospitalRegistrationNumber || '',
          gst: companyData.gst || '',
          isPharmacy: companyData.isPharmacy || false
        }));

        if (companyData.branchDetails && Array.isArray(companyData.branchDetails)) {
          setBranchDetails(
            companyData.branchDetails.map((branch) => ({
              branchName: branch.branchName || '',
              address: branch.address || '',
              pincode: branch.pincode || '',
              registrationNumber: branch.registrationNumber || ''
            }))
          );
        }

        if (companyData.headerImage && companyData.headerImage.data) {
          setFetchedHeaderImage(companyData?.headerImage?.data);
        }

        if (companyData.hospitalLogo && companyData.hospitalLogo.data) {
          setFetchedHospitalLogo(companyData?.hospitalLogo?.data);
        }
      } else {
        console.warn('No company data found.');
      }
    } catch (error) {
      console.error('Error fetching company setup:', error);
    }
  };

  useEffect(() => {
    fetchHospitalSetup();
  }, []);

  // const handleSubmit = async () => {
  //   if (validate()) {
  //     if (!hospitalId) {
  //       toast.error('Hospital ID is missing')
  //       return
  //     }

  //     try {
  //       const formData = new FormData()
  //       const token = retrieveToken()

  //       // Append form data
  //       Object.keys(form).forEach(key => {
  //         if (form[key] instanceof File) {
  //           formData.append(key, form[key]) // File data
  //         } else {
  //           formData.append(key, form[key]) // Other data
  //         }
  //       })
  //       // Append branch details as a JSON string
  //       formData.append('branchDetails', JSON.stringify(branchDetails))

  //       // Submit the form data

  //       const response = await fetch(`${REACT_APP_API_URL}company-setup/${hospitalId}`, {
  //         method: 'PUT',
  //         body: formData,
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })

  //       const data = await response.json()

  //       if (data.success === true) {
  //         toast.success(data.msg)
  //         fetchHospitalSetup()
  //       } else {
  //         toast.error('Something went wrong !')
  //       }

  //       // localStorage.setItem('loginData', JSON.stringify(response.updateDetail))
  //     } catch (error) {
  //       console.error('Error submitting form:', error)
  //       toast.error('Failed to save, please try again.')
  //     }
  //   }
  // }

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const formData = new FormData();
        const token = retrieveToken();

        // Append form data fields
        Object.keys(form).forEach((key) => {
          if (form[key] instanceof File) {
            formData.append(key, form[key]); // Append file data
          } else {
            formData.append(key, form[key]); // Append regular fields
          }
        });

        // Convert branch details to JSON string and append
        formData.append('branchDetails', JSON.stringify(branchDetails));

        const url = hospitalId ? `${REACT_APP_API_URL}company-setup/${hospitalId}` : `${REACT_APP_API_URL}company-setup`;

        const method = hospitalId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success === true) {
          toast.success(data.msg || 'Company setup saved successfully!');
          fetchHospitalSetup();
        } else {
          toast.error(data.msg || 'Something went wrong while saving data.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to save company details. Please try again later.');
      }
    }
  };

  const handlePharmacyCheck = () => {
    setIsPharmacy(!isPharmacy);
    setForm({ ...form, isPharmacy: isPharmacy });
    if (!isPharmacy) {
      setOpen(true);
    }
  };

  const handlePharmacyChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo' && files) {
      const file = files[0];
      setPharmacyDetail({
        ...pharmacyDetail,
        [name]: file
      });
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setPharmacyDetail({
        ...pharmacyDetail,
        [name]: value
      });
    }
  };

  const handlePharmacySubmit = () => {
    const formData = { ...pharmacyDetail };
    setOpen(false);
  };

  // useEffect(() => {
  //   return () => {
  //     if (form.headerImage instanceof File) {
  //       URL.revokeObjectURL(form.headerImage);
  //     }
  //   };
  // }, [form.headerImage]);

  // useEffect(() => {
  //   let objectUrl;
  //   if (form.hospitalLogo instanceof File) {
  //     objectUrl = URL.createObjectURL(form.hospitalLogo);
  //   }

  //   return () => {
  //     if (objectUrl) {
  //       URL.revokeObjectURL(objectUrl);
  //     }
  //   };
  // }, [form.hospitalLogo]);

  useEffect(() => {
    if (form.headerImage instanceof File) {
      const objectUrl = URL.createObjectURL(form.headerImage);
      setHeaderImagePreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [form.headerImage]);

  useEffect(() => {
    if (form.hospitalLogo instanceof File) {
      const objectUrl = URL.createObjectURL(form.hospitalLogo);
      setHospitalLogoPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [form.hospitalLogo]);

  return (
    <>
      <Breadcrumb title="Hospital Setup">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Hospital Setup
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {/* First Row */}
                <Grid item xs={4}>
                  <TextField
                    label="Hospital Name"
                    name="hospitalName"
                    value={form.hospitalName}
                    onChange={handleChange}
                    error={!!errors.hospitalName}
                    helperText={errors.hospitalName}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Hospital Address"
                    name="hospitalAddress"
                    value={form.hospitalAddress}
                    onChange={handleChange}
                    error={!!errors.hospitalAddress}
                    helperText={errors.hospitalAddress}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Pincode"
                    name="Pincode"
                    value={form.Pincode}
                    onChange={handleChange}
                    error={!!errors.Pincode}
                    helperText={errors.Pincode}
                    inputProps={{
                      maxLength: 6,
                      minLength: 6
                    }}
                    fullWidth
                  />
                </Grid>

                {/* Second Row */}
                <Grid item xs={4}>
                  <TextField label="City" name="City" value={form.City} fullWidth disabled />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="State" name="State" value={form.State} fullWidth disabled />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="District" name="District" value={form.District} onChange={handleChange} fullWidth />
                </Grid>

                {/* Third Row */}
                <Grid item xs={4}>
                  <TextField
                    label="Mobile Number"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Landline"
                    name="landlineNumber"
                    value={form.landlineNumber}
                    onChange={handleChange}
                    error={!!errors.landlineNumber}
                    helperText={errors.landlineNumber}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                  />
                </Grid>

                {/* Additional Fields */}
                <Grid item xs={6}>
                  <TextField
                    label="Website Link"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    error={!!errors.website}
                    helperText={errors.website}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Hospital Registration Number"
                    name="hospitalRegistrationNumber"
                    value={form.hospitalRegistrationNumber}
                    onChange={handleChange}
                    error={!!errors.hospitalRegistrationNumber}
                    helperText={errors.hospitalRegistrationNumber}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="GST Number"
                    name="gst"
                    value={form.gst}
                    onChange={handleChange}
                    error={!!errors.gst}
                    helperText={errors.gst}
                    fullWidth
                    inputProps={{
                      maxLength: 15,
                      minLength: 15
                    }}
                  />
                </Grid>

                {/* File Inputs */}
                <Grid item xs={3}>
                  <TextField
                    type="file"
                    label="Header Image"
                    name="headerImage"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  {form.headerImage instanceof File ? (
                    <img src={URL.createObjectURL(form.headerImage)} style={{ width: '100px', margin: '10px 0' }} alt="Header img" />
                  ) : fetchedHeaderImage ? (
                    <img
                      src={`data:image/png;base64, ${fetchedHeaderImage}`}
                      style={{ width: '100px', margin: '10px 0' }}
                      alt="Header img"
                    />
                  ) : null}
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    type="file"
                    label="Logo"
                    name="hospitalLogo"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  {form.hospitalLogo instanceof File ? (
                    <img src={URL.createObjectURL(form.hospitalLogo)} style={{ width: '100px', margin: '10px 0' }} alt="Company Logo" />
                  ) : fetchedHospitalLogo ? (
                    <img
                      src={`data:image/png;base64, ${fetchedHospitalLogo}`}
                      style={{ width: '100px', margin: '10px 0' }}
                      alt="Company Logo"
                    />
                  ) : null}
                </Grid>

                <Grid item xs={4}>
                  <FormControlLabel label="Is Pharmacy" control={<Checkbox checked={isPharmacy} onChange={handlePharmacyCheck} />} />
                  {isPharmacy && (
                    <p style={{ color: 'red' }} onClick={() => setOpen(true)}>
                      View Form
                    </p>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography style={{ margin: '1rem 0' }} variant="h6">
                    Branch Details
                  </Typography>
                  {branchDetails.map((branch, index) => (
                    <Grid container spacing={2} key={index} alignItems="center" style={{ marginBottom: '10px' }}>
                      <Grid item xs={3}>
                        <TextField
                          label="Branch Name"
                          name="branchName"
                          value={branch.branchName}
                          onChange={(e) => handleChangeBranch(index, e)}
                          error={!!errors[`branchName${index}`]}
                          helperText={errors[`branchName${index}`]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Address"
                          name="address"
                          value={branch.address}
                          onChange={(e) => handleChangeBranch(index, e)}
                          error={!!errors[`address${index}`]}
                          helperText={errors[`address${index}`]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          label="Pincode"
                          name="pincode"
                          value={branch.pincode}
                          onChange={(e) => handleChangeBranch(index, e)}
                          error={!!errors[`pincode${index}`]}
                          helperText={errors[`pincode${index}`]}
                          fullWidth
                          inputProps={{
                            maxLength: 6,
                            minLength: 6
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Registration Number"
                          name="registrationNumber"
                          value={branch.registrationNumber}
                          onChange={(e) => handleChangeBranch(index, e)}
                          error={!!errors[`registrationNumber${index}`]}
                          helperText={errors[`registrationNumber${index}`]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleRemoveBranch(index)} color="secondary">
                          <FaTrash />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaPlus />}
                    onClick={handleAddBranch}
                    style={{ marginTop: '16px' }}
                  >
                    Add Branch
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style}>
          <h4> pharmacy Details</h4>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        label="Pharmacy Name"
                        name="pharmacyName"
                        value={pharmacyDetail.pharmacyName}
                        onChange={handlePharmacyChange}
                        error={!!errors.pharmacyName}
                        helperText={errors.pharmacyName}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Pharmacy Address"
                        name="pharmacyAddress"
                        value={pharmacyDetail.pharmacyAddress}
                        onChange={handlePharmacyChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Pincode"
                        name="pincode"
                        value={pharmacyDetail.pincode}
                        onChange={handlePharmacyChange}
                        fullWidth
                        inputProps={{
                          maxLength: 6,
                          minLength: 6
                        }}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={pharmacyDetail.phoneNumber}
                        onChange={handlePharmacyChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="GST Number"
                        name="gstNumber"
                        value={pharmacyDetail.gstNumber}
                        onChange={handlePharmacyChange}
                        fullWidth
                        inputProps={{
                          maxLength: 15,
                          minLength: 15
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField label="Email" name="email" value={pharmacyDetail.email} onChange={handlePharmacyChange} fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        type="file"
                        label="Logo"
                        name="logo"
                        onChange={handlePharmacyChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                      {logoPreview && (
                        <div style={{ marginTop: '10px' }}>
                          <Typography variant="body2">Logo Preview:</Typography>
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" onClick={handlePharmacySubmit}>
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={handleClose} style={{ marginLeft: '10px' }}>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* <ToastContainer /> */}
    </>
  );
};

export default HospitalSetup;

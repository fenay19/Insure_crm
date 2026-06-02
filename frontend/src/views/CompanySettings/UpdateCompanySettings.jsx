import React, { useState, useEffect, useRef } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import REACT_APP_API_URL, { get, put, retrieveToken } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowBack } from '@mui/icons-material';

const UpdateCompanySettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  let pincodeTimeout = useRef();

  const [logoPreview, setLogoPreview] = useState('');
  const [expCenterErrors, setExpCenterErrors] = useState({});

  const [form, setForm] = useState({
    clientName: '',
    officialMailId: '',
    officialPhoneNo: '',
    altPhoneNo: '',
    website: '',
    gstNo: '',
    officeAddress: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    companyLogo: null
  });

  const [expCenter, setExpCenter] = useState([
    {
      name: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      gstNo: ''
    }
  ]);
  const [warehouse, setWarehouse] = useState([{ name: '', address: '', pincode: '', city: '', state: '', country: '', gstNo: '' }]);
  const [factories, setFactories] = useState([{ name: '', address: '', pincode: '', city: '', state: '', country: '', gstNo: '' }]);
  const [branches, setBranches] = useState([{ name: '', address: '', pincode: '', city: '', state: '', country: '', gstNo: '' }]);

  const [showExpCenter, setShowExpCenter] = useState(false);
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [showFactories, setShowFactories] = useState(false);
  const [showBranches, setShowBranches] = useState(false);

  const [errors, setErrors] = useState({});
  const [expErrors, setExpErrors] = useState([]);
  const [warehouseErrors, setWarehouseErrors] = useState([]);
  const [factoriesErrors, setFactoriesErrors] = useState([]);
  const [branchesErrors, setBranchesErrors] = useState([]);

  const addForm = (section) => {
    const setterMap = {
      expCenter: setExpCenter,
      warehouse: setWarehouse,
      factories: setFactories,
      branches: setBranches
    };

    setterMap[section]((prev) => [...prev, { name: '', address: '', pincode: '', city: '', state: '', country: '', gstNo: '' }]);
  };

  const removeForm = (section, index) => {
    const setterMap = {
      expCenter: setExpCenter,
      warehouse: setWarehouse,
      factories: setFactories,
      branches: setBranches
    };

    setterMap[section]((prev) => prev.filter((_, i) => i !== index));
  };
  // fetch existing data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await get(`/clientRegistration/${id}`);

        if (res.status === 'true' && res.data) {
          const d = res.data;

          // Main form
          setForm({
            clientName: d.clientName || '',
            officialMailId: d.officialMailId || '',
            officialPhoneNo: d.officialPhoneNo || '',
            altPhoneNo: d.altPhoneNo || '',
            website: d.website || '',
            gstNo: d.gstNo || '',
            officeAddress: d.officeAddress || '',
            pincode: d.pincode || '',
            country: d.country || '',
            state: d.state || '',
            city: d.city || '',
            companyLogo: d.logo || null
          });

          setLogoPreview(d.logo || '');

          // Export Center (Array support)
          if (Array.isArray(d.locations?.exportCenter) && d.locations.exportCenter.length > 0) {
            setExpCenter(
              d.locations.exportCenter.map((exp) => ({
                name: exp.name || '',
                address: exp.address || '',
                pincode: exp.pincode || '',
                country: exp.country || '',
                state: exp.state || '',
                city: exp.city || '',
                gstNo: exp.gstNo || ''
              }))
            );
            setShowExpCenter(true);
          } else {
            setExpCenter([
              {
                name: '',
                address: '',
                pincode: '',
                country: '',
                state: '',
                city: '',
                gstNo: ''
              }
            ]);
            setShowExpCenter(false);
          }

          // Warehouse (Array support)
          if (Array.isArray(d.locations?.warehouse) && d.locations.warehouse.length > 0) {
            setWarehouse(
              d.locations.warehouse.map((wh) => ({
                name: wh.name || '',
                address: wh.address || '',
                pincode: wh.pincode || '',
                country: wh.country || '',
                state: wh.state || '',
                city: wh.city || '',
                gstNo: wh.gstNo || ''
              }))
            );
            setShowWarehouse(true);
          } else {
            setWarehouse([
              {
                name: '',
                address: '',
                pincode: '',
                country: '',
                state: '',
                city: '',
                gstNo: ''
              }
            ]);
            setShowWarehouse(false);
          }

          // Factories (Array support)
          if (Array.isArray(d.locations?.factories) && d.locations.factories.length > 0) {
            setFactories(
              d.locations.factories.map((f) => ({
                name: f.name || '',
                address: f.address || '',
                pincode: f.pincode || '',
                country: f.country || '',
                state: f.state || '',
                city: f.city || '',
                gstNo: f.gstNo || ''
              }))
            );
            setShowFactories(true);
          } else {
            setFactories([
              {
                name: '',
                address: '',
                pincode: '',
                country: '',
                state: '',
                city: '',
                gstNo: ''
              }
            ]);
            setShowFactories(false);
          }

          // Branches (Array support)
          if (Array.isArray(d.locations?.branches) && d.locations.branches.length > 0) {
            setBranches(
              d.locations.branches.map((b) => ({
                name: b.name || '',
                address: b.address || '',
                pincode: b.pincode || '',
                country: b.country || '',
                state: b.state || '',
                city: b.city || '',
                gstNo: b.gstNo || ''
              }))
            );
            setShowBranches(true);
          } else {
            setBranches([
              {
                name: '',
                address: '',
                pincode: '',
                country: '',
                state: '',
                city: '',
                gstNo: ''
              }
            ]);
            setShowBranches(false);
          }
        } else {
          toast.error('Failed to fetch data.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching data');
      }
    };

    fetchClient();
  }, [id]);

  // fetch pincode information
  const fetchPincodeDetails = async (value, section, index = null) => {
    try {
      const resp = await fetch(`https://api.postalpincode.in/pincode/${value}`);
      const [data] = await resp.json();

      if (data.Status === 'Success' && data.PostOffice.length > 0) {
        const { District, State, Country } = data.PostOffice[0];
        const update = { city: District, state: State, country: Country };

        const setterMap = {
          form: setForm,
          expCenter: setExpCenter,
          warehouse: setWarehouse,
          factories: setFactories,
          branches: setBranches
        };

        setterMap[section]((prevState) => {
          if (Array.isArray(prevState) && index !== null) {
            return prevState.map((item, i) => (i === index ? { ...item, ...update } : item));
          } else {
            return { ...prevState, ...update };
          }
        });
      } else {
        toast.error('Invalid pincode');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error fetching pincode info');
    }
  };

  // handlers with debounce
  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setLogoPreview(files[0]); // always set new file
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      // your existing logic for pincode, etc.
    }
  };

  const handleExpCenterChange = (e, index) => {
    const { name, value } = e.target;
    let field = '';

    if (name === 'expCenterPincode') {
      field = 'pincode';
      clearTimeout(pincodeTimeout);
      if (value.match(/^\d{6}$/)) {
        pincodeTimeout.current = setTimeout(() => {
          fetchPincodeDetails(value, 'expCenter', index);
        }, 500);
      }
    } else {
      field = name.replace('expCenter', '');
      field = field.charAt(0).toLowerCase() + field.slice(1);
    }

    // Update the specific center object at index
    setExpCenter((prev) => {
      const updatedExpCenters = [...prev]; // Copy previous state
      updatedExpCenters[index] = {
        ...updatedExpCenters[index], // Spread the current object
        [field]: value // Update the field
      };
      return updatedExpCenters; // Return updated array
    });
  };

  const handleWarehouseChange = (e, index) => {
    const { name, value } = e.target;
    let field = '';

    if (name === 'warehousePincode') {
      field = 'pincode';
      clearTimeout(pincodeTimeout.current);
      if (/^\d{6}$/.test(value)) {
        pincodeTimeout.current = setTimeout(() => {
          fetchPincodeDetails(value, 'warehouse', index);
        }, 500);
      }
    } else {
      field = name.replace('warehouse', '');
      field = field.charAt(0).toLowerCase() + field.slice(1);
    }

    setWarehouse((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleFactoriesChange = (e, index) => {
    const { name, value } = e.target;
    let field = '';

    if (name === 'factoriesPincode') {
      field = 'pincode';
      clearTimeout(pincodeTimeout.current);
      if (/^\d{6}$/.test(value)) {
        pincodeTimeout.current = setTimeout(() => {
          fetchPincodeDetails(value, 'factories', index);
        }, 500);
      }
    } else {
      field = name.replace('factories', '');
      field = field.charAt(0).toLowerCase() + field.slice(1);
    }

    setFactories((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleBranchesChange = (e, index) => {
    const { name, value } = e.target;
    let field = '';

    if (name === 'branchesPincode') {
      field = 'pincode';
      clearTimeout(pincodeTimeout.current);
      if (/^\d{6}$/.test(value)) {
        pincodeTimeout.current = setTimeout(() => {
          fetchPincodeDetails(value, 'branches', index);
        }, 500);
      }
    } else {
      field = name.replace('branches', '');
      field = field.charAt(0).toLowerCase() + field.slice(1);
    }

    setBranches((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      console.log('Updated branches:', updated);
      return updated;
    });
  };

  // validation
  const validateSection = (data, _, setErrors, sectionName = '') => {
    const allErrors = [];
    let hasError = false;

    data.forEach((item, index) => {
      const itemErrors = {};

      if (!item.name) itemErrors.name = 'Name is required';
      if (!item.address) itemErrors.address = 'Address is required';
      if (!item.pincode || !/^\d{6}$/.test(item.pincode)) itemErrors.pincode = 'Valid 6-digit pincode required';
      if (!item.city) itemErrors.city = 'City is required';
      if (!item.state) itemErrors.state = 'State is required';
      if (!item.country) itemErrors.country = 'Country is required';
      // if (!item.gstNo || !/^[0-9A-Z]{15}$/.test(item.gstNo)) itemErrors.gstNo = '15-char GST No required';

      if (Object.keys(itemErrors).length > 0) {
        hasError = true;

        // 👇 Construct a readable error string
        const fieldErrors = Object.entries(itemErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');

        toast.error(`${sectionName} ${index + 1} ➤ ${fieldErrors}`);
      }

      allErrors.push(itemErrors);
    });

    setErrors(allErrors);
    return !hasError;
  };

  const validateMain = () => {
    const err = {};
    if (!form.clientName) err.clientName = 'Required';
    if (!form.officialMailId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.officialMailId)) err.officialMailId = 'Valid email required';
    if (!form.officialPhoneNo || !/^\d{10}$/.test(form.officialPhoneNo)) err.officialPhoneNo = '10-digit mobile required';
    if (form.altPhoneNo && !/^\d{10}$/.test(form.altPhoneNo)) err.altPhoneNo = '10-digit alt mobile';
    if (!form.website) err.website = 'Website required';
    // if (!form.gstNo || !/^[0-9A-Z]{15}$/.test(form.gstNo)) err.gstNo = '15 char GST';
    if (!form.officeAddress) err.officeAddress = 'Address required';
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) err.pincode = '6-digit pincode';
    if (!form.city) err.city = 'City required';
    if (!form.state) err.state = 'State required';
    if (!form.country) err.country = 'Country required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateAll = () => {
    const errors = [];

    if (!form.clientName?.trim()) errors.push('clientName');
    if (!form.officialMailId?.trim()) errors.push('officialMailId');
    if (!form.officialPhoneNo?.trim()) errors.push('officialPhoneNo');
    if (!form.gstNo?.trim()) errors.push('gstNo');
    if (!form.officeAddress?.trim()) errors.push('officeAddress');

    if (errors.length > 0) {
      console.log('Validation failed. Missing fields:', errors);
      return false;
    }

    return true;
  };

  const handleDeleteLogo = () => {
    setForm((prev) => ({ ...prev, companyLogo: null }));
    setLogoPreview(null);
  };

  // submission
  // const handleSubmit = async () => {
  //   // if (!validateAll()) {
  //   //   console.log('Validation failed');
  //   //   return;
  //   // }

  //   // ✅ Validate main form
  //   const isMainValid = validateMain(); // uses setErrors internally

  //   // ✅ Validate section arrays using your error states
  //   const isExpValid = showExpCenter ? validateSection(expCenter, null, setExpErrors, 'Export Center') : true;
  //   const isWhValid = showWarehouse ? validateSection(warehouse, null, setWarehouseErrors, 'Warehouse') : true;
  //   const isFacValid = showFactories ? validateSection(factories, null, setFactoriesErrors, 'Factory') : true;
  //   const isBranchValid = showBranches ? validateSection(branches, null, setBranchesErrors, 'Branch') : true;

  //   // ✅ Stop submission if any section fails validation
  //   if (!(isMainValid && isExpValid && isWhValid && isFacValid && isBranchValid)) {
  //     console.log('Validation failed');
  //     return;
  //   }

  //   const locations = {
  //     exportCenter: showExpCenter ? expCenter : null,
  //     warehouse: showWarehouse ? warehouse : null,
  //     factories: showFactories ? factories : null,
  //     branches: showBranches ? branches : null
  //   };
  //   const data = { ...form, locations };

  //   try {
  //     console.log('Submitting data:', data);
  //     const res = await put(`clientRegistration/${id}`, data);
  //     if (res.success === true) {
  //       toast.success('Updated successfully');
  //       navigate('/company-settings');
  //     } else toast.error('Update failed');
  //   } catch (e) {
  //     console.error(e);
  //     toast.error('Error updating');
  //   }
  // };

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;

    // normalize slashes
    const normalized = logoPath.replace(/\\/g, '/');

    // replace public/images with uploads
    const urlPath = normalized.replace('public/images', 'uploads');

    // prepend backend root URL, not /api/
    // console.log(`http://localhost:5050/api/${urlPath}`);

    return `${REACT_APP_API_URL}${urlPath}`;
  };

  const handleSubmit = async () => {
    const isMainValid = validateMain();
    const isExpValid = showExpCenter ? validateSection(expCenter, null, setExpErrors, 'Export Center') : true;
    const isWhValid = showWarehouse ? validateSection(warehouse, null, setWarehouseErrors, 'Warehouse') : true;
    const isFacValid = showFactories ? validateSection(factories, null, setFactoriesErrors, 'Factory') : true;
    const isBranchValid = showBranches ? validateSection(branches, null, setBranchesErrors, 'Branch') : true;

    if (!(isMainValid && isExpValid && isWhValid && isFacValid && isBranchValid)) {
      console.log('Validation failed');
      return;
    }

    const locations = {
      exportCenter: showExpCenter ? expCenter : null,
      warehouse: showWarehouse ? warehouse : null,
      factories: showFactories ? factories : null,
      branches: showBranches ? branches : null
    };

    try {
      const formData = new FormData();

      // Append primitive values
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'companyLogo') {
          formData.append(key, value);
        }
      });

      // Append file
      if (form.companyLogo instanceof File) {
        formData.append('logo', form.companyLogo); // 👈 must match `upload.single("logo")`
      }

      if (form.companyLogo && !(form.companyLogo instanceof File)) {
        console.error('Not a valid File object:', form.companyLogo);
      }

      // Append locations (stringify objects/arrays)
      formData.append('locations', JSON.stringify(locations));

      const res = await put(`clientRegistration/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success === true) {
        toast.success('Updated successfully');
        navigate('/company-settings');
      } else toast.error('Update failed');
    } catch (e) {
      console.error(e);
      toast.error('Error updating');
    }
  };

  const handleLogoDelete = () => {
    setForm((prev) => ({ ...prev, companyLogo: null }));
    setLogoPreview('');
  };

  return (
    <>
      <Breadcrumb title="Company Settings">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Company Settings
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Update Company Settings</Typography>
            <Button variant="contained" onClick={() => navigate('/company-settings')}>
              <ArrowBack />
            </Button>
          </Grid>
          <Card>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {/* Company Name */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Company Name"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    error={!!errors.clientName}
                    helperText={errors.clientName}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Email */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Email"
                    name="officialMailId"
                    value={form.officialMailId}
                    onChange={handleChange}
                    error={!!errors.officialMailId}
                    helperText={errors.officialMailId}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Mobile Number */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Mobile No."
                    name="officialPhoneNo"
                    value={form.officialPhoneNo}
                    onChange={handleChange}
                    error={!!errors.officialPhoneNo}
                    helperText={errors.officialPhoneNo}
                    inputProps={{
                      maxLength: 10,
                      minLength: 10
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Alternate Mobile Number */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Alternate Mobile No."
                    name="altPhoneNo"
                    value={form.altPhoneNo}
                    onChange={handleChange}
                    error={!!errors.altPhoneNo}
                    helperText={errors.altPhoneNo}
                    inputProps={{
                      maxLength: 10,
                      minLength: 10
                    }}
                    fullWidth
                  />
                </Grid>
                {/* Website Link */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Website Link"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    error={!!errors.website}
                    helperText={errors.website}
                    fullWidth
                    required
                  />
                </Grid>
                {/* GST Number */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="GST No."
                    name="gstNo"
                    value={form.gstNo}
                    onChange={handleChange}
                    error={!!errors.gstNo}
                    helperText={errors.gstNo}
                    inputProps={{
                      maxLength: 15,
                      minLength: 15
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Address */}
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Address"
                    name="officeAddress"
                    value={form.officeAddress}
                    onChange={handleChange}
                    error={!!errors.officeAddress}
                    helperText={errors.officeAddress}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Pincode */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    error={!!errors.pincode}
                    helperText={errors.pincode}
                    inputProps={{
                      maxLength: 6,
                      minLength: 6
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Country */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    error={!!errors.country}
                    helperText={errors.country}
                    fullWidth
                    required
                  />
                </Grid>
                {/* State */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    error={!!errors.state}
                    helperText={errors.state}
                    fullWidth
                    required
                  />
                </Grid>
                {/* City */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    fullWidth
                    required
                  />
                </Grid>

                {/* <Grid item xs={12} sm={3}>
                  <TextField
                    type="file"
                    label="Company Logo"
                    name="companyLogo"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  {logoPreview && (
                    <Box position="relative" display="inline-block" mt={2}>
                      <img src={logoPreview} alt="Company Logo" style={{ width: '100px', borderRadius: '4px' }} />
                      <IconButton
                        size="small"
                        onClick={handleDeleteLogo}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          left: -8,
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: '#f8d7da',
                            color: 'red'
                          }
                        }}
                      >
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  )}
                </Grid> */}

                <Grid item xs={12} sm={3}>
                  {!logoPreview && !form.companyLogo && (
                    <Button variant="contained" component="label" fullWidth>
                      Upload Logo
                      <input type="file" name="companyLogo" hidden accept="image/*" onChange={handleChange} />
                    </Button>
                  )}

                  {(logoPreview || form.companyLogo) && (
                    <Box position="relative" display="inline-block" mt={2}>
                      <img
                        src={logoPreview instanceof File ? URL.createObjectURL(logoPreview) : getLogoUrl(form.companyLogo)}
                        alt="Company Logo"
                        style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 4 }}
                      />

                      <IconButton
                        size="small"
                        onClick={handleDeleteLogo}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          left: -8,
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: '#f8d7da',
                            color: 'red'
                          }
                        }}
                      >
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={showExpCenter} onChange={(e) => setShowExpCenter(e.target.checked)} />}
                    label="Experience Center"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={showFactories} onChange={(e) => setShowFactories(e.target.checked)} />}
                    label="Factories"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={showWarehouse} onChange={(e) => setShowWarehouse(e.target.checked)} />}
                    label="Warehouse"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={showBranches} onChange={(e) => setShowBranches(e.target.checked)} />}
                    label="Branches"
                  />
                </Grid>
                {showExpCenter &&
                  expCenter?.map((item, index) => {
                    return (
                      <Box mt={2} px={2} key={index}>
                        <Typography ml={1} variant="h6" gutterBottom>
                          Experience Center
                        </Typography>
                        <Grid container spacing={gridSpacing}>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Center Name"
                              name="expCenterName"
                              value={item.name}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.name}
                              helperText={expCenterErrors.name}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Center Address"
                              name="expCenterAddress"
                              value={item.address}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.address}
                              helperText={expCenterErrors.address}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Pincode"
                              name="expCenterPincode"
                              value={item.pincode}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.pincode}
                              helperText={expCenterErrors.pincode}
                              inputProps={{
                                maxLength: 6,
                                minLength: 6
                              }}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Country"
                              name="expCenterCountry"
                              value={item.country}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.country}
                              helperText={expCenterErrors.country}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="State"
                              name="expCenterState"
                              value={item.state}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.state}
                              helperText={expCenterErrors.state}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="City"
                              name="expCenterCity"
                              value={item.city}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.city}
                              helperText={expCenterErrors.city}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="GST No."
                              name="expCenterGstNo"
                              value={item.gstNo}
                              onChange={(e) => handleExpCenterChange(e, index)}
                              error={!!expCenterErrors.gstNo}
                              helperText={expCenterErrors.gstNo}
                              inputProps={{
                                maxLength: 15,
                                minLength: 15
                              }}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} display="flex" alignItems="center">
                            <IconButton color="primary" onClick={() => addForm('expCenter')}>
                              <AddIcon fontSize="large" />
                            </IconButton>
                            <IconButton color="error" onClick={() => removeForm('expCenter', index)} disabled={expCenter.length === 1}>
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                {/* factory */}
                {showFactories && (
                  <>
                    {factories.map((item, index) => (
                      <Box mt={2} px={2} key={index}>
                        <Typography ml={3} variant="h6" gutterBottom>
                          Factory
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Factory Name"
                              name="factoriesName"
                              value={item.name}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.name}
                              helperText={factoriesErrors.name}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Factory Address"
                              name="factoriesAddress"
                              value={item.address}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.address}
                              helperText={factoriesErrors.address}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Pincode"
                              name="factoriesPincode"
                              value={item.pincode}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.pincode}
                              helperText={factoriesErrors.pincode}
                              inputProps={{
                                maxLength: 6,
                                minLength: 6
                              }}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Country"
                              name="factoriesCountry"
                              value={item.country}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.country}
                              helperText={factoriesErrors.country}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="State"
                              name="factoriesState"
                              value={item.state}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.state}
                              helperText={factoriesErrors.state}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="City"
                              name="factoriesCity"
                              value={item.city}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.city}
                              helperText={factoriesErrors.city}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="GST No."
                              name="factoriesGstNo"
                              value={item.gstNo}
                              onChange={(e) => handleFactoriesChange(e, index)}
                              error={!!factoriesErrors.gstNo}
                              helperText={factoriesErrors.gstNo}
                              inputProps={{
                                maxLength: 15,
                                minLength: 15
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} display="flex" alignItems="center">
                            <IconButton color="primary" onClick={() => addForm('factories')}>
                              <AddIcon fontSize="large" />
                            </IconButton>
                            <IconButton color="error" onClick={() => removeForm('factories', index)} disabled={factories.length === 1}>
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </>
                )}
                {showWarehouse && (
                  <>
                    {warehouse.map((item, index) => (
                      <Box mt={2} px={2} key={index}>
                        <Typography variant="h6" gutterBottom>
                          Warehouse
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Warehouse Name"
                              name="warehouseName"
                              value={item.name}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.address}
                              helperText={warehouseErrors.address}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Warehouse Address"
                              name="warehouseAddress"
                              value={item.address}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.address}
                              helperText={warehouseErrors.address}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Pincode"
                              name="warehousePincode"
                              value={item.pincode}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.pincode}
                              helperText={warehouseErrors.pincode}
                              inputProps={{
                                maxLength: 6,
                                minLength: 6
                              }}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Country"
                              name="warehouseCountry"
                              value={item.country}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.country}
                              helperText={warehouseErrors.country}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item sm={3}>
                            <TextField
                              label="State"
                              name="warehouseState"
                              value={item.state}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.state}
                              helperText={warehouseErrors.state}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="City"
                              name="warehouseCity"
                              value={item.city}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.city}
                              helperText={warehouseErrors.city}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="GST No."
                              name="warehouseGstNo"
                              value={item.gstNo}
                              onChange={(e) => handleWarehouseChange(e, index)}
                              error={!!warehouseErrors.gstNo}
                              helperText={warehouseErrors.gstNo}
                              inputProps={{
                                maxLength: 15,
                                minLength: 15
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} display="flex" alignItems="center">
                            <IconButton color="primary" onClick={() => addForm('warehouse')}>
                              <AddIcon fontSize="large" />
                            </IconButton>
                            <IconButton color="error" onClick={() => removeForm('warehouse', index)} disabled={warehouse.length === 1}>
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </>
                )}
                {showBranches && (
                  <>
                    {branches.map((item, index) => (
                      <Box mt={2} px={2} key={index}>
                        <Typography variant="h6" gutterBottom>
                          Branch
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Branch Name"
                              name="branchesName"
                              value={item.name}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.name}
                              helperText={branchesErrors.name}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Branch Address"
                              name="branchesAddress"
                              value={item.address}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.address}
                              helperText={branchesErrors.address}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Pincode"
                              name="branchesPincode"
                              value={item.pincode}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.pincode}
                              helperText={branchesErrors.pincode}
                              inputProps={{
                                maxLength: 6,
                                minLength: 6
                              }}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Country"
                              name="brancheCountry"
                              value={item.country}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.country}
                              helperText={branchesErrors.country}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="State"
                              name="brancheState"
                              value={item.state}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.state}
                              helperText={branchesErrors.state}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="City"
                              name="brancheCity"
                              value={item.city}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.city}
                              helperText={branchesErrors.city}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="GST No."
                              name="branchesGstNo"
                              value={item.gstNo}
                              onChange={(e) => handleBranchesChange(e, index)}
                              error={!!branchesErrors.gstNo}
                              helperText={branchesErrors.gstNo}
                              inputProps={{
                                maxLength: 15,
                                minLength: 15
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} display="flex" alignItems="center">
                            <IconButton color="primary" onClick={() => addForm('branches')}>
                              <AddIcon fontSize="large" />
                            </IconButton>
                            <IconButton color="error" onClick={() => removeForm('branches', index)} disabled={branches.length === 1}>
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </>
                )}
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
      <ToastContainer />
    </>
  );
};

export default UpdateCompanySettings;

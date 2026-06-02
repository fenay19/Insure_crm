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
    FormControlLabel,
    Checkbox,
    Box
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import REACT_APP_API_URL, { axiosInstance, get, put, retrieveToken } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Field renderer component for generating form fields
const FieldRenderer = ({
    fields,
    values,
    errors,
    handleChange,
    handleFileChange, // Added separate handler for file changes.
    gridSize = 4,
    containerSpacing = 2,
    gridContainerProps = {},
    logoPreview,
    handleDeleteLogo
}) => {
    return (
        <Grid container spacing={containerSpacing} {...gridContainerProps}>
            {fields.map((field) => (
                <Grid item xs={field.gridSize || gridSize} key={field.name}>
                    <TextField
                        label={field.label}
                        name={field.name}
                        value={field.type === 'file' ? '' : values[field.valueKey || field.name] || ''}
                        onChange={field.type === 'file' ? handleFileChange : handleChange}
                        error={!!errors[field.errorKey || field.valueKey || field.name]}
                        helperText={errors[field.errorKey || field.valueKey || field.name]}
                        fullWidth
                        required={field.required !== false}
                        multiline={field.multiline || false}
                        rows={field.rows || 1}
                        type={field.type || 'text'}
                        InputLabelProps={field.type === 'file' ? { shrink: true } : undefined}
                        inputProps={field.inputProps || {}}
                    />
                    {field.name === 'companyLogo' && logoPreview ? (
                        <Box position="relative" display="inline-block" mt={2}>
                            <img
                                src={logoPreview}
                                alt="Company Logo"
                                style={{ width: '100px', borderRadius: '4px' }}
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
                    ) : null}
                </Grid>
            ))}
        </Grid>
    );
};

// Section renderer for location-based forms
const LocationSectionRenderer = ({
    title,
    show,
    locations,
    errors,
    handleChange,
    includeGST = false,
    onAddLocation,
    onDeleteLocation
}) => {
    if (!show) return null;

    return (
        <Box mt={2}>
            <Typography ml={3} variant="h6" gutterBottom>
                {title === 'expCenter' ? 'Experience Center' :
                    title === 'branche' ? 'Branch' :
                        title.charAt(0).toUpperCase() + title.slice(1)}
            </Typography>

            {locations.map((location, index) => (
                <Grid container spacing={2} key={`${title}-${index}`} sx={{ mb: 2, ml: 1 }}>
                    <Grid item xs={2}>
                        <TextField
                            label="Address"
                            name={`${title}Address-${index}`}
                            value={location.address}
                            onChange={(e) => handleChange(title, index, 'address', e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            label="Pincode"
                            name={`${title}Pincode-${index}`}
                            value={location.pincode}
                            onChange={(e) => handleChange(title, index, 'pincode', e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 6, minLength: 6 }}
                            error={!!errors[index]?.pincode}
                            helperText={errors[index]?.pincode}
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            label="Country"
                            name={`${title}Country-${index}`}
                            value={location.country}
                            onChange={(e) => handleChange(title, index, 'country', e.target.value)}
                            fullWidth
                            required
                            error={!!errors[index]?.country}
                            helperText={errors[index]?.country}
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            label="State"
                            name={`${title}State-${index}`}
                            value={location.state}
                            onChange={(e) => handleChange(title, index, 'state', e.target.value)}
                            fullWidth
                            required
                            error={!!errors[index]?.state}
                            helperText={errors[index]?.state}
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            label="City"
                            name={`${title}City-${index}`}
                            value={location.city}
                            onChange={(e) => handleChange(title, index, 'city', e.target.value)}
                            fullWidth
                            required
                            error={!!errors[index]?.city}
                            helperText={errors[index]?.city}
                        />
                    </Grid>
                    {includeGST && (
                        <Grid item xs={2}>
                            <TextField
                                label="GST No."
                                name={`${title}GstNo-${index}`}
                                value={location.gstNo}
                                onChange={(e) => handleChange(title, index, 'gstNo', e.target.value)}
                                fullWidth
                                required
                                inputProps={{ maxLength: 15, minLength: 15 }}
                                error={!!errors[index]?.gstNo}
                                helperText={errors[index]?.gstNo}
                            />
                        </Grid>
                    )}
                    <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="primary"
                            onClick={() => onAddLocation(title)}
                            sx={{ mr: 1 }}
                        >
                            <FaPlus />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => onDeleteLocation(title, index)}
                        >
                            <FaTrash />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
};

const AddCompanySettings = () => {
    const [logoPreview, setLogoPreview] = useState('');
    const [logoFile, setLogoFile] = useState(null); // Separate state for the file object
    const [form, setForm] = useState({
        companyName: '',
        email: '',
        mobileNumber: '',
        alternateMobileNumber: '',
        websiteLink: '',
        gstNo: '',
        address: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
        // Removed companyLogo from the form state
    });

    // State for multiple locations
    const [expCenterLocations, setExpCenterLocations] = useState([{ address: '', pincode: '', country: '', state: '', city: '', gstNo: '' }]);
    const [warehouseLocations, setWarehouseLocations] = useState([{ address: '', pincode: '', country: '', state: '', city: '' }]);
    const [factoriesLocations, setFactoriesLocations] = useState([{ address: '', pincode: '', country: '', state: '', city: '' }]);
    const [branchesLocations, setBranchesLocations] = useState([{ address: '', pincode: '', country: '', state: '', city: '' }]);

    // Show/hide state for location sections
    const [showExpCenter, setShowExpCenter] = useState(false);
    const [showWarehouse, setShowWarehouse] = useState(false);
    const [showFactories, setShowFactories] = useState(false);
    const [showBranches, setShowBranches] = useState(false);

    // Error states
    const [errors, setErrors] = useState({});
    const [expCenterErrors, setExpCenterErrors] = useState([]);
    const [factoriesErrors, setFactoriesErrors] = useState([]);
    const [warehouseErrors, setWarehouseErrors] = useState([]);
    const [branchesErrors, setBranchesErrors] = useState([]);

    // Handle location field change
    const handleLocationChange = (locationType, index, field, value) => {
        let locationSetter;
        let locations;

        switch (locationType) {
            case 'expCenter':
                locationSetter = setExpCenterLocations;
                locations = [...expCenterLocations];
                break;
            case 'factories':
                locationSetter = setFactoriesLocations;
                locations = [...factoriesLocations];
                break;
            case 'warehouse':
                locationSetter = setWarehouseLocations;
                locations = [...warehouseLocations];
                break;
            case 'branche':
                locationSetter = setBranchesLocations;
                locations = [...branchesLocations];
                break;
            default:
                return;
        }

        locations[index] = { ...locations[index], [field]: value };
        locationSetter(locations);
    };

    // Add location row
    const handleAddLocation = (locationType) => {
        switch (locationType) {
            case 'expCenter':
                setExpCenterLocations([...expCenterLocations, { address: '', pincode: '', country: '', state: '', city: '', gstNo: '' }]);
                break;
            case 'factories':
                setFactoriesLocations([...factoriesLocations, { address: '', pincode: '', country: '', state: '', city: '' }]);
                break;
            case 'warehouse':
                setWarehouseLocations([...warehouseLocations, { address: '', pincode: '', country: '', state: '', city: '' }]);
                break;
            case 'branche':
                setBranchesLocations([...branchesLocations, { address: '', pincode: '', country: '', state: '', city: '' }]);
                break;
            default:
                return;
        }
    };

    // Delete location row
    const handleDeleteLocation = (locationType, index) => {
        switch (locationType) {
            case 'expCenter':
                if (expCenterLocations.length > 1) {
                    const newLocations = [...expCenterLocations];
                    newLocations.splice(index, 1);
                    setExpCenterLocations(newLocations);
                }
                break;
            case 'factories':
                if (factoriesLocations.length > 1) {
                    const newLocations = [...factoriesLocations];
                    newLocations.splice(index, 1);
                    setFactoriesLocations(newLocations);
                }
                break;
            case 'warehouse':
                if (warehouseLocations.length > 1) {
                    const newLocations = [...warehouseLocations];
                    newLocations.splice(index, 1);
                    setWarehouseLocations(newLocations);
                }
                break;
            case 'branche':
                if (branchesLocations.length > 1) {
                    const newLocations = [...branchesLocations];
                    newLocations.splice(index, 1);
                    setBranchesLocations(newLocations);
                }
                break;
            default:
                return;
        }
    };

    // Validation functions
    const validateMainForm = () => {
        const newErrors = {};
        if (!form.companyName) newErrors.companyName = 'Company Name is required';
        if (!form.email) newErrors.email = 'Email is required';
        if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Invalid email format';
        if (!form.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
        if (!form.mobileNumber.match(/^[0-9]{10}$/)) newErrors.mobileNumber = 'Mobile Number should be 10 digits';
        if (form.alternateMobileNumber && !form.alternateMobileNumber.match(/^[0-9]{10}$/)) {
            newErrors.alternateMobileNumber = 'Alternate Mobile Number should be 10 digits';
        }
        if (!form.websiteLink) newErrors.websiteLink = 'Website Link is required';
        if (!form.gstNo) newErrors.gstNo = 'GST Number is required';
        if (!form.gstNo.match(/^[0-9A-Z]{15}$/)) newErrors.gstNo = 'GST Number should be 15 characters';
        if (!form.address) newErrors.address = 'Address is required';
        if (!form.pincode) newErrors.pincode = 'Pincode is required';
        if (!form.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode should be 6 digits';
        if (!form.country) newErrors.country = 'Country is required';
        if (!form.state) newErrors.state = 'State is required';
        if (!form.city) newErrors.city = 'City is required';
        if (!logoFile) newErrors.companyLogo = 'Company Logo is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Common validation function for location sections
    const validateLocations = (locations, setErrorsFn, showLocation, requireGST = false) => {
        if (!showLocation) return true;

        const newErrors = [];
        let isValid = true;

        locations.forEach((location, index) => {
            const locationErrors = {};

            if (!location.address) locationErrors.address = 'Address is required';
            if (!location.pincode) locationErrors.pincode = 'Pincode is required';
            if (location.pincode && !location.pincode.match(/^[0-9]{6}$/)) {
                locationErrors.pincode = 'Pincode should be 6 digits';
            }
            if (!location.country) locationErrors.country = 'Country is required';
            if (!location.state) locationErrors.state = 'State is required';
            if (!location.city) locationErrors.city = 'City is required';

            if (requireGST) {
                if (!location.gstNo) locationErrors.gstNo = 'GST Number is required';
                if (location.gstNo && !location.gstNo.match(/^[0-9A-Z]{15}$/)) {
                    locationErrors.gstNo = 'GST Number should be 15 characters';
                }
            }

            newErrors[index] = locationErrors;
            if (Object.keys(locationErrors).length > 0) {
                isValid = false;
            }
        });

        setErrorsFn(newErrors);
        return isValid;
    };

    const validateExpCenterLocations = () => validateLocations(expCenterLocations, setExpCenterErrors, showExpCenter, true);
    const validateFactoriesLocations = () => validateLocations(factoriesLocations, setFactoriesErrors, showFactories);
    const validateWarehouseLocations = () => validateLocations(warehouseLocations, setWarehouseErrors, showWarehouse);
    const validateBranchesLocations = () => validateLocations(branchesLocations, setBranchesErrors, showBranches);

    const validate = () => {
        const mainFormValid = validateMainForm();
        const expCenterValid = validateExpCenterLocations();
        const factoriesValid = validateFactoriesLocations();
        const warehouseValid = validateWarehouseLocations();
        const branchesValid = validateBranchesLocations();

        return mainFormValid && expCenterValid && factoriesValid && warehouseValid && branchesValid;
    };

    const handleDeleteLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
    };

    // Main form change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Separate file input handler
    const handleFileChange = (e) => {
        const { files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                // Create complete payload with all form data
                const payload = {
                    // Main company information
                    ...form,
                    // Add logo file information separately
                    companyLogoName: logoFile ? logoFile.name : null,
                    // Additional sections data based on checkboxes
                    locations: {
                        exportCenter: showExpCenter ? expCenterLocations : [],
                        factories: showFactories ? factoriesLocations : [],
                        warehouse: showWarehouse ? warehouseLocations : [],
                        branches: showBranches ? branchesLocations : []
                    }
                };

                console.log("Complete Company Form Data:", payload);
                

                toast.success('Form data logged successfully!');
                // Actual API submission would go here in a production app
                // For a real API call, you would use FormData to include the file:
                /*
                const formData = new FormData();
                // Add all form fields
                Object.keys(form).forEach(key => formData.append(key, form[key]));
                // Add the file
                if (logoFile) {
                  formData.append('companyLogo', logoFile);
                }
                // Add location data as JSON string
                formData.append('locations', JSON.stringify({
                  exportCenter: showExpCenter ? expCenterLocations : [],
                  factories: showFactories ? factoriesLocations : [],
                  warehouse: showWarehouse ? warehouseLocations : [],
                  branches: showBranches ? branchesLocations : []
                }));
                // Then make the API call with the formData
                */
            } catch (error) {
                console.error('Error submitting form:', error);
                toast.error('Failed to process form data.');
            }
        }
    };

    // Define main form fields configuration
    const mainFormFields = [
        { label: "Company Name", name: "companyName", required: true },
        { label: "Email", name: "email", required: true },
        {
            label: "Mobile No.", name: "mobileNumber", required: true,
            inputProps: { maxLength: 10, minLength: 10 }
        },
        {
            label: "Alternate Mobile No.", name: "alternateMobileNumber", required: false,
            inputProps: { maxLength: 10, minLength: 10 }
        },
        { label: "Website Link", name: "websiteLink", required: true },
        {
            label: "GST No.", name: "gstNo", required: true,
            inputProps: { maxLength: 15, minLength: 15 }
        },
        { label: "Address", name: "address", required: true, multiline: true, rows: 2 },
        {
            label: "Pincode", name: "pincode", required: true,
            inputProps: { maxLength: 6, minLength: 6 }
        },
        { label: "Country", name: "country", required: true },
        { label: "State", name: "state", required: true },
        { label: "City", name: "city", required: true },
        {
            label: "Company Logo",
            name: "companyLogo",
            type: "file",
            required: true
        }
    ];

    return (
        <Card>
            <CardContent>
                {/* Header Section */}
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Grid item>
                        <Typography variant="h6">Add Company Settings</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" component={Link} to="/company-settings">
                            <ArrowBackIcon /> Back
                        </Button>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 4 }} />

                {/* Main Form */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FieldRenderer
                            fields={mainFormFields}
                            values={form}
                            errors={errors}
                            handleChange={handleChange}
                            handleFileChange={handleFileChange}
                            logoPreview={logoPreview}
                            handleDeleteLogo={handleDeleteLogo}
                        />
                    </Grid>

                    {/* Location Checkboxes */}
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

                    {/* Location Sections */}
                    {showExpCenter && (
                        <Grid item xs={12}>
                            <LocationSectionRenderer
                                title="expCenter"
                                show={showExpCenter}
                                locations={expCenterLocations}
                                errors={expCenterErrors}
                                handleChange={handleLocationChange}
                                onAddLocation={handleAddLocation}
                                onDeleteLocation={handleDeleteLocation}
                                includeGST={true}
                            />
                        </Grid>
                    )}

                    {showFactories && (
                        <Grid item xs={12}>
                            <LocationSectionRenderer
                                title="factories"
                                show={showFactories}
                                locations={factoriesLocations}
                                errors={factoriesErrors}
                                handleChange={handleLocationChange}
                                onAddLocation={handleAddLocation}
                                onDeleteLocation={handleDeleteLocation}
                            />
                        </Grid>
                    )}

                    {showWarehouse && (
                        <Grid item xs={12}>
                            <LocationSectionRenderer
                                title="warehouse"
                                show={showWarehouse}
                                locations={warehouseLocations}
                                errors={warehouseErrors}
                                handleChange={handleLocationChange}
                                onAddLocation={handleAddLocation}
                                onDeleteLocation={handleDeleteLocation}
                            />
                        </Grid>
                    )}

                    {showBranches && (
                        <Grid item xs={12}>
                            <LocationSectionRenderer
                                title="branche"
                                show={showBranches}
                                locations={branchesLocations}
                                errors={branchesErrors}
                                handleChange={handleLocationChange}
                                onAddLocation={handleAddLocation}
                                onDeleteLocation={handleDeleteLocation}
                            />
                        </Grid>
                    )}

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<SaveIcon />}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>

                <ToastContainer position="top-right" autoClose={5000} />
            </CardContent>
        </Card>

    );
}

export default AddCompanySettings
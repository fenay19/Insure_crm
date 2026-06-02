import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Card,
  CardContent,
  Divider,
  Checkbox,
  IconButton,
  Box
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import { get, post } from '../../../api/api.js';

const Lead = () => {
  const [errors, setErrors] = useState({});
  const [leadCategory, setLeadCategory] = useState('prospect');
  const [form, setForm] = useState({
    contact: [],
    newCompanyName: '' // <-- new variable for new lead
  });
  const [wantContact, setWantContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prospects, setProspects] = useState([]);
  const [leadRefs, setLeadRefs] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [clientData, setClientData] = useState([]);
  const navigate = useNavigate();
  // Reset the form
  const resetForm = () => {
    setForm({
      Prospect: '',
      Client: '',
      newCompanyName: '',
      companyName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      countryCode: '',
      phoneNo: '',
      altPhoneNo: '',
      email: '',
      altEmail: '',
      notes: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      reference: '',
      productService: '',
      leadstatus: '',
      leadType: '',
      projectValue: '',
      assignTo: '',
      contact: [],
      followups: []
    });
    setWantContact(false);
  };

  const validate = () => {
    const newErrors = {};
    let requiredFields = ['phoneNo'];
    if (leadCategory !== 'newLead') {
      requiredFields.push('companyName');
    }

    if (leadCategory === 'prospect') {
      requiredFields.push('Prospect');
    }
    if (leadCategory === 'client') {
      requiredFields.push('Client');
    }
    if (leadCategory === 'newLead') {
      requiredFields.push('newCompanyName');
    }

    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = 'Required';
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email';
    }
    if (form.altEmail && form.altEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.altEmail)) {
      newErrors.altEmail = 'Invalid alt email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch pincode details
  const fetchPincodeDetails = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setForm((prevForm) => ({
          ...prevForm,
          city: postOffice.District,
          state: postOffice.State,
          country: postOffice.Country
        }));
      } else {
        toast.warning('Invalid Pincode');
      }
    } catch (error) {
      toast.error('Failed to fetch pincode details');
    }
  };

  // Staff options: store {_id, name}
  const getStaffName = async () => {
    try {
      const response = await get('administrative');
      const dataStaff = response.data.map((item) => ({
        _id: item._id,
        name: item.basicDetails.firstName + ' ' + item.basicDetails.lastName
      }));
      setStaffOptions(dataStaff);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [prospectData, leadRefData, productData, leadStatusData, leadTypeData] = await Promise.all([
          get('prospect'),
          get('leadReference'),
          get('productOrServiceCategory'),
          get('leadstatus'),
          get('leadType')
        ]);
        setProspects(prospectData.data || []);
        setLeadRefs(leadRefData.data || []);
        setStatuses(leadStatusData.data || []);
        setLeadTypes(leadTypeData.data || []);
      } catch (err) {}
    };
    const fetchProductCategory = async () => {
      try {
        const response = await get('SubProductCategory');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    };
    fetchProductCategory();
    fetchDropdownData();
    getStaffName();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await get('department');
        if (response && response.data) {
          setDepartments(response.data);
        }
      } catch (error) {}
    };
    const fetchPositions = async () => {
      try {
        const response = await get('position');
        if (response && response.data) {
          setPositions(response.data);
        }
      } catch (err) {}
    };
    fetchPositions();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchClientDetails = async () => {
      const res = await get('admin-clientRegistration');
      if (res.data && res.status === 'true') {
        const filteredData = res.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
        setClientData(filteredData);
      }
    };
    fetchClientDetails();
  }, []);

  // Lead Category
  useEffect(() => {
    if (leadCategory === 'prospect') {
      const selected = prospects.find((p) => p._id === form.Prospect);
      if (selected) {
        setForm((prev) => ({
          ...prev,
          companyName: selected.companyName,
          phoneNo: selected.phoneNo,
          address: selected.address,
          pincode: selected.pincode,
          city: selected.city,
          state: selected.state,
          country: selected.country,
          notes: selected.notes
        }));
      }
    } else if (leadCategory === 'client') {
      // handled in client dropdown
    } else if (leadCategory === 'newLead') {
      setForm((prev) => ({
        ...prev,
        Prospect: '',
        Client: '',
        companyName: '',
        phoneNo: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        notes: ''
      }));
    }
  }, [leadCategory, form.Prospect, prospects]);

  // Handle all field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // client selection
    if (name === 'clientList') {
      const filteredData = clientData.find((item) => item._id === value);
      setWantContact(true);
      setForm((prev) => ({
        ...prev,
        Client: filteredData._id,
        clientList: value,
        companyName: filteredData.clientName,
        phoneNo: filteredData.officialPhoneNo,
        altPhoneNo: filteredData.altPhoneNo,
        email: filteredData.officialMailId,
        altEmail: filteredData.altMailId,
        address: filteredData.officeAddress,
        pincode: filteredData.pincode,
        city: filteredData.city,
        state: filteredData.state,
        country: filteredData.country,
        contact: filteredData.contactPerson || []
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addContact = () => {
    setForm((prevForm) => ({
      ...prevForm,
      contact: [...(prevForm.contact || []), { name: '', email: '', position: '', department: '', phone: '', selected: false }]
    }));
  };

  const handleProspectChange = (e) => {
    const selectedId = e.target.value;
    const selectedCompany = prospects.find((p) => p._id === selectedId);

    console.log(selectedCompany);

    if (selectedCompany) {
      setForm((prev) => ({
        ...prev,
        Prospect: selectedCompany._id,
        companyName: selectedCompany.companyName || '',
        phoneNo: selectedCompany.phoneNo,
        address: selectedCompany.address,
        pincode: selectedCompany.pincode,
        city: selectedCompany.city,
        state: selectedCompany.state,
        country: selectedCompany.country,
        notes: selectedCompany.notes,
        contact: selectedCompany.contacts
      }));
    }
  };

  const removeContact = (index) => {
    const updated = [...form.contact];
    updated.splice(index, 1);
    setForm({ ...form, contact: updated });
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...form.contact];
    updated[index][field] = value;
    setForm({ ...form, contact: updated });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    if (!validate()) return;
    try {
      setIsLoading(true);
      const payload = { ...form, leadCategory };

      // Handle Prospect/Client/newCompanyName fields based on leadCategory
      if (leadCategory === 'prospect') {
        payload.Prospect = form.Prospect;
        payload.Client = '';
        payload.newCompanyName = '';
      } else if (leadCategory === 'client') {
        payload.Prospect = '';
        payload.Client = form.Client;
        payload.newCompanyName = '';
      } else if (leadCategory === 'newLead') {
        payload.Prospect = '';
        payload.Client = '';
        payload.newCompanyName = form.newCompanyName; // store as string
        payload.companyName = form.newCompanyName; // store as string
      }

      // Remove helper fields not needed on backend
      delete payload.clientList;

      const response = await post('lead', payload);

      if (response?.success === true) {
        toast.success(response.message || 'Lead saved successfully!', {
          autoClose: 3000,
          theme: 'colored'
        });
        resetForm();
      } else {
        toast.error(response?.message || 'Submission failed', {
          autoClose: 3000,
          theme: 'colored'
        });
      }
    } catch (error) {
      toast.error('Failed to save lead. Try again.', {
        autoClose: 3000,
        theme: 'colored'
      });
    } finally {
      setIsLoading(false);
    }
    navigate('/lead-management/lead');
  };

  const renderTextField = (label, name, required = false, type = 'text', readOnly = false) => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={form[name] || ''}
      onChange={handleChange}
      fullWidth
      required={required}
      error={!!errors[name]}
      helperText={errors[name]}
      InputProps={{
        readOnly: readOnly
      }}
    />
  );

  const renderDropdown = (label, name, options, getLabel = (o) => o.clientName) => (
    <TextField
      select
      label={label}
      name={name}
      value={form[name] || ''}
      onChange={handleChange}
      fullWidth
      required
      error={!!errors[name]}
      helperText={errors[name]}
    >
      {options.map((opt, i) => (
        <MenuItem key={opt._id || i} value={opt._id}>
          {getLabel(opt)}
        </MenuItem>
      ))}
    </TextField>
  );

  const renderDropdownSimple = (label, name, options) => (
    <TextField
      select
      label={label}
      name={name}
      value={form[name] || ''}
      onChange={handleChange}
      fullWidth
      required
      error={!!errors[name]}
      helperText={errors[name]}
    >
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="h6">Lead Form</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" component={Link} to="/lead-management/lead">
              <ArrowBackIcon /> Back
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RadioGroup row value={leadCategory} onChange={(e) => setLeadCategory(e.target.value)}>
              <FormControlLabel value="prospect" control={<Radio />} label="Prospect" />
              <FormControlLabel value="client" control={<Radio />} label="Client" />
              <FormControlLabel value="newLead" control={<Radio />} label="New Lead" />
            </RadioGroup>
          </Grid>

          {leadCategory === 'prospect' && (
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Select Company"
                value={form.Prospect || ''}
                onChange={handleProspectChange}
                margin="normal"
                required
                error={!!errors.Prospect}
                helperText={errors.Prospect}
              >
                {prospects.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.companyName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {leadCategory === 'client' && (
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Select Client"
                name="clientList"
                value={form.clientList || ''}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.Client}
                helperText={errors.Client}
              >
                {clientData.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {client.clientName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {leadCategory === 'newLead' && (
            <Grid item xs={12} md={6}>
              <TextField
                label="New Company Name"
                name="newCompanyName"
                value={form.newCompanyName || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.newCompanyName}
                helperText={errors.newCompanyName}
              />
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {leadCategory !== 'newLead' && (
            <Grid item xs={12} md={6}>
              {renderTextField('Company Name', 'companyName', true, 'text')}
            </Grid>
          )}
          {/* <Grid item xs={12} md={3}>
            {renderTextField('First Name', 'firstName', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Middle Name', 'middleName', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Last Name', 'lastName', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderDropdownSimple('Gender', 'gender', ['Male', 'Female', 'Other'])}
          </Grid> */}
          <Grid item xs={12} md={3}>
            {renderTextField('Country Code', 'countryCode')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Phone No', 'phoneNo', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Alt Phone No', 'altPhoneNo')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Email', 'email')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Alt Email', 'altEmail')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Notes', 'notes')}
          </Grid>
          <Grid item xs={12} md={8}>
            {renderTextField('Address', 'address')}
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Pincode"
              name="pincode"
              value={form.pincode || ''}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value.length === 6) {
                  fetchPincodeDetails(e.target.value);
                }
              }}
              fullWidth
              error={!!errors.pincode}
              helperText={errors.pincode}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            {renderTextField('City', 'city')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('State', 'state')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Country', 'country')}
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Lead Reference"
              name="reference"
              value={form.reference || ''}
              onChange={handleChange}
              error={!!errors.reference}
              helperText={errors.reference}
            >
              {leadRefs.map((ref) => (
                <MenuItem key={ref._id} value={ref._id}>
                  {ref.LeadReference}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Product / Service"
              name="productService"
              value={form.productService || ''}
              onChange={handleChange}
              error={!!errors.productService}
              helperText={errors.productService}
            >
              {products.map((prod) => (
                <MenuItem key={prod._id} value={prod._id}>
                  {prod.subProductName}
                  {/* console.log(products) */}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Lead Status"
              name="leadstatus"
              value={form.leadstatus || ''}
              onChange={handleChange}
              error={!!errors.leadstatus}
              helperText={errors.leadstatus}
            >
              {statuses.map((s) => (
                <MenuItem key={s._id} value={s._id} style={{ backgroundColor: s.colorCode, color: '#000000' }}>
                  {s.LeadStatus}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Lead Type"
              name="leadType"
              value={form.leadType || ''}
              onChange={handleChange}
              error={!!errors.leadType}
              helperText={errors.leadType}
            >
              {leadTypes.map((lt) => (
                <MenuItem key={lt._id} value={lt._id}>
                  {lt.LeadType}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Project Value', 'projectValue')}
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Assign To"
              name="assignTo"
              value={form.assignTo || ''}
              onChange={handleChange}
              error={!!errors.assignTo}
              helperText={errors.assignTo}
            >
              {staffOptions.map((staff) => (
                <MenuItem key={staff._id} value={staff._id}>
                  {staff.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} ml={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={wantContact}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setWantContact(checked);
                    if (checked && (!form.contact || form.contact.length === 0)) {
                      addContact();
                    }
                  }}
                  disabled={isLoading}
                />
              }
              label="Add Contacts"
            />
          </Grid>
          {wantContact &&
            form.contact?.map((contact, index) => (
              <React.Fragment key={index}>
                <Grid container spacing={2} alignItems="center" m={1}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Name"
                      value={contact.name || ''}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Email"
                      value={contact.email || ''}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Designation"
                      value={contact.position || ''}
                      onChange={(e) => handleContactChange(index, 'position', e.target.value)}
                      fullWidth
                    >
                      {positions?.map((pos) => (
                        <MenuItem key={pos._id} value={pos.position}>
                          {pos.position}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Department"
                      value={contact.department || ''}
                      onChange={(e) => handleContactChange(index, 'department', e.target.value)}
                      fullWidth
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept._id} value={dept.department}>
                          {dept.department}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" m={1}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Phone"
                      value={contact.phone || ''}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Checkbox
                      checked={contact.selected || false}
                      onChange={(e) => handleContactChange(index, 'selected', e.target.checked)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Box display="flex" gap={1}>
                      <IconButton color="primary" onClick={addContact} disabled={isLoading}>
                        <AddIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => removeContact(index)} disabled={isLoading}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
              <SaveIcon sx={{ mr: 1 }} />
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <ToastContainer position="top-right" autoClose={3000} />
    </Card>
  );
};

export default Lead;

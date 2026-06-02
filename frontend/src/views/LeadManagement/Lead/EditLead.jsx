import React, { useEffect, useState } from 'react';
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
  Box,
  IconButton
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get, put } from 'api/api';

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wantContact, setWantContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    countryCode: '',
    phoneNo: '',
    altPhoneNo: '',
    email: '',
    altEmail: '',
    companyName: '',
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
    notes: '',
    Prospect: '',
    clientList: '',
    Client: '',
    newCompanyName: '' // <-- add this for newLead
  });

  const [errors, setErrors] = useState({});
  const [leadCategory, setLeadCategory] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [clientList, setClientData] = useState([]);
  const [leadRefs, setLeadRefs] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [products, setProducts] = useState([]);
  const [positions, setPositions] = useState([]);

  const [prospects, setProspects] = useState([]);

  const dropdownOptions = {
    gender: ['Male', 'Female', 'Other'],
    country: ['India', 'USA', 'UK']
  };

  // Validation with dynamic required fields
  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      // 'firstName',
      // 'lastName',
      // 'gender',
      // 'countryCode',
      'phoneNo'
      // 'email',
      // 'address',
      // 'pincode',
      // 'city',
      // 'state',
      // 'country',
      // 'reference',
      // 'productService',
      // 'leadstatus',
      // 'leadType',
      // 'assignTo',
      // 'projectValue'
    ];
    if (leadCategory === 'prospect') {
      requiredFields.push('Prospect');
    } else if (leadCategory === 'client') {
      requiredFields.push('Client');
    } else if (leadCategory === 'newLead') {
      requiredFields.push('newCompanyName');
    }

    // Debug: Show which fields are required

    // console.log('Validate: requiredFields:', requiredFields);

    requiredFields.forEach((field) => {
      if (!form[field]) {
        newErrors[field] = 'Required';
        // Debug: Which field is missing
        // console.log(`Validate: missing required field: ${field}`);
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email';
      // console.log('Validate: Invalid email format:', form.email);
    }
    if (form.altEmail && form.altEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.altEmail)) {
      newErrors.altEmail = 'Invalid alt email';
      // console.log('Validate: Invalid alt email format:', form.altEmail);
    }

    // Debug: Output all errors before setting
    // console.log('Validate: newErrors:', newErrors);

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    // console.log('Validate: isValid:', isValid);

    return isValid;
  };

  // Handle lead category change
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setLeadCategory(newCategory);
    if (newCategory === 'prospect') {
      setForm((prev) => ({
        ...prev,
        Client: '',
        clientList: '',
        newCompanyName: ''
      }));
    } else if (newCategory === 'client') {
      setForm((prev) => ({
        ...prev,
        Prospect: '',
        newCompanyName: ''
      }));
    } else if (newCategory === 'newLead') {
      setForm((prev) => ({
        ...prev,
        Prospect: '',
        Client: '',
        clientList: '',
        newCompanyName: ''
      }));
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for client selection
    if (name === 'clientList') {
      const filteredData = clientList.find((item) => item._id === value);
      if (filteredData) {
        setForm((prev) => ({
          ...prev,
          Client: filteredData._id,
          Prospect: '',
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
          contact: filteredData.contactPerson,
          clientList: value,
          newCompanyName: ''
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle prospect select
  const handleProspectChange = (e) => {
    const selectedProspectId = e.target.value;
    const selectedProspect = prospects.find((p) => p._id === selectedProspectId);
    if (selectedProspect) {
      setForm((prev) => ({
        ...prev,
        Prospect: selectedProspect._id,
        Client: '',
        clientList: '',
        companyName: selectedProspect.companyName,
        phoneNo: selectedProspect.phoneNo,
        altPhoneNo: selectedProspect.altPhoneNo,
        email: selectedProspect.email,
        altEmail: selectedProspect.altEmail,
        address: selectedProspect.address,
        pincode: selectedProspect.pincode,
        city: selectedProspect.city,
        state: selectedProspect.state,
        country: selectedProspect.country,
        notes: selectedProspect.notes,
        newCompanyName: ''
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    if (validate()) {
      // console.log('hello');
      try {
        let payload = { ...form, leadCategory };
        if (leadCategory === 'prospect') {
          payload.Client = '';
          payload.clientList = '';
          payload.newCompanyName = '';
        } else if (leadCategory === 'client') {
          payload.Prospect = '';
          payload.newCompanyName = '';
        } else if (leadCategory === 'newLead') {
          payload.Prospect = '';
          payload.Client = '';
          payload.clientList = '';
          // companyName is still required, but newCompanyName is the unique field for new leads
        }
        // console.log('payload', payload);

        const response = await put(`lead/${id}`, payload);
        // console.log(response);
        if (response) {
          toast.success(response.message || '✅ Lead updated successfully!', {
            autoClose: 3000,
            theme: 'colored'
          });
        }
      } catch (error) {
        console.error('Error updating lead:', error);
        toast.error('Failed to update lead');
      }
    } else {
      toast.error('Please fill all required fields correctly');
    }
    navigate('/lead-management/lead');
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...form.contact];
    updated[index][field] = value;
    setForm({ ...form, contact: updated });
  };

  const addContact = () => {
    setForm((prevForm) => ({
      ...prevForm,
      contact: [...(prevForm.contact || []), { name: '', email: '', position: '', department: '', phone: '', selected: false }]
    }));
  };

  // Fetch dropdown and lead details
  const fetchDropdownData = async () => {
    try {
      const [prospectData, leadRefData, productData, leadstatusData, leadTypeData, staffData] = await Promise.all([
        get('prospect'),
        get('leadReference'),
        get('productOrServiceCategory'),
        get('leadstatus'),
        get('leadType'),
        get('administrative')
      ]);
      setProspects(prospectData.data || []);
      setLeadRefs(leadRefData.data || []);
      // setProducts(productData.data || []);
      setStatuses(leadstatusData.data || []);
      setLeadTypes(leadTypeData.data || []);
      setStaffOptions(staffData.data || []);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  const fetchLeadDetails = async () => {
    try {
      const employeeId = localStorage.getItem('empId');
      const response = await get(`lead/${employeeId}/${id}/`);
      if (response.success) {
        const leadData = response.data;
        console.log(leadData);
        setLeadCategory(leadData.leadCategory || '');

        setForm((prev) => ({
          ...prev,
          ...leadData,
          Prospect: leadData.Prospect?._id ? String(leadData.Prospect._id) : leadData.Prospect ? String(leadData.Prospect) : '',
          reference: leadData.reference?._id ? String(leadData.reference._id) : leadData.reference ? String(leadData.reference) : '',
          productService: leadData.productService?._id
            ? String(leadData.productService._id)
            : leadData.productService
              ? String(leadData.productService)
              : '',
          leadstatus: leadData.leadstatus?._id ? String(leadData.leadstatus._id) : leadData.leadstatus ? String(leadData.leadstatus) : '',
          leadType: leadData.leadType?._id ? String(leadData.leadType._id) : leadData.leadType ? String(leadData.leadType) : '',
          assignTo: leadData.assignTo?._id ? String(leadData.assignTo._id) : leadData.assignTo ? String(leadData.assignTo) : '',
          Client: leadData.Client?._id ? String(leadData.Client._id) : leadData.Client ? String(leadData.Client) : '',
          clientList: leadData.Client?._id ? String(leadData.Client._id) : leadData.Client ? String(leadData.Client) : '',
          companyName: leadData.companyName || '',
          newCompanyName: leadData.newCompanyName || ''
        }));
      }
      // console.log(form);
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
    }
  };

  const fetchClientDetails = async () => {
    const res = await get('admin-clientRegistration');
    if (res.data && res.status === 'true') {
      const filteredData = res.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
      setClientData(filteredData);
    }
  };

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
    const fetchProductCategory = async () => {
      try {
        const response = await get('SubProductCategory');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    };
    fetchProductCategory();
    fetchPositions();
    fetchDepartments();
  }, []);

  // Sync prospect/client selection with company data
  useEffect(() => {
    if (leadCategory === 'prospect' && form.Prospect) {
      const selectedProspect = prospects.find((p) => p._id === form.Prospect);
      if (selectedProspect) {
        setForm((prev) => ({
          ...prev,
          companyName: selectedProspect.companyName,
          phoneNo: selectedProspect.phoneNo,
          address: selectedProspect.address,
          pincode: selectedProspect.pincode,
          city: selectedProspect.city,
          state: selectedProspect.state,
          country: selectedProspect.country,
          notes: selectedProspect.notes,
          newCompanyName: ''
        }));
      }
    } else if (leadCategory === 'client' && form.clientList) {
      const selectedClient = clientList.find((client) => client._id === form.clientList);
      if (selectedClient) {
        setForm((prev) => ({
          ...prev,
          companyName: selectedClient.clientName,
          phoneNo: selectedClient.officialPhoneNo,
          altPhoneNo: selectedClient.altPhoneNo,
          email: selectedClient.officialMailId,
          altEmail: selectedClient.altMailId,
          address: selectedClient.officeAddress,
          pincode: selectedClient.pincode,
          city: selectedClient.city,
          state: selectedClient.state,
          country: selectedClient.country,
          notes: '',
          newCompanyName: ''
        }));
      }
    }
    // eslint-disable-next-line
  }, [leadCategory, form.Prospect, form.clientList, prospects, clientList]);

  useEffect(() => {
    fetchDropdownData();
    fetchLeadDetails();
    fetchClientDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="h6">Lead Form</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              <ArrowBackIcon /> Back
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RadioGroup row value={leadCategory} onChange={handleCategoryChange}>
              <FormControlLabel value="prospect" control={<Radio />} label="Prospects" />
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
                required={leadCategory === 'prospect'}
                error={leadCategory === 'prospect' && !!errors.Prospect}
                helperText={leadCategory === 'prospect' ? errors.Prospect : ''}
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
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Client"
                name="clientList"
                value={form.clientList || ''}
                onChange={handleChange}
                margin="normal"
                required={leadCategory === 'client'}
                error={leadCategory === 'client' && !!errors.Client}
                helperText={leadCategory === 'client' ? errors.Client : ''}
              >
                {clientList.map((client) => (
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
              <TextField
                label="Company Name"
                name="companyName"
                value={form.companyName || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.newCompanyName}
                helperText={errors.newCompanyName}
              />
            </Grid>
          )}
          {/* <Grid item xs={12} md={3}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Middle Name"
              name="middleName"
              value={form.middleName || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.middleName}
              helperText={errors.middleName}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Gender"
              name="gender"
              value={form.gender || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.gender}
              helperText={errors.gender}
            >
              {dropdownOptions.gender.map((opt, i) => (
                <MenuItem key={i} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
          <Grid item xs={12} md={3}>
            <TextField
              label="Country Code"
              name="countryCode"
              value={form.countryCode || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.countryCode}
              helperText={errors.countryCode}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Phone No"
              name="phoneNo"
              value={form.phoneNo || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.phoneNo}
              helperText={errors.phoneNo}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Alt Phone No"
              name="altPhoneNo"
              value={form.altPhoneNo || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.altPhoneNo}
              helperText={errors.altPhoneNo}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Alt Email"
              name="altEmail"
              value={form.altEmail || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.altEmail}
              helperText={errors.altEmail}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Notes"
              name="notes"
              value={form.notes || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.notes}
              helperText={errors.notes}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label="Address"
              name="address"
              value={form.address || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Pincode"
              name="pincode"
              value={form.pincode || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.pincode}
              helperText={errors.pincode}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="City"
              name="city"
              value={form.city || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="State"
              name="state"
              value={form.state || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Country"
              name="country"
              value={form.country || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.country}
              helperText={errors.country}
            >
              {dropdownOptions.country.map((opt, i) => (
                <MenuItem key={i} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Lead Reference"
              name="reference"
              value={form.reference || ''}
              onChange={handleChange}
              fullWidth
              required
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
              select
              label="Product / Service"
              name="productService"
              value={form.productService || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.productService}
              helperText={errors.productService}
            >
              {products.map((prod) => (
                <MenuItem key={prod._id} value={prod._id}>
                  {prod.subProductName}
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
              required
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
              select
              label="Lead Type"
              name="leadType"
              value={form.leadType || ''}
              onChange={handleChange}
              fullWidth
              required
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
            <TextField
              label="Project Value"
              name="projectValue"
              value={form.projectValue || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.projectValue}
              helperText={errors.projectValue}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Assign To"
              name="assignTo"
              value={form.assignTo || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.assignTo}
              helperText={errors.assignTo}
            >
              {staffOptions.map((opt) => (
                <MenuItem key={opt._id} value={opt._id}>
                  {opt.basicDetails.firstName} {opt.basicDetails.lastName}
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
                      value={contact.designation || ''}
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Update
            </Button>
          </Grid>
        </Grid>

        <ToastContainer />
      </CardContent>
    </Card>
  );
};

export default EditLead;

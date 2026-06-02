
// import React, { useState, useEffect } from 'react';
// import { get, post } from '../../../api/api.js';
// import {
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   Divider,
//   MenuItem,
//   FormControlLabel,
//   RadioGroup,
//   Radio
// } from '@mui/material';

// const Lead = () => {
//   const [formData, setFormData] = useState({});
//   const [radioValue, setRadioValue] = useState('');
//   const [prospects, setProspects] = useState([]);
//   const [leadRefs, setLeadRefs] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [leadTypes, setLeadTypes] = useState([]);

//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       try {
//         const [prospectData, leadRefData, productData, statusData, leadTypeData] = await Promise.all([
//           get('prospect'),
//           get('leadReference'),
//           get('productOrServiceCategory'),
//           get('status'),
//           get('leadType')
//         ]);
//         setProspects(prospectData.data);
//         setLeadRefs(leadRefData.data);
//         setProducts(productData.data);
//         setStatuses(statusData.data);
//         setLeadTypes(leadTypeData.data);
//       } catch (err) {
//         console.error('Dropdown load error:', err);
//       }
//     };

//     fetchDropdownData();
//   }, []);

//   const handleProspectChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedCompany = prospects.find((p) => p._id === selectedId);

//     if (selectedCompany) {
//       setFormData((prev) => ({
//         ...prev,
//         Prospect: selectedId, // send ID to backend
//         phoneNo: selectedCompany.phoneNo,
//         address: selectedCompany.address,
//         pincode: selectedCompany.pincode,
//         city: selectedCompany.city,
//         state: selectedCompany.state,
//         country: selectedCompany.country,
//         notes: selectedCompany.notes
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await post('lead', formData);
//       alert('Lead created successfully');
//       setFormData({});
//     } catch (err) {
//       console.error('Error saving lead:', err);
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           Add Lead
//         </Typography>

//         <RadioGroup row value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
//           <FormControlLabel value="Prospect" control={<Radio />} label="Prospect" />
//           <FormControlLabel value="Client" control={<Radio />} label="Client" />
//           <FormControlLabel value="NewLead" control={<Radio />} label="New Lead" />
//         </RadioGroup>

//         {radioValue === 'Prospect' && (
//           <TextField
//             select
//             fullWidth
//             label="Select Company"
//             value={formData.Prospect || ''}
//             onChange={handleProspectChange}
//             margin="normal"
//           >
//             {prospects.map((p) => (
//               <MenuItem key={p._id} value={p._id}>
//                 {p.companyName}
//               </MenuItem>
//             ))}
//           </TextField>
//         )}

//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="First Name"
//               name="firstName"
//               value={formData.firstName || ''}
//               onChange={handleInputChange}
//               required
//             />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} required />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField fullWidth label="Phone No" name="phoneNo" value={formData.phoneNo || ''} onChange={handleInputChange} required />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField fullWidth label="Email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField fullWidth label="Address" name="address" value={formData.address || ''} onChange={handleInputChange} />
//           </Grid>

//           <Grid item xs={4}>
//             <TextField fullWidth label="Pincode" name="pincode" value={formData.pincode || ''} onChange={handleInputChange} />
//           </Grid>
//           <Grid item xs={4}>
//             <TextField fullWidth label="City" name="city" value={formData.city || ''} onChange={handleInputChange} />
//           </Grid>
//           <Grid item xs={4}>
//             <TextField fullWidth label="State" name="state" value={formData.state || ''} onChange={handleInputChange} />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField fullWidth label="Country" name="country" value={formData.country || ''} onChange={handleInputChange} />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               select
//               label="Lead Reference"
//               name="reference"
//               value={formData.reference || ''}
//               onChange={handleInputChange}
//             >
//               {leadRefs.map((ref) => (
//                 <MenuItem key={ref._id} value={ref.LeadReference}>
//                   {ref.LeadReference}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               select
//               label="Product / Service"
//               name="productService"
//               value={formData.productService || ''}
//               onChange={handleInputChange}
//             >
//               {products.map((prod) => (
//                 <MenuItem key={prod._id} value={prod.productName}>
//                   {prod.productName}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField fullWidth select label="Status" name="status" value={formData.status || ''} onChange={handleInputChange}>
//               {statuses.map((s) => (
//                 <MenuItem key={s._id} value={s.statusName}>
//                   {s.statusName}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField fullWidth select label="Lead Type" name="leadType" value={formData.leadType || ''} onChange={handleInputChange}>
//               {leadTypes.map((lt) => (
//                 <MenuItem key={lt._id} value={lt.LeadType}>
//                   {lt.LeadType}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField fullWidth multiline rows={3} label="Notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} />
//           </Grid>

//           <Grid item xs={12}>
//             <Button type="submit" variant="contained" onClick={handleSubmit}>
//               Save Lead
//             </Button>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default Lead;

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
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { drop } from 'lodash';

import { get, post, put, remove } from '../../../api/api.js';

const Lead = () => {
  const [form, setForm] = useState({ contacts: [] });
  const [errors, setErrors] = useState({});
  const [leadCategory, setLeadCategory] = useState('fresh');
  const [wantContact, setWantContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [prospects, setProspects] = useState([]);
  const [leadRefs, setLeadRefs] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);

  const dropdownOptions = {
    gender: ['Male', 'Female', 'Other'],
    productService: ['Product A', 'Service B'],
    status: ['New', 'In Progress', 'Closed'],
    leadType: ['Cold', 'Warm', 'Hot'],
    client: ['sahil', 'sahil2', 's3'],
    prospects: ['pransy', 'p2', 'p3'],
    assignTo: ['User 1', 'User 2'],
    country: ['India', 'USA', 'UK'],
    profession: ['Engineer', 'Doctor', 'Teacher'],
    cateroryOfOrganisation: ['Private', 'Public', 'Non-Profit']
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      'companyName',
      'firstName',
      'middleName',
      'lastName',
      'gender',
      'countryCode',
      'phoneNo',
      'email',
      'address',
      'pincode',
      'city',
      'state',
      'country',
      'reference',
      'productService',
      'status',
      'leadType',
      'assignTo',
      'projectValue',
      'profession',
      'cateroryOfOrganisation'
    ];

    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = 'Required';
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email';
    }
    if (form.altEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.altEmail)) {
      newErrors.altEmail = 'Invalid alt email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //todo: get Prospect Data
  async function getProspectData() {
    try {
      const response = await get('prospect');
      console.log('Prospect Data:', response.data);
    } catch (error) {
      console.error('Prospect fetch error:', error);
      toast.error('Prospect data load failed');
    }
  }

  // todo: get Lead Reference data
  async function getLeadReferenceData() {
    try {
      const response = await get('leadReference');
      console.log('Lead Reference :', response.data);
    } catch (error) {
      console.error('Lead Reference fetch error:', error);
      toast.error('Lead Reference data load failed');
    }
  }

  //todo: get product or service category data
  async function getProductServiceCategoryData() {
    try {
      const response = await get('productOrServiceCategory');

      console.log('Product Service Category :', response.data);
    } catch (error) {
      console.error('product or service category fetch error:', error);
      toast.error('product or service category data load failed');
    }
  }

  // todo: get status data
  async function getStatusData() {
    try {
      const response = await get('status');
      console.log('Status data:', response.data);
    } catch (error) {
      console.error('status data fetch error:', error);
      toast.error('status data load failed');
    }
  }

  async function getleadTypeData() {
    try {
      const response = await get('leadType');

      console.log('Lead Type data:', response.data);
    } catch (error) {
      console.error('lead type data fetch error:', error);
      toast.error('lead data load failed');
    }
  }

  async function getAssignToOrAdmistrative() {
    try {
      const response = await get('administrative');
      console.log('Assign to > Admistrative data:', response.data);
    } catch (error) {
      console.error('Assign to > Admistrative data fetch error:', error);
      toast.error('Assign to > Admistrative load failed');
    }
  }

  // useEffect(() => {
  //   //? prospect
  //   getProspectData();
  //   getLeadReferenceData();
  //   getProductServiceCategoryData();
  //   getStatusData();
  //   getleadTypeData();
  //   getAssignToOrAdmistrative();
  // }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [prospectData, leadRefData, productData, statusData, leadTypeData] = await Promise.all([
          get('prospect'),
          get('leadReference'),
          get('productOrServiceCategory'),
          get('status'),
          get('leadType')
        ]);
        setProspects(prospectData.data);
        setLeadRefs(leadRefData.data);
        setProducts(productData.data);
        setStatuses(statusData.data);
        setLeadTypes(leadTypeData.data);
      } catch (err) {
        console.error('Dropdown load error:', err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addContact = () => {
    setForm((prev) => ({
      ...prev,
      contacts: [
        ...(prev.contacts || []),
        {
          name: '',
          email: '',
          designation: '',
          dept: '',
          phone: '',
          selected: false
        }
      ]
    }));
  };

  const handleProspectChange = (e) => {
    const selectedId = e.target.value;
    const selectedCompany = prospects.find((p) => p._id === selectedId);

    if (selectedCompany) {
      setForm((prev) => ({
        ...prev,
        Prospect: selectedId, // send ID to backend
        phoneNo: selectedCompany.phoneNo,
        address: selectedCompany.address,
        pincode: selectedCompany.pincode,
        city: selectedCompany.city,
        state: selectedCompany.state,
        country: selectedCompany.country,
        notes: selectedCompany.notes
      }));
    }
  };

  const removeContact = (index) => {
    const updatedContacts = [...form.contacts];
    updatedContacts.splice(index, 1);
    setForm((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...form.contacts];
    updatedContacts[index][field] = value;
    setForm((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  // const handleSubmit = () => {
  //   if (validate()) {
  //     setIsLoading(true);
  //     console.log('Submitted Data:', form);

  //     toast.success('Lead submitted successfully');
  //     setIsLoading(false);
  //   } else {
  //     toast.error('Please fill all required fields correctly');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post('lead', form);
      toast.success('Lead submitted successfully');
      alert('Lead created successfully');
      setForm({});
    } catch (err) {
      toast.error('Please fill all required fields correctly');
      console.error('Error saving lead:', err);
    }
  };

  const renderTextField = (label, name, required = false, type = 'text') => (
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
    />
  );

  const renderDropdown = (label, name, options) => (
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
              {renderDropdown('Client', 'clientList', dropdownOptions.client)}
            </Grid>
          )}
          {leadCategory === 'newLead' && (
            <Grid item xs={12} md={3}>
              {renderDropdown('New Lead', 'newLeadList', ['Fresh', 'Warm', 'Hot'])}
            </Grid>
          )}
        </Grid>

        {/* You can conditionally show prospects/clients table here based on leadCategory */}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Row 1 */}
          {/* <Grid item xs={12} md={6}>
            {renderTextField('Company Name', 'companyName', true)}
          </Grid> */}
          <Grid item xs={12} md={3}>
            {renderTextField('First Name', 'firstName', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Middle Name', 'middleName', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Last Name', 'lastName', true)}
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} md={3}>
            {renderDropdown('Gender', 'gender', dropdownOptions.gender)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Country Code', 'countryCode', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Phone No', 'phoneNo', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Alt Phone No', 'altPhoneNo')}
          </Grid>

          {/* Row 3 */}
          <Grid item xs={12} md={3}>
            {renderTextField('Email', 'email', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Alt Email', 'altEmail')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Notes', 'notes')}
          </Grid>

          {/* Row 4 */}
          <Grid item xs={12} md={8}>
            {renderTextField('Address', 'address', true)}
          </Grid>
          <Grid item xs={12} md={2}>
            {renderTextField('Pincode', 'pincode', true)}
          </Grid>
          <Grid item xs={12} md={2}>
            {renderTextField('City', 'city', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('State', 'state', true)}
          </Grid>

          {/* Row 5 */}
          <Grid item xs={12} md={3}>
            {renderDropdown('Country', 'country', dropdownOptions.country)}
          </Grid>
          {/* <Grid item xs={12} md={3}>
            {renderTextField('Lead Reference', 'reference', true)}
          </Grid> */}
          <Grid item xs={3}>
            <TextField fullWidth select label="Lead Reference" name="reference" value={form.reference || ''} onChange={handleChange}>
              {leadRefs.map((ref) => (
                <MenuItem key={ref._id} value={ref.LeadReference}>
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
            >
              {products.map((prod) => (
                <MenuItem key={prod._id} value={prod.productName}>
                  {prod.productName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth select label="Status" name="status" value={form.status || ''} onChange={handleChange}>
              {statuses.map((s) => (
                <MenuItem key={s._id} value={s.statusName}>
                  {s.statusName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Row 6 */}
          <Grid item xs={12} md={3}>
                      <TextField fullWidth select label="Lead Type" name="leadType" value={form.leadType || ''} onChange={handleChange}>
                        {leadTypes.map((lt) => (
                          <MenuItem key={lt._id} value={lt.LeadType}>
                            {lt.LeadType}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Project Value', 'projectValue', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderDropdown('Assign To', 'assignTo', dropdownOptions.assignTo)}
          </Grid>
          {/* <Grid item xs={12} md={3}>{renderDropdown('Position  ', 'position', dropdownOptions.assignTo)}</Grid>
          <Grid item xs={12} md={3}>{renderDropdown('Department', 'department', dropdownOptions.assignTo)}</Grid>
          <Grid item xs={12} md={3}>{renderDropdown('Caterory Of Organisation', 'cateroryOfOrganisation', dropdownOptions.assignTo)}</Grid>
          <Grid item xs={12} md={3}>{renderDropdown('Profession', 'profession', dropdownOptions.profession)}</Grid> */}

          <Grid item xs={12} ml={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={wantContact}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setWantContact(checked);
                    if (checked && (!form.contacts || form.contacts.length === 0)) {
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
            form.contacts?.map((contact, index) => (
              <React.Fragment key={index}>
                {/* First Row: Name, Email, Designation, Department */}
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
                      label="Designation"
                      value={contact.designation || ''}
                      onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Department"
                      value={contact.dept || ''}
                      onChange={(e) => handleContactChange(index, 'dept', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* Second Row: Phone, Checkbox, Add, Delete */}
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
    </Card>
  );
};

export default Lead;

// ! new

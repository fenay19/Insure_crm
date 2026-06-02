import React, { useState, useEffect } from 'react';
import { get, put, post, remove } from '../../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  MenuItem,
  IconButton,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ contacts: [] });
  const [wantContact, setWantContact] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);

  useEffect(() => {
    fetchDropDownOptions();
    fetchDesignationOptions();
    fetchDeptOptions();
  }, []);

  const fetchDropDownOptions = async () => {
    try {
      setIsLoading(true);
      const response = await get('network');
      if (response.status === 'true') {
        setDropdownOptions(response.data.map((item) => item.networkName));
      } else {
        toast.error('Failed to load networks');
      }
    } catch (error) {
      toast.error('Error loading networks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesignationOptions = async () => {
    try {
      const response = await get('position');
      if (response.status === 'true') {
        setDesignationOptions(response.data.map((item) => item.position));
      }
    } catch (error) {
      toast.error('Error loading designations');
    }
  };

  const fetchDeptOptions = async () => {
    try {
      const response = await get('department');
      if (response.status === 'true') {
        setDeptOptions(response.data.map((item) => item.department));
      }
    } catch (error) {
      toast.error('Error loading departments');
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await get(`prospect/${id}`);
        if (response.status === 'true') {
          const companyData = response.data;
          ['dob', 'dateOfIncorporation'].forEach((field) => {
            if (companyData[field]) {
              const date = new Date(companyData[field]);
              if (!isNaN(date.getTime())) {
                companyData[field] = date.toISOString();
              }
            }
          });
          setForm(companyData);
          if (companyData.contacts && companyData.contacts.length > 0) {
            setWantContact(true);
          }
        } else {
          navigate('/prospects');
        }
      } catch (error) {
        toast.error('Failed to fetch company data');
        navigate('/prospects');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [id, navigate]);

  const validate = () => {
    const newErrors = {};
    ['companyName', 'phoneNo', 'address', 'pincode', 'city', 'state', 'country'].forEach((field) => {
      if (!form[field]) newErrors[field] = 'Required';
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (wantContact && form.contacts.length > 0) {
      form.contacts.forEach((contact, index) => {
        if (contact.email && !emailRegex.test(contact.email)) {
          if (!newErrors.contacts) newErrors.contacts = {};
          if (!newErrors.contacts[index]) newErrors.contacts[index] = {};
          newErrors.contacts[index].email = 'Invalid email';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'date' && value) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        setForm((prev) => ({ ...prev, [name]: dateValue.toISOString() }));
        return;
      }
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...form.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
      contactId: updatedContacts[index]?.contactId || form.contacts[index]?.contactId // preserve
    };
    setForm((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  const addContact = () => {
    setForm((prev) => ({
      ...prev,
      contacts: [...(prev.contacts || []), { name: '', email: '', designation: '', dept: '', phone: '' }]
    }));
  };

  const removeContact = (index) => {
    const updatedContacts = form.contacts.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  const handleSubmit = async () => {
    if (!validate()) return toast.error('Please fix validation errors');
    try {
      setIsLoading(true);
      const oldContacts = (await get(`prospect/${id}`)).data.contacts || [];
      const response = await put(`prospect/${id}`, form);
      if (response.status === 'true' || response.status === true) {
        toast.success('Company updated successfully');
        if (form.contacts && form.contacts.length > 0) {
          for (const contact of form.contacts) {
            if (contact.contactId) {
              const contactPayload = {
                companyName: form.companyName,
                name: contact.name,
                email: contact.email,
                designation: contact.designation,
                phone: contact.phone,
                department: contact.dept
              };
              await put(`contact/${contact.contactId}`, contactPayload);
            }
          }
        }
        const currentIds = form.contacts.map((c) => c._id).filter(Boolean);
        for (const oldContact of oldContacts) {
          if (oldContact._id && !currentIds.includes(oldContact._id)) {
            await remove(`contact/${oldContact._id}`);
          }
        }
      } else {
        toast.error('Failed to update company');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDropdown = (label, name, options) => (
    <TextField select label={label} name={name} value={form[name] || ''} onChange={handleChange} fullWidth>
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );

  const renderRichTextEditor = (name, label) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block' }}>{label}</label>
      <ReactQuill
        value={form[name] || ''}
        onChange={(value) => setForm((prev) => ({ ...prev, [name]: value }))}
        theme="snow"
        readOnly={isLoading}
      />
    </div>
  );

  const renderTextField = (label, name, required = false, type = 'text') => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={type === 'date' ? new Date(form[name]).toISOString().split('T')[0] : form[name] || ''}
      onChange={handleChange}
      fullWidth
      required={required}
    />
  );

  if (loading)
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );

  return (
    // <Card>
    //   <CardContent>
    //     <Grid container spacing={2}>
    //       {renderTextField('Company Name', 'companyName', true)}
    //       {renderTextField('Phone No', 'phoneNo', true)}
    //       {renderTextField('Date of Incorporation', 'dateOfIncorporation', false, 'date')}
    //       {renderDropdown('Network', 'network', dropdownOptions)}
    //       {renderTextField('Address', 'address', true)}
    //       {renderTextField('Pincode', 'pincode', true)}
    //       {renderTextField('City', 'city', true)}
    //       {renderTextField('State', 'state', true)}
    //       {renderTextField('Country', 'country', true)}
    //       {renderRichTextEditor('notes', 'Notes')}

    //       <FormControlLabel control={<Checkbox checked={wantContact} onChange={(e) => {
    //         const checked = e.target.checked;
    //         setWantContact(checked);
    //         if (checked && (!form.contacts || form.contacts.length === 0)) addContact();
    //       }} />} label="Add Contacts" />

    //       {wantContact && form.contacts.map((contact, index) => (
    //         <React.Fragment key={index}>
    //           {['name', 'email', 'designation', 'dept', 'phone'].map((field) => (
    //             <Grid item xs={12} sm={6} md={4} key={field}>
    //               <TextField
    //                 label={field.charAt(0).toUpperCase() + field.slice(1)}
    //                 value={contact[field] || ''}
    //                 onChange={(e) => handleContactChange(index, field, e.target.value)}
    //                 fullWidth
    //               />
    //             </Grid>
    //           ))}
    //           <Grid item>
    //             <IconButton onClick={() => removeContact(index)}><DeleteIcon /></IconButton>
    //           </Grid>
    //         </React.Fragment>
    //       ))}

    //       <Grid item xs={12}>
    //         <Button onClick={handleSubmit} variant="contained" color="primary">
    //           <EditIcon /> {isLoading ? 'Updating...' : 'Update'}
    //         </Button>
    //       </Grid>
    //     </Grid>
    //     <ToastContainer position="top-right" autoClose={3000} />
    //   </CardContent>
    // </Card>

    <Card>
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="h6">Company Details</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
              Back
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {/* === Company Basic Fields === */}
          <Grid item xs={12} sm={6}>
            {renderTextField('Company Name', 'companyName', true)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderTextField('Phone No', 'phoneNo', true)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderTextField('Date of Incorporation', 'dateOfIncorporation', false, 'date')}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderDropdown('Network', 'network', dropdownOptions)}
          </Grid>

          {/* === Address Section === */}
          <Grid item xs={12}>
            <Typography variant="h6">Address Details</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            {renderTextField('Address', 'address', true)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderTextField('Pincode', 'pincode', true)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderTextField('City', 'city', true)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderTextField('State', 'state', true)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderTextField('Country', 'country', true)}
          </Grid>

          {/* === Notes Section === */}
          <Grid item xs={12}>
            <Typography variant="h6">Notes</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12}>
            {renderRichTextEditor('notes', 'Notes')}
          </Grid>

          {/* === Contacts Section === */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={wantContact}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setWantContact(checked);
                    if (checked && (!form.contacts || form.contacts.length === 0)) addContact();
                  }}
                />
              }
              label="Add Contacts"
            />
          </Grid>

          {wantContact &&
            form.contacts.map((contact, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Contact {index + 1}</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Name"
                    value={contact.name || ''}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    fullWidth
                    error={!!errors.contacts?.[index]?.email}
                    helperText={errors.contacts?.[index]?.email}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Phone"
                    value={contact.phone || ''}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Designation"
                    value={contact.designation || ''}
                    onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                    select
                    fullWidth
                  >
                    {designationOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Department"
                    value={contact.dept || ''}
                    onChange={(e) => handleContactChange(index, 'dept', e.target.value)}
                    select
                    fullWidth
                  >
                    {deptOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4} display="flex" alignItems="center">
                  <IconButton onClick={addContact} aria-label="add" color="primary">
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => removeContact(index)} aria-label="delete" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}

          {/* === Submit Button === */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading}>
              <EditIcon sx={{ mr: 1 }} />
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </Grid>
        </Grid>
        <ToastContainer position="top-right" autoClose={3000} />
      </CardContent>
    </Card>
  );
};

export default EditCompany;

// const EditCompany = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ contacts: [] });
//   const [wantContact, setWantContact] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [designationOptions, setDesignationOptions] = useState([]);
//   const [deptOptions, setDeptOptions] = useState([]);

//   // Fetch dropdown options on mount
//   useEffect(() => {
//     fetchDropDownOptions();
//     fetchDesignationOptions();
//     fetchDeptOptions();
//   }, []);

//   //todo: fetch network data
//   const fetchDropDownOptions = async () => {
//     try {
//       setIsLoading(true);
//       const response = await get('network');
//       if (response.status === 'true') {
//         setDropdownOptions(response.data.map((item) => item.networkName));
//       } else {
//         toast.error('Failed to load networks');
//       }
//     } catch (error) {
//       console.error('Error fetching networks:', error);
//       toast.error('Error loading networks');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchDesignationOptions = async () => {
//     try {
//       const response = await get('position');
//       if (response.status === 'true') {
//         setDesignationOptions(response.data.map((item) => item.position));
//       } else {
//         toast.error('Failed to load designations');
//       }
//     } catch (error) {
//       toast.error('Error loading designations');
//     }
//   };
//   const fetchDeptOptions = async () => {
//     try {
//       const response = await get('department');
//       if (response.status === 'true') {
//         setDeptOptions(response.data.map((item) => item.department));
//       } else {
//         toast.error('Failed to load departments');
//       }
//     } catch (error) {
//       toast.error('Error loading departments');
//     }
//   };

//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       try {
//         const response = await get(`prospect/${id}`);

//         console.log('edit prospect data', response.data);

//         if (response.status === 'true') {
//           const companyData = response.data;

//           // Ensure date fields are properly formatted
//           const dateFields = ['dob', 'dateOfIncorporation'];
//           dateFields.forEach((field) => {
//             if (companyData[field]) {
//               // Ensure it's a valid date format
//               try {
//                 const date = new Date(companyData[field]);
//                 if (!isNaN(date.getTime())) {
//                   companyData[field] = date.toISOString();
//                 }
//               } catch (e) {
//                 console.log(`Invalid date format for ${field}:`, companyData[field]);
//               }
//             }
//           });

//           setForm(companyData);

//           // If company has contacts, set wantContact to true
//           if (companyData.contacts && companyData.contacts.length > 0) {
//             setWantContact(true);
//           }
//         } else {
//           toast.error('Failed to load company details');
//           navigate('/prospects');
//         }
//       } catch (error) {
//         console.error('Error fetching company data:', error);
//         toast.error('Failed to fetch company data');
//         navigate('/prospects');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanyData();
//   }, [id, navigate]);

//   const validate = () => {
//     const newErrors = {};
//     const requiredFields = ['companyName', 'phoneNo', 'address', 'pincode', 'city', 'state', 'country'];

//     requiredFields.forEach((field) => {
//       console.log('field', form[field]);
//       if (!form[field]) newErrors[field] = 'Required';
//     });

//     // Improved email validation regex
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//     if (form.email && !emailRegex.test(form.email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     if (form.altEmail && !emailRegex.test(form.altEmail)) {
//       newErrors.altEmail = 'Invalid email format';
//     }

//     // Validate contacts if any
//     if (wantContact && form.contacts.length > 0) {
//       form.contacts.forEach((contact, index) => {
//         if (contact.email && !emailRegex.test(contact.email)) {
//           if (!newErrors.contacts) newErrors.contacts = {};
//           if (!newErrors.contacts[index]) newErrors.contacts[index] = {};
//           newErrors.contacts[index].email = 'Invalid email format';
//         }
//       });
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;

//     // Special handling for date fields
//     if (type === 'date' && value) {
//       try {
//         // Store dates in ISO format for consistency
//         const dateValue = new Date(value);
//         if (!isNaN(dateValue.getTime())) {
//           setForm((prev) => ({ ...prev, [name]: dateValue.toISOString() }));
//           return;
//         }
//       } catch (err) {
//         console.error('Error processing date:', err);
//       }
//     }

//     // Normal handling for other fields
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleContactChange = (index, field, value) => {
//     const updatedContacts = [...form.contacts];
//     if (!updatedContacts[index]) {
//       updatedContacts[index] = {};
//     }
//     updatedContacts[index][field] = value;
//     setForm((prev) => ({ ...prev, contacts: updatedContacts }));
//   };

//   const addContact = () => {
//     setForm((prev) => ({
//       ...prev,
//       contacts: [...(prev.contacts || []), { name: '', email: '', designation: '', dept: '', phone: '' }]
//     }));
//   };

//   const removeContact = (indexToRemove) => {
//     const updatedContacts = form.contacts.filter((_, i) => i !== indexToRemove);
//     setForm((prev) => ({ ...prev, contacts: updatedContacts }));
//   };

//   const handleSubmit = async () => {
//     if (validate()) {
//       try {
//         setIsLoading(true);

//         // 1. Keep track of old contacts (before edit)
//         const oldContacts = form._id ? (await get(`prospect/${id}`)).data.contacts || [] : [];

//         // 2. Update the prospect/company
//         const response = await put(`prospect/${id}`, form);

//         if (response.status === 'true' || response.status === true) {
//           toast.success('Company updated successfully!');

//           if (form.contacts && form.contacts.length > 0) {
//             console.log('contact form:', form.contacts);
//             for (const contact of form.contacts) {
//               if (contact.contactId) {
//                 console.log('Contact ID: ', contact.contactId);
//                 const contactPayload = {
//                   companyName: form.companyName,
//                   name: contact.name,
//                   email: contact.email,
//                   designation: contact.designation,
//                   phone: contact.phone,
//                   department: contact.dept
//                 };
//                 try {
//                   const response = await put(`contact/${contact.contactId}`, contactPayload);
//                   console.log('contact details : ', response);
//                 } catch (err) {
//                   console.error('Error syncing contact:', err);
//                 }
//               }
//             }
//           }

//           // 4. Delete removed contacts from /api/contact
//           const currentIds = form.contacts.map((c) => c._id).filter(Boolean);
//           for (const oldContact of oldContacts) {
//             if (oldContact._id && !currentIds.includes(oldContact._id)) {
//               try {
//                 await remove(`contact/${oldContact._id}`);
//               } catch (err) {
//                 console.error('Error deleting contact:', err);
//               }
//             }
//           }
//         } else {
//           toast.error(`Failed to update company: ${response.error || 'Unknown error'}`);
//         }
//       } catch (error) {
//         console.error('Error updating form:', error);
//         toast.error('Something went wrong while updating the company');
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       toast.error('Please fill all required fields correctly');
//     }
//   };

//   //   const handleSubmit = async () => {
//   //   if (validate()) {
//   //     try {
//   //       setIsLoading(true);

//   //       // Update the prospect/company
//   //       const response = await put(`prospect/${id}`, form);

//   //       if (response.status === 'true' || response.status === true) {
//   //         toast.success('Company updated successfully!');

//   //         // Optionally, update each contact in /api/contact if they have _id
//   //         if (form.contacts && form.contacts.length > 0) {
//   //           for (const contact of form.contacts) {
//   //             if (contact._id) {
//   //               const contactPayload = {
//   //                 companyName: form.companyName,
//   //                 name: contact.name,
//   //                 email: contact.email,
//   //                 designation: contact.designation,
//   //                 phone: contact.phone,
//   //                 department: contact.dept
//   //               };
//   //               try {
//   //                 // Use your API's PUT endpoint for contact update
//   //                 const contactRes = await put(`contact/${contact._id}`, contactPayload);
//   //                 if (contactRes.status === 'true' || contactRes.status === true) {
//   //                   toast.success(`Contact "${contact.name}" updated successfully!`);
//   //                 } else {
//   //                   toast.error(`Failed to update contact "${contact.name}": ${contactRes.error || 'Unknown error'}`);
//   //                 }
//   //               } catch (err) {
//   //                 console.error('Error updating contact:', err);
//   //                 toast.error(`Error updating contact "${contact.name}"`);
//   //               }
//   //             }
//   //           }
//   //         }
//   //       } else {
//   //         toast.error(`Failed to update company: ${response.error || 'Unknown error'}`);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error updating form:', error);
//   //       toast.error('Something went wrong while updating the company');
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   } else {
//   //     toast.error('Please fill all required fields correctly');
//   //   }
//   // }

//   // const handleSubmit = async () => {
//   //   if (validate()) {
//   //     try {
//   //       setIsLoading(true);

//   //       const response = await put(`prospect/${id}`, form);

//   //       if (response.status === 'true') {
//   //         toast.success('Company updated successfully!');
//   //       } else {
//   //         toast.error(`Failed to update company: ${response.error || 'Unknown error'}`);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error updating form:', error);
//   //       toast.error('Something went wrong while updating the company');
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   } else {
//   //     toast.error('Please fill all required fields correctly');
//   //   }
//   // };

//   const renderDropdown = (label, name, options) => (
//     <TextField
//       select
//       label={label}
//       name={name}
//       value={form[name] || ''}
//       onChange={handleChange}
//       fullWidth
//       required
//       error={!!errors[name]}
//       helperText={errors[name]}
//       disabled={isLoading}
//     >
//       {options.map((opt, i) => (
//         <MenuItem key={i} value={opt}>
//           {opt}
//         </MenuItem>
//       ))}
//     </TextField>
//   );

//   const renderRichTextEditor = (name, label) => (
//     <div style={{ marginBottom: '1rem' }}>
//       <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
//       <ReactQuill
//         value={form[name] || ''}
//         onChange={(value) => setForm((prev) => ({ ...prev, [name]: value }))}
//         theme="snow"
//         readOnly={isLoading}
//       />
//       {errors[name] && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors[name]}</div>}
//     </div>
//   );

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     try {
//       // Handle both date strings and Date objects
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return ''; // Invalid date

//       // Format as YYYY-MM-DD for input type="date"
//       return date.toISOString().split('T')[0];
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return '';
//     }
//   };

//   const renderTextField = (label, name, required = false, type = 'text') => (
//     <TextField
//       label={label}
//       name={name}
//       type={type}
//       value={type === 'date' ? formatDateForInput(form[name]) : type !== 'file' ? form[name] || '' : undefined}
//       onChange={handleChange}
//       fullWidth
//       required={required}
//       error={!!errors[name]}
//       helperText={errors[name]}
//       InputLabelProps={['date', 'file'].includes(type) ? { shrink: true } : {}}
//       inputProps={type === 'file' ? { accept: '*' } : {}}
//       disabled={isLoading}
//     />
//   );

//   if (loading) {
//     return (
//       <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '50vh' }}>
//         <CircularProgress />
//       </Grid>
//     );
//   }

//   return (
//     <Card>
//       <CardContent>
//         <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//           <Grid item>
//             <Typography variant="h6">Edit Company Information</Typography>
//           </Grid>
//           <Grid item>
//             <Button variant="contained" color="primary" component={Link} to="/prospects">
//               <ArrowBackIcon /> Back
//             </Button>
//           </Grid>
//         </Grid>

//         <Divider sx={{ mb: 2 }} />

//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12} md={4}>
//             {renderTextField('Company Name', 'companyName', true)}
//           </Grid>
//           <Grid item xs={12} md={4}>
//             {renderTextField('Phone No', 'phoneNo', true)}
//           </Grid>
//           <Grid item xs={12} md={4}>
//             {renderTextField('Date of Incorporation', 'dateOfIncorporation', false, 'date')}
//           </Grid>
//           <Grid item xs={12} md={3}>
//             {renderDropdown('Network', 'network', dropdownOptions)}
//           </Grid>
//           <Grid item xs={12} md={6}>
//             {renderTextField('Address', 'address', true)}
//           </Grid>
//           <Grid item xs={12} md={3}>
//             {renderTextField('Pincode', 'pincode', true)}
//           </Grid>
//           <Grid item xs={12} md={4}>
//             {renderTextField('City', 'city', true)}
//           </Grid>
//           <Grid item xs={12} md={4}>
//             {renderTextField('State', 'state', true)}
//           </Grid>
//           <Grid item xs={12} md={4}>
//             {renderTextField('Country', 'country', true)}
//           </Grid>
//           <Grid item xs={12}>
//             {renderRichTextEditor('notes', 'Notes')}
//           </Grid>

//           <Grid item xs={12} ml={0.5}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={wantContact}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     setWantContact(checked);
//                     if (checked && (!form.contacts || form.contacts.length === 0)) {
//                       addContact();
//                     }
//                   }}
//                   disabled={isLoading}
//                 />
//               }
//               label="Add Contacts"
//             />
//           </Grid>

//           {wantContact &&
//             form.contacts &&
//             form.contacts.map((contact, index) => (
//               <React.Fragment key={index}>
//                 {/* Contact form fields */}
//                 <Grid item xs={12} md={2}>
//                   <TextField
//                     label="Name"
//                     value={contact.name || ''}
//                     onChange={(e) => handleContactChange(index, 'name', e.target.value)}
//                     fullWidth
//                     error={errors.contacts && errors.contacts[index] && !!errors.contacts[index].name}
//                     helperText={errors.contacts && errors.contacts[index] && errors.contacts[index].name}
//                     disabled={isLoading}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={2.5}>
//                   <TextField
//                     label="Email"
//                     value={contact.email || ''}
//                     onChange={(e) => handleContactChange(index, 'email', e.target.value)}
//                     fullWidth
//                     error={errors.contacts && errors.contacts[index] && !!errors.contacts[index].email}
//                     helperText={errors.contacts && errors.contacts[index] && errors.contacts[index].email}
//                     disabled={isLoading}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={2.5}>
//                   <TextField
//                     select
//                     label="Designation"
//                     value={contact.designation || ''}
//                     onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
//                     fullWidth
//                     disabled={isLoading}
//                   >
//                     {designationOptions.map((opt, i) => (
//                       <MenuItem key={i} value={opt}>
//                         {opt}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} md={2.5}>
//                   <TextField
//                     select
//                     label="Department"
//                     value={contact.dept || ''}
//                     onChange={(e) => handleContactChange(index, 'dept', e.target.value)}
//                     fullWidth
//                     disabled={isLoading}
//                   >
//                     {deptOptions.map((opt, i) => (
//                       <MenuItem key={i} value={opt}>
//                         {opt}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} md={1.5}>
//                   <TextField
//                     label="Phone"
//                     value={contact.phone || ''}
//                     onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
//                     fullWidth
//                     disabled={isLoading}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={0.5} container justifyContent="flex-start">
//                   <IconButton color="primary" onClick={addContact} aria-label="add contact" disabled={isLoading}>
//                     <AddIcon fontSize="large" />
//                   </IconButton>
//                 </Grid>

//                 <Grid item xs={12} md={0.5} container justifyContent="flex-end">
//                   <IconButton onClick={() => removeContact(index)} color="error" aria-label="delete" disabled={isLoading}>
//                     <DeleteIcon fontSize="large" />
//                   </IconButton>
//                 </Grid>
//               </React.Fragment>
//             ))}

//           <Grid item xs={12}>
//             <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
//               <EditIcon /> {isLoading ? 'Updating...' : 'Update'}
//             </Button>
//           </Grid>
//         </Grid>
//         <ToastContainer position="top-right" autoClose={5000} />
//       </CardContent>
//     </Card>
//   );
// };

// export default EditCompany;

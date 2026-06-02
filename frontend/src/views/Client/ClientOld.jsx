//! Ayushi Code
// import React, { useState, useEffect } from 'react';
// import {
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Card,
//   IconButton,
//   CardContent,
//   Divider,
//   Box,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem
// } from '@mui/material';
// import { FaTrash } from 'react-icons/fa';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Link } from 'react-router-dom';
// import Breadcrumb from 'component/Breadcrumb';
// import { gridSpacing } from 'config.js';
// import Add from '@mui/icons-material/Add';
// import Close from '@mui/icons-material/Close';
// import CancelIcon from '@mui/icons-material/Cancel';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import Edit from '@mui/icons-material/Edit';
// import Delete from '@mui/icons-material/Delete';
// import value from 'assets/scss/_themes-vars.module.scss';

// import { axiosInstance } from '../../api/api.js';

// const Client = () => {
//   const [logoPreview, setLogoPreview] = useState('');
//   const [form, setForm] = useState(initialState());
//   const [data, setData] = useState([
//     {
//     clientName: 'Alpha Tech Pvt Ltd',
//     clientType: 'Client',
//     officialPhoneNo: '9876543210',
//     gstNo: '27ABCDE1234F2Z5'
//   },
//   {
//     clientName: 'Beta Distributors',
//     clientType: 'Supplier',
//     officialPhoneNo: '9123456789',
//     gstNo: '29XYZPQ7890K1Z3'
//   },

//   ]);
//   const [open, setOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [errors, setErrors] = useState({});
//   const clients = ['Client', 'Vendor', 'Supplier']; // Example client types

//   function initialState() {
//     return {
//       clientName: '',
//       officialPhoneNo: '',
//       altPhoneNo: '',
//       officialMailId: '',
//       altMailId: '',
//       emergencyContactPerson: '',
//       emergencyContactNo: '',
//       website: '',
//       gstNo: '',
//       panNo: '',
//       logo: null,
//       officeAddress: '',
//       pincode: '',
//       city: '',
//       state: '',
//       country: '',
//       clientType: '', // New field for client type
//       contactPerson: {
//         name: '',
//         department: '',
//         position: '',
//         email: '',
//         phone: ''
//       }
//     };
//   }

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!form.clientName) newErrors.clientName = 'Client Name is required';
//     if (!form.officialPhoneNo) newErrors.officialPhoneNo = 'Official Phone Number is required';
//     if (!form.officialPhoneNo.match(/^[0-9]{10}$/)) newErrors.officialPhoneNo = 'Must be 10 digits';
//     if (form.altPhoneNo && !form.altPhoneNo.match(/^[0-9]{10}$/)) newErrors.altPhoneNo = 'Must be 10 digits';
//     if (!form.officialMailId) newErrors.officialMailId = 'Official Email is required';
//     if (!form.officialMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.officialMailId = 'Invalid email format';
//     if (form.altMailId && !form.altMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.altMailId = 'Invalid email format';
//     if (!form.emergencyContactPerson) newErrors.emergencyContactPerson = 'Required';
//     if (!form.emergencyContactNo) newErrors.emergencyContactNo = 'Required';
//     if (!form.emergencyContactNo.match(/^[0-9]{10}$/)) newErrors.emergencyContactNo = 'Must be 10 digits';
//     if (!form.website) newErrors.website = 'Required';
//     // if (!form.gstNo) newErrors.gstNo = 'Required';
//     // if (!form.gstNo.match(/^[0-9A-Z]{15}$/)) newErrors.gstNo = 'Must be 15 alphanumeric characters';
//     if (!form.officeAddress) newErrors.officeAddress = 'Required';
//     if (!form.clientType) newErrors.clientType = 'Required';
//     if (!form.pincode) newErrors.pincode = 'Required';
//     if (!form.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Must be 6 digits';
//     if (!form.city) newErrors.city = 'Required';
//     if (!form.state) newErrors.state = 'Required';
//     if (!form.country) newErrors.country = 'Required';
//     if (!form.contactPerson.name) newErrors['contactPerson.name'] = 'Contact Person Name is required';
//     if (!form.contactPerson.department) newErrors['contactPerson.department'] = 'Department is required';
//     if (!form.contactPerson.position) newErrors['contactPerson.position'] = 'Position is required';
//     if (!form.contactPerson.email) newErrors['contactPerson.email'] = 'Email is required';
//     else if (!form.contactPerson.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors['contactPerson.email'] = 'Invalid email format';
//     if (!form.contactPerson.phone) newErrors['contactPerson.phone'] = 'Phone is required';
//     else if (!form.contactPerson.phone.match(/^[0-9]{10}$/)) newErrors['contactPerson.phone'] = 'Must be 10 digits';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//  const handleOpen = () => {
//     setForm(initialState);
//     setErrors({});
//     setEditIndex(null);
//     setOpen(true);
//   };

//   const handleEdit = (index) => {
//     setForm({ ...data[index] }); // Fix: always use a copy, not a reference
//     setEditIndex(index);
//     setOpen(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files && files[0]) {
//       if (name === 'logo') {
//         setForm({ ...form, logo: files[0] });
//         setLogoPreview(URL.createObjectURL(files[0]));
//       }
//       return;
//     }

//     if (name.includes('.')) {
//       const keys = name.split('.');
//       setForm((prevForm) => {
//         return {
//           ...prevForm,
//           [keys[0]]: {
//             ...prevForm[keys[0]],
//             [keys[1]]: value
//           }
//         };
//       });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleDeleteLogo = () => {
//     setForm({ ...form, logo: null });
//     setLogoPreview('');
//   };

//   // const handleSubmit = () => {
//   //   if (validateForm()) {
//   //     console.log("Submitted Client Data:", form);
//   //     toast.success("Client registered successfully!");
//   //   } else {
//   //     toast.error("Please fix the form errors.");
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         // 1. Register the client (excluding contactPerson)
//         const clientPayload = { ...form };
//         delete clientPayload.contactPerson;
//         const clientResponse = await axiosInstance.post('clientRegistration', clientPayload);

//         if (clientResponse.data && clientResponse.data.status === 'true') {
//           // 2. Register the contact person (if present)
//           const contactPersonPayload = { ...form.contactPerson };
//           if (
//             contactPersonPayload.name &&
//             contactPersonPayload.department &&
//             contactPersonPayload.position &&
//             contactPersonPayload.email &&
//             contactPersonPayload.phone
//           ) {
//             await axiosInstance.post('contactPerson', contactPersonPayload);
//           }
//           toast.success('Client and Contact Person registered successfully!');
//           // Optionally reset form here
//           setForm({
//             clientName: '',
//             officialPhoneNo: '',
//             altPhoneNo: '',
//             officialMailId: '',
//             altMailId: '',
//             emergencyContactPerson: '',
//             emergencyContactNo: '',
//             website: '',
//             gstNo: '',
//             panNo: '',
//             logo: null,
//             officeAddress: '',
//             pincode: '',
//             city: '',
//             state: '',
//             country: '',
//             clientType: '',
//             contactPerson: {
//               name: '',
//               department: '',
//               position: '',
//               email: '',
//               phone: ''
//             }
//           });
//           setLogoPreview('');
//           setErrors({});
//         } else {
//           toast.error(clientResponse.data.message || 'Failed to register client');
//         }
//       } catch (error) {
//         toast.error('Error submitting form');
//         console.error(error);
//       }
//     } else {
//       toast.error('Please fix the form errors.');
//     }
//   };

//   const fieldGroups = [
//     [
//       { label: 'Client Name', name: 'clientName' },
//       { label: 'Official Phone No.', name: 'officialPhoneNo' },
//       { label: 'Alternate Phone No.', name: 'altPhoneNo' },
//       { label: 'Official Mail ID', name: 'officialMailId' }
//     ],
//     [
//       { label: 'Alternate Mail ID', name: 'altMailId' },
//       { label: 'Emergency Contact Person', name: 'emergencyContactPerson' },
//       { label: 'Emergency Contact No.', name: 'emergencyContactNo' },
//       // { label: 'Website', name: 'website' }
//     ],
//     [
//       { label: 'GST No.', name: 'gstNo' },
//       { label: 'PAN No.', name: 'panNo' },
//       { label: 'Pincode', name: 'pincode' },
//       { label: 'City', name: 'city' }
//     ],
//     [],
//     [
//       { label: 'State', name: 'state' },
//       { label: 'Country', name: 'country' }
//       // { label: 'Type Of Client', name: 'clientType' },
//       // { label: 'Office Address', name: 'officeAddress'}
//     ]
//   ];

//   const contactPersonFields = [
//     [
//       { label: 'Name', name: 'contactPerson.name', errorKey: 'contactPersonName' },
//       { label: 'Department', name: 'contactPerson.department', errorKey: 'contactPersonDepartment' },
//       { label: 'Position', name: 'contactPerson.position', errorKey: 'contactPersonPosition' }
//     ],
//     [
//       { label: 'Email', name: 'contactPerson.email', errorKey: 'contactPersonEmail' },
//       { label: 'Phone No.', name: 'contactPerson.phone', errorKey: 'contactPersonPhone' }
//     ]
//   ];

//   return (
//     <>
//       <Breadcrumb>
//         <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
//           Home
//         </Typography>
//         <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
//           Client
//         </Typography>
//       </Breadcrumb>

//       <Grid container spacing={gridSpacing}>
//         <Grid item xs={12}>
//           <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//             <Typography variant="h5">Client Details</Typography>
//             <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
//               Add Client
//             </Button>
//           </Grid>

//           {/* Bank Table */}
//           {
//           // data.length > 0 &&
//           (
//             <Card>
//               <CardContent>
//                 <Box sx={{ overflowX: 'auto' }}>
//                   <Grid container spacing={2} sx={{ minWidth: '800px' }}>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>SN</TableCell>
//                           <TableCell>Client Name</TableCell>
//                           <TableCell>Type Of Client</TableCell>
//                           <TableCell>Phone No</TableCell>
//                           <TableCell>GST No</TableCell>
//                           <TableCell>Actions</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {data.map((entry, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>{entry.clientName}</TableCell>
//                             <TableCell>{entry.clientType}</TableCell>
//                             <TableCell>{entry.officialPhoneNo}</TableCell>
//                             <TableCell>{entry.gstNo}</TableCell>

//                             <TableCell sx={{
//                                   display:'flex',
//                                   flexWrap: 'nowrap',
//                               }}>
//                                 <Button size="small"  sx={{
//                                   padding: '1px', // Reduced padding
//                                   minWidth: '24px', // Set minimum width
//                                   height: '24px',
//                                   mr: '5px',
//                                 }}>
//                                   <IconButton color='inherit'   onClick={() => handleEdit(index)}><Edit /></IconButton>
//                                 </Button>
//                                 <Button color="error" sx={{
//                                   padding: '1px', // Reduced padding
//                                   minWidth: '24px', // Set minimum width
//                                   height: '24px'
//                                 }}>
//                                   <IconButton color='inherit'><Delete /></IconButton>
//                                 </Button>
//                               </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </Grid>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Grid>
//       </Grid>

//       <Dialog open={open} onClose= {handleClose} maxWidth="md" fullWidth>
//         <DialogTitle>
//           {editIndex != null ? 'Edit Client' : 'Add Client'}
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpen(false)}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500]
//             }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="h5" gutterBottom>
//             Client Registration
//           </Typography>
//           <Card>
//             <Divider />
//             <CardContent>
//               <Grid container spacing={2}>
//                 {fieldGroups.map((group, idx) => (
//                   <React.Fragment key={idx}>
//                     {group.map((field) => (
//                       <Grid item xs={12} sm={3} key={field.name}>
//                         <TextField
//                           label={field.label}
//                           name={field.name}
//                           value={form[field.name]}
//                           onChange={handleChange}
//                           error={!!errors[field.name]}
//                           helperText={errors[field.name]}
//                           fullWidth
//                           required={!['altPhoneNo', 'altMailId', 'panNo'].includes(field.name)}
//                         />
//                       </Grid>
//                     ))}
//                   </React.Fragment>
//                 ))}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Website"
//                     name="website"
//                     value={form.website}
//                     onChange={handleChange}
//                     error={!!errors.website}
//                     helperText={errors.website}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={3}>
//                   <TextField
//                     select
//                     label="Client Type"
//                     name="clientType"
//                     value={form.clientType}
//                     onChange={handleChange}
//                     error={!!errors.clientType}
//                     helperText={errors.clientType}
//                     fullWidth
//                     required
//                   >
//                     {clients.map((type, i) => (
//                       <MenuItem key={i} value={type}>
//                         {type}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} sm={3}>
//                   <TextField type="file" label="Logo" name="logo" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
//                   {logoPreview && (
//                     <Box position="relative" mt={2}>
//                       <img src={logoPreview} alt="Logo" style={{ width: 100, borderRadius: 4 }} />
//                       <IconButton
//                         size="small"
//                         onClick={handleDeleteLogo}
//                         sx={{
//                           position: 'absolute',
//                           top: -8,
//                           left: -8,
//                           backgroundColor: 'white',
//                           border: '1px solid #ccc',
//                           boxShadow: 1,
//                           '&:hover': { backgroundColor: '#f8d7da', color: 'red' }
//                         }}
//                       >
//                         <FaTrash size={12} />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                   <TextField
//                     label="Office Address"
//                     name="officeAddress"
//                     value={form.officeAddress}
//                     onChange={handleChange}
//                     error={!!errors.officeAddress}
//                     helperText={errors.officeAddress}
//                     fullWidth
//                     required
//                   />
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//           <ToastContainer />

//           <Divider sx={{ my: 2 }} />
//           <Typography variant="h5" gutterBottom>
//             Contact Person
//           </Typography>
//           <Card>
//             <Divider />
//             <CardContent>
//               <Grid container spacing={2}>
//                 {contactPersonFields.map((group, idx) => (
//                   <React.Fragment key={idx}>
//                     {group.map((field) => (
//                       <Grid item xs={12} sm={4} key={field.name}>
//                         <TextField
//                           label={field.label}
//                           name={field.name}
//                           value={form[field.name]}
//                           onChange={handleChange}
//                           error={!!errors[field.name]}
//                           helperText={errors[field.name]}
//                           fullWidth
//                           required
//                         />
//                       </Grid>
//                     ))}
//                   </React.Fragment>
//                 ))}
//               </Grid>
//             </CardContent>
//           </Card>
//         </DialogContent>
//          <DialogActions sx={{ pr: 3, pb: 2 }}>
//                   <Button
//                     onClick={() => setOpen(false)}
//                     variant="contained"
//                     color="error"
//                     sx={{
//                       minWidth: '40px', // Adjust the button size to fit the icon
//                       padding: '2px', // Reduce padding around the icon
//                     }}
//                   >
//                     <IconButton color="inherit">
//                       <CancelIcon /> {/* Cancel icon */}
//                     </IconButton>
//                   </Button>

//                   <Button
//                     onClick={handleSubmit}
//                     variant="contained"
//                     sx={{
//                       minWidth: '40px', // Adjust the button size to fit the icon
//                       padding: '2px', // Reduce padding around the icon
//                       backgroundColor: value.primaryLight
//                     }}
//                   >
//                     <IconButton color="inherit">
//                       {editIndex !== null ? <EditIcon /> : <SaveIcon />} {/* Conditional rendering of icons */}
//                     </IconButton>
//                   </Button>
//                 </DialogActions>

//       </Dialog>
//     </>
//   );
// };

// export default Client;

//! newer updated data

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
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import value from 'assets/scss/_themes-vars.module.scss';
import { axiosInstance } from '../../api/api.js';
import axios from 'axios';

const initialState = {
  clientName: '',
  officialPhoneNo: '',
  altPhoneNo: '',
  officialMailId: '',
  altMailId: '',
  emergencyContactPerson: '',
  emergencyContactNo: '',
  website: '',
  gstNo: '',
  panNo: '',
  logo: null,
  officeAddress: '',
  pincode: '',
  city: '',
  state: '',
  country: '',
  clientType: '',
  contactPerson: {
    name: '',
    department: '',
    position: '',
    email: '',
    phone: ''
  }
};

const ClientOld = () => {
  const [logoPreview, setLogoPreview] = useState('');
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [typeOfClientList, setTypeOfClientList] = useState([]);
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const fetchTypeOfClientList = async () => {
      try {
        const res = await axiosInstance.get('typeOfClient');
        if (res.data && res.data.status === 'true') {
          setTypeOfClientList(res.data.data);
        }
      } catch (err) {}
    };

    const fetchClients = async () => {
      try {
        const res = await axiosInstance.get('clientRegistration');
        if (res.data && res.data.status === 'true') {
          setClientList(res.data.data);
        }
      } catch (err) {}
    };

    fetchTypeOfClientList();
    fetchClients();
  }, []);

  const refreshClients = async () => {
    try {
      const res = await axiosInstance.get('clientRegistration');
      if (res.data && res.data.status === 'true') {
        setClientList(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.clientName) newErrors.clientName = 'Client Name is required';
    if (!form.officialPhoneNo) newErrors.officialPhoneNo = 'Official Phone Number is required';
    if (!form.officialPhoneNo.match(/^[0-9]{10}$/)) newErrors.officialPhoneNo = 'Must be 10 digits';
    if (form.altPhoneNo && !form.altPhoneNo.match(/^[0-9]{10}$/)) newErrors.altPhoneNo = 'Must be 10 digits';
    if (!form.officialMailId) newErrors.officialMailId = 'Official Email is required';
    if (!form.officialMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.officialMailId = 'Invalid email format';
    if (form.altMailId && !form.altMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.altMailId = 'Invalid email format';
    if (!form.emergencyContactPerson) newErrors.emergencyContactPerson = 'Required';
    if (!form.emergencyContactNo) newErrors.emergencyContactNo = 'Required';
    if (!form.emergencyContactNo.match(/^[0-9]{10}$/)) newErrors.emergencyContactNo = 'Must be 10 digits';
    if (!form.website) newErrors.website = 'Required';
    if (!form.officeAddress) newErrors.officeAddress = 'Required';
    if (!form.clientType) newErrors.clientType = 'Required';
    if (!form.pincode) newErrors.pincode = 'Required';
    if (!form.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Must be 6 digits';
    if (!form.city) newErrors.city = 'Required';
    if (!form.state) newErrors.state = 'Required';
    if (!form.country) newErrors.country = 'Required';
    if (!form.contactPerson.name) newErrors['contactPerson.name'] = 'Contact Person Name is required';
    if (!form.contactPerson.department) newErrors['contactPerson.department'] = 'Department is required';
    if (!form.contactPerson.position) newErrors['contactPerson.position'] = 'Position is required';
    if (!form.contactPerson.email) newErrors['contactPerson.email'] = 'Email is required';
    else if (!form.contactPerson.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors['contactPerson.email'] = 'Invalid email format';
    if (!form.contactPerson.phone) newErrors['contactPerson.phone'] = 'Phone is required';
    else if (!form.contactPerson.phone.match(/^[0-9]{10}$/)) newErrors['contactPerson.phone'] = 'Must be 10 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors.');
      return;
    }
    try {
      const clientPayload = { ...form };
      delete clientPayload.contactPerson;
      const formData = new FormData();
      Object.keys(clientPayload).forEach((key) => {
        if (key !== 'logo') {
          formData.append(key, clientPayload[key]);
        }
      });
      if (form.logo && form.logo instanceof File) {
        formData.append('logo', form.logo);
      }
      Object.entries(form.contactPerson).forEach(([k, v]) => {
        formData.append(`contactPerson_${k}`, v);
      });

      let res;
      if (editClientId) {
        res = await axiosInstance.put(`clientRegistration/${editClientId}`, formData);
      } else {
        res = await axiosInstance.post('clientRegistration', formData);
      }

      if (res.data && res.data.status === 'true') {
        toast.success(editClientId ? 'Client updated successfully!' : 'Client added successfully!');
        setForm(initialState);
        setLogoPreview('');
        setErrors({});
        setEditClientId(null);
        refreshClients();
        setOpen(false);
      } else {
        toast.error(res.data.message || 'Failed to save client');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const handleEditClient = (client) => {
    setForm({
      clientName: client.clientName || '',
      officialPhoneNo: client.officialPhoneNo || '',
      altPhoneNo: client.altPhoneNo || '',
      officialMailId: client.officialMailId || '',
      altMailId: client.altMailId || '',
      emergencyContactPerson: client.emergencyContactPerson || '',
      emergencyContactNo: client.emergencyContactNo || '',
      website: client.website || '',
      gstNo: client.gstNo || '',
      panNo: client.panNo || '',
      logo: null,
      officeAddress: client.officeAddress || '',
      pincode: client.pincode || '',
      city: client.city || '',
      state: client.state || '',
      country: client.country || '',
      clientType:
        client.clientType && client.clientType._id ? client.clientType._id : typeof client.clientType === 'string' ? client.clientType : '',
      contactPerson: {
        name: client.contactPerson?.name || '',
        department: client.contactPerson?.department || '',
        position: client.contactPerson?.position || '',
        email: client.contactPerson?.email || '',
        phone: client.contactPerson?.phone || ''
      }
    });
    setEditClientId(client._id);
    setOpen(true);
  };

  const handleDeleteClient = async (id) => {
    try {
      await axiosInstance.delete(`clientRegistration/${id}`);
      toast.success('Client deleted!');
      refreshClients();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      if (name === 'logo') {
        setForm({ ...form, logo: files[0] });
        setLogoPreview(URL.createObjectURL(files[0]));
      }
      return;
    }
    if (name.includes('.')) {
      const keys = name.split('.');
      setForm((prevForm) => ({
        ...prevForm,
        [keys[0]]: {
          ...prevForm[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDeleteLogo = () => {
    setForm({ ...form, logo: null });
    setLogoPreview('');
  };

  const handlePincodeBlur = async () => {
    if (form.pincode && form.pincode.match(/^[0-9]{6}$/)) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${form.pincode}`);
        const apiData = res.data && res.data[0];
        if (apiData && apiData.Status === 'Success' && apiData.PostOffice && apiData.PostOffice.length > 0) {
          setForm((prev) => ({
            ...prev,
            city: apiData.PostOffice[0].District || '',
            state: apiData.PostOffice[0].State || '',
            country: apiData.PostOffice[0].Country || 'India'
          }));
          setErrors((prev) => ({ ...prev, pincode: undefined }));
        } else {
          setForm((prev) => ({
            ...prev,
            city: '',
            state: '',
            country: ''
          }));
          setErrors((prev) => ({ ...prev, pincode: 'Invalid or not found' }));
          toast.error('Pincode not found. Please enter a valid pincode.');
        }
      } catch (err) {
        setForm((prev) => ({
          ...prev,
          city: '',
          state: '',
          country: ''
        }));
        setErrors((prev) => ({ ...prev, pincode: 'Error fetching pincode details' }));
        toast.error('Error fetching pincode details, Please try again.');
      }
    }
  };
  const handleDateChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fieldGroups = [
    [
      { label: 'Client Name', name: 'clientName' },
      { label: 'Official Phone No.', name: 'officialPhoneNo' },
      { label: 'Alternate Phone No.', name: 'altPhoneNo' },
      { label: 'Official Mail ID', name: 'officialMailId' }
    ],
    [
      { label: 'Alternate Mail ID', name: 'altMailId' },
      { label: 'Emergency Contact Person', name: 'emergencyContactPerson' },
      { label: 'Emergency Contact No.', name: 'emergencyContactNo' }
      // { label: 'Website', name: 'website' }
    ],
    [
      { label: 'GST No.', name: 'gstNo' },
      { label: 'PAN No.', name: 'panNo' },
      { label: 'Pincode', name: 'pincode' },
      { label: 'City', name: 'city' }
    ],
    [],
    [
      { label: 'State', name: 'state' },
      { label: 'Country', name: 'country' }
      // { label: 'Type Of Client', name: 'clientType' },
      // { label: 'Office Address', name: 'officeAddress'}
    ]
  ];

  const contactPersonFields = [
    [
      { label: 'Name', name: 'contactPerson.name' },
      { label: 'Department', name: 'contactPerson.department' },
      { label: 'Position', name: 'contactPerson.position' }
    ],
    [
      { label: 'Email', name: 'contactPerson.email' },
      { label: 'Phone No.', name: 'contactPerson.phone' }
    ]
  ];

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Client
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <label htmlFor="">Type of Client</label>
          <RadioGroup row value={clientList} onChange={(e) => setClientList(e.target.value)}>
            <FormControlLabel value="prospect" control={<Radio />} label="Temparory" />
            <FormControlLabel value="client" control={<Radio />} label="Permanent" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Client Details</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setForm(initialState);
                setOpen(true);
                setEditClientId(null);
              }}
            >
              Add Client
            </Button>
          </Grid>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Box></Box>
                <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>SN</TableCell>
                        <TableCell>Client Name</TableCell>
                        <TableCell>Contact Person</TableCell>
                        <TableCell>Contact No</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>License Validdd</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientList.map((entry, index) => (
                        <TableRow key={entry._id || index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{entry.clientName}</TableCell>
                          <TableCell>{typeOfClientList.find((t) => t._id === entry.clientType)?.typeOfClient || ''}</TableCell>
                          <TableCell>{entry.officialPhoneNo}</TableCell>
                          <TableCell>{entry.gstNo}</TableCell>
                          <TableCell sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                            <Button
                              size="small"
                              sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                              onClick={() => handleEditClient(entry)}
                            >
                              <IconButton color="inherit">
                                <Edit />
                              </IconButton>
                            </Button>
                            <Button
                              color="error"
                              sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
                              onClick={() => handleDeleteClient(entry._id)}
                            >
                              <IconButton color="inherit">
                                <Delete />
                              </IconButton>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditClientId(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editClientId ? 'Edit Client' : 'Add Client'}
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpen(false);
              setEditClientId(null);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom>
            Client Registration
          </Typography>
          <Card>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {fieldGroups.map((group, idx) => (
                  <React.Fragment key={idx}>
                    {group.map((field) => {
                      if (field.name === 'pincode') {
                        return (
                          <Grid item xs={12} sm={3} key={field.name}>
                            <TextField
                              label={field.label}
                              name={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              onBlur={handlePincodeBlur}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]}
                              fullWidth
                            />
                          </Grid>
                        );
                      }
                      if (field.name === 'clientType') {
                        return (
                          <Grid item xs={12} sm={3} key={field.name}>
                            <TextField
                              select
                              label={field.label}
                              name={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]}
                              fullWidth
                            >
                              <MenuItem value="">
                                <em>Select Type Of Client</em>
                              </MenuItem>
                              {typeOfClientList.map((type) => (
                                <MenuItem key={type._id} value={type._id}>
                                  {type.typeOfClient}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        );
                      }
                      return (
                        <Grid item xs={12} sm={3} key={field.name}>
                          <TextField
                            label={field.label}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            fullWidth
                            multiline={field.multiline}
                            rows={field.multiline ? 2 : 1}
                          />
                        </Grid>
                      );
                    })}
                  </React.Fragment>
                ))}
                <Grid item xs={12} sm={3}>
                  <TextField type="file" label="Logo" name="logo" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                  {logoPreview && (
                    <Box position="relative" mt={2}>
                      <img src={logoPreview} alt="Logo" style={{ width: 100, borderRadius: 4 }} />
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
                          '&:hover': { backgroundColor: '#f8d7da', color: 'red' }
                        }}
                      >
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <ToastContainer />

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Contact Person
          </Typography>
          <Card>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {contactPersonFields.map((group, idx) => (
                  <React.Fragment key={idx}>
                    {group.map((field) => (
                      <Grid item xs={12} sm={4} key={field.name}>
                        <TextField
                          label={field.label}
                          name={field.name}
                          value={form.contactPerson[field.name.split('.')[1]]}
                          onChange={handleChange}
                          error={!!errors[field.name]}
                          helperText={errors[field.name]}
                          fullWidth
                        />
                      </Grid>
                    ))}
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleClientSubmit}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpen(false);
              setEditClientId(null);
            }}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px',
              padding: '2px'
            }}
          >
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>
          <Button
            onClick={handleClientSubmit}
            variant="contained"
            sx={{
              minWidth: '40px',
              padding: '2px',
              backgroundColor: value.primaryLight
            }}
          >
            <IconButton color="inherit">{editClientId ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientOld;

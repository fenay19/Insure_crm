// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
// import Breadcrumb from 'component/Breadcrumb';
// import { Link } from 'react-router-dom';
// import { get } from '../../api/api';

// // ✅ MUI Calendar Imports
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

// const InvoiceReport = () => {
//   // Stores all invoices fetched from the API (the source data)
//   const [allInvoiceData, setAllInvoiceData] = useState([]);
//   // Stores the currently displayed/filtered invoices
//   const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);

//   // Filter States
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [month, setMonth] = useState('');

//   // 1. DATA FETCHING
//   const fetchInvoices = async () => {
//     const res = await get('invoiceRegistration');
//     if (res.status === true) {
//       const invoices = res.invoices || [];
//       // Set both the source and the initial filtered data
//       setAllInvoiceData(invoices);
//       setFilteredInvoiceData(invoices);
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   // 2. CLIENT-SIDE FILTERING LOGIC
//   useEffect(() => {
//     let filtered = [...allInvoiceData]; // Start with all invoices

//     // Apply Month Filter (YYYY-MM format)
//     if (month) {
//       const [year, mon] = month.split('-').map(Number);

//       filtered = filtered.filter((inv) => {
//         // Ensure date parsing is robust
//         const d = new Date(inv.date);
//         // Date.getMonth() is 0-indexed, so we compare month+1
//         return d.getFullYear() === year && d.getMonth() + 1 === mon;
//       });
//     }

//     // Apply From Date Filter (YYYY-MM-DD format)
//     if (fromDate) {
//       // Normalize dates to midnight for consistent comparison
//       const f = dayjs(fromDate).startOf('day').toDate();
//       filtered = filtered.filter((inv) => new Date(inv.date) >= f);
//     }

//     // Apply To Date Filter (YYYY-MM-DD format)
//     if (toDate) {
//       // Normalize dates to end of day for inclusive comparison
//       const t = dayjs(toDate).endOf('day').toDate();
//       filtered = filtered.filter((inv) => new Date(inv.date) <= t);
//     }

//     setFilteredInvoiceData(filtered); // Update the displayed data
//   }, [fromDate, toDate, month, allInvoiceData]);

//   // Helper function for GST Amount calculation logic
//   const calculateGstAmount = (invoice) => {
//     const diff = invoice.roundUp - invoice.totalAmount;
//     // Check if the difference is negligible (Non-GST case)
//     if (Math.abs(diff) < 0.01) {
//       return 'Non GST';
//     }
//     return `₹${diff.toFixed(2)}`;
//   };

//   return (
//     <>
//       <Breadcrumb>
//         <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
//           Home
//         </Typography>
//         <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
//           Invoice Report
//         </Typography>
//       </Breadcrumb>

//       <Grid container spacing={2} sx={{ mt: 2 }}>
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h6" m={2}>
//                   INVOICE REPORT
//                 </Typography>
//               </Box>

//               {/* ======================================== */}
//               {/* FILTERS (CALENDARS)          */}
//               {/* ======================================== */}
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <Grid container spacing={2} sx={{ mb: 4 }} alignItems="flex-end">
//                   {/* FROM DATE */}
//                   <Grid item xs={12} sm={3}>
//                     <DatePicker
//                       label="From Date"
//                       value={fromDate ? dayjs(fromDate) : null}
//                       onChange={(newVal) => setFromDate(newVal ? newVal.format('YYYY-MM-DD') : '')}
//                       slotProps={{ textField: { fullWidth: true } }}
//                     />
//                   </Grid>

//                   {/* TO DATE */}
//                   <Grid item xs={12} sm={3}>
//                     <DatePicker
//                       label="To Date"
//                       value={toDate ? dayjs(toDate) : null}
//                       onChange={(newVal) => setToDate(newVal ? newVal.format('YYYY-MM-DD') : '')}
//                       slotProps={{ textField: { fullWidth: true } }}
//                     />
//                   </Grid>

//                   {/* MONTH PICKER */}
//                   <Grid item xs={12} sm={3}>
//                     <DatePicker
//                       views={['year', 'month']}
//                       label="Select Month"
//                       value={month ? dayjs(month) : null}
//                       onChange={(newVal) => setMonth(newVal ? newVal.format('YYYY-MM') : '')}
//                       slotProps={{ textField: { fullWidth: true } }}
//                     />
//                   </Grid>

//                   {/* CLEAR BUTTON */}
//                   <Grid item xs={12} sm={3}>
//                     {/* Import Button component from '@mui/material' if not already present */}
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => {
//                         setFromDate('');
//                         setToDate('');
//                         setMonth('');
//                       }}
//                       fullWidth
//                       sx={{ height: '56px' }} // Match height of DatePicker TextField
//                     >
//                       Clear Filters
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </LocalizationProvider>
//               {/* --- End Filters --- */}

//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <Card sx={{ p: 2 }}>
//                     <Box sx={{ width: '100%' }}>
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>SN</TableCell>
//                             <TableCell>Client Name</TableCell>
//                             <TableCell>Invoice No.</TableCell>
//                             <TableCell>Date</TableCell>
//                             <TableCell align="right">Principle Amount</TableCell>
//                             <TableCell align="right">GST Amount</TableCell>
//                             <TableCell align="right">Total Amount</TableCell>
//                             <TableCell align="right">Paid Amount</TableCell>
//                             <TableCell align="right">Balance Amount</TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {filteredInvoiceData.length > 0 ? (
//                             filteredInvoiceData.map((invoice, index) => (
//                               <TableRow key={invoice._id || index}>
//                                 <TableCell>{index + 1}</TableCell>
//                                 <TableCell>{invoice.clientName}</TableCell>
//                                 <TableCell>{invoice.invoiceNumber}</TableCell>
//                                 <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
//                                 {/* Invoice Amount (Principle Amount / Taxable Value) */}
//                                 <TableCell align="right">₹{invoice.totalAmount?.toFixed(2)}</TableCell>
//                                 {/* GST Amount Calculation: roundUp - totalAmount */}
//                                 <TableCell align="right">{calculateGstAmount(invoice)}</TableCell>
//                                 {/* Total Amount (RoundUp) */}
//                                 <TableCell align="right">₹{invoice.roundUp?.toFixed(2)}</TableCell>
//                                 {/* Paid Amount */}
//                                 <TableCell align="right">₹{invoice.totalPaidAmount?.toFixed(2)}</TableCell>
//                                 {/* Balance Amount */}
//                                 <TableCell align="right">₹{(invoice.roundUp - invoice.totalPaidAmount)?.toFixed(2)}</TableCell>
//                               </TableRow>
//                             ))
//                           ) : (
//                             <TableRow>
//                               <TableCell colSpan={9} align="center">
//                                 No invoices found
//                               </TableCell>
//                             </TableRow>
//                           )}
//                         </TableBody>
//                       </Table>
//                     </Box>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default InvoiceReport;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Autocomplete
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { get } from '../../api/api';

// ✅ MUI Calendar Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const InvoiceReport = () => {
  // Stores all invoices fetched from the API (the source data)
  const [allInvoiceData, setAllInvoiceData] = useState([]);
  // Stores the currently displayed/filtered invoices
  const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);

  // Filter States
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [month, setMonth] = useState('');
  const [clientName, setClientName] = useState(''); // Selected client filter
  const [clientOptions, setClientOptions] = useState([]); // Unique client names for autocomplete

  // 1. DATA FETCHING
  const fetchInvoices = async () => {
    const res = await get('invoiceRegistration');
    if (res.status === true) {
      const invoices = res.invoices || [];
      // Set both the source and the initial filtered data
      setAllInvoiceData(invoices);
      setFilteredInvoiceData(invoices);

      // Extract unique client names for autocomplete
      const clients = [...new Set(invoices.map((inv) => inv.clientName))];
      setClientOptions(clients);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 2. CLIENT-SIDE FILTERING LOGIC
  useEffect(() => {
    let filtered = [...allInvoiceData]; // Start with all invoices

    // Apply Month Filter (YYYY-MM format)
    if (month) {
      const [year, mon] = month.split('-').map(Number);
      filtered = filtered.filter((inv) => {
        const d = new Date(inv.date);
        return d.getFullYear() === year && d.getMonth() + 1 === mon;
      });
    }

    // Apply From Date Filter (YYYY-MM-DD format)
    if (fromDate) {
      const f = dayjs(fromDate).startOf('day').toDate();
      filtered = filtered.filter((inv) => new Date(inv.date) >= f);
    }

    // Apply To Date Filter (YYYY-MM-DD format)
    if (toDate) {
      const t = dayjs(toDate).endOf('day').toDate();
      filtered = filtered.filter((inv) => new Date(inv.date) <= t);
    }

    // Apply Client Filter
    if (clientName) {
      filtered = filtered.filter((inv) => inv.clientName.toLowerCase() === clientName.toLowerCase());
    }

    setFilteredInvoiceData(filtered); // Update the displayed data
  }, [fromDate, toDate, month, clientName, allInvoiceData]);

  // Helper function for GST Amount calculation logic
  const calculateGstAmount = (invoice) => {
    const diff = invoice.roundUp - invoice.totalAmount;
    if (Math.abs(diff) < 0.01) {
      return 'Non GST';
    }
    return `₹${diff.toFixed(2)}`;
  };

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Invoice Report
        </Typography>
      </Breadcrumb>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" m={2}>
                  INVOICE REPORT
                </Typography>
              </Box>

              {/* ======================================== */}
              {/* FILTERS (CALENDARS + CLIENT AUTOCOMPLETE) */}
              {/* ======================================== */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} sx={{ mb: 4 }} alignItems="flex-end">
                  {/* FROM DATE */}
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="From Date"
                      value={fromDate ? dayjs(fromDate) : null}
                      onChange={(newVal) => setFromDate(newVal ? newVal.format('YYYY-MM-DD') : '')}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>

                  {/* TO DATE */}
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="To Date"
                      value={toDate ? dayjs(toDate) : null}
                      onChange={(newVal) => setToDate(newVal ? newVal.format('YYYY-MM-DD') : '')}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>

                  {/* MONTH PICKER */}
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      views={['year', 'month']}
                      label="Select Month"
                      value={month ? dayjs(month) : null}
                      onChange={(newVal) => setMonth(newVal ? newVal.format('YYYY-MM') : '')}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>

                  {/* CLIENT AUTOCOMPLETE */}
                  <Grid item xs={12} sm={2}>
                    <Autocomplete
                      options={clientOptions}
                      value={clientName}
                      onChange={(event, newValue) => setClientName(newValue || '')}
                      freeSolo
                      renderInput={(params) => <TextField {...params} label="Filter by Client" fullWidth />}
                    />
                  </Grid>

                  {/* CLEAR BUTTON */}
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setFromDate('');
                        setToDate('');
                        setMonth('');
                        setClientName('');
                      }}
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </LocalizationProvider>
              {/* --- End Filters --- */}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <Box sx={{ width: '100%' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>SN</TableCell>
                            <TableCell>Client Name</TableCell>
                            <TableCell>Invoice No.</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Principle Amount</TableCell>
                            <TableCell align="right">GST Amount</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                            <TableCell align="right">Paid Amount</TableCell>
                            <TableCell align="right">Balance Amount</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {filteredInvoiceData.length > 0 ? (
                            filteredInvoiceData.map((invoice, index) => (
                              <TableRow key={invoice._id || index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{invoice.clientName}</TableCell>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                <TableCell align="right">₹{invoice.totalAmount?.toFixed(2)}</TableCell>
                                <TableCell align="right">{calculateGstAmount(invoice)}</TableCell>
                                <TableCell align="right">₹{invoice.roundUp?.toFixed(2)}</TableCell>
                                <TableCell align="right">₹{invoice.totalPaidAmount?.toFixed(2)}</TableCell>
                                <TableCell align="right">₹{(invoice.roundUp - invoice.totalPaidAmount)?.toFixed(2)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={9} align="center">
                                No invoices found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default InvoiceReport;

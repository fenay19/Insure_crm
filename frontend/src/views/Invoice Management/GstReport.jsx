// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableCell, TableRow, Button } from '@mui/material';
// import Breadcrumb from 'component/Breadcrumb';
// import { Link } from 'react-router-dom';
// import { get } from '../../api/api';

// // ✅ MUI Calendar Imports
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

// const GstReport = () => {
//   const [allGstInvoices, setAllGstInvoices] = useState([]);
//   const [gstInvoices, setGstInvoices] = useState([]);

//   // Filters
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [month, setMonth] = useState('');

//   const fetchGstInvoices = async () => {
//     const res = await get('invoiceRegistration');

//     if (res.status === true) {
//       const allInvoices = res.invoices || [];

//       const onlyGst = allInvoices.filter((invoice) => invoice.gstType?.toLowerCase() !== 'non-gst');

//       setAllGstInvoices(onlyGst);
//       setGstInvoices(onlyGst);
//     }
//   };

//   useEffect(() => {
//     fetchGstInvoices();
//   }, []);

//   useEffect(() => {
//     let filtered = [...allGstInvoices];

//     if (month) {
//       const [year, mon] = month.split('-').map(Number);

//       filtered = filtered.filter((inv) => {
//         const d = new Date(inv.date);
//         return d.getFullYear() === year && d.getMonth() + 1 === mon;
//       });
//     }

//     if (fromDate) {
//       const f = new Date(fromDate);
//       filtered = filtered.filter((inv) => new Date(inv.date) >= f);
//     }

//     if (toDate) {
//       const t = new Date(toDate);
//       filtered = filtered.filter((inv) => new Date(inv.date) <= t);
//     }

//     setGstInvoices(filtered);
//   }, [fromDate, toDate, month, allGstInvoices]);

//   return (
//     <>
//       <Breadcrumb>
//         <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
//           Home
//         </Typography>
//         <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
//           GST Report
//         </Typography>
//       </Breadcrumb>

//       <Grid container spacing={2} sx={{ mt: 2 }}>
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 GST REPORT
//               </Typography>
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
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => {
//                         setFromDate('');
//                         setToDate('');
//                         setMonth('');
//                       }}
//                       fullWidth
//                       sx={{ height: '56px' }}
//                     >
//                       Clear Filters
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </LocalizationProvider>

//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>SN</TableCell>
//                     <TableCell>Client Name</TableCell>
//                     <TableCell>Invoice No.</TableCell>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Invoice Amount</TableCell>
//                     <TableCell>Principle Amount</TableCell>
//                     <TableCell>CGST Amount</TableCell>
//                     <TableCell>SGST Amount</TableCell>
//                     <TableCell>IGST Amount</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {gstInvoices.length > 0 ? (
//                     gstInvoices.map((invoice, index) => (
//                       <TableRow key={invoice._id}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{invoice.clientName}</TableCell>
//                         <TableCell>{invoice.invoiceNumber}</TableCell>
//                         <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>

//                         <TableCell align="right">₹{invoice.roundUp.toFixed(2)}</TableCell>
//                         <TableCell align="right">₹{invoice.totalAmount.toFixed(2)}</TableCell>

//                         <TableCell align="right">{invoice?.gstType === 'igst' ? 0 : invoice?.cgstIgstAmount}</TableCell>

//                         <TableCell align="right">{invoice?.gstType === 'igst' ? 0 : invoice?.sgstAmount}</TableCell>

//                         <TableCell align="right">{invoice?.gstType === 'igst' ? invoice?.igstAmount : 0}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={9} align="center">
//                         No GST invoices found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default GstReport;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
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

const GstReport = () => {
  const [allGstInvoices, setAllGstInvoices] = useState([]);
  const [gstInvoices, setGstInvoices] = useState([]);

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [month, setMonth] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientOptions, setClientOptions] = useState([]);

  const fetchGstInvoices = async () => {
    const res = await get('invoiceRegistration');

    if (res.status === true) {
      const allInvoices = res.invoices || [];

      // Only GST invoices
      const onlyGst = allInvoices.filter((invoice) => invoice.gstType?.toLowerCase() !== 'non-gst');

      setAllGstInvoices(onlyGst);
      setGstInvoices(onlyGst);

      // Extract unique client names
      const clients = [...new Set(onlyGst.map((inv) => inv.clientName))];
      setClientOptions(clients);
    }
  };

  useEffect(() => {
    fetchGstInvoices();
  }, []);

  useEffect(() => {
    let filtered = [...allGstInvoices];

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      filtered = filtered.filter((inv) => {
        const d = new Date(inv.date);
        return d.getFullYear() === year && d.getMonth() + 1 === mon;
      });
    }

    if (fromDate) {
      const f = new Date(fromDate);
      filtered = filtered.filter((inv) => new Date(inv.date) >= f);
    }

    if (toDate) {
      const t = new Date(toDate);
      filtered = filtered.filter((inv) => new Date(inv.date) <= t);
    }

    if (clientName) {
      filtered = filtered.filter((inv) => inv.clientName.toLowerCase() === clientName.toLowerCase());
    }

    setGstInvoices(filtered);
  }, [fromDate, toDate, month, clientName, allGstInvoices]);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          GST Report
        </Typography>
      </Breadcrumb>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                GST REPORT
              </Typography>

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

                  {/* CLIENT FILTER */}
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

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Invoice No.</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Invoice Amount</TableCell>
                    <TableCell>Principle Amount</TableCell>
                    <TableCell>CGST Amount</TableCell>
                    <TableCell>SGST Amount</TableCell>
                    <TableCell>IGST Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {gstInvoices.length > 0 ? (
                    gstInvoices.map((invoice, index) => (
                      <TableRow key={invoice._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>

                        <TableCell align="right">₹{invoice.roundUp.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{invoice.totalAmount.toFixed(2)}</TableCell>

                        <TableCell align="right">{invoice?.gstType === 'igst' ? 0 : invoice?.cgstIgstAmount}</TableCell>

                        <TableCell align="right">{invoice?.gstType === 'igst' ? 0 : invoice?.sgstAmount}</TableCell>

                        <TableCell align="right">{invoice?.gstType === 'igst' ? invoice?.igstAmount : 0}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No GST invoices found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default GstReport;

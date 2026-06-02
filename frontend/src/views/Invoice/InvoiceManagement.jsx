import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import Gst from './Gst/Gst';

import { get, put, remove } from '../../api/api';
import AdvanceReciept from './Reciept';
import PaymentDialog from './Payment';
import { toast } from 'react-toastify';
import InvoiceDetails from './InvoiceDetails';
import { Receipt } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { setIn } from 'formik';
import { data } from 'views/OPDQueue/data';

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [gstData, setGstData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewType, setViewType] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [invoicePermissionDetails, setInvoicePermissionDetails] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const fetchInvoices = async () => {
    const res = await get('invoiceRegistration');
    if (res.status === true) {
      const filteredData = res.invoices.filter((invoice) => invoice.gstType === 'gst' || invoice.gstType === 'igst');
      setGstData(filteredData || []);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin' || loginRole === 'super-admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.Invoice) {
      setInvoicePermissionDetails(systemRights.actionPermissions.Invoice);
    }
    const fetchGstData = async () => {
      const res = await get('invoiceRegistration');
      if (res.status === true) {
        const filteredData = res.invoices.filter((invoice) => invoice.gstType === 'gst' || invoice.gstType === 'igst');
        setGstData(filteredData || []);
      }
    };
    fetchGstData();
    fetchInvoices();
  }, [systemRights]);

  const handleEdit = (gstType, id) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    console.log(gstType);
    if (gstType === 'gst' || gstType === 'igst') {
      navigate(`/invoice-management/update-gst/${id}`);
    } else {
      navigate(`/invoice-management/update-non-gst/${id}`);
    }
  };

  const handleDelete = async (id) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    const refreshTable = async () => {
      const res = await get('invoiceRegistration');
      if (res.status === true) {
        const filteredData = res.invoices.filter((invoice) => invoice.gstType === 'gst' || invoice.gstType === 'igst');
        setGstData(filteredData || []);
      }
    };

    const response = await remove(`invoiceRegistration/${id}`);
    if (response.status === true) {
      refreshTable();
    }
    fetchInvoices();
  };

  const handlePaymentClick = (invoice) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    setPaymentInvoice(invoice);
    setOpenPaymentDialog(true);
  };

  const handlePaymentSubmit = async (paymentDetails) => {
    try {
      const updatedInvoice = {
        ...paymentInvoice,
        paymentDetails
      };

      await put(`invoiceRegistration/${paymentInvoice._id}`, updatedInvoice);
      toast.success('Paid Successfully!');

      const updateInvoiceList = (list) => list.map((inv) => (inv._id === paymentInvoice._id ? updatedInvoice : inv));
      setGstData((prev) => updateInvoiceList(prev));

      setOpenPaymentDialog(false);
      setPaymentInvoice(null);
      fetchInvoices();
      // fetchGstData();
    } catch (error) {
      console.error('Payment update failed:', error);
    }
  };

  const renderInvoiceTable = () => {
    const data = gstData;

    console.log(data);

    return (
      <Box sx={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SN</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Invoice No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Balance Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((invoice, index) => (
                <TableRow key={invoice._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right" sx={{ pr: 8 }}>
                    ₹{invoice.roundUp?.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 8 }}>
                    ₹{(invoice.roundUp - invoice.totalPaidAmount).toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {invoice.status === 'paid' ? (
                      <Button variant="contained" color="success" size="small" disabled>
                        Paid
                      </Button>
                    ) : invoice.paymentDetails?.paidAmount > 0 ? (
                      <Button variant="contained" color="info" size="small" onClick={() => handlePaymentClick(invoice)}>
                        Partially Paid
                      </Button>
                    ) : (
                      <Button variant="contained" color="warning" size="small" onClick={() => handlePaymentClick(invoice)}>
                        Unpaid
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Invoice" arrow>
                      <IconButton
                        // disabled={invoice.status !== 'paid'}
                        color="primary"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setViewType('invoice');
                          setOpenDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Receipt" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setViewType('receipt');
                          setOpenDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {(invoicePermissionDetails?.Edit === true || admin) && (
                      <IconButton onClick={() => handleEdit(invoice.gstType, invoice._id)} color="inherit">
                        <Edit />
                      </IconButton>
                    )}
                    {(invoicePermissionDetails?.Delete === true || admin) && (
                      <IconButton onClick={() => handleDelete(invoice._id)} color="error">
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Invoice found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    );
  };

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Invoice Management
        </Typography>
      </Breadcrumb>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" m={3}>
                    GST INVOICE
                  </Typography>
                </Box>
                {(invoicePermissionDetails?.Add === true || admin) && (
                  <Button variant="contained" color="primary" component={Link} to="/invoice-management/addInvoice">
                    Add Invoice
                  </Button>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>{renderInvoiceTable()}</Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 2
        }}
      >
        {/* <IconButton
    onClick={() => setOpenDialog(false)}
    sx={{
      color: (theme) => theme.palette.grey[500],
      p: 0.5,
    }}
  >
    <CloseIcon />
  </IconButton> */}
      </DialogTitle>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {viewType === 'invoice' ? 'Invoice Details' : 'Receipt'}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {viewType === 'invoice' && <InvoiceDetails closeModal={() => setOpenDialog(false)} invoiceData={selectedInvoice} />}
          {viewType === 'receipt' && (
            <AdvanceReciept closeModal={() => setOpenDialog(false)} invoiceData={selectedInvoice} fetchInvoices={fetchInvoices} />
          )}
        </DialogContent>
      </Dialog>

      <PaymentDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        invoice={paymentInvoice}
        onSubmit={handlePaymentSubmit}
      />
    </>
  );
};

export default InvoiceManagement;

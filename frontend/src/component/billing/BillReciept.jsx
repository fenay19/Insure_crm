import {
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Dialog,
  Paper
} from '@mui/material';
import AdvanceReciept from './AdvanceReciept';

import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { convertToWords, currentDate } from 'utils/currentDate';
import { useDispatch, useSelector } from 'react-redux';
import { Discount } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { resetPrintDataForAdvanceOPDReceipt, setCloseBillingModal, setInitialStates } from 'reduxSlices/opdBillingStates';
import { get, post, put } from 'api/api';

const BillReciept = ({ close = () => {} } = {}) => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const empCode = window.localStorage.getItem('empCode');
  const [existBill, setExistBill] = useState({
    data: [],
    exist: false
  });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const contentRef = useRef(null);

  const billDate = currentDate();
  const dispatch = useDispatch();

  const reactToPrint = useReactToPrint({ contentRef });

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const AllGeneratedReceiptAgainstPatient = useSelector((state) => state.opdBillingStates.OPDReceiptData);

  const groupedServices = {};
  AllGeneratedReceiptAgainstPatient.forEach((entry) => {
    entry.services.forEach((service) => {
      const serviceName = service.detailServiceName;
      if (!groupedServices[serviceName]) {
        groupedServices[serviceName] = {
          detailServiceName: serviceName,
          serviceCode: service.serviceCode,
          quantity: 0,
          rate: parseInt(service.rate),
          servicesTotalAmount: 0
        };
      }
      groupedServices[serviceName].quantity += 1;
    });
  });
  // Calculate totalAmount for each service
  for (const key in groupedServices) {
    groupedServices[key].servicesTotalAmount = groupedServices[key].rate * groupedServices[key].quantity;
  }
  // Convert the grouped object into an array
  const servicesData = Object.values(groupedServices);

  const servicesAmount = servicesData.reduce((sum, service) => sum + Number(service.servicesTotalAmount || 0), 0);
  const totalAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.totalAmount || 0), 0);
  const paidAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.paidAmount || 0), 0);
  const pendingAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.pendingAmount || 0), 0);
  const discountAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => (sum += Number(receipt.discountCharges || 0)), 0);
  const handlePrint = () => {
    reactToPrint();
    setTimeout(() => {
      dispatch(setCloseBillingModal());
      dispatch(resetPrintDataForAdvanceOPDReceipt());
    }, 1000);

    if (pathname !== '/confirm-patientForm') {
      dispatch(setCloseBillingModal());
      navigate('/confirm-patientForm');
    }
    dispatch(setInitialStates());
  };

  const fetchBill = async () => {
    try {
      if (!billingData?.patientId) {
        console.warn('Patient ID is missing');
        return;
      }

      const res = await get(`opd-billing/${billingData.patientId}`);

      if (res?.success) {
        setExistBill({
          exist: true,
          data: res.data
        });
      } else {
        console.error('Failed to fetch billing data:', res?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    }
  };

  async function handleSave() {
    const billData = {
      patientId: billingData?.patientId,
      opdId: billingData?._id,
      receipts: AllGeneratedReceiptAgainstPatient?.map((d) => d._id),
      tokenNo: billingData?.tokenNo,
      services: servicesData,
      discountCharges: discountAmount,
      paidAmount: paidAmount,
      pendingAmount: pendingAmount,
      totalAmount: totalAmount,
      servicesAmount: servicesAmount,
      billNo: AllGeneratedReceiptAgainstPatient[0]?.billNo || 'N/A',
      billDate: billDate,
      personWhoCreatedBill: AllGeneratedReceiptAgainstPatient[0]?.personWhoCreatedThisBillName,
      employeeCode: empCode
    };
    try {
      if (existBill?.exist) {
        const res = await put(`opd-billing/${existBill?.data?._id}`, billData);
        if (res?.success) {
          toast.success('Saved Successfully');
          dispatch(setCloseBillingModal());
          navigate('/confirm-patientForm');
          fetchBill();
          dispatch(resetPrintDataForAdvanceOPDReceipt());

          dispatch(setInitialStates());
        } else {
          toast.error('Cannot Save');
        }
      } else {
        const res = await post(`opd-billing`, billData);
        if (res?.success) {
          toast.success('Saved Successfully');
          dispatch(setCloseBillingModal());
          navigate('/confirm-patientForm');
          fetchBill();
        } else {
          toast.error('Cannot Save');
        }
      }
    } catch (err) {
      toast.error('Some thing went wrong');
    }
  }

  useEffect(() => {
    fetchBill();
  }, []);
  return (
    <>
      <Box>
        <div ref={contentRef} style={{ padding: '4rem', borderRadius: '0px' }}>
          {/* Hospital Information */}
          <Grid container spacing={1} sx={{ marginBottom: 1, alignItems: 'center' }}>
            {/* Left Side: Business Name */}
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#126078', fontSize: '1rem' }}>
                {hospitalData?.hospitalName}
              </Typography>
            </Grid>

            {/* Right Side: Contact Details */}
            <Grid item xs={8} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Address :</strong> {hospitalData?.hospitalAddress}, {hospitalData?.City}, {hospitalData?.State} -{' '}
                {hospitalData?.Pincode}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Contact:</strong> {hospitalData?.mobileNumber} | <strong>Email:</strong> {hospitalData?.email}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Website:</strong> {hospitalData?.website}
              </Typography>
            </Grid>
          </Grid>

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

          {/* OPD Bill Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
              OPD Bill
            </Typography>
            <Box sx={{ backgroundColor: '#126078', paddingX: 1, paddingY: 0.5, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                <strong>Bill No:</strong> {AllGeneratedReceiptAgainstPatient[0]?.billNo || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

          {/* Patient Information */}
          <Grid container spacing={1} sx={{ marginBottom: 1 }}>
            {/* Column 1 - Patient Info */}
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ display: 'flex', gap: '4px', color: '#555', fontSize: '0.75rem' }}>
                <strong>Patient Name:</strong>
                {billingData?.patientFirstName
                  ? `${billingData?.patientFirstName} ${billingData?.patientMiddleName || ''} ${billingData?.patientLastName || ''}`
                  : 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Age:</strong> {billingData?.age || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Gender:</strong> {billingData?.gender || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Mobile Number:</strong> {billingData?.mobile_no || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Patient Payee:</strong> {billingData?.patientPayee || 'N/A'}
              </Typography>
            </Grid>

            {/* Column 2 - Address & OPD Info */}
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Address:</strong> {billingData?.address || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>OPD No:</strong> {billingData?.opd_regNo || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Registration Date:</strong> 12/12/2024
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>UHID:</strong> {billingData?.uhid || 'N/A'}
              </Typography>
            </Grid>

            {/* Column 3 - Department & Doctor */}
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Department:</strong> {billingData?.departmentName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Doctor:</strong> {billingData?.consultantName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Token No:</strong> {billingData?.tokenNo || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Bill Date:</strong> {billDate || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          {/* Service Charges Table */}
          <TableContainer component={Paper} sx={{ marginBottom: 1, borderRadius: 0 }}>
            <Typography variant="h6" sx={{ padding: 1, fontWeight: 'bold', color: '#126078', fontSize: '0.875rem' }}>
              Service Charges
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#126078', height: '30px' }}>
                  {['SN', 'Particular', '', 'Quantity', 'Total Amount'].map((head, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        padding: '4px'
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {servicesData?.map((item, index) => (
                  <TableRow key={index} sx={{ height: '20px' }}>
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{index + 1}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.detailServiceName}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.rate}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.quantity}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.servicesTotalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Amount Summary */}
          <Grid container spacing={1} sx={{ marginBottom: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Services Amount:</strong> ₹{servicesAmount?.toFixed(2) || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Total Amount:</strong> ₹{totalAmount?.toFixed(2) || 0}
              </Typography>
              <hr style={{ borderColor: '#ddd', marginTop: '0.25rem', marginBottom: '0.25rem' }} />
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Paid Amount:</strong> ₹{paidAmount?.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Pending Amount:</strong> ₹{pendingAmount?.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Discount:</strong> ₹{discountAmount?.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>

          {/* Receipts Table */}
          <TableContainer component={Paper} sx={{ marginBottom: 1, borderRadius: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#126078', fontSize: '0.875rem' }}>
              Receipts
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#126078', height: '20px' }}>
                  {['Sr No', 'Receipt No', 'Amount', 'Payment Mode', 'Transaction ID'].map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        padding: '4px'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {AllGeneratedReceiptAgainstPatient?.length > 0 ? (
                  AllGeneratedReceiptAgainstPatient?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{row?.receiptNo || 'N/A'}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{row?.paidAmount || 0}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{row?.paymentMode || 'N/A'}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{row?.transactionId || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ fontSize: '0.75rem' }}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total Amount in Words */}
          <Box sx={{ backgroundColor: '#f1f8e9', borderRadius: '4px', padding: '0.75rem', marginBottom: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976D2', fontSize: '0.875rem' }}>
              Total: ₹{paidAmount}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976D2', fontSize: '0.75rem', marginTop: 0.5 }}>
              <em>Amount in Words: {convertToWords(paidAmount)?.toUpperCase()}</em>
            </Typography>
          </Box>

          <Box sx={{ marginTop: '2rem', paddingTop: '1.5rem', width: '48%' }}>
            <Typography variant="body1">
              <strong>Authorized Signatury:</strong>
            </Typography>
            <Typography variant="body1">
              <strong>Prepared By:</strong> {AllGeneratedReceiptAgainstPatient[0]?.personWhoCreatedThisBillName}
            </Typography>
          </Box>
          <Box sx={{ width: '48%' }}>
            <Typography variant="body1">
              <strong>Employee ID:</strong> {empCode || 'N/A'}
            </Typography>
          </Box>

          {/* Action Buttons */}
        </div>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', padding: 4 }}>
        <Button variant="contained" color="primary" sx={{ paddingX: 2, fontSize: '0.75rem' }} onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" color="primary" sx={{ paddingX: 2, fontSize: '0.75rem' }} onClick={handlePrint}>
          Save & Print
        </Button>
        <Button variant="contained" color="primary" sx={{ paddingX: 2, fontSize: '0.75rem' }} onClick={close}>
          Cancel
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <AdvanceReciept billingData={billingData} />
      </Dialog>
    </>
  );
};

export default BillReciept;

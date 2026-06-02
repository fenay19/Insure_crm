import {
  Button,
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { convertToWords, currentDate, extractPrefixAndNumber } from 'utils/currentDate';
import { useDispatch, useSelector } from 'react-redux';
import { Discount } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { resetPrintDataForAdvanceOPDReceipt, setCloseBillingModal, setInitialStates } from 'reduxSlices/opdBillingStates';
import { get, post, put } from 'api/api';

const CreditNote = () => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const { serviceDataSelectedToDisplay, totalAmount, totalDiscount } = useSelector((state) => state.opdBillingStates);
  const empCode = window.localStorage.getItem('empCode');
  const loginData = JSON.parse(window.localStorage.getItem('loginData'));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [existBill, setExistBill] = useState({
    data: [],
    exist: false
  });

  const billNo = extractPrefixAndNumber(billingData?.opd_regNo);

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
  console.log(servicesData);
  console.log(serviceDataSelectedToDisplay);
  console.log(AllGeneratedReceiptAgainstPatient);

  const servicesAmount = servicesData.reduce((sum, service) => sum + Number(service.servicesTotalAmount || 0), 0);
  const totalAmounts = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.s || 0), 0);
  const paidAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.paidAmount || 0), 0);
  const pendingAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.pendingAmount || 0), 0);
  const discountAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => (sum += Number(receipt.discountCharges || 0)), 0);

  const fetchBill = async () => {
    try {
      if (!billingData?.patientId) {
        console.warn('Patient ID is missing');
        return;
      }

      const res = await get(`opd-billing/credit/${billingData.patientId}`);

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

  useEffect(() => {
    fetchBill();
  }, []);

  const serviceDetail = useMemo(
    () =>
      serviceDataSelectedToDisplay.map((service) => ({
        _id: service?._id,
        rate: service?.rate,
        detailServiceName:
          service?.serviceIdOfRelatedMaster?.detailServiceName ||
          service?.serviceIdOfRelatedMaster?.profileName ||
          service?.serviceIdOfRelatedMaster?.services?.[0]?.detailServiceName ||
          service?.serviceIdOfRelatedMaster?.testName ||
          `OPD Consultation (${service?.serviceIdOfRelatedMaster?.type} - ${service?.serviceIdOfRelatedMaster?.consultantName})`,
        serviceCode: service?.code,
        servicesTotalAmount: service?.rate,
        quantity: 1
      })),
    [serviceDataSelectedToDisplay]
  );

  const mergedServices = [...(existBill?.data?.services || []), ...(serviceDetail || [])];

  // Dynamically calculate totals
  const servicesAmountCB = mergedServices.reduce((acc, cur) => acc + (cur?.servicesTotalAmount || 0), 0);
  const totalAmountCB = servicesAmountCB; // adjust if you have additional charges
  const paidAmountCB = 0; // update if dynamic
  const pendingAmountCB = totalAmountCB - paidAmountCB;
  const discountAmountCB = 0; // update if dynamic

  async function handleSave() {
    let billData = {};

    if (AllGeneratedReceiptAgainstPatient?.length > 0) {
      billData = {
        patientId: billingData?.patientId,
        opdId: billingData?._id,
        tokenNo: billingData?.tokenNo,
        services: serviceDetail,
        discountCharges: discountAmount,
        paidAmount: 0,
        pendingAmount: totalAmounts,
        totalAmount: totalAmount,
        servicesAmount: servicesAmount,
        billNo: AllGeneratedReceiptAgainstPatient[0]?.billNo || billNo,
        billDate: billDate,
        personWhoCreatedBill: AllGeneratedReceiptAgainstPatient[0]?.personWhoCreatedThisBillName,
        employeeCode: empCode
      };
    } else {
      billData = {
        patientId: billingData?.patientId,
        opdId: billingData?._id,
        tokenNo: billingData?.tokenNo,
        services: mergedServices,
        discountCharges: discountAmountCB,
        paidAmount: 0,
        pendingAmount: totalAmountCB,
        totalAmount: totalAmountCB,
        servicesAmount: servicesAmountCB,
        billNo: billNo,
        billDate: billDate,
        personWhoCreatedBill: loginData?.name,
        employeeCode: empCode
      };
    }

    try {
      if (existBill?.exist) {
        const res = await put(`opd-billing/credit/${existBill?.data?._id}`, billData);
        if (res?.success) {
          toast.success('Saved Successfully');
          dispatch(setCloseBillingModal());
          navigate('/confirm-patientForm');
          fetchBill();
          dispatch(resetPrintDataForAdvanceOPDReceipt());
        } else {
          toast.error('Cannot Save');
        }
      } else {
        const res = await post(`opd-billing/credit`, billData);
        if (res?.success) {
          toast.success('Saved Successfully');
          dispatch(setCloseBillingModal());
          navigate('/confirm-patientForm');
          fetchBill();
          dispatch(resetPrintDataForAdvanceOPDReceipt());
        } else {
          toast.error('Cannot Save');
        }
      }
    } catch (err) {
      toast.error('Some thing went wrong');
    }
  }
  const handlePrint = () => {
    reactToPrint();
    if (pathname !== '/confirm-patientForm') {
      navigate('/confirm-patientForm');
    }
    dispatch(setInitialStates());
    dispatch(setCloseBillingModal());
    dispatch(resetPrintDataForAdvanceOPDReceipt());
    handleSave();
  };
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

          {/* OPD  Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
              OPD Credit Bill
            </Typography>
            <Box sx={{ backgroundColor: '#126078', paddingX: 1, paddingY: 0.5, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                <strong>Bill No:</strong> {AllGeneratedReceiptAgainstPatient[0]?.billNo || billNo}
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
                {(servicesData.length ? servicesData : [...(existBill?.data?.services || []), ...(serviceDetail || [])])?.map(
                  (item, index) => (
                    <TableRow key={index} sx={{ height: '20px' }}>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.detailServiceName}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.rate}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.quantity}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>{item?.servicesTotalAmount}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Amount Summary */}

          {AllGeneratedReceiptAgainstPatient?.length > 0 ? (
            <Grid container spacing={1} sx={{ marginBottom: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Services Amount:</strong> ₹{servicesAmount?.toFixed(2) || totalAmount || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Total Amount:</strong> ₹{totalAmount?.toFixed(2) || totalAmount || 0}
                </Typography>
                <hr style={{ borderColor: '#ddd', marginTop: '0.25rem', marginBottom: '0.25rem' }} />
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Paid Amount:</strong>₹{0.0}
                  {/* <strong>Paid Amount:</strong>₹{pendingAmount?.toFixed(2)} */}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Pending Amount:</strong> ₹{totalAmount?.toFixed(2) || totalAmount || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Discount:</strong> ₹{discountAmount?.toFixed(2) || totalDiscount || 0}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1} sx={{ marginBottom: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Services Amount:</strong> ₹{servicesAmountCB.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Total Amount:</strong> ₹{totalAmountCB.toFixed(2)}
                </Typography>
                <hr
                  style={{
                    borderColor: '#ddd',
                    marginTop: '0.25rem',
                    marginBottom: '0.25rem'
                  }}
                />
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Paid Amount:</strong> ₹{paidAmountCB.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Pending Amount:</strong> ₹{pendingAmountCB.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                  <strong>Discount:</strong> ₹{discountAmountCB.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          )}

          <Box sx={{ marginTop: '2rem', paddingTop: '1.5rem', width: '48%' }}>
            <Typography variant="body1">
              <strong>Authorized Signatury:</strong>
            </Typography>
            <Typography variant="body1">
              <strong>Prepared By:</strong> {AllGeneratedReceiptAgainstPatient[0]?.personWhoCreatedThisBillName || loginData?.name}
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
      </Box>
    </>
  );
};

export default CreditNote;

import React, { useRef } from 'react';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { convertToWords } from 'utils/currentDate';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { resetPrintDataForAdvanceOPDReceipt, setCloseBillingModal, setInitialStates } from 'reduxSlices/opdBillingStates';

const AdvanceReciept = () => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const { PrintDataForAdvanceOPDReceipt } = useSelector((state) => state.opdBillingStates);
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const dispatch = useDispatch();

  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef });
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const handlePrint = () => {
    reactToPrint();
    setTimeout(() => {
      dispatch(setCloseBillingModal());
    }, 1000);
    if (pathname !== '/confirm-patientForm') {
      navigate('/confirm-patientForm');
    }
    dispatch(setInitialStates());
  };

  function handleSave() {
    toast.success('Saved Successfully');
    dispatch(setCloseBillingModal());
    dispatch(resetPrintDataForAdvanceOPDReceipt());
    dispatch(setInitialStates());

    navigate('/confirm-patientForm');
  }
  return (
    <>
      <Box>
        <div ref={contentRef} style={{ padding: '4rem', borderRadius: '0px' }}>
          {/* header information hospital name and address */}
          <Grid container spacing={1} sx={{ marginBottom: 1, alignItems: 'center' }}>
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
              RECEIPT
            </Typography>
            <Box sx={{ backgroundColor: '#126078', paddingX: 1, paddingY: 0.5, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                <strong>Receipt No :</strong> {PrintDataForAdvanceOPDReceipt?.receiptNo || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

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
                <strong>Age/Gender : </strong> {billingData?.age || 'N/A'} / {billingData.gender || 'N/A'}
              </Typography>

              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Receipt Date :</strong> {PrintDataForAdvanceOPDReceipt.billDate || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Token No:</strong> {billingData?.tokenNo || 'N/A'}
              </Typography>
            </Grid>

            {/* Column 2 - Address & OPD Info */}
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>UHID:</strong> {billingData?.uhid || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>OPD No:</strong> {billingData?.opd_regNo || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Note:</strong> {billingData?.note || 'N/A'}
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
                <strong>Bill NO :</strong> {PrintDataForAdvanceOPDReceipt.billNo || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

          <TableContainer sx={{ marginBottom: '1rem' }}>
            <Table size="small">
              {' '}
              {/* Reducing table size to shrink spacing */}
              <TableHead>
                <TableRow sx={{ backgroundColor: '#126078', height: '30px' }}>
                  {' '}
                  {/* Reduced row height */}
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Service Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PrintDataForAdvanceOPDReceipt?.services?.length > 0 ? (
                  <>
                    {/* Single Row for Service Names */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: '500', padding: '4px' }}>
                        {PrintDataForAdvanceOPDReceipt.services.map((item) => item.detailServiceName).join(', ')}
                      </TableCell>
                    </TableRow>

                    {/* Total Amount Row */}
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '8px' }}>
                        <Typography fontWeight={'bold'}>Payment Received: Rs {PrintDataForAdvanceOPDReceipt?.paidAmount}</Typography>
                        <Typography fontWeight={'bold'}>In Words: {convertToWords(PrintDataForAdvanceOPDReceipt?.totalAmount)}</Typography>
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ padding: '1rem' }}>
                      <Typography variant="body1" color="textSecondary">
                        No services selected to display.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ marginTop: '2rem', paddingTop: '1.5rem', width: '48%' }}>
                <Typography variant="body1">
                  <strong>Authorized Signatury:</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Prepared By:</strong> {PrintDataForAdvanceOPDReceipt?.personWhoCreatedThisBillName}
                </Typography>
                <Typography variant="body1">
                  <strong>Employee ID:</strong>
                </Typography>
              </Box>

              <Box sx={{ marginTop: '0.5rem', width: '35%' }}>
                {' '}
                {/* Reduced width */}
                <Table size="small" sx={{ border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                  <TableHead>
                    <TableRow sx={{ height: '28px' }}>
                      {' '}
                      {/* Reduced header row height */}
                      <TableCell
                        sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.9rem' }}
                      >
                        Payment Mode
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.9rem' }}
                      >
                        Transaction ID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ height: '25px' }}>
                      {' '}
                      {/* Reduced row height */}
                      <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                        {PrintDataForAdvanceOPDReceipt?.paymentMode || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                        {PrintDataForAdvanceOPDReceipt?.transactionId || 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Box>

      <Box sx={{ marginTop: '2rem', padding: '30px' }}>
        <Button
          variant="contained"
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            backgroundColor: '#126078',
            color: 'white',
            mr: 2
          }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            backgroundColor: '#126078',
            color: 'white'
          }}
          onClick={handlePrint}
        >
          Save & Print
        </Button>
      </Box>
    </>
  );
};

export default AdvanceReciept;

import { Box, Button, Grid, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { get } from 'api/api';
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { convertToWords } from 'utils/currentDate';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

function ViewAllReceiptsOfPatient({ opdPatientInformation, close = () => {} } = {}) {
  const [allPatientReceipts, setAllPatientReceipts] = useState([]);
  const fetchAllGeneratedReceiptAgainstOpdPatient = async () => {
    const response = await get(`opd-receipt/getOpdReceipts/${opdPatientInformation._id}`);
    response.success ? setAllPatientReceipts(response.receipts) : setAllPatientReceipts([]);
  };

  useEffect(() => {
    if (opdPatientInformation._id) {
      fetchAllGeneratedReceiptAgainstOpdPatient();
    }
  }, [opdPatientInformation._id]);

  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef });

  const { billingData } = useSelector((state) => state.opdBilling);
  const { hospitalData } = useSelector((state) => state.hospitalData);

  // Group receipts into chunks of 2 for printing
  const chunkedReceipts = [];
  for (let i = 0; i < allPatientReceipts.length; i += 3) {
    chunkedReceipts.push(allPatientReceipts.slice(i, i + 3));
  }

  return (
    <>
      {allPatientReceipts.length > 0 ? (
        <>
          <Box ref={contentRef}>
            {chunkedReceipts.map((chunk, chunkIndex) => (
              <Box
                key={chunkIndex}
                sx={{
                  '@media print': {
                    pageBreakAfter: chunkIndex < chunkedReceipts.length - 1 ? 'always' : 'auto'
                  }
                }}
              >
                {chunk.map((receipt, index) => (
                  <div
                    key={receipt._id}
                    style={{
                      padding: '2rem 3.5rem',
                      borderRadius: '0px',
                      marginBottom: '1rem',
                      '@media print': {
                        marginBottom: '0rem'
                      }
                    }}
                  >
                    {/* Receipt content */}
                    <Grid container spacing={1} sx={{ marginBottom: 1, alignItems: 'center' }}>
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#126078', fontSize: '1rem' }}>
                          {hospitalData?.hospitalName}
                        </Typography>
                      </Grid>

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
                          <strong>Receipt No :</strong> {receipt.receiptNo || 'N/A'}
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
                            ? `${billingData?.patientFirstName} ${billingData?.patientMiddleName || ''} ${
                                billingData?.patientLastName || ''
                              }`
                            : 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                          <strong>Age/Gender : </strong> {billingData?.age || 'N/A'} / {billingData.gender || 'N/A'}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                          <strong>Receipt Date :</strong> {receipt.billDate || 'N/A'}
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
                          <strong>Bill NO :</strong> {receipt.billNo || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>

                    <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

                    <TableContainer sx={{ marginBottom: '1rem' }}>
                      <Table width="100%">
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
                          {receipt?.services?.length > 0 ? (
                            <>
                              {/* Single Row for Service Names */}
                              <TableRow>
                                <TableCell sx={{ fontWeight: '500', padding: '4px' }}>
                                  {receipt.services.map((item) => item.detailServiceName).join(', ')}
                                </TableCell>
                              </TableRow>

                              {/* Total Amount Row */}
                              <TableRow>
                                <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '8px' }}>
                                  <Typography fontWeight={'bold'}>Payment Received: Rs {receipt?.paidAmount}</Typography>
                                  <Typography fontWeight={'bold'}>In Words: {convertToWords(receipt?.totalAmount)}</Typography>
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

                    <Grid container spacing={3} sx={{ marginBottom: '1rem' }}>
                      <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ marginTop: '2rem', paddingTop: '1.5rem', width: '48%' }}>
                          <Typography variant="body1">
                            <strong>Authorized Signatury:</strong>
                          </Typography>
                          <Typography variant="body1">
                            <strong>Prepared By:</strong> {receipt?.personWhoCreatedThisBillName}
                          </Typography>
                        </Box>

                        <Box sx={{ marginTop: '0.5rem' }}>
                          {' '}
                          {/* Reduced width */}
                          <Table size="small" sx={{ border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                            <TableHead>
                              <TableRow sx={{ height: '28px' }}>
                                {' '}
                                {/* Reduced header row height */}
                                <TableCell
                                  sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                    padding: '4px',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  Payment Mode
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                    padding: '4px',
                                    fontSize: '0.9rem'
                                  }}
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
                                  {receipt?.paymentMode || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                                  {receipt?.transactionId || 'N/A'}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Grid>
                    </Grid>

                    <hr style={{ borderColor: '#ddd', marginBottom: '1rem' }} />
                  </div>
                ))}
              </Box>
            ))}
          </Box>

          <Box sx={{ marginTop: '2rem', padding: '30px',display:"flex",gap:1 }}>
            <Button variant="contained" onClick={() => reactToPrint()}>
              Print
            </Button>
            <Button variant="contained" onClick={close} >
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No receipts found.
          </Typography>
        </Paper>
      )}
    </>
  );
}

export default ViewAllReceiptsOfPatient;

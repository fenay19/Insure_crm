import React, { useEffect } from 'react';
import { Card, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setPrintDataForAdvanceOPDReceipt } from 'reduxSlices/opdBillingStates';
import { setAllOPDReceiptDataFromApi } from 'reduxSlices/opdBillingStates';
import { get } from 'api/api';
const PatientAccountDetails = () => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const { finalAmount, pendingAmount, OPDReceiptData, totalAmount } = useSelector((state) => state.opdBillingStates);
  const dispatch = useDispatch();

  const fetchAllGeneratedReceiptAgainstOpdPatient = async () => {
    const data = await get(`opd-receipt/getOpdReceipts/${billingData._id}`);
    dispatch(setAllOPDReceiptDataFromApi(data.receipts.length > 0 ? data.receipts : []));
  };

  console.log('OPD RECEIPT', OPDReceiptData);

  //calculate total amount paid the by patient till now
  const totalAmountPaidBythePatient = OPDReceiptData?.reduce((sum, item) => (sum += item.paidAmount), 0);
  const totalPendingAmountOfPatient = OPDReceiptData?.reduce((sum, item) => (sum += item.pendingAmount), 0);
  const appointmentDate = billingData?.createdAt ? new Date(billingData.createdAt).toLocaleDateString() : 'N/A';

  useEffect(() => {
    if (billingData._id) {
      fetchAllGeneratedReceiptAgainstOpdPatient();
    }
  }, [billingData._id]);

  return (
    <>
      <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2, minHeight: 'fit-content' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Patient Account Details
        </Typography>
        <hr />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Consultant Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>App. Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Pending</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{billingData?.consultantName || 'N/A'}</TableCell>
                <TableCell sx={{ width: '140px' }}>{appointmentDate || 'N/A'}</TableCell>
                <TableCell>{totalAmountPaidBythePatient || 0}</TableCell>
                <TableCell>{totalPendingAmountOfPatient || 0}</TableCell>
                <TableCell sx={{ backgroundColor: billingData?.billingStatus === 'Paid' ? 'green' : 'red', color: 'white' }}>
                  {billingData?.billingStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {(OPDReceiptData || []).length > 0 && (
  <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2, minHeight: 'fit-content' }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      OPD Receipts
    </Typography>
    <hr />
    <TableContainer
      sx={{
        maxHeight: '400px',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '8px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '8px'
        },
        scrollbarWidth: 'thin', // Firefox
        scrollbarColor: '#c1c1c1 #f1f1f1' // Firefox
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>SR.NO</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Receipt No.</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Final Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Paid Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {OPDReceiptData.map((item, index) => (
            <TableRow key={item?._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item?.receiptNo}</TableCell>
              <TableCell>{item?.totalAmount}</TableCell>
              <TableCell>{item?.discountCharges}</TableCell>
              <TableCell>{item?.finalAmount || item?.paidAmount}</TableCell>
              <TableCell>{item?.paidAmount}</TableCell>
              <TableCell>{item?.billDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
)}


    </>
  );
};

export default PatientAccountDetails;

import React, { useRef } from 'react'
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
} from '@mui/material'
import { useReactToPrint } from 'react-to-print'
import { useSelector } from 'react-redux'
import { convertToWords } from 'utils/currentDate'

const AdvanceReciept = () => {
  const { billingData } = useSelector(state => state.opdBilling)
  const { PrintDataForAdvanceOPDReceipt } = useSelector(state => state.opdBillingStates)
  const { hospitalData } = useSelector(state => state.hospitalData)

  const contentRef = useRef(null)
  const reactToPrint = useReactToPrint({ contentRef })

  console.log("printReceipt Data", PrintDataForAdvanceOPDReceipt)

  return (
    <>
     

      <div ref={contentRef} style={{ padding: '60px' }}>
        <Grid container spacing={2} alignItems='center' sx={{ marginBottom: '1.5rem' }}>
          {/* Left Side - Address */}
          <Grid item xs={8}>
            <Typography variant='body1'>
              <strong>Address:</strong> {hospitalData.hospitalAddress} - {hospitalData.Pincode}
            </Typography>
            <Typography variant='body1'>
              <strong>Mobile No. : </strong>
              {hospitalData.mobileNumber}
            </Typography>
            <Typography variant='body1'>
              <strong>Landline No. : </strong>
              {hospitalData.landlineNumber}
            </Typography>
            <Typography variant='body1'>
              <strong>Emai:</strong> {hospitalData.email}
            </Typography>
          </Grid>

          {/* Right Side - Logo */}
          <Grid item xs={4} textAlign='right'>
            <Typography variant='h4' fontWeight='bold'>
              {hospitalData.hospitalName}
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderRadius: '0px',
            padding: '0.5rem 0.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
            position: 'relative', // Ensures proper alignment
            width: '100%'
          }}
        >
          {/* Left Side: This will stay centered */}
          <Box>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 'bold',
                fontSize: '25px !important', // Ensures size remains constant
                color: '#333',
                textDecoration: 'underline'
              }}
            >
              RECEIPT
            </Typography>
          </Box>

          {/* Second Box: Moves to the Left */}
          <Box sx={{ position: 'absolute', right: 0 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize : '15px !important', color: 'red' }}>
              Receipt No. - {PrintDataForAdvanceOPDReceipt?.receiptNo}
            </Typography>
          </Box>
        </Box>

        <div
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            padding: '20px',
            boxSizing: 'border-box',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            {/* Left Section */}
            <div style={{ textAlign: 'left' }}>
              <Typography variant='body1' style={{ marginBottom: '10px' }}>
                <strong>Patient Name:</strong>{' '}
                {billingData?.patientFirstName
                  ? `${billingData.patientFirstName} ${billingData.patientMiddleName || ''} ${billingData.patientLastName || ''}`
                  : 'N/A'}
              </Typography>
              <Typography variant='body1' style={{ marginBottom: '10px' }}>
                <strong>Age/Gender:</strong> {billingData?.age || 'N/A'} / {billingData?.gender || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Receipt Date:</strong> {PrintDataForAdvanceOPDReceipt.billDate || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Token No:</strong> {billingData?.tokenNo || 'N/A'}
              </Typography>
            </div>

            {/* Center Section */}
            <div style={{ textAlign: 'center' }}>
              <Typography variant='body1' style={{ marginBottom: '10px' }}>
                <strong>UHID No:</strong> {billingData?.uhid || 'N/A'}
              </Typography>
              <Typography variant='body1' style={{ marginBottom: '10px' }}>
                <strong>OPD No:</strong> {billingData?.opd_regNo || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Note:</strong> {billingData?.note || 'N/A'}
              </Typography>
            </div>

            {/* Right Section */}
            <div style={{ textAlign: 'right' }}>
              <Typography variant='body1' style={{ marginBottom: '10px' }}>
                <strong>Department:</strong> {billingData?.departmentName || 'N/A'}
              </Typography>
              <Typography variant='body1' style={{ marginBottom: '10px' }}>
                <strong>Dr Name:</strong> {billingData?.consultantName || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Bill No:</strong> {PrintDataForAdvanceOPDReceipt.billNo || 'N/A'}
              </Typography>
            </div>
          </div>
        </div>

        <TableContainer sx={{ marginBottom: '1rem' }}>
          <Table size='small'>
            {' '}
            {/* Reducing table size to shrink spacing */}
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2', height: '30px' }}>
                {' '}
                {/* Reduced row height */}
               
                <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Service Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PrintDataForAdvanceOPDReceipt?.services?.length > 0 ? (
             <>
             {/* Single Row for Service Names */}
             <TableRow>
               <TableCell sx={{ fontWeight: '500', padding: '4px' }}>
                 {PrintDataForAdvanceOPDReceipt.services.map(item => item.detailServiceName).join(', ')}
                 {PrintDataForAdvanceOPDReceipt.services.map(item => item.detailServiceName).join(', ')}
               </TableCell>
             </TableRow>
           
             {/* Total Amount Row */}
             <TableRow>
               <TableCell colSpan={2} align='right' sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '8px' }}>
                 <Typography fontWeight={'bold'}>Payment Received: Rs {PrintDataForAdvanceOPDReceipt?.paidAmount}</Typography>
                 <Typography fontWeight={'bold'}>In Words: {convertToWords(PrintDataForAdvanceOPDReceipt?.totalAmount)}</Typography>
               </TableCell>
             </TableRow>
           </>
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align='center' sx={{ padding: '1rem' }}>
                    <Typography variant='body1' color='textSecondary'>
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
              <Typography variant='body1'>
                <strong>Authorized Signature:</strong>
              </Typography>
              <Typography variant='body1'>
                <strong>Prepared By:</strong> {PrintDataForAdvanceOPDReceipt?.personWhoCreatedThisBillName}
              </Typography>
            </Box>

            <Box sx={{ marginTop: '0.5rem', width: '35%' }}>
              {' '}
              {/* Reduced width */}
              <Table size='small' sx={{ border: '1px solid #ddd', borderCollapse: 'collapse' }}>
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
      <Box sx={{ marginTop: '2rem', padding: '30px' }}>
        <Button
          variant='contained'
          color='success'
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': { backgroundColor: '#2e7d32' },
            color: 'white'
          }}
          onClick={() => reactToPrint()}
        >
          Print
        </Button>
      </Box>
    </>
  )
}

export default AdvanceReciept

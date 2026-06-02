import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Box,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentDialog = ({ open, onClose, invoice, onSubmit }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [bankName, setBankName] = useState('');

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [submittedData, setSubmittedData] = useState(null); // <-- new

  useEffect(() => {
    if (mode === 'Wave off') {
      setAmount(invoice?.totalAmount || '');
    } else {
      setAmount('');
    }
    setTransactionId('');
    setBankName('');
  }, [mode, invoice]);

  const handleSave = () => {
    const paymentDetails = {
      paymentMode: mode,
      paidAmount: amount,
      transactionId: mode === 'Cash' || mode === 'Wave off' ? '' : transactionId,
      paymentBankName: mode === 'Cheque' ? bankName : '',
      paymentDate: date,
      invoiceId: invoice?._id
    };

    setSubmittedData(paymentDetails); // <-- store locally
    onSubmit(paymentDetails);
    // Optionally, you could keep the dialog open to show submitted details
    navigate('/invoice-management');
  };

  const showTransactionFields = ['Cheque', 'NEFT/RTGS', 'Online'].includes(mode);
  const isWaveOff = mode === 'Wave off';
  const isCash = mode === 'Cash';
  const isCheque = mode === 'Cheque';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Payment Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mb={2} mt={2}>
          <Grid item xs={12} sm={6}>
            {/* <Typography fontWeight="bold">Total without GST :- ₹{invoice?.totalAmount || 0}</Typography> */}
            <Typography fontWeight="bold">Grand Total :- ₹{invoice?.roundUp || 0}</Typography>
            <Typography fontWeight="bold" mt={1}>
              Invoice Balance Amount :- ₹{invoice?.roundUp - invoice?.totalPaidAmount || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select label="Mode of Payment" fullWidth value={mode} onChange={(e) => setMode(e.target.value)} required>
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="NEFT/RTGS">NEFT/RTGS</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Wave off">Wave off</MenuItem>
            </TextField>
          </Grid>

          {/* Transaction Fields */}
          {showTransactionFields && (
            <Grid item xs={12} sm={6}>
              <TextField
                label={mode === 'Cheque' ? 'Cheque No' : 'Transaction ID'}
                fullWidth
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </Grid>
          )}

          {/* Bank Name for Cheque */}
          {isCheque && (
            <Grid item xs={12} sm={6}>
              <TextField label="Bank Name" fullWidth value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </Grid>
          )}

          {/* Amount (for all modes) */}
          {(isCash || isCheque || showTransactionFields || isWaveOff) && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Amount" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} />
              </Grid>
            </>
          )}

          {/* Date */}
        </Grid>

        {/* Summary Box */}
        {/* {submittedData && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box border="1px solid #000" borderRadius="4px" p={2} textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Submitted Payment Details
              </Typography>
              <Typography mt={1}>
                Payment Mode: <strong>{submittedData.paymentMode}</strong>
              </Typography>

              {submittedData.transactionId && (
                <Typography>
                  {submittedData.paymentMode === 'Cheque' ? 'Cheque No' : 'Transaction ID'}: <strong>{submittedData.transactionId}</strong>
                </Typography>
              )}
              {submittedData.paymentBankName && (
                <Typography>
                  Bank Name: <strong>{submittedData.paymentBankName}</strong>
                </Typography>
              )}
              <Typography> Date: <strong>{submittedData.paymentDate}</strong> </Typography>
              <Typography>
                Amount: <strong>₹{submittedData.paidAmount}</strong>
              </Typography>
            </Box>
          </>
        )} */}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!mode || !date || (!amount && !isWaveOff)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;

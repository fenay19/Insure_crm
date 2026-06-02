import React, { useEffect, useState } from 'react'
import { Button, TextField, Typography, Box, Divider } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setAmount, setPaidAmount, setPaymentDetails, setPendingAmount, setTransactionId } from 'reduxSlices/opdBillingStates'

const PaymentUI = ({ onSubmit, label, fetchOPDReceiptAfterSubmit }) => {
  const { selectedPaymentMode, selectedPaymentModeWithoutBill, paymentDetails, totalAmount, finalAmount } = useSelector(
    state => state.opdBillingStates
  )
  const dispatch = useDispatch()
  let paymentMode = selectedPaymentMode ?? selectedPaymentModeWithoutBill

  const handleFullAmountClick = () => {
    if (finalAmount !== 0) {
      dispatch(setAmount(finalAmount))
    } else {
      dispatch(setAmount(totalAmount))
    }
  }

  const handleAmountChange = event => {
    dispatch(setAmount(event.target.value))
  }

  const handleDetailsChange = event => {
    dispatch(setTransactionId(event.target.value))
  }

  const handleSubmit = () => {
    const paymentDetails = {
      paymentMode,
      selectedFor: label
    }
    dispatch(setPaymentDetails(paymentDetails))

    onSubmit(paymentDetails)
  }

  // const pendingAmount =
  //   finalAmount > 0 ? finalAmount - parseFloat(paymentDetails?.amount || 0) : totalAmount - parseFloat(paymentDetails?.amount || 0);

  // useEffect(() => {
  //   dispatch(setPaidAmount(paymentDetails.amount));
  //   dispatch(setPendingAmount(pendingAmount));
  // }, [dispatch, paymentDetails.amount, finalAmount, totalAmount, pendingAmount]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        bgcolor: 'background.paper'
      }}
    >
      {/* Payment Mode Display */}
      <Typography
        variant='h6'
        sx={{
          color: 'primary.main',
          mb: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          textTransform: 'uppercase'
        }}
      >
        Payment Mode {label}: {paymentMode}
      </Typography>

      <Divider sx={{ width: '100%', mb: 2 }} />

      {/* Conditional Input for Payment Details */}
      {paymentMode !== 'Cash' && (
        <TextField
          label={'Transaction ID *'}
          variant='outlined'
          size='small'
          fullWidth
          value={paymentDetails?.transactionId}
          onChange={handleDetailsChange}
          sx={{ mb: 2 }}
          required
        />
      )}

      {/* Full Amount and Amount Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          width: '100%'
        }}
      >
        <Button variant='contained' color='secondary' fullWidth onClick={handleFullAmountClick} sx={{ whiteSpace: 'nowrap' }}>
          Full Amount
        </Button>
        <Typography variant='body1' sx={{ whiteSpace: 'nowrap' }}>
          OR
        </Typography>
        <TextField label='Enter Amount' type='number' size='small' value={paymentDetails?.amount} onChange={handleAmountChange} fullWidth />
      </Box>

      {/* Submit Button */}
      <Button
        variant='contained'
        color='primary'
        onClick={handleSubmit}
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        Submit Payment
      </Button>
    </Box>
  )
}

export default PaymentUI

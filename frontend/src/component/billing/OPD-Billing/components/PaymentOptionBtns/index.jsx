import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  TextField
} from '@mui/material';
import PaymentUI from 'component/billing/PaymentUi';
import { toast } from 'react-toastify';
import { get, post, put } from 'api/api';
import { currentDate, extractPrefixAndNumber } from 'utils/currentDate';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetPrintDataForAdvanceOPDReceipt,
  setCloseBillingModal,
  setConsultantId,
  setIncreaseNotificationCount,
  setSelectedPaymentMode,
  setSelectedPaymentModeWithoutBill
} from 'reduxSlices/opdBillingStates';
import RefundNote from 'component/billing/RefundNote';
import CreditNote from 'component/billing/OPDCreditNote';
import { useNavigate } from 'react-router';
import { useGetConsultantsQuery } from 'services/endpoints/consultants/consultantApi';
import {
  useGetNotificationsPatientQuery,
  useGetNotificationsQuery,
  useSendNotficationMutation
} from 'services/endpoints/notifications/notificationApi';
import { createSocketConnection } from 'socket';

const PaymentBtns = ({
  anchorElWithoutBill,
  openWithoutBill,
  handleAnchorElWithoutBill,
  handleClose,
  handlePaymentModeWithoutBillSubmit,
  handlePaymentSubmit
}) => {
  const { data } = useGetConsultantsQuery();
  const { billingData } = useSelector((state) => state.opdBilling);
  const [sendNotification, { isSuccess, isError, data: notficationResponse }] = useSendNotficationMutation();
  const { data: userNotification, refetch } = useGetNotificationsQuery(billingData?.patientId);
  const [selectedConsultantId, setSelectedConsultantId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [existBill, setExistBill] = useState({
    data: [],
    exist: false
  });
  const dispatch = useDispatch();
  const {
    selectedPaymentMode,
    selectedPaymentModeWithoutBill,
    paymentModes,
    paidAmount,
    finalAmount,
    totalAmount,
    totalDiscount,
    serviceDataSelectedToDisplay,
    consultnatIdForNotificaion
  } = useSelector((state) => state.opdBillingStates);
  const { billType } = useSelector((state) => state.opdBillingStates);

  const [isCreditNoteOpen, setIsCreditNoteOpen] = useState(false);
  const navigate = useNavigate();
  const [cashCreditDialog, setCashCreditDialog] = useState(false);

  const loginData = JSON.parse(window.localStorage.getItem('loginData'));
  const empCode = window.localStorage.getItem('empCode');

  const billNo = extractPrefixAndNumber(billingData?.opd_regNo || 'N/A');
  const billDate = currentDate();

  const AllGeneratedReceiptAgainstPatient = useSelector((state) => state.opdBillingStates.OPDReceiptData);
  const paidAmounts = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.paidAmount || 0), 0);
  const pendingAmount = AllGeneratedReceiptAgainstPatient.reduce((sum, receipt) => sum + Number(receipt.pendingAmount || 0), 0);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleCreditDialog = () => {
    if (billType === 'Cash Credit') {
      setCashCreditDialog(true);
      return;
    }
    setIsCreditNoteOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsCreditNoteOpen(false);
    setCashCreditDialog(false);
  };

  const serviceDetails = useMemo(
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

  const billData = {
    patientId: billingData?.patientId,
    opdId: billingData?._id,
    tokenNo: billingData?.tokenNo,
    services: serviceDetails,
    discountCharges: totalDiscount,
    paidAmount: 0,
    pendingAmount: totalAmount,
    totalAmount: totalAmount,
    servicesAmount: totalAmount,
    billNo: billNo,
    billDate: billDate,
    personWhoCreatedBill: loginData?.name,
    employeeCode: empCode
  };

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

  const handleSaveBilling = async () => {
    try {
      const isExisting = existBill?.exist;
      const url = isExisting ? `opd-billing/credit-patient/${existBill?.data?._id}` : 'opd-billing/credit-patient';
      const method = isExisting ? put : post;

      const res = await method(url, billData);

      if (res?.success) {
        toast.success('Saved Successfully');
        dispatch(setCloseBillingModal());
        navigate('/confirm-patientForm');
        dispatch(resetPrintDataForAdvanceOPDReceipt());

        if (isExisting) fetchBill();
      } else {
        toast.error('Failed to save');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleChange = (event) => {
    dispatch(setConsultantId(event.target.value));
    setSelectedConsultantId(event.target.value);
  };
  async function handleSendRequestNotification() {
    try {
      await sendNotification({
        consultantId: selectedConsultantId,
        patientId: billingData?.patientId,
        message: `Approve the request of ${billingData?.patientFirstName} ${billingData?.patientLastName}`,
        pendingAmount: pendingAmount,
        paidAmount: paidAmounts,
        isRead: false,
        isApproved: false,
        personWhoSendNotification: loginData?.refId
      }).unwrap();
    } catch (err) {
      toast.error('Failed to send notification');
      console.error('❌ Notification Error:', err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      handleDialogClose();
      setSelectedConsultantId('');
    }

    if (isError) {
      // toast.error(error?.data?.message || 'Something went wrong');
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    fetchBill();
  }, []);

  const socket = createSocketConnection();
  useEffect(() => {
    if (socket) {
      socket.on('PATIENT_APPROVED_REQUEST', (data) => {
        refetch();
      });

      // Cleanup on unmount
      return () => {
        socket.off('PATIENT_APPROVED_REQUEST');
      };
    }
  }, [socket]);

  return (
    <Box className="actionBtns" sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 2,
          p: 2,
          backgroundColor: '#f7f7f7',
          borderRadius: 2,
          width: '100%',
          maxWidth: '800px',
          mb: 3
        }}
      >
        {/* Amount Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 1,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              borderBottom: '2px solid #ddd',
              pb: 1
            }}
          >
            Final Amount: ₹{finalAmount > 0 ? finalAmount : totalAmount}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'success.main',
              fontWeight: 'bold'
            }}
          >
            Paid Amount: ₹{paidAmount}
          </Typography>
        </Box>

        {/* Payment UI Box */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between'
          }}
        >
          {selectedPaymentModeWithoutBill !== null && (
            <Box sx={{ flex: 1, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <PaymentUI onSubmit={handlePaymentModeWithoutBillSubmit} label="Receipt" />
            </Box>
          )}

          {selectedPaymentMode !== null && (
            <Box sx={{ flex: 1, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <PaymentUI onSubmit={handlePaymentSubmit} label="Bill" />
            </Box>
          )}
        </Box>
      </Box>

      <Button
        sx={{ marginRight: '10px' }}
        variant="contained"
        onClick={handleSaveBilling}
        disabled={serviceDetails?.length > 0 ? false : true}
      >
        Save
      </Button>
      {(billType !== 'Credit' || userNotification?.[0]?.isApproved) && (
        <>
          {(billType !== 'Cash Credit' || userNotification?.[0]?.isApproved) && (
            <Box component="span" sx={{ display: 'inline-block' }}>
              <Button variant="contained" onClick={handlePaymentSubmit}>
                Generate Bill
              </Button>
            </Box>
          )}

          <Box component="span" sx={{ display: 'inline-block', marginLeft: '10px' }}>
            <Button variant="contained" onClick={handleAnchorElWithoutBill}>
              Generate Receipt
            </Button>
            <Menu anchorEl={anchorElWithoutBill} open={openWithoutBill} onClose={handleClose}>
              {paymentModes.map((mode) => (
                <MenuItem
                  key={mode._id}
                  onClick={() => {
                    dispatch(setSelectedPaymentModeWithoutBill(mode?.paymentMode));
                    dispatch(setSelectedPaymentMode(null));
                  }}
                >
                  {mode.paymentMode}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Button sx={{ marginLeft: '10px' }} variant="contained" onClick={handleDialogOpen}>
            Refund Voucher
          </Button>
        </>
      )}
      {billType === 'Credit' && (
        <Button sx={{ marginLeft: '10px' }} variant="contained" onClick={handleCreditDialog}>
          Credit Bill
        </Button>
      )}
      {billType === 'Cash Credit' && (
        <Button sx={{ marginLeft: '10px' }} variant="contained" onClick={handleCreditDialog}>
          Send Request
        </Button>
      )}

      {/* Refund Note Dialog */}
      <Dialog open={isDialogOpen} fullWidth maxWidth="sm" aria-labelledby="opd-refund-note-dialog-title" onClose={handleDialogClose}>
        <DialogContent>
          <RefundNote onClose={handleDialogClose} />
        </DialogContent>
      </Dialog>

      {/* Cash Credit Dialog */}
      <Dialog open={cashCreditDialog} maxWidth="md" aria-labelledby="opd-cash-credit-title" onClose={handleDialogClose}>
        <DialogContent>
          <Box sx={{ marginTop: 2, width: '25vw' }}>
            <Typography variant="body2" fontWeight="600" sx={{ marginBottom: 2 }}>
              Select Consultant:
            </Typography>

            <Autocomplete
              fullWidth
              options={data || []}
              getOptionLabel={(option) =>
                `${option?.basicDetails?.prefix?.prefix || ''}. ${option?.basicDetails?.firstName || ''} ${option?.basicDetails?.lastName || ''}`
              }
              value={data?.find((item) => item._id === selectedConsultantId) || null}
              onChange={(event, newValue) => {
                handleChange({ target: { value: newValue?._id || '' } });
              }}
              renderInput={(params) => <TextField {...params} label="Consultant" required />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </Box>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSendRequestNotification}>
            Send Request
          </Button>
          <Button variant="contained" sx={{ mt: 2, ml: 1 }} onClick={() => setCashCreditDialog(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Credit Note Dialog */}
      <Dialog open={isCreditNoteOpen} fullWidth maxWidth="md" aria-labelledby="opd-credit-note-dialog-title" onClose={handleDialogClose}>
        <DialogContent>
          <CreditNote onClose={handleDialogClose} />
        </DialogContent>
      </Dialog>

      {userNotification?.[0]?.isApproved && (
        <Box
          sx={{
            mt: 2,
            px: 2,
            position: 'absolute',
            py: 1,
            bottom: -2,
            left: '66%',
            borderRadius: 2,
            backgroundColor: 'success.main',
            color: 'white',
            fontWeight: 600,
            textAlign: 'center',
            animation: 'blinker 1s linear infinite',
            '@keyframes blinker': {
              '50%': {
                opacity: 0
              }
            }
          }}
        >
          Approved
        </Box>
      )}
    </Box>
  );
};

export default PaymentBtns;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notificationApprovedCount: 0,
  activeTab: 0,
  selectedPaymentMode: null,
  selectedPaymentModeWithoutBill: null,
  paymentDetails: {
    transactionId: '',
    amount: 0
  },
  paymentModes: [],
  serviceDataSelectedToDisplay: [],
  discountType: '',
  discountValue: '',
  totalDiscount: 0,
  finalAmount: 0,
  totalAmount: 0,
  paidAmount: 0,
  pendingAmount: 0,
  dropDownOptions: [],
  OPDReceiptData: [], //all opd receipt of patient
  PrintDataForAdvanceOPDReceipt: {},
  opdBillingModal: false,
  billType: 'billType',
  consultnatIdForNotificaion: ''
};
const opdBillingStates = createSlice({
  name: 'opdBillingStates',
  initialState,
  reducers: {
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    setSelectedPaymentMode: (state, { payload }) => {
      state.selectedPaymentMode = payload;
    },
    setSelectedPaymentModeWithoutBill: (state, { payload }) => {
      state.selectedPaymentModeWithoutBill = payload;
    },
    setPaymentDetails: (state, { payload }) => {
      state.paymentDetails = {
        ...state.paymentDetails,
        ...payload
      };
    },
    setTransactionId: (state, { payload }) => {
      state.paymentDetails.transactionId = payload;
    },
    setAmount: (state, { payload }) => {
      state.paymentDetails.amount = payload;
    },
    setPaymentModes: (state, { payload }) => {
      state.paymentModes = payload;
    },
    setServiceDataSelectedToDisplay: (state, { payload }) => {
      const newFilteredData = payload.filter(
        (newItem) => !state.serviceDataSelectedToDisplay.some((existingItem) => existingItem._id === newItem._id)
      );
      state.serviceDataSelectedToDisplay = [...state.serviceDataSelectedToDisplay, ...newFilteredData];
      console.log('after', state.serviceDataSelectedToDisplay);
    },

    removeServiceData: (state, { payload }) => {
      // Remove service by ID
      const filteredData = state.serviceDataSelectedToDisplay.filter((service) => service._id !== payload);
      state.serviceDataSelectedToDisplay = filteredData;
    },
    setDiscountType: (state, { payload }) => {
      state.discountType = payload;
    },
    setDiscountValue: (state, { payload }) => {
      state.discountValue = payload;
    },
    setTotalDiscount: (state, { payload }) => {
      state.totalDiscount = payload;
    },
    setFinalAmount: (state, { payload }) => {
      state.finalAmount = payload;
    },
    setTotalAmount: (state, { payload }) => {
      state.totalAmount = payload;
    },
    setPaidAmount: (state, { payload }) => {
      state.paidAmount = payload;
    },
    setPendingAmount: (state, { payload }) => {
      state.pendingAmount = payload;
    },
    setDropDownOptions: (state, { payload }) => {
      state.dropDownOptions = payload;
    },
    setInitialStates: (state) => {
      return { ...initialState };
    },

    setOPDReceiptData: (state, { payload }) => {
      state.OPDReceiptData.push(payload);
    },

    setAllOPDReceiptDataFromApi: (state, { payload }) => {
      state.OPDReceiptData = payload;
    },

    setPrintDataForAdvanceOPDReceipt: (state, action) => {
      state.PrintDataForAdvanceOPDReceipt = action.payload;
    },
    resetPrintDataForAdvanceOPDReceipt: (state, action) => {
      state.PrintDataForAdvanceOPDReceipt = {};
      state.serviceDataSelectedToDisplay = [];
    },
    setOpenBillingModal: (state, action) => {
      state.opdBillingModal = true;
    },
    setCloseBillingModal: (state, action) => {
      state.opdBillingModal = false;
    },
    setBillType: (state, { payload }) => {
      state.billType = payload;
    },
    setConsultantId: (state, { payload }) => {
      state.consultnatIdForNotificaion = payload;
    },
    setIncreaseNotificationCount: (state) => {
      state.notificationApprovedCount += 1;
    }
  }
});

export const {
  setIncreaseNotificationCount,
  setConsultantId,
  setBillType,
  setCloseBillingModal,
  setOpenBillingModal,
  setDropDownOptions,
  setActiveTab,
  setSelectedPaymentMode,
  setSelectedPaymentModeWithoutBill,
  setPaymentDetails,
  setTransactionId,
  setPaymentModes,
  setServiceDataSelectedToDisplay,
  removeServiceData,
  setDiscountType,
  setDiscountValue,
  setFinalAmount,
  setTotalAmount,
  setTotalDiscount,
  setAmount,
  setPaidAmount,
  setPendingAmount,
  setInitialStates,
  setOPDReceiptData,
  setAllOPDReceiptDataFromApi,
  setPrintDataForAdvanceOPDReceipt,
  resetPrintDataForAdvanceOPDReceipt
} = opdBillingStates.actions;
export default opdBillingStates.reducer;

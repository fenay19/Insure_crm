import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Card, Dialog, IconButton, Modal, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import AdvanceReciept from './AdvanceReciept';
import BillReciept from './BillReciept';
import { get, post } from 'api/api';
import ServiceSectionTabs from './OPD-Billing/components/ServiceTabs';
import PatientDemoGraph from './OPD-Billing/components/PatientDemoGraph';
import PatientAccountDetails from './OPD-Billing/components/PatientAccountDetails';
import PatientPreviousDetails from './OPD-Billing/components/PreviousPatient';
import InvoiceTable from './OPD-Billing/components/InvoiceTable';
import PaymentBtns from './OPD-Billing/components/PaymentOptionBtns';
import { toast } from 'react-toastify';
import { currentDate, extractPrefixAndNumber } from 'utils/currentDate';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { setBillingInfo } from 'reduxSlices/opdBillingSlice';
import {
  setDropDownOptions,
  setInitialStates,
  setPaidAmount,
  setPaymentModes,
  setPendingAmount,
  setServiceDataSelectedToDisplay,
  setOPDReceiptData,
  setPrintDataForAdvanceOPDReceipt,
  setCloseBillingModal,
  resetPrintDataForAdvanceOPDReceipt,
  setBillType
} from 'reduxSlices/opdBillingStates';

function OPDBilling({ getFreshAppointmentAfterConfirmAppoinment = () => {} } = {}) {
  const contentRef = useRef();
  const dispatch = useDispatch();
  const {
    serviceDataSelectedToDisplay,
    activeTab,
    finalAmount,
    totalAmount,
    totalDiscount,
    paidAmount,

    selectedPaymentMode,
    selectedPaymentModeWithoutBill,
    paymentDetails
  } = useSelector((state) => state.opdBillingStates);

  const { billingData } = useSelector((state) => state.opdBilling);
  const [serviceData, setServiceData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElWithoutBill, setAnchorElWithoutBill] = useState(null);
  // Service Tabs State
  const [dropdownValue, setDropdownValue] = useState('');

  const [selectedValues, setSelectedValues] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [investigationType, setInvestigationType] = useState('Pathology');
  // All Service data State
  const [servicesData, setServicesData] = useState({
    opdPackageDetail: [],
    radiologyDetail: [],
    pathologyDetail: [],
    otherServiceDetail: [],
    opdConsultationDetail: [],
    otherDiagnostics: [],
    pathologyProfiles: []
  });

  const open = Boolean(anchorEl);
  const openWithoutBill = Boolean(anchorElWithoutBill);

  const billNo = extractPrefixAndNumber(billingData?.opd_regNo || 'N/A');
  const billDate = currentDate();

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
        serviceCode: service?.code
      })),
    [serviceDataSelectedToDisplay]
  );

  // State for submiting payment
  const [data, setData] = useState({
    opdId: '',
    paidAmount: '',
    services: '',
    paymentMode: '',
    finalAmount: '',
    totalAmount: '',
    discountCharges: '',
    patientId: '',
    billNo: '',
    billDate: ''
  });

  // Update `data` whenever dependencies change
  useEffect(() => {
    setData({
      opdId: billingData?._id || '0',
      paidAmount: paidAmount,
      services: serviceDetail,
      paymentMode: selectedPaymentModeWithoutBill,
      transactionId: paymentDetails.transactionId,
      finalAmount: finalAmount > 0 ? finalAmount : totalAmount,
      discountCharges: totalDiscount,
      totalAmount: totalAmount,
      patientId: billingData?.patientId,
      billNo: billNo,
      billDate: billDate
    });
  }, [
    billingData?._id,
    serviceDetail,
    totalDiscount,
    totalAmount,
    finalAmount,
    billDate,
    selectedPaymentModeWithoutBill,
    selectedPaymentMode,
    paidAmount,
    billingData.patientId,
    billNo,
    paymentDetails
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAnchorElWithoutBill = (event) => {
    setAnchorElWithoutBill(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElWithoutBill(null);
  };

  const closeModal = () => {
    dispatch(setCloseBillingModal());
    dispatch(setInitialStates());
    dispatch(resetPrintDataForAdvanceOPDReceipt());
  };

  const handleOpenModal = (text) => {
    setType(text);
    setModalOpen(true);
  };
  const pendingAmount =
    finalAmount > 0 ? finalAmount - parseFloat(paymentDetails?.amount || 0) : totalAmount - parseFloat(paymentDetails?.amount || 0);

  const handlePaymentSubmit = async () => {
    handleOpenModal('with');
    // dispatch(setPaidAmount(paymentDetails.amount))
    // dispatch(setPendingAmount(pendingAmount))
    // try {
    //   const res = await post('opd-billing/adda', {
    //     ...data,
    //     paymentMode: paymentDetails?.paymentMode,
    //     paidAmount: paidAmount,
    //     cardNo: paymentDetails?.paymentDetail
    //   })
    //   if (res?.data) {
    //     toast.success(res?.message || 'Saved successfully!')
    //   } else {
    //     toast.error('Failed to save the data.')
    //   }
    // } catch (err) {
    //   console.error('Error during API call:', err)
    //   toast.error('Something went wrong. Please try again.')
    // }
  };

  const getTokenNoForOPDPatientAfterBillPaid = async (opdId) => {
    const response = await get(`opd-patient/patientWithToken/${opdId}`);
    dispatch(setBillingInfo({ ...response.data, isEdit: true }));
  };

  const handlePaymentModeWithoutBillSubmit = async () => {
    try {
      const res = await post('opd-receipt/add', {
        ...data,
        pendingAmount: pendingAmount,

        paidAmount: paymentDetails?.amount,
        cardNo: paymentDetails?.paymentDetail
      });

      // console.log(res)

      if (res?.success === true) {
        toast.success(res?.message || 'Saved successfully!');

        dispatch(setOPDReceiptData(res.receipt));
        dispatch(setPrintDataForAdvanceOPDReceipt(res.receipt));
        await getTokenNoForOPDPatientAfterBillPaid(res.receipt.opdId);
        if (!billingData.isEdit) {
          getFreshAppointmentAfterConfirmAppoinment();
        }
        handleOpenModal('without');
      } else {
        toast.error('Failed to save the data.');
      }
    } catch (err) {
      console.error('Error during API call:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const getPaymentData = async () => {
    await get('payment-mode').then((response) => {
      dispatch(setPaymentModes(response?.paymentMode ?? []));
    });
  };

  const handleInvestigationTypeChange = (type) => {
    setInvestigationType(type);
    setDropdownValue('');
  };

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleAddClick = () => {
    if (dropdownValue && !selectedValues[activeTab].includes(dropdownValue)) {
      setSelectedValues((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], dropdownValue]
      }));

      setDropdownValue('');
    }
  };

  const getDropdownOptions = () => {
    let res = [];

    switch (activeTab) {
      case 0:
        res = servicesData.otherServiceDetail || [];
        break;

      case 1:
        if (investigationType?.toLowerCase()?.trim() === 'pathology') {
          res = servicesData.pathologyDetail || [];
        } else if (investigationType?.toLowerCase()?.trim() === 'pathology profile') {
          res = servicesData.pathologyProfiles || [];
        } else {
          res = servicesData.radiologyDetail || [];
        }
        break;

      case 2:
        res = servicesData.opdConsultationDetail || [];
        break;

      case 3:
        res = servicesData.opdPackageDetail || [];
        break;

      case 4:
        res = servicesData.otherDiagnostics || [];
        break;

      default:
        res = [];
    }

    dispatch(setDropDownOptions(res));
  };

  // Helper function to filter data based on selected values
  const filterServiceData = (dataArray, selectedIds) => {
    return dataArray?.filter(({ _id }) => selectedIds?.includes(_id)) || [];
  };

  // Main function to filter data based on the active tab and selected values
  const handleServiceDataFiltering = () => {
    let filteredData = [];

    switch (activeTab) {
      case 0:
        // Filter data for "Other Services"
        filteredData = filterServiceData(servicesData?.otherServiceDetail, selectedValues[0]);
        break;

      case 1:
        // Filter data for "Investigation" (Pathology and Radiology combined)
        const pathologyFiltered = filterServiceData(servicesData?.pathologyDetail, selectedValues[1]);
        const radiologyFiltered = filterServiceData(servicesData?.radiologyDetail, selectedValues[1]);
        const pathologyProfile = filterServiceData(servicesData?.pathologyProfiles, selectedValues[1]);
        filteredData = [...pathologyFiltered, ...radiologyFiltered, ...pathologyProfile];
        break;

      case 2:
        // Filter data for "Consultation"

        filteredData = filterServiceData(servicesData?.opdConsultationDetail, selectedValues[2]);
        break;

      case 3:
        // Filter data for "OPD Package"
        filteredData = filterServiceData(servicesData?.opdPackageDetail, selectedValues[3]);
        break;
      case 4:
        // Filter data for "OPD Package"
        filteredData = filterServiceData(servicesData?.otherDiagnostics, selectedValues[4]);
        break;

      default:
        break;
    }

    dispatch(setServiceDataSelectedToDisplay(filteredData));

    filteredData = [];
  };

  useEffect(() => {
    getPaymentData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleServiceDataFiltering();
  }, [dropdownValue]);

  const fetchApplicableServiceRateListForPatient = async () => {
    const payeeCategory = billingData.payeeCategory || undefined;
    const patientPayee = billingData.patientPayee || undefined;
    const tpa = billingData.tpa || undefined;
    const response = await get(`service-rate-new/getApplicableServiceListForPatient/${payeeCategory}/${patientPayee}/${tpa}`);

    const result = {
      pathology: response?.data?.pathology || [],
      radiology: response?.data?.radiology || [],
      opdPackage: response?.data?.opdPackage || [],
      otherServices: response?.data?.otherServices || [],
      opdConsultant: response?.data?.opdConsultant || [],
      otherDiagnostics: response?.data?.otherDiagnostics || [],
      pathologyProfiles: response?.data?.pathologyProfiles || []
    };

    setServiceData(result);
  };

  useEffect(() => {
    fetchApplicableServiceRateListForPatient();
    const billType = billingData?.billType || {};
    if (billType) {
      dispatch(setBillType(billType));
    }
  }, [billingData, dispatch]);

  useEffect(() => {
    setServicesData({
      opdPackageDetail: serviceData?.opdPackage || [],
      radiologyDetail: serviceData?.radiology || [],
      pathologyDetail: serviceData?.pathology || [],
      otherServiceDetail: serviceData?.otherServices || [],
      opdConsultationDetail: serviceData?.opdConsultant || [],
      otherDiagnostics: serviceData?.otherDiagnostics || [],
      pathologyProfiles: serviceData?.pathologyProfiles || []
    });
  }, [serviceData]);

  getDropdownOptions();

  return (
    <>
      <div className="wideModal" style={{ width: '90vw' }}>
        <Box>
          <div ref={contentRef}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Typography variant="h6" className="popupHead">
                OPD Billing
              </Typography>
              <IconButton title="Close" onClick={closeModal} className="btnCancel">
                <Close />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                mb: 4,
                height: '56vh'
              }}
            >
              <Card sx={{ p: 2, width: '70%' }}>
                <ServiceSectionTabs
                  dropdownValue={dropdownValue}
                  onDropdownChange={handleDropdownChange}
                  onAddClick={handleAddClick}
                  onInvestigationTypeChange={handleInvestigationTypeChange}
                  investigationType={investigationType}
                />
              </Card>

              <PatientDemoGraph />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ width: '60%' }}>
                <InvoiceTable selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
                <PaymentBtns
                  anchorEl={anchorEl}
                  open={open}
                  handleClick={handleClick}
                  handleClose={handleClose}
                  anchorElWithoutBill={anchorElWithoutBill}
                  openWithoutBill={openWithoutBill}
                  handleAnchorElWithoutBill={handleAnchorElWithoutBill}
                  handlePaymentSubmit={handlePaymentSubmit}
                  handlePaymentModeWithoutBillSubmit={handlePaymentModeWithoutBillSubmit}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '40%' }}>
                <PatientAccountDetails />
              </Box>
            </Box>
          </div>
        </Box>
      </div>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg" fullWidth>
        {type === 'without' ? <AdvanceReciept /> : <BillReciept />}
      </Dialog>
    </>
  );
}

export default OPDBilling;

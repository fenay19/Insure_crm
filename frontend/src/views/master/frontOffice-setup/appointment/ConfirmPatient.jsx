import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Loader from 'component/Loader/Loader';
import { get, put, remove } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import DataTable from 'component/DataTable';
import { Edit, ReceiptLong } from '@mui/icons-material';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Add, Receipt } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';

// import DeleteBtn from 'component/buttons/DeleteBtn';
import AddRequestList from './Requests';
import { toast, ToastContainer } from 'react-toastify';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import EditConfirmAppointment from './forms/EditConfirmAppointment';
import ViewAllReceiptsOfPatient from './ViewAllReceiptsOfPatient';
import { setAllOPDReceiptDataFromApi, setBillType, setCloseBillingModal, setOpenBillingModal } from 'reduxSlices/opdBillingStates';
import { useDispatch, useSelector } from 'react-redux';
import BillReciept from 'component/billing/BillReciept';
import { setBillingInfo } from 'reduxSlices/opdBillingSlice';
import OPDBilling from 'component/billing/OPDBilling';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { createSocketConnection } from '../../../../socket';
// import { Clock } from '@mui/x-date-pickers/TimeClock/Clock';
const ConfirmPatient = ({ bgColor }) => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [patientType, setPatientType] = useState('OPD');
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [allReceipts, setAllReceipts] = useState([]);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const dispatch = useDispatch();

  const openRegistration = (type) => {
    setType(type);
    setEditData({});
    setOpenRegistrationModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
  };
  const nagivate = useNavigate();

  // useEffect(() => {
  //   const socket = createSocketConnection();

  //   console.log('Real-time update:');
  //   socket.emit('join-patient-room'); // ✅ Matches backend now

  //   socket.on('PATIENT_STATUS_UPDATED', (updatedPatient) => {
  //     console.log('Real-time update:', updatedPatient);
  //     setShowData((prev) => prev.map((p) => (p._id === updatedPatient._id ? { ...updatedPatient, sr: p.sr } : p)));
  //     setServerData((prev) => prev.map((p) => (p._id === updatedPatient._id ? { ...updatedPatient, sr: p.sr } : p)));
  //     getData();
  //   });

  //   return () => {
  //     socket.off('PATIENT_STATUS_UPDATED');
  //   };
  // }, [patientType]);

  useEffect(() => {
    getData();
  }, [patientType]);

  const getData = async () => {
    setLoader(true);

    try {
      const apiUrlMapping = {
        OPD: `opd-patient`,
        Walkin: `walkin-patient`,
        Daycare: `daycare-patient`,
        Emergency: `emr-patient`,
        IPD: `ipd-patient`
      };
      const response = await get(apiUrlMapping[patientType]);
      const addsr = response.data.map((val, index) => ({
        ...val,
        sr: index + 1
      }));
      setShowData(addsr);
      setServerData(addsr);
    } catch (error) {
      toast.error(console.log(error));
    } finally {
      setLoader(false);
    }
  };

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = serverData?.filter(
      (item) => `${item?.patientFirstName}`.toLowerCase().includes(searchValue) || item.departmentName.toLowerCase().includes(searchValue)
    );
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleEdit = (item) => {
    setType('edit');
    setEditData(item);
    setOpenRegistrationModal(true);
  };

  const [openViewReceiptsModal, setOpenViewReceiptsModal] = useState(false);
  const [opdPatientData, setOpdPatientData] = useState({});

  const handleViewReceipts = async (item) => {
    console.log('RECEPIT', item);
    dispatch(setBillingInfo(item));

    setOpdPatientData(item);
    setOpenViewReceiptsModal(true);
  };

  const handleCloseViewReceiptsModal = () => {
    setOpdPatientData({});
    setOpenViewReceiptsModal(false);
  };

  const [openViewBillModal, setOpenViewBillModal] = useState(false);
  const { opdBillingModal } = useSelector((state) => state.opdBillingStates);
  const handleClosViewBillModal = () => {
    setOpenViewBillModal(false);
  };
  const handleViewBill = async (item) => {
    try {
      const billRes = await get(`opd-billing/${item.patientId}`);
      const credit = await get(`opd-billing/credit/${item.patientId}`);

      if (!billRes?.data) {
        toast.error('Bill is not generated');
        return setOpenViewBillModal(false);
      }

      dispatch(setBillingInfo(item));

      const response = await get(`opd-receipt/getOpdReceipts/${item._id}`);

      if (response) {
        dispatch(setAllOPDReceiptDataFromApi(response.receipts));
      } else {
        dispatch(setAllOPDReceiptDataFromApi([]));
        toast.warning('No OPD receipts found.');
      }

      setOpenViewBillModal(true);
    } catch (error) {
      console.error('Error fetching bill:', error);
      toast.error('Failed to fetch bill details.');
      setOpenViewBillModal(false);
    }
  };

  useEffect(() => {
    const socket = createSocketConnection();

    // ✅ Join room on mount
    socket.emit('join-patient-room');
    console.log('✅ Joined patient room for real-time updates');

    // ✅ Handle updates
    const handleStatusUpdate = (updatedPatient) => {
      console.log('📡 Real-time update received:', updatedPatient);
      setShowData((prev) => prev.map((p) => (p._id === updatedPatient._id ? { ...updatedPatient, sr: p.sr } : p)));
      setServerData((prev) => prev.map((p) => (p._id === updatedPatient._id ? { ...updatedPatient, sr: p.sr } : p)));
      getData();
    };

    socket.on('PATIENT_STATUS_UPDATED', handleStatusUpdate);

    // 🧼 Cleanup
    return () => {
      socket.off('PATIENT_STATUS_UPDATED', handleStatusUpdate);
      socket.disconnect(); // 🛑 Prevent memory leaks
      console.log('👋 Disconnected socket from patient room');
    };
  }, [patientType]);

  const handleConfirmApp = (item) => {
    setType('confirm');
    setEditData(item);
    setOpenRegistrationModal(true);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);

  const handleOpenDialog = (item) => {
    const hasAnyData = Object.values(item?.requests)?.some((value) => value !== null);
    const { billType } = item || {};
    dispatch(setBillType(billType));

    if (!hasAnyData) {
      toast.error('NO TESTS AVAILABLE');
      return;
    }
    setSelectedRequestData(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequestData(null);
  };

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget); // Open the menu for the clicked item
    setSelectedItem(item); // Store the clicked patient item
  };

  // For Patient Manulay change status
  const handleStatusChange = async (item, newStatus) => {
    const payload = {
      date: item?.date,
      time: item?.time,
      consultantId: item?.consultantId
    };
    if (!item?._id) {
      toast.error('Invalid patient data.');
      return;
    }

    try {
      const res = await put(`opd-patient/update-patient-status/${item._id}`, { status: newStatus });
      await put(`opd-patient/update-slot`, payload);

      if (res.success) {
        toast.success(`Status updated to "${newStatus}" successfully!`);
        getData();
      } else {
        toast.warning(res.data?.message || 'Could not update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again later.');
    }
  };

  const handleClose = (newStatus) => {
    setAnchorEl(null);
    if (newStatus && selectedItem) {
      handleStatusChange(selectedItem, newStatus); // Update only the selected item
    }
  };

  const getStatusBadge = (item) => {
    let bgColor = 'gray';
    let icon = '';

    if (item.status?.toLowerCase()?.trim() === 'waiting') {
      bgColor = '#FFC107';
      icon = <AccessTimeIcon style={{ width: '24px', height: '20px' }} />;
    } else if (item.status?.toLowerCase()?.trim() === 'patient in') {
      bgColor = '#4CAF50';
      icon = <ArrowForwardIcon style={{ width: '24px', height: '20px' }} />;
    } else if (item.status?.toLowerCase()?.trim() === 'patient out') {
      bgColor = 'red';
      icon = <ArrowBackIcon style={{ width: '24px', height: '20px' }} />;
    }

    return (
      <>
        <button
          onClick={(event) => handleClick(event, item)} // Pass event and item to parent handler
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: bgColor,
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            whiteSpace: 'nowrap',
            width: '150px',
            textAlign: 'center'
          }}
        >
          {icon} {item.status}
        </button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose(null)}>
          <MenuItem onClick={() => handleClose('Waiting')}>Waiting</MenuItem>
          <MenuItem onClick={() => handleClose('Patient In')}>Patient In</MenuItem>
          <MenuItem onClick={() => handleClose('Patient Out')}>Patient Out</MenuItem>
        </Menu>
      </>
    );
  };
  const calculateTimeDifference = (formFillingTime, patientInTime) => {
    if (!formFillingTime || !patientInTime) return 'N/A';

    // Function to convert "hh:mm AM/PM" format to a Date object (same date)
    const convertToTime = (timeString) => {
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) hours += 12; // Convert PM to 24-hour format
      if (modifier === 'AM' && hours === 12) hours = 0; // Convert 12 AM to 0

      const date = new Date();
      date.setHours(hours, minutes, 0, 0); // Set extracted time on the same date
      return date;
    };

    // Convert both times to Date objects
    const startTime = convertToTime(formFillingTime);
    const endTime = convertToTime(patientInTime);

    // Calculate difference in milliseconds
    const diffMs = endTime - startTime;

    // Convert to total minutes
    const diffMinutes = Math.abs(Math.round(diffMs / 60000));

    // Convert minutes into hours and remaining minutes
    const hoursDiff = Math.floor(diffMinutes / 60);
    const minutesDiff = diffMinutes % 60;

    // Format the output correctly
    if (hoursDiff === 0) {
      return `${minutesDiff} min`;
    } else if (minutesDiff === 0) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''}`;
    } else {
      return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ${minutesDiff} min`;
    }
  };
  const columns = [
    'SN',
    'Patient Name',
    'Mobile No',
    'UHID',
    'Department',
    'Consultant',
    'Registration ID',
    'Category',

    'Payment Status',
    'Patient Status',
    'Action',
    'Requests',
    'OPD Waiting Time'
  ];
  const finalData =
    showData &&
    showData.map((item, ind) => ({
      SN: ind + 1,
      'Patient Name': (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <strong>
            {item.prefix} {item?.patientFirstName} {item.patientLastName}
          </strong>
        </div>
      ),
      'Mobile No': item?.mobile_no,

      UHID: item.uhid,
      'Registration ID':
        item.formType === 'OPD'
          ? item.opd_regNo
          : item.formType === 'Walkin'
            ? item.walkin_regNo
            : item.formType === 'Daycare'
              ? item.daycare_regNo
              : item.formType === 'IPD'
                ? item.ipd_regNo
                : item.formType === 'Emergency'
                  ? item.emr_regNo
                  : null,
      'Aadhar No': item.aadhar_no,
      'Abha No': item.abha_no,
      Department: item.departmentName,
      Consultant: item?.consultantName,
      Category: item?.payeeCategory,
      'Payment Status': (
        <div style={{ textAlign: 'center', fontWeight: '600' }}>
          {item.billingStatus === 'Non_Paid' ? (
            <div style={{ backgroundColor: '#FFC107', color: '#212121', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>
              Unpaid
            </div>
          ) : item.billingStatus === 'Paid' ? (
            <div style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>
              Paid
            </div>
          ) : (
            <div style={{ backgroundColor: '#F44336', color: '#fff', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>Due</div>
          )}
        </div>
      ),
      'Patient Status': getStatusBadge(item),
      Action: (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {/* Add Bill Receipt Button */}
            <Tooltip title="Add Bill / Receipt" placement="top">
              <IconButton
                onClick={() => {
                  const billTypes = ['corporate private', 'corporate public', 'insurance', 'government scheme'].includes(
                    item?.payeeCategory?.toLowerCase()?.trim()
                  )
                    ? 'Credit'
                    : item?.payeeCategory?.toLowerCase()?.trim() === 'cash'
                      ? 'Cash'
                      : 'Other'; // Default case if no match
                  const billType = item?.billType || {};
                  setIsBillingOpen(true);
                  dispatch(setOpenBillingModal());
                  dispatch(setBillingInfo({ ...item }));
                  if (billType) {
                    dispatch(setBillType(billType));
                  } else {
                    dispatch(setBillType(billTypes));
                  }
                }}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <Add />
                <Receipt />
              </IconButton>
            </Tooltip>

            {/* View Bill Button */}
            <Tooltip title="View Bill" placement="top">
              <IconButton
                onClick={() => handleViewBill(item)}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <ReceiptLong />
              </IconButton>
            </Tooltip>

            {/* View Receipt Button */}
            <Tooltip title="View Receipt" placement="top">
              <IconButton
                onClick={() => handleViewReceipts(item)}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <Receipt />
              </IconButton>
            </Tooltip>

            {/* Edit Button with Green Color */}
            <Tooltip title="Edit" placement="top">
              <IconButton
                onClick={() => handleEdit(item)}
                sx={{
                  backgroundColor: 'success.main', // Green background color
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'success.dark' } // Darker green on hover
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </div>
        </>
      ),
      Requests: (
        <Tooltip title="View  Requests" placement="top">
          <Badge
            color="error"
            variant="dot"
            overlap="circular"
            invisible={!Object.values(item?.requests || {}).some((val) => !!val)}
            sx={{
              '& .MuiBadge-dot': {
                width: 18, // Increase dot size
                height: 18, // Increase dot size
                backgroundColor: 'red', // Optional: Customize dot color
                animation: 'blinker 1s linear infinite',
                borderRadius: 5
              },
              '& .MuiBadge-badge': {
                animation: 'blinker 1s linear infinite',
                '@keyframes blinker': {
                  '50%': { opacity: 0 }
                }
              }
            }}
          >
            <IconButton
              onClick={() => handleOpenDialog(item)}
              sx={{
                backgroundColor: 'info.dark',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'info.dark' }
              }}
            >
              <Visibility />
            </IconButton>
          </Badge>
        </Tooltip>
      ),
      'OPD Waiting Time': calculateTimeDifference(item?.formFillingTime, item?.patientInTime)
    }));

  return (
    <>
      <Breadcrumb
        title={
          <Typography
            variant="subtitle2"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              padding: '10px 16px', // Increased padding for better width
              borderRadius: '6px',
              display: 'inline-block',
              fontSize: '1.3rem', // Increased font size
              minWidth: '190px', // Ensures the button has a minimum width
              textAlign: 'center', // Centers the text inside
              cursor: 'pointer'
              // '&:hover': {
              //   backgroundColor: 'primary.dark',
              // },
            }}
          >
            {patientType} Registration
          </Typography>
        }
      >
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Confirm Patient
        </Typography>
      </Breadcrumb>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <Button variant="contained" onClick={() => nagivate(-1)}>
                Back
              </Button>

              {/* <FormControl>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    alignItems: 'center',
                    marginLeft: '2rem'
                  }}
                >
                  <FormLabel style={{ marginRight: '6px' }}>
                    <strong>Registration Type:</strong>
                  </FormLabel>
                  <RadioGroup row name='formType' value={patientType} onChange={e => setPatientType(e.target.value)}>
                    <FormControlLabel value='OPD' control={<Radio size='medium' />} label='OPD' />
                    <FormControlLabel disabled value='Walkin' control={<Radio size='medium' />} label='Walkin' />
                    <FormControlLabel disabled value='Daycare' control={<Radio size='medium' />} label='Daycare' />
                    <FormControlLabel disabled value='Emergency' control={<Radio size='medium' />} label='Emergency' />
                    <FormControlLabel disabled value='IPD' control={<Radio size='medium' />} label='IPD' />
                  </RadioGroup>
                </div>
              </FormControl> */}
            </div>
            <div>
              <input
                style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
                className="search_input"
                type="search"
                placeholder="Search..."
                onChange={filterData}
              />
            </div>
          </div>

          {loader ? (
            <Loader />
          ) : showData && showData.length === 0 ? (
            <NoDataPlaceholder />
          ) : (
            <DataTable columns={columns} data={finalData} bgColor="#126078" />
          )}

          <Modal open={openRegistrationModal} onClose={closeRegistration}>
            <EditConfirmAppointment close={closeRegistration} patientDetail={editData} getData={getData} />
          </Modal>

          <Modal open={opdBillingModal}>
            <OPDBilling
            // close={() => setIsBillingOpen(false)}
            //  billingData={billingData}
            //  getFreshAppointmentAfterConfirmAppoinment={fetchAppointmentsAfterBilling}
            />
          </Modal>

          {/* {isBillingOpen&&  <OPDBilling close={() => setIsBillingOpen(false)} />} */}

          <Dialog open={openViewBillModal} maxWidth="lg" fullWidth>
            <BillReciept close={handleClosViewBillModal} />
          </Dialog>

          <Dialog open={openViewReceiptsModal} onClose={() => handleCloseViewReceiptsModal()} maxWidth="lg" fullWidth>
            <ViewAllReceiptsOfPatient opdPatientInformation={opdPatientData} close={handleCloseViewReceiptsModal} />
          </Dialog>
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Tests</DialogTitle>
            <DialogContent dividers>
              {selectedRequestData ? <AddRequestList requests={selectedRequestData || {}} /> : <Typography>Loading...</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary" variant="outlined">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

export default ConfirmPatient;

import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, List, Typography, Grid, Button, Stack, Grow, MenuItem, Menu } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'; // C
import ReusableButton from 'component/buttons/Button';
import Cards from '../components/Card';
import { data, userData } from '../data';
import { CheckCircle, FollowTheSigns, Home, LocalHospital, ManageHistory } from '@mui/icons-material';
import { FaDiagnoses, FaPrescription, FaUserCircle } from 'react-icons/fa';
import { MdOutlineMonitorHeart } from 'react-icons/md';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UserDetail from '../components/UserDetail';
import MedicalPrescription from 'views/OPD/PatientClinicalScreen/MedicalPrescription/MedicalPrescription';
import ProvisionalDiagnosis from 'views/OPD/PatientClinicalScreen/ProvisionalDiagnosis/ProvisionalDiagnosis';
import FinalDiagnosis from 'views/OPD/PatientClinicalScreen/FinalDiagnosis/FinalDiagnosis';
import Examination from 'views/OPD/PatientClinicalScreen/Examination/Examination';
import ChiefComplaint from 'views/OPD/PatientClinicalScreen/ChiefComplaint/ChiefComplaint';
import VitalMaster from 'views/master/vital-master';
import History from 'views/OPD/PatientClinicalScreen/History/History';
import Orders from 'views/OPD/PatientClinicalScreen/Orders/Orders';
import FollowUp from 'views/OPD/PatientClinicalScreen/FollowUp/FollowUp';
import { useDispatch, useSelector } from 'react-redux';
import Print from 'views/OPD/PatientClinicalScreen/Print/Print';

import Modal from '@mui/material/Modal';
import { put } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import { selectPatient } from 'store/patientSlice';
import { useUpdatePatientStatusMutation } from 'services/endpoints/OPDPatient/opdPatientApi';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const OPDQueueHeader = () => {
  const [value, setValue] = React.useState(0);
  const STATUS = 'Patient Out';
  const departmentId = localStorage.getItem('departmentId') || '';
  const patient = useSelector((state) => state.patient.selectedPatient);
  const [updateStatus, { isLoading, isSuccess }] = useUpdatePatientStatusMutation();
  const dispatch = useDispatch();
  const [printType, setPrintType] = useState('');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
const {authorize,SystemRightData,userId} = useSelector((state) => state.auth);
console.log("SystemRightData---------from redux store--", SystemRightData,userId);
console.log("authorize-----------", authorize);


  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeStatus = async () => {
    try {
      const isPatientIn = patient?.status?.toLowerCase()?.trim() === 'patient in';
      const payload = {
        date: patient?.date,
        time: patient?.time,
        consultantId: patient?.consultantId
      };
      if (isPatientIn) {
        // const res = await put(`opd-patient/update-patient-status/${patient._id}`, { status: STATUS });
        const { data } = await updateStatus(patient._id);
        await put(`opd-patient/update-slot`, payload);
        if (data?.data) {
          toast.success(`Status updated successfully!`);
          dispatch(selectPatient(data?.data || {}));
        } else {
          toast.warning('Could not update status. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again later.');
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const printBtnOpn = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePrint = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    setAnchorEl(null);

    if (option === 'withHistory') {
      setPrintType('history');

      handleOpen();
    } else if (option === 'onlyPrescription') {
      // 👉 Handle Save & Print with only medical prescription
      setPrintType('medical prescription');
      handleOpen();
    }
  };

  const allTabs = [
    { label: 'Vitals', icon: <MdOutlineMonitorHeart />, key: 'vital' },
    { label: 'Chief Complaints', icon: <ManageHistory />, key: 'chief-complaint' },
    { label: 'Medical History', icon: <ManageHistory />, key: 'medical-history' },
    { label: 'Examinations', icon: <ManageHistory />, key: 'examination' },
    { label: 'Medical Prescription', icon: <FaPrescription />, key: 'medical-prescription' },
    { label: 'Provisional Diagnosis', icon: <FaDiagnoses />, key: 'provisional-diagnosis' },
    { label: 'Final Diagnosis', icon: <CheckCircle />, key: 'final-diagnosis' },
    { label: 'Orders', icon: <LocalHospital />, key: 'Orders' },
    { label: 'Follow', icon: <FollowTheSigns />, key: 'Follow' },
    { label: 'All', icon: <FollowTheSigns />, key: 'All' }
  ];
  const filteredTabs = allTabs.filter(
    (tab) => SystemRightData?.authorizedIds?.[tab.key] === true
  );
  
  

  console.log("filteredTabs", filteredTabs);


  return (  
    <>
      <Box sx={{ padding: 3 }}>
        {/* Section for Cards and Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          {/* Cards */}
          {/* <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {data.map(({ title, total }) => (
              // <Cards key={title} total={total} title={title} />
            ))}
          </Box> */}

          {/* Buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <ReusableButton text="OPD" />
            <ReusableButton text="IPD" />
            <ReusableButton text="Emrgency" />
          </Box>
            {patient?.status?.toLowerCase()?.trim() === 'patient in' && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="h4"
              sx={{
                bgcolor: patient ? 'green' : 'transparent',
                color: patient ? 'white' : 'inherit',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: 2,
                display: 'inline-block' // Prevents full-width issue
              }}
            >
              Patient In
            </Typography>
          </Box>
        )}
        </Box>

       

        <Box sx={{ marginTop: '1.5rem' }}>
          <UserDetail userData={userData} />
        </Box>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mr={4}>
          {/* Save Button */}
          <Button
            sx={{ backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2e7d32' } }}
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleChangeStatus}
          >
            Save
          </Button>

          {/* Save & Print Button */}
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68900' } }}
            startIcon={<SaveIcon />}
            onClick={handleClick}
          >
            Save & Print
          </Button>
          <Menu anchorEl={anchorEl} open={printBtnOpn} onClose={handleClosePrint}>
            <MenuItem onClick={() => handleOptionClick('withHistory')}>With History</MenuItem>
            <MenuItem onClick={() => handleOptionClick('onlyPrescription')}>Only Medical Prescription</MenuItem>
          </Menu>

          {/* Print Preview Button */}
          <Button
            variant="contained"
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
            startIcon={<VisibilityIcon />}
          >
            Print Preview
          </Button>
        </Stack>
        {/* Tabs Section */}
        <Box sx={{ marginTop: 4 }}>
          <Box
            sx={{
              backgroundColor: '#f5f5f5', // Light background
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Soft elevation
              borderRadius: '16px', // Rounded corners for a smooth look
              padding: 2, // Inner padding
              marginBottom: 3, // Space below the tabs
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="simple tabs example"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  color: 'black',
                  transition: 'all 0.3s ease-in-out'
                },
                '& .Mui-selected': {
                  backgroundColor: '#126078', // Active tab background
                  color: 'white !important',
                  borderRadius: '12px', // Better shape
                  paddingX: 2,
                  fontWeight: 'bold'
                },
                '& .MuiTab-root.Mui-selected svg': {
                  color: 'white'
                }
              }}
            >
             {filteredTabs.map((tab, index) => (
          <Tab key={tab.key} label={tab.label} icon={tab.icon} {...a11yProps(index)} />
        ))}
              {/* <Tab label="Print" icon={<FollowTheSigns />} {...a11yProps(10)} onClick={() => handleOpen()} /> */}
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <VitalMaster userData={userData} editData={{ departmentId: { _id: departmentId } }} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ChiefComplaint editData={{ departmentId: { _id: departmentId } }} isEmr={true} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <History editData={{ departmentId: { _id: departmentId } }} isEmr={true} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Examination editData={{ departmentId: { _id: departmentId } }} isEmr={true} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <Box m={2}>
              <MedicalPrescription editData={{ departmentId: { _id: departmentId } }} />
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <ProvisionalDiagnosis editData={{ departmentId: { _id: departmentId } }} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            <FinalDiagnosis editData={{ departmentId: { _id: departmentId } }} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <Box mt={2}>
              <Orders editData={{ departmentId: { _id: departmentId } }} />
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={8}>
            <Box mt={2}>
              <FollowUp editData={{ departmentId: { _id: departmentId } }} />
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={9}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <VitalMaster userData={userData} editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <ChiefComplaint editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <History editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Examination editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <MedicalPrescription editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <ProvisionalDiagnosis editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <FinalDiagnosis editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Orders editData={{ departmentId: { _id: departmentId } }} />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <FollowUp editData={{ departmentId: { _id: departmentId } }} />
              </Box>
            </Box>
          </CustomTabPanel>

          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', // Adjust the width as needed
                maxWidth: '100%', // Maximum width
                bgcolor: 'background.paper',

                p: 4,
                borderRadius: 0,
                maxHeight: '90vh', // Maximum height
                overflowY: 'auto' // Enable scrolling if content overflows
              }}
            >
              {/* Close button */}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'text.secondary'
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Print component */}
              <Print printType={printType} />
            </Box>
          </Modal>
        </Box>
      </Box>

      <ToastContainer />
    </>
  );
};

export default OPDQueueHeader;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { Close } from '@mui/icons-material';
import { get, put } from 'api/api';
import ComplaintsForm from '../../../OPD/PatientClinicalScreen/ChiefComplaint/ChiefComplaint';
import MedicalHistoryForm from '../../../OPD/PatientClinicalScreen/History/History';
import ExaminationsForm from '../../../OPD/PatientClinicalScreen/Examination/Examination';
import MedicalPrescriptionForm from '../../../OPD/PatientClinicalScreen/MedicalPrescription/MedicalPrescription';
import ProvisionalDiagnosisForm from '../../../OPD/PatientClinicalScreen/ProvisionalDiagnosis/ProvisionalDiagnosis';
import FinalDiagnosisForm from '../../../OPD/PatientClinicalScreen/FinalDiagnosis/FinalDiagnosis';
import FollowForm from '../../../OPD/PatientClinicalScreen/FollowUp/FollowUp';
import VitalMaster from 'views/master/vital-master';
import Orders from 'views/OPD/PatientClinicalScreen/Orders/Orders';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const a11yProps = (index) => ({
  id: `vertical-tab-${index}`,
  'aria-controls': `vertical-tabpanel-${index}`
});

const EditSetup = ({ close, getData, editData, isDrProfile }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Vitals', component: VitalMaster },
    { label: 'Chief Complaints', component: ComplaintsForm },
    { label: 'Medical History', component: MedicalHistoryForm },
    { label: 'Examinations', component: ExaminationsForm },
    { label: 'Medical Prescription', component: MedicalPrescriptionForm },
    { label: 'Provisional Diagnosis', component: ProvisionalDiagnosisForm },
    { label: 'Final Diagnosis', component: FinalDiagnosisForm },
    { label: 'Orders', component: Orders },
    { label: 'Follow', component: FollowForm }
  ];

  return (
    <Box
      sx={{
        padding: '2rem',
        borderRadius: '10px',
        margin: 'auto',
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        Update Form Setup for <span style={{ color: 'red' }}>{editData.department}</span>
      </Typography>

      {/* Close Button */}
      <Close
        onClick={close}
        sx={{
          background: 'red',
          color: '#fff',
          cursor: 'pointer',
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontSize: '1.8rem',
          padding: '5px',
          borderRadius: '50%',
          transition: 'all 0.3s ease-in-out',
          '&:hover': { background: '#b71c1c' }
        }}
      />

      {/* Content Box */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 3,
          overflow: 'hidden',
          minHeight: '80vh'
        }}
      >
        {/* Tabs Section */}
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            width: 280,
            minWidth: 280, // Ensures the width remains fixed
            flexShrink: 0, // Prevents shrinking when content grows
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px 0 0 8px'
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              {...a11yProps(index)}
              sx={{
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: '#333',
                '&.Mui-selected': { color: '#d32f2f' }
              }}
            />
          ))}
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {tabs.map((tab, index) => {
            const Component = tab.component;
            return (
              <TabPanel key={index} value={value} index={index}>
                <Component editData={editData} selectedMenu={tab.label} isDrProfile={isDrProfile} />
              </TabPanel>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

EditSetup.propTypes = {
  close: PropTypes.func.isRequired,
  getData: PropTypes.shape({
    department: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  }).isRequired,
  editData: PropTypes.shape({
    department: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
};

export default EditSetup;

import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Divider } from '@mui/material';
import Diagnostics from '../OtherDiagnostics/OtherDiganostics';
import Radiology from '../RadioLogy/RadioLogy';
import Pathology from '../Pathology/Pathology';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Investigation = ({ editData }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', mt: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            '.MuiTabs-indicator': {
              backgroundColor: '#1976d2'
            }
          }}
        >
          <Tab label="Radiology" sx={{ backgroundColor: value === 0 ? '#e3f2fd' : 'inherit' }} />
          <Tab label="Pathology" sx={{ backgroundColor: value === 1 ? '#e3f2fd' : 'inherit' }} />
          <Tab label="Other Diagnostics" sx={{ backgroundColor: value === 2 ? '#e3f2fd' : 'inherit' }} />
        </Tabs>
        <Divider sx={{ my: 3 }} />
        <TabPanel value={value} index={0}>
          <Radiology editData={editData} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Pathology editData={editData} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Diagnostics editData={editData} />
        </TabPanel>
      </Box>
    </>
  );
};

export default Investigation;

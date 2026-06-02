import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { put } from 'api/api';
import { toast } from 'react-toastify';

const LabRadiologyDisplay = ({ data, onDelete }) => {
  if (!data || data.length === 0) return <Typography>No Data Available</Typography>;

  // Extract Radiology and Pathology separately
  const radiologyTests = [];
  const pathologyTests = [];

  data.forEach((item) => {
    item.labRadiology.forEach((test) => {
      if (test.selectedFor.toLowerCase() === 'radiology') {
        radiologyTests.push({ ...test, parentId: item._id });
      } else if (test.selectedFor.toLowerCase() === 'pathology') {
        pathologyTests.push({ ...test, parentId: item._id });
      }
    });
  });

  const handleDelete = async (testId, parentId) => {
    onDelete(testId, parentId);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white'
      }}
    >
      {/* Radiology Section */}
      {radiologyTests.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: 'blue' }}>
            Radiology Tests
          </Typography>
          <List>
            {radiologyTests.map((test) => (
              <ListItem key={test._id} sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemText primary={test.testName} />
                <IconButton onClick={() => handleDelete(test._id, test.parentId)}>
                  <ClearIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Pathology Section */}
      {pathologyTests.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: 'green' }}>
            Pathology Tests
          </Typography>
          <List>
            {pathologyTests.map((test) => (
              <ListItem key={test._id} sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemText primary={test.testName} />
                <IconButton onClick={() => handleDelete(test._id, test.parentId)}>
                  <ClearIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default LabRadiologyDisplay;

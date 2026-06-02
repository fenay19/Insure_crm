import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import { Add, Receipt } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setBillType, setOpenBillingModal } from 'reduxSlices/opdBillingStates';
import { setBillingInfo } from 'reduxSlices/opdBillingSlice';
import OPDBilling from 'component/billing/OPDBilling';

const Section = ({ title, items, getItemText, sectionNumber, onAddClick, onReceiptClick }) => {
  if (!items?.length) return null;

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {sectionNumber}. {title}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          {items.map((item, idx) => (
            <ListItem key={item._id || idx}>
              <ListItemText primary={getItemText(item)} />

              <IconButton onClick={() => onReceiptClick(item, title)}>
                <Add sx={{ mr: 1 }} />
                <Receipt />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const AddRequestList = ({ requests }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    isReceipt: false,
    selectedItem: null,
    selectedRequest: null,
    title: ''
  });
  const dispatch = useDispatch();
  const handleOpenDialog = (item, title, isReceipt) => {
    console.log('title');
    setDialogState({
      open: false,
      isReceipt,
      selectedItem: item,
      selectedRequest: requests,
      title: `${isReceipt ? 'Receipt' : 'Add Item'} - ${title}`
    });
    const isCash = item?.payeeCategory?.toLowerCase()?.trim() === 'cash';
    dispatch(setOpenBillingModal());
    dispatch(setBillingInfo({ ...requests, selectedTest: { ...item, title } }));
    dispatch(setBillType(isCash ? 'Cash' : 'Credit'));
  };

  console.log("requests?.requests?.crossConsultant?.consultant",requests?.requests?.crossConsultant?.consultant)
  const sectionData = [
    {
      title: 'Radiology Tests',
      items: requests?.requests?.radiology?.radiology,
      getItemText: (item) => item.testName
    },
    {
      title: 'Pathology Tests',
      items: requests?.requests?.pathology?.pathology,
      getItemText: (item) => item.testName
    },
    {
      title: 'Other Diagnostics',
      items: requests?.requests?.otherDiagnostics?.diagnostics,
      getItemText: (item) => item.testName
    },
    {
      title: 'Procedures',
      items: requests?.requests?.procedure?.procedure,
      getItemText: (item) => item.procedureName
    },
    {
      title: 'Cross Consultant',
      items: requests?.requests?.crossConsultant?.consultant,
      getItemText: (item) => {
        const { firstName = '', lastName = '' } = item?.basicDetails || {};
        return `${firstName} ${lastName}`.trim() || 'Unknown';
      }
    }
  ];

  return (
    <div>
      {sectionData.map((section, idx) => (
        <Section
          key={section.title}
          sectionNumber={idx + 1}
          title={section.title}
          items={section.items}
          getItemText={section.getItemText}
          onAddClick={(item, title) => handleOpenDialog(item, title, false)}
          onReceiptClick={(item, title) => handleOpenDialog(item, title, true)}
        />
      ))}
    </div>
  );
};

export default AddRequestList;

import React from 'react';
import { Container, Paper, Typography, Box, List, ListItem, Divider } from '@mui/material';

const RefundNote = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          p: 4,
          overflow: 'hidden', // Prevents content from breaking across pages
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 2
        }}
      >
        {/* Header */}
        <Typography variant="h5" fontWeight="bold">
          [Hospital Name]
        </Typography>
        <Typography>[Hospital Address]</Typography>
        <Typography>[City, State, ZIP Code]</Typography>
        <Typography>[Phone Number]</Typography>

        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Date: [Insert Date]</Typography>

        {/* Refund Details */}
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          Cash Refund Note
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography>
            <strong>Patient Name:</strong> [Full Name]
          </Typography>
          <Typography>
            <strong>Patient ID/Admission Number:</strong> [Patient ID Number]
          </Typography>
          <Typography>
            <strong>Date of Birth:</strong> [DOB]
          </Typography>
          <Typography>
            <strong>Receipt/Transaction Number:</strong> [Receipt/Transaction Number]
          </Typography>
        </Box>

        <Typography sx={{ mt: 3 }}>
          Dear <strong>[Patient's Name]</strong>,
        </Typography>
        <Typography sx={{ mt: 1 }}>
          This is to acknowledge that a cash refund of <strong>[Refund Amount]</strong> has been issued to you in relation to the
          overpayment made for your treatment at <strong>[Hospital Name]</strong>.
        </Typography>

        {/* Refund Breakdown */}
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          Details of Refund:
        </Typography>

        <List>
          <ListItem>
            <strong>Amount Paid:</strong> [Amount Paid]
          </ListItem>
          <ListItem>
            <strong>Refund Amount:</strong> [Refund Amount]
          </ListItem>
          <ListItem>
            <strong>Refund Date:</strong> [Refund Date]
          </ListItem>
          <ListItem>
            <strong>Reason for Refund:</strong> [Reason for Refund, such as overpayment, duplicate payment, etc.]
          </ListItem>
          <ListItem>
            <strong>Payment Method for Refund:</strong> [e.g., Cash, Bank Transfer, etc.]
          </ListItem>
        </List>

        <Typography sx={{ mt: 3 }}>
          Thank you for choosing <strong>[Hospital Name]</strong>.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Footer */}
        <Typography>Sincerely,</Typography>
        <Typography>
          <strong>[Billing Officer's Name]</strong>
        </Typography>
        <Typography>[Title]</Typography>
        <Typography>[Contact Information]</Typography>
      </Box>
    </Container>
  );
};

export default RefundNote;

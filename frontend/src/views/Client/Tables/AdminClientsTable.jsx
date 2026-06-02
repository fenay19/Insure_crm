import React, { useEffect } from 'react';
import { Card, CardContent, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton } from '@mui/material';
import { Edit, Delete, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { get, post, put, remove } from '../../../api/api';
import { toast } from 'react-toastify';

const AdminClientsTable = ({ clientList, refreshClients, handleEditClient, handleDeleteClient }) => {
  const navigate = useNavigate();
  console.log(clientList);

  return (
    <Card>
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Grid container spacing={2} sx={{ minWidth: '800px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Contact No</TableCell>
                  <TableCell>Email</TableCell>
                  {/* <TableCell>License Valid</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientList?.map((entry, index) => (
                  <TableRow key={entry._id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.clientName}</TableCell>
                    <TableCell>{entry.contactPerson?.[0]?.name || 'N/A'}</TableCell>
                    <TableCell>{entry.officialPhoneNo}</TableCell>
                    <TableCell>{entry.officialMailId}</TableCell>
                    {/* <TableCell>
                      {entry?.endDate
                        ? new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }).format(new Date(entry.endDate))
                        : 'N/A'}
                    </TableCell> */}
                    <TableCell sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                      {/* Edit Button */}
                      <IconButton
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          if (localStorage.getItem('expired') === 'true') {
                            toast.error('Subscription has ended. Please subscribe to continue working.');
                            return;
                          }
                          handleEditClient(entry);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>

                      {/* Delete Button */}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (localStorage.getItem('expired') === 'true') {
                            toast.error('Subscription has ended. Please subscribe to continue working.');
                            return;
                          }
                          handleDeleteClient(entry._id);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminClientsTable;

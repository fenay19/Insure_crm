import React from 'react';
import { Card, CardContent, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { get, post, put, remove } from '../../../api/api';
import { toast } from 'react-toastify';
const PermanentClientTable = ({ clientList, refreshClients, clientPermission, isAdmin }) => {
  const navigate = useNavigate();
  clientList = clientList.filter((client) => client?.clientType?.typeOfClient === 'Permanent');
  const handleDeleteClient = async (id) => {
    try {
      const role = localStorage.getItem('loginRole');
      if (role === 'super-admin') {
        await remove(`clientRegistration/${id}`);
        toast.success('Client deleted!');
        refreshClients();
      } else if (role === 'admin') {
        await remove(`admin-clientRegistration/${id}`);
        toast.success('Client deleted!');
        refreshClients();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };
  // console.log(clientList);
  return (
    <Card>
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Box></Box>
          <Grid container spacing={2} sx={{ minWidth: '800px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Contact No</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>License Valid</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientList.map((entry, index) => (
                  <TableRow key={entry._id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.clientName}</TableCell>
                    <TableCell>{entry.contactPerson[0].name || 'N/A'}</TableCell>
                    <TableCell>{entry.officialPhoneNo}</TableCell>
                    <TableCell>{entry.officialMailId}</TableCell>
                    <TableCell>
                      {entry.endDate
                        ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
                            new Date(entry.endDate)
                          )
                        : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ display: 'flex', flexDirection: 'row' }}>
                      {(clientPermission.Edit === true || isAdmin || localStorage.getItem('loginRole') === 'super-admin') && (
                        <Button
                          size="small"
                          sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                          onClick={() => navigate(`/client/editClient/${entry._id}`)}
                        >
                          <IconButton color="inherit">
                            <Edit />
                          </IconButton>
                        </Button>
                      )}
                      {(clientPermission.Delete === true || isAdmin || localStorage.getItem('loginRole') === 'super-admin') && (
                        <Button
                          color="error"
                          sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
                          onClick={() => handleDeleteClient(entry._id)}
                        >
                          <IconButton color="inherit">
                            <Delete />
                          </IconButton>
                        </Button>
                      )}
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
export default PermanentClientTable;

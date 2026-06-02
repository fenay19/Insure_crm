import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Box 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { ToastContainer } from 'react-toastify';

import { Edit, Delete } from '@mui/icons-material';

const Staff = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dummy data for now
  const rows = [
    { id: 1, name: 'John Doe', number: '1234567890', city: 'New York' },
    { id: 2, name: 'Jane Smith', number: '9876543210', city: 'Chicago' },
    { id: 3, name: 'Alice Johnson', number: '5556667777', city: 'Los Angeles' },
    { id: 4, name: 'Bob Williams', number: '9998887777', city: 'Houston' },
    { id: 5, name: 'Charlie Brown', number: '4443332222', city: 'Phoenix' },
    { id: 6, name: 'David Miller', number: '1112223333', city: 'Miami' }
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Breadcrumb title="Staff Details">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Staff Details
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Divider />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Staff List
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/hr/AddStaff">
                <AddIcon /> Add Staff
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow sx={{verticalAlign: 'top'}}>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Number</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow sx={{verticalAlign: 'top'}} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.number}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            component={Link} to={`/hr/EditStaff/${row.id}`}
                            startIcon={<Edit />}
                            sx={{ minWidth: '32px', height: '32px' }}
                          />

                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            sx={{ minWidth: '32px', height: '32px' }}
                          />

                           
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ToastContainer />
    </>
  );
};

export default Staff;

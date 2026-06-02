import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Divider,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  TablePagination,
  Paper,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { get } from '../../api/api';
import CustomerHistoryModal from './CustomerHistoryModal';

const Customer = () => {
  const navigate = useNavigate();
  const [clientList, setClientList] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all'); // 'all' | 'corporate' | 'retail'

  // Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page on search
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Customer type filter handler
  const handleTypeFilter = (event, newFilter) => {
    if (newFilter !== null) {
      setCustomerTypeFilter(newFilter);
      setPage(0);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term and customer type
  const filteredData = useMemo(() => {
    let data = clientList || [];

    // Apply customer type filter
    if (customerTypeFilter !== 'all') {
      data = data.filter(
        (entry) => entry.customerType?.toLowerCase() === customerTypeFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      data = data.filter(
        (entry) =>
          entry.name?.toLowerCase().includes(lowerSearch) ||
          entry.email?.toLowerCase().includes(lowerSearch) ||
          entry.customerId?.toLowerCase().includes(lowerSearch) ||
          entry.customerGroupName?.toLowerCase().includes(lowerSearch) ||
          entry.mobile?.includes(lowerSearch) ||
          entry.customerType?.toLowerCase().includes(lowerSearch)
      );
    }

    return data;
  }, [clientList, searchTerm, customerTypeFilter]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Calculate correct serial number across pages
  const displayedIndex = (rowIndex) => {
    return page * rowsPerPage + rowIndex + 1;
  };

  const fetchClients = async () => {
    try {
      const role = localStorage.getItem('loginRole');
      let url = role === 'super-admin' ? 'clientRegistration' : 'customerRegistration';
      const res = await get(url);
      if (res.status) {
        setClientList(res.data);
        console.log('Client List set:', clientList);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Customer
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Customer Details</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                navigate('/addCustomer');
              }}
            >
              Add Customer
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Paper sx={{ overflow: 'hidden' }}>
            {/* Search & Filter Row */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Customer Type Toggle */}
              <ToggleButtonGroup
                value={customerTypeFilter}
                exclusive
                onChange={handleTypeFilter}
                size="small"
                sx={{ flexShrink: 0 }}
              >
                <ToggleButton value="all" sx={{ px: 2, fontWeight: 600, textTransform: 'none' }}>
                  All
                  {clientList.length > 0 && (
                    <Chip label={clientList.length} size="small" sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }} />
                  )}
                </ToggleButton>
                <ToggleButton value="corporate" sx={{ px: 2, fontWeight: 600, textTransform: 'none', color: customerTypeFilter === 'corporate' ? 'primary.main' : 'inherit' }}>
                  Corporate
                  {clientList.length > 0 && (
                    <Chip
                      label={clientList.filter(e => e.customerType?.toLowerCase() === 'corporate').length}
                      size="small"
                      color={customerTypeFilter === 'corporate' ? 'primary' : 'default'}
                      sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }}
                    />
                  )}
                </ToggleButton>
                <ToggleButton value="retail" sx={{ px: 2, fontWeight: 600, textTransform: 'none' }}>
                  Retail
                  {clientList.length > 0 && (
                    <Chip
                      label={clientList.filter(e => e.customerType?.toLowerCase() === 'retail').length}
                      size="small"
                      color={customerTypeFilter === 'retail' ? 'primary' : 'default'}
                      sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }}
                    />
                  )}
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Search Field */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, email, customer ID, group, or mobile..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ flex: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch} edge="end" aria-label="clear search">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Table Container */}
            <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Customer Type</TableCell>
                    <TableCell>Customer Group Name</TableCell>
                    <TableCell sx={{ minWidth: '150px' }}>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((entry, index) => (
                    <TableRow key={entry.customerId || index} hover>
                      <TableCell>{displayedIndex(index)}</TableCell>
                      <TableCell>{entry?.customerId}</TableCell>
                      <TableCell>{entry?.customerType}</TableCell>
                      <TableCell>{entry?.customerGroupName}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          onClick={() => {
                            if (entry?.name) {
                              setSelectedCustomerName(entry.name);
                              setHistoryModalOpen(true);
                            }
                          }}
                          sx={{
                            cursor: 'pointer',
                            color: '#1976d2',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                              color: '#0d47a1',
                            },
                          }}
                        >
                          {entry?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{entry?.email}</TableCell>
                      <TableCell>{entry?.mobile}</TableCell>
                      <TableCell
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end', // Push buttons to bottom
                          alignItems: 'flex-start',
                          gap: 0.5,
                          py: 1 // Add padding for spacing
                        }}
                      >
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>

                      {/* <TableCell sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                        <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[100]}
              component="div"
              count={filteredData.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
            />
          </Paper>
        </CardContent>
      </Card>
      
      {/* Customer History Modal */}
      <CustomerHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        customerName={selectedCustomerName}
      />
    </>
  );
};

export default Customer;

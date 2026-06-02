import React, { useEffect, useState, useMemo } from 'react';
import { get } from 'api/api';
import { toast } from 'react-toastify';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const ParametricReport = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // filter states
  const [filters, setFilters] = useState({
    reference: [],
    assignTo: [],
    product: [],
    status: [],
    leadType: []
  });

  async function getLeadData() {
    try {
      const loginRole = localStorage.getItem('loginRole');
      const employeeId = localStorage.getItem('empId');

      let url = 'lead';
      if (loginRole === 'staff' && employeeId) {
        url += `/${employeeId}`;
      }

      const response = await get(url);
      const payload = response?.data?.data ?? response?.data ?? response ?? [];
      setData(Array.isArray(payload) ? payload : []);
    } catch (error) {
      toast.error('Failed to fetch lead data');
      console.error(error);
    }
  }

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  useEffect(() => {
    getLeadData();
  }, []);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const openDetails = (row) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    setSelectedRow(row);
    setOpenDialog(true);
  };
  const closeDetails = () => {
    setSelectedRow(null);
    setOpenDialog(false);
  };

  // compute unique options
  const options = useMemo(() => {
    return {
      reference: [...new Set(data.map((d) => d.reference?.LeadReference).filter(Boolean))],
      assignTo: [
        ...new Set(
          data
            .map((d) =>
              d.assignTo ? `${d.assignTo.basicDetails?.firstName || ''} ${d.assignTo.basicDetails?.lastName || ''}`.trim() : null
            )
            .filter(Boolean)
        )
      ],
      product: [...new Set(data.map((d) => d.productService?.subProductName).filter(Boolean))],
      status: [...new Set(data.map((d) => d.leadstatus?.LeadStatus).filter(Boolean))],
      leadType: [...new Set(data.map((d) => d.leadType?.LeadType).filter(Boolean))]
    };
  }, [data]);

  // filtering logic
  const filtered = data
    .filter((lead) => {
      if (search) {
        const name = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
        const product = (lead.productService?.subProductName || '').toLowerCase();
        if (!name.includes(search.toLowerCase()) && !product.includes(search.toLowerCase())) {
          return false;
        }
      }

      const checks = {
        reference: lead.reference?.LeadReference,
        assignTo: lead.assignTo
          ? `${lead.assignTo.basicDetails?.firstName || ''} ${lead.assignTo.basicDetails?.lastName || ''}`.trim()
          : null,
        product: lead.productService?.subProductName,
        status: lead.leadstatus?.LeadStatus,
        leadType: lead.leadType?.LeadType
      };

      return Object.entries(filters).every(([key, selected]) => {
        if (selected.length === 0) return true;
        return selected.includes(checks[key]);
      });
    })
    // Sort dynamically
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      let aVal = a[key];
      let bVal = b[key];

      // Handle nested fields
      if (key === 'product') {
        aVal = a.productService?.subProductName || '';
        bVal = b.productService?.subProductName || '';
      } else if (key === 'status') {
        aVal = a.leadstatus?.LeadStatus || '';
        bVal = b.leadstatus?.LeadStatus || '';
      } else if (key === 'leadType') {
        aVal = a.leadType?.LeadType || '';
        bVal = b.leadType?.LeadType || '';
      } else if (key === 'reference') {
        aVal = a.reference?.LeadReference || '';
        bVal = b.reference?.LeadReference || '';
      } else if (key === 'assignTo') {
        aVal = a.assignTo ? `${a.assignTo.basicDetails?.firstName || ''} ${a.assignTo.basicDetails?.lastName || ''}` : '';
        bVal = b.assignTo ? `${b.assignTo.basicDetails?.firstName || ''} ${b.assignTo.basicDetails?.lastName || ''}` : '';
      }

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (key === 'createdAt') {
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              {/* Title */}
              <Grid item xs={12} sm={3}>
                <Typography variant="h6">Parametric Lead Report</Typography>
              </Grid>

              {/* Filters row (Search + Dropdowns together) */}
              <Grid item xs={12} sm={9}>
                <Grid container spacing={2}>
                  {/* Search field styled like dropdown */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <TextField
                        placeholder="Search name or product"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                      />
                    </FormControl>
                  </Grid>

                  {/* Dropdown filters */}
                  {['reference', 'assignTo', 'product', 'status', 'leadType'].map((key) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{key}</InputLabel>
                        <Select
                          multiple
                          value={filters[key]}
                          onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                          input={<OutlinedInput label={key} />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {options[key].map((val) => (
                            <MenuItem key={val} value={val}>
                              <Checkbox checked={filters[key].indexOf(val) > -1} />
                              <ListItemText primary={val} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Table */}
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      { key: 'id', label: 'Id' },
                      { label: 'Action' },
                      { key: 'organization', label: 'Organization' },
                      { key: 'product', label: 'Product' },
                      { key: 'status', label: 'Status' },
                      { key: 'leadType', label: 'Lead Type' },
                      { key: 'lastCommunication', label: 'Last Communication' },
                      { key: 'followUpDate', label: 'Follow Up Date' },
                      { key: 'phoneNo', label: 'Phone Number' },
                      { key: 'city', label: 'City' },
                      { key: 'reference', label: 'Reference' },
                      { key: 'assignTo', label: 'Assign To' },
                      { key: 'createdAt', label: 'Created Date' },
                      { key: 'dayCount', label: 'Day Count' }
                    ].map((col) => (
                      <TableCell
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        sx={{
                          cursor: 'pointer',
                          userSelect: 'none',
                          fontWeight: sortConfig.key === col.key ? 'bold' : 'normal'
                        }}
                      >
                        {col.label}
                        {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginated.length > 0 ? (
                    paginated.map((lead, idx) => (
                      <TableRow key={lead._id || idx} hover>
                        <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                        <TableCell
                        // sx={{
                        //   display: 'flex',
                        //   alignItems: 'center',
                        //   justifyContent: 'center',
                        //   gap: 1
                        // }}
                        >
                          <div
                            style={{
                              display: 'flex'
                            }}
                          >
                            <Button variant="text" size="small" onClick={() => openDetails(lead)}>
                              View
                            </Button>
                            <Button variant="text" size="small" component={Link} to={`/lead-management/EditLead/${lead._id}`}>
                              Update
                            </Button>
                            <Tooltip title="hello" arrow>
                              <IconButton color="primary">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>

                        <TableCell>{lead?.Prospect?.companyName || lead?.Client?.clientName || lead?.newCompanyName || 'N/A'}</TableCell>
                        <TableCell>{lead.productService?.subProductName || 'N/A'}</TableCell>
                        <TableCell>
                          {/* <TableCell sx={{ bgcolor: lead.leadstatus?.colorCode || 'transparent', color: '#fff', borderRadius: '8px' }}> */}
                          <Box
                            sx={{
                              backgroundColor: lead.leadstatus?.colorCode || 'transparent',
                              color: '#000000',
                              padding: '4px 10px',
                              borderRadius: '10px',
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              minWidth: '80px',

                              textAlign: 'center'
                            }}
                          >
                            {lead.leadstatus?.LeadStatus || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell>{lead.leadType?.LeadType || 'N/A'}</TableCell>
                        <TableCell>{lead.lastCommunication || (lead.followups?.[0]?.comment ?? 'N/A')}</TableCell>
                        <TableCell>{lead.followups?.[0]?.followupDate ?? lead.followUpDate ?? 'N/A'}</TableCell>
                        <TableCell>{lead.phoneNo || 'N/A'}</TableCell>
                        <TableCell>{lead.city || 'N/A'}</TableCell>
                        <TableCell>{lead.reference?.LeadReference || 'N/A'}</TableCell>
                        <TableCell>
                          {lead.assignTo
                            ? `${lead.assignTo.basicDetails?.firstName || ''} ${lead.assignTo.basicDetails?.lastName || ''}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : 'N/A'}</TableCell>
                        <TableCell>
                          {lead.createdAt ? Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={closeDetails}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: 6, backgroundColor: '#fafafa' }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          Lead Details
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Email / Phone / Assigned To */}
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1 }}>{selectedRow?.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography sx={{ bgcolor: '#f3e5f5', p: 1, borderRadius: 1 }}>{selectedRow?.phoneNo}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned To
              </Typography>
              <Typography sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 1 }}>
                {selectedRow?.assignTo?.basicDetails?.firstName} {selectedRow?.assignTo?.basicDetails?.lastName}
              </Typography>
            </Grid>

            {/* Company / Product */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Company & Product
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Company
              </Typography>
              <Typography>{selectedRow?.Prospect?.companyName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Product
              </Typography>
              <Typography>{selectedRow?.productService?.productName}</Typography>
            </Grid>

            {/* Lead Info */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Lead Info
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography
                sx={{
                  bgcolor: selectedRow?.leadstatus?.colorCode || '#eeeeee',
                  color: 'white',
                  fontWeight: 'bold',
                  p: 1,
                  borderRadius: 1,
                  display: 'inline-block'
                }}
              >
                {selectedRow?.leadstatus?.LeadStatus}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Typography sx={{ bgcolor: '#ede7f6', p: 1, borderRadius: 1 }}>{selectedRow?.leadType?.LeadType}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                {`${selectedRow?.address}, ${selectedRow?.city}, ${selectedRow?.state}, ${selectedRow?.country} - ${selectedRow?.pincode}`}
              </Typography>
            </Grid>

            {/* Contacts */}
            {selectedRow?.contact?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Contacts
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Table
                  size="small"
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '& td, & th': { border: '1px solid #eee' }
                  }}
                >
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRow?.contact.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}

            {/* Followups */}
            {selectedRow?.followups?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Followups
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Table
                  size="small"
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '& td, & th': { border: '1px solid #eee' }
                  }}
                >
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRow?.followups.map((f) => (
                      <TableRow key={f._id}>
                        <TableCell>{f.followupDate}</TableCell>
                        <TableCell>{f.followupTime}</TableCell>
                        <TableCell>{f.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
          <Button onClick={closeDetails} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ParametricReport;

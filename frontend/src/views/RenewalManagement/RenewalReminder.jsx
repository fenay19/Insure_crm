import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  TableContainer,
  Paper,
  Tooltip,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBack from '@mui/icons-material/ArrowBack';
import REACT_APP_API_URL, { get, post } from '../../api/api';
// import  { get, post, put, remove } from '../../api/api';
import axios from 'axios';

const now = new Date();
const initialState = {
  month: now,
  filterBy: '',
  dateFrom: new Date(now.getFullYear(), now.getMonth(), 1),
  dateTo: new Date(now.getFullYear(), now.getMonth() + 1, 0)
};

const RenewalReminder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);
  const [dateFrom, setDateFrom] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [dateTo, setDateTo] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [insCompanyData, setInsCompanyData] = useState({});
  const [insDepartmentData, setInsDepartmentData] = useState({});
  const [financialYearData, setFinancialYearData] = useState([]);
  const [financialYear, setFinancialYear] = useState('');
  // const handleFilterChange = (e) => setDateFrom(e.target.value);
  const handleFilterValue = (e) => setFilterValue(e.target.value);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingReminderId, setSendingReminderId] = useState(null);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleMonthYearChange = (newValue) => {
    if (!newValue) return;

    console.log('month chagned', newValue);

    const month = newValue.getMonth();
    const year = newValue.getFullYear();

    const fromDateObj = new Date(year, month, 1);
    const toDateObj = new Date(year, month + 1, 0);

    fromDateObj.setHours(0, 0, 0, 0);
    toDateObj.setHours(0, 0, 0, 0);

    setForm((prev) => ({
      ...prev,
      month: newValue,
      dateFrom: fromDateObj,
      dateTo: toDateObj
    }));
  };

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const formattedFirstDay = formatDate(firstDayOfMonth);
    // console.log(formattedFirstDay);
    setDateFrom(formattedFirstDay);
  }, []);

  // Auto-fetch on mount with current month dates
  useEffect(() => {
    fetchPolicyDetail();
    fetchDropdownData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDropdownData = async () => {
    try {
      const [insCompanyData, insDepartmentData, financialYearData] = await Promise.all([
        get('insCompany'),
        get('insDepartment'),
        get('financialYear')
      ]);
      setInsCompanyData(insCompanyData.data || []);
      setInsDepartmentData(insDepartmentData.data || []);
      setFinancialYearData(financialYearData.data || []);
      // console.log('Prefix List data', incotermsData);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  const fetchPolicyDetail = useCallback(async () => {
    // console.log('Function called date From ', form);
    if (!form.dateFrom) return;

    setLoading(true);
    try {
      // const res = await axios.get(`${REACT_APP_API_URL}policyDetail/by-date?dateFrom=${dateFrom}`);
      const res = await axios.get(`${REACT_APP_API_URL}policyDetail/by-date`, {
        params: {
          dateFrom: formatDate(form.dateFrom),
          dateTo: formatDate(form.dateTo)
        }
      });
      if (res.status) setCustomerList(res.data.data);
      else setCustomerList([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  }, [form]);

  const handleSendReminder = async (entry) => {
    if (sendingReminderId) return; // Prevent double clicks
    setSendingReminderId(entry._id);
    try {
      console.log('📩 Sending reminder for policy:', entry._id);
      const res = await post(`policyDetail/send-reminder/${entry._id}`);
      console.log('📨 Reminder response:', res);

      if (res.success) {
        // Update the customerList with new reminderCount from backend
        setCustomerList((prev) =>
          prev.map((item) => (item._id === entry._id ? { ...item, reminderCount: res.reminderCount } : item))
        );
        toast.success('Reminder Sent Successfully');
      } else {
        toast.error(res.message || 'Failed to send reminder');
      }
    } catch (error) {
      console.error('❌ Send reminder error:', error);
      toast.error('Failed to send reminder');
    } finally {
      setSendingReminderId(null);
    }
  };

  const calculateRemainingDays = (renewalDateString) => {
    if (!renewalDateString) return '0';
    const renewalDate = new Date(renewalDateString.split('T')[0]);
    const today = new Date();
    renewalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0; // Show 0 if past due
  };

  const filteredData = customerList.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase()));

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFilterChange = (name, value) => {
    if (!value) {
      setForm((prev) => ({
        ...prev,
        dateFrom: null,
        dateTo: null
      }));
      return;
    }
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Paper elevation={6} sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="h6">Loading Policies...</Typography>
          </Paper>
        </Box>
      )}
      <Breadcrumb title="Renewal Reminder">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Renewal Management
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Renewal Reminder
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <Grid container spacing={1} sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  <Grid item sx={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Month"
                        views={['year', 'month']}
                        value={form.month}
                        onChange={handleMonthYearChange}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField label="Search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </Grid>
                  <Grid item xs={2}>
                    <Button size="large" sx={{ py: 1 }} variant="contained" onClick={fetchPolicyDetail}>
                      filter
                    </Button>
                  </Grid>
                  {/* <Grid item xs={2}>
                    <Button size="large" sx={{ py: 1 }} variant="contained" onClick={() => navigate('/renewal/pdf-extraction', { state: { source: 'renewalPage' } })}>
                      Upload PDF
                    </Button>
                  </Grid> */}
                  {/* <Grid item xs={2}>
                    <TextField select label="Filter By" name="filter" value={filterValue} onChange={handleFilterValue} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="byDateRange">BY DATE RANGE</MenuItem>
                      <MenuItem value="renew">RENEW WITHIN 30 DAYS</MenuItem>
                    </TextField>
                  </Grid> */}
                  {filterValue === 'byDateRange' && (
                    <>
                      <Grid item xs={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="From Date"
                            value={form.dateFrom}
                            // onChange={(value) => handleDateFilterChange('dateFrom', value)}
                            onChange={(newValue) => handleFilterChange('dateFrom', newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="To Date"
                            value={form.dateTo}
                            // onChange={(value) => handleDateFilterChange('dateFrom', value)}
                            onChange={(newValue) => handleFilterChange('toFrom', newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={1}>
                        <Button variant="contained" size="small">
                          Apply
                        </Button>
                      </Grid>
                    </>
                  )}
                  {filterValue === 'renew' && (
                    <>
                      <Grid item xs={2}>
                        <Button variant="contained" size="small">
                          Renew within 30 days
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button variant="contained" size="large" sx={{ backgroundColor: 'orange' }}>
                          Reset
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      {/* <TextField label="Search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth /> */}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <TableContainer>
                  <Table size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: '#f5f5f5',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <TableCell sx={{ width: 60 }}>SN</TableCell>
                        <TableCell sx={{ width: 180 }}>CUSTOMER NAME</TableCell>
                        <TableCell sx={{ width: 150 }}>DEPARTMENT</TableCell>
                        <TableCell sx={{ width: 140 }}>POLICY NO</TableCell>
                        <TableCell sx={{ width: 130 }}>NET PREMIUM</TableCell>
                        <TableCell sx={{ width: 130 }}>TOTAL PREMIUM</TableCell>
                        <TableCell sx={{ width: 160 }}>RENEWAL DATE</TableCell>
                        <TableCell sx={{ width: 160 }}>Send Message</TableCell>
                        <TableCell sx={{ width: 120 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    {customerList.length > 0 ? (
                      <>
                        <TableBody>
                          {paginatedData.length > 0 ? (
                            paginatedData.map((entry, index) => (
                              <TableRow key={index}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell sx={{ maxWidth: 180 }}>
                                  <Tooltip title={entry?.cutomerName || ''} arrow>
                                    <Typography noWrap>
                                      {entry?.cutomerName?.length > 15 ? entry.cutomerName.substring(0, 15) + '...' : entry?.cutomerName}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>

                                <TableCell>{entry?.insDepartment?.insDepartment}</TableCell>
                                <TableCell sx={{ maxWidth: 140 }}>
                                  <Tooltip title={entry?.policyNumber || ''} arrow>
                                    <Typography noWrap>{entry?.policyNumber}</Typography>
                                  </Tooltip>
                                </TableCell>

                                <TableCell>{entry?.netPremium}</TableCell>
                                <TableCell>{entry?.totalAmount}</TableCell>
                                <TableCell>
                                  {/* {entry?.renewalDate?.split('T')[0]} */}
                                  {entry?.renewalDate ? new Date(entry.renewalDate).toLocaleDateString('en-GB') : ''}

                                  <Typography variant="body2">({calculateRemainingDays(entry?.renewalDate)} days)</Typography>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    sx={{ backgroundColor: 'green' }}
                                    disabled={sendingReminderId === entry._id}
                                    onClick={() => handleSendReminder(entry)}
                                  >
                                    {sendingReminderId === entry._id ? 'Sending...' : `${entry?.mobile} (${entry?.reminderCount || 0})`}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    sx={{ backgroundColor: 'orange' }}
                                    onClick={() => navigate(`/renewPolicy/${entry?._id}`)}
                                  >
                                    Renew
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={9} align="center">
                                <Typography variant="h6">No Data Found</Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </>
                    ) : (
                      <>No Data Found</>
                    )}
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                      setRowsPerPage(parseInt(event.target.value, 10));
                      setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default RenewalReminder;

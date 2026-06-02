import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { financialYearContext } from 'context/financialYearContext';
// import { CButton, CFormInput, CFormSelect } from '@coreui/react';
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
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  TablePagination,
  Paper,
  InputAdornment,
  Radio,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { gridSpacing } from 'config.js';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import value from 'assets/scss/_themes-vars.module.scss';
import REACT_APP_API_URL, { get, post, put, remove } from '../../api/api';
import axios from 'axios';
import { useSelector } from 'react-redux';
import InsurerHistoryModal from './InsurerHistoryModal';

const initialState = {
  dateFrom: null,
  dateTo: null,
  month: null,
  department: '',
  company: ''
};

const Policy = () => {
  const FYHeader = useContext(financialYearContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);
  const [filter, setFilter] = useState('byMonth');
  const [customerList, setCustomerList] = useState([]);
  const [insCompanyData, setInsCompanyData] = useState({});
  const [insDepartmentData, setInsDepartmentData] = useState({});
  const [financialYearData, setFinancialYearData] = useState([]);
  const [financialYear, setFinancialYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Insurer History Modal state
  const [insurerModalOpen, setInsurerModalOpen] = useState(false);
  const [selectedInsurerName, setSelectedInsurerName] = useState('');

  useEffect(() => {}, [filter]);

  useEffect(() => {
    const selectedFY = localStorage.getItem('selectedFY');
    setFinancialYear(selectedFY);
  }, []);

  console.log('Selected FY in Policy', financialYear);
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

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Validate the financialYear loaded from localStorage against the active DB's financialYearData
  useEffect(() => {
    if (financialYearData.length > 0 && financialYear) {
      const isValid = financialYearData.some((fy) => fy._id === financialYear);
      if (!isValid) {
        // The FY in localStorage belongs to an older/different database
        console.warn('Stale Financial Year ID detected from localStorage. Resetting...');
        const newFY = financialYearData[0]._id;
        setFinancialYear(newFY);
        localStorage.setItem('selectedFY', newFY);
      }
    } else if (financialYearData.length === 0 && financialYear) {
        // If there are NO financial years in DB, clear the filter to show all data
        setFinancialYear('');
        localStorage.removeItem('selectedFY');
    }
  }, [financialYearData, financialYear]);

  // Fetch all policy Detail

  const fetchPolicyDetail = useCallback(async () => {
    setLoading(true);
    try {
      // Check if financial year is a valid string/id before appending
      const isValidFY = financialYear && financialYear !== 'undefined' && financialYear !== 'null' && financialYear !== '';
      const url = isValidFY ? `policyDetail?financialYear=${financialYear}` : `policyDetail`;
      
      console.log('Fetching policies with URL:', url);
      const res = await get(url);
      console.log('policyDetail data:', res);
      if (res.status === true || res.status === 'true' || res.data) {
        setCustomerList(res.data || []);
      } else {
        setCustomerList([]);
      }
    } catch (error) {
      console.error('Error fetching policy detail:', error);
      setCustomerList([]);
    } finally {
      setLoading(false);
    }
  }, [financialYear]);

  useEffect(() => {
    // Listen for ANY localStorage changes (even from other components/tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'selectedFY') {
        const newFY = e.newValue;
        if (newFY && newFY !== financialYear) {
          setFinancialYear(newFY);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check current value on mount
    const savedFY = localStorage.getItem('selectedFY');
    if (savedFY && savedFY !== financialYear) {
      setFinancialYear(savedFY);
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Empty deps - runs once

  // Todo:
  useEffect(() => {
    fetchPolicyDetail();
  }, [financialYear]);

  const handleDelete = async (index) => {
    setLoading(true);
    try {
      const id = index;
      await remove(`policyDetail/${id}`);
      toast.success('Record Deleted Sucessfully');
      fetchPolicyDetail();
    } catch (error) {
      console.error(error);
      toast.error('Record Deletion Failed');
    } finally {
      setLoading(false);
    }
  };

  // Truncate text to max 2 lines (approx 100 chars)
  const truncateText = (text, maxLength = 25) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  // const filteredData = useMemo(() => {
  //   if (!searchTerm.trim()) return customerList;

  //   const lowerSearch = searchTerm.toLowerCase().trim();
  //   return customerList.filter(
  //     (entry) =>
  //       entry?.cutomerName?.toLowerCase().includes(lowerSearch) ||
  //       entry?.insCompany?.insCompany?.toLowerCase().includes(lowerSearch) ||
  //       entry?.insDepartment?.insDepartment?.toLowerCase().includes(lowerSearch) ||
  //       entry?.policyNumber?.toLowerCase().includes(lowerSearch)
  //   );
  // }, [customerList, searchTerm]);

  const filteredData = useMemo(() => {
    let filtered = customerList;

    if (selectedCompany) {
      filtered = filtered.filter((row) => row?.insCompany?._id === selectedCompany);
    }

    if (selectedDepartment) {
      filtered = filtered.filter((row) => row?.insDepartment?._id === selectedDepartment);
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();

      filtered = filtered.filter((entry) => {
        const customerName = entry?.cutomerName?.toLowerCase?.() || '';
        const company = entry?.insCompany?.insCompany?.toLowerCase?.() || '';
        const department =
          (typeof entry?.insDepartment === 'string' ? entry?.insDepartment : entry?.insDepartment?.insDepartment)?.toLowerCase?.() || '';

        const policy = entry?.policyNumber?.toLowerCase?.() || '';

        return (
          customerName.includes(lowerSearch) ||
          company.includes(lowerSearch) ||
          department.includes(lowerSearch) ||
          policy.includes(lowerSearch)
        );
      });
    }

    return filtered;
  }, [customerList, searchTerm, selectedCompany, selectedDepartment]);
  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleFilter = (e) => {
    setFinancialYear(e.target.value);
  };
  const handleClear = () => {
    setForm(initialState);
    setSelectedDepartment('');
    setSelectedCompany('');
    setSearchCustomer('');
    setFilteredRows(customerList);
  };

  const handleFileUpload = async (e) => {
    setIsUploading(true);
    try {
      if (!file) {
        toast.error('No file selected');
        setIsUploading(false);
        return;
      }
      // console.log('File is presnt ', file);

      const formData = new FormData();
      formData.append('file', file);

      // Use the generic 'post' from api.js so it includes the token and companyId
      const response = await post(`policyDetail/import-csv/`, formData);
      if (response.success || response.status) {
        toast.success(`Inserted ${response.insertedCount} Records`);
      } else if (response.failedCount > 0) {
        toast.warning(`Inserted ${response.insertedCount}, Failed ${response.failedCount}`);
      }
      console.log('Upload response', response);
    } catch (error) {
      toast('Error uploading file');
    } finally {
      setIsUploading(false); // Stop uploading
    }
  };

  const handleFileChange = (event) => {
    // console.log('file changed ', event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    console.log('FY ', financialYear);
    try {
      let exportUrl = `${REACT_APP_API_URL}policyDetail/export-csv?financialYear=${financialYear}`;
      
      if (filter === 'byMonth' && form.dateFrom && form.dateTo) {
         exportUrl += `&filterDate=byMonth&dateFrom=${formatDate(form.dateFrom)}&dateTo=${formatDate(form.dateTo)}`;
      }

      const response = await axios.get(exportUrl, {
        responseType: 'blob'
      });

      console.log('exporrt Response ', response);
      let filename = `policyData-${financialYear}.csv`;
      if (filter === 'byMonth' && form.month) {
        filename = `policyData-${form.month.toLocaleString('default', { month: 'short' })}-${form.month.getFullYear()}.csv`;
      }
      
      const blob = new Blob([response.data], { type: 'text/csv' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Policy exported successfully');
      setIsExporting(false);
    } catch (error) {
      console.log(error);
      toast.error('Error exporting Policy data');
      setIsExporting(false);
    }
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleMonthYearChange = (newValue) => {
    if (!newValue) return;

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

  const fetchFilteredPolicyDetail = async () => {
    console.log('Function called date From ', form);
    if (!form.dateFrom) return;
    setLoading(true);
    try {
      // const res = await axios.get(`${REACT_APP_API_URL}policyDetail/by-date?dateFrom=${form.dateFrom}`);
      const res = await axios.get(`${REACT_APP_API_URL}policyDetail/by-date`, {
        params: {
          filterDate: filter,
          dateFrom: formatDate(form.dateFrom),
          dateTo: formatDate(form.dateTo)
        }
      });
      console.log('policyDetail data:', res);
      if (res.status) {
        setCustomerList(res.data.data);
      } else {
        setCustomerList([]);
        setSummary({
          totalAmount: 0,
          brokerageIncGst: 0,
          netPremium: 0,
          gstAmount: 0
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // ✅ Stop loading
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

      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Policy
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing} sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Policy Management</Typography>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                background: 'white',
                padding: '.4rem',
                borderRadius: '6px'
              }}
            >
              <input
                style={{ border: 'none', outline: 'none' }}
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />

              <Button variant="contained" onClick={handleFileUpload} disabled={isUploading}>
                {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Bulk Upload'}
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="contained" onClick={handleExportCSV} disabled={isExporting}>
                {isExporting ? <CircularProgress size={24} color="inherit" /> : 'Export Policy'}
              </Button>
              <Button variant="contained" onClick={() => navigate('/renewal/pdf-extraction', { state: { source: 'policyList' } })}>
                Upload PDF
              </Button>
              <Button variant="contained" onClick={() => navigate('/policy/AddPolicy')}>
                <Add /> Add Policy
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="filter">Filter</InputLabel>
            <Select labelId="filter" label="filter" name="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="byFinancialYear">By Financial Year</MenuItem>
              <MenuItem value="byMonth">By Month</MenuItem>
              {/* <MenuItem value="byCompany">Insurance Company</MenuItem> */}
              {/* <MenuItem value="byDepartment">Department</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
        {filter === 'byFinancialYear' ? (
          <>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                labelId="financialYear"
                label="FinancialYear"
                name="financialYear"
                type="financialYear"
                value={financialYear || ''}
                onChange={(e) => handleFilter(e)}
              >
                {financialYearData.length > 0 ? (
                  financialYearData.map((type) => (
                    <MenuItem
                      key={type._id}
                      value={type._id}
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      {new Date(type.fromDate).getFullYear()} - {new Date(type.toDate).getFullYear()}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>Loading...</MenuItem>
                )}
              </TextField>
            </Grid>
          </>
        ) : null}
        {filter === 'byMonth' ? (
          <>
            <Grid item xs={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Month"
                  views={['year', 'month']}
                  value={form.month}
                  onChange={handleMonthYearChange}
                  // onChange={(newValue) => handleFilterChange('month', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </>
        ) : null}
        {filter === 'byStaff' ? (
          <>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="staff">Staff</InputLabel>
                <Select labelId="staff" label="staff" name="staff">
                  <MenuItem value="byStaff">Ajay</MenuItem>
                  <MenuItem value="byMonth">Vijay</MenuItem>
                  <MenuItem value="byCompany">Sanjay</MenuItem>
                  <MenuItem value="byDepartment">Ramdeen</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        ) : null}
        {filter === 'byCompany' ? (
          <>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="company">Insurance Company</InputLabel>
                <Select labelId="company" label="company" name="company">
                  {insCompanyData.length > 0 &&
                    insCompanyData.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.insCompany}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        ) : null}
        {filter === 'byDepartment' ? (
          <>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="department">Department</InputLabel>
                <Select labelId="department" label="department" name="department">
                  {insDepartmentData?.length > 0 &&
                    insDepartmentData?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.insDepartment}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        ) : null}

        {filter === 'byFinancialYear' ? null : (
          <>
            <Grid item xs={2}>
              <Button size="large" sx={{ py: 1 }} variant="contained" onClick={fetchFilteredPolicyDetail}>
                filter
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" size="large" onClick={handleClear}>
                Reset Filter
              </Button>
            </Grid>
            <Grid container spacing={2} sx={{ m: 2 }}>
              <Grid item xs={2}>
                <TextField
                  select
                  label="Department"
                  name="insDepartment"
                  fullWidth
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {insDepartmentData?.length > 0 ? (
                    insDepartmentData?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.insDepartment}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>Loading...</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  select
                  label="Insurance Company"
                  name="insCompany"
                  fullWidth
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  {insCompanyData?.length > 0 ? (
                    insCompanyData?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.insCompany}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>Loading...</MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>

      <Card>
        <CardContent>
          <Paper sx={{ overflow: 'hidden' }}>
            {/* Search Field */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, company, department, policy..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch} edge="end">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Table Container */}
            <Box sx={{ overflowX: 'auto' }}>
              <Grid container sx={{ minWidth: '1000px' }}>
                <Table sx={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ height: 'auto' }}>
                      <TableCell sx={{ width: 60, px: 1, py: 0.2 }}>SN</TableCell>
                      <TableCell sx={{ width: 600, px: 1, py: 0.2 }}>Customer Name</TableCell>
                      <TableCell sx={{ width: 300, px: 1, py: 0.2 }}>Insurance Company</TableCell>
                      <TableCell sx={{ width: 150, px: 1, py: 0.2 }}>Department</TableCell>
                      <TableCell sx={{ width: 150, px: 1, py: 0.2 }}>Start Date</TableCell>
                      <TableCell sx={{ width: 150, px: 1, py: 0.2 }}>Policy No</TableCell>
                      <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Net Premium</TableCell>
                      <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Total GST</TableCell>
                      <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Total Amount</TableCell>
                      <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedData.map((entry, index) => (
                      <TableRow
                        key={entry?._id || index}
                        hover
                        sx={{
                          height: 'auto',
                          '&:hover': { backgroundColor: 'action.hoverOpacity' }
                        }}
                      >
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5, wordBreak: 'break-word' }}>
                          {truncateText(entry?.cutomerName)}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5, wordBreak: 'break-word', maxHeight: 60 }}>
                          <Typography
                            variant="body2"
                            onClick={() => {
                              const name = entry?.insurerName || entry?.insCompany?.insCompany;
                              if (name) {
                                setSelectedInsurerName(name);
                                setInsurerModalOpen(true);
                              }
                            }}
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              color: '#1976d2',
                              fontWeight: 500,
                              '&:hover': {
                                textDecoration: 'underline',
                                color: '#0d47a1'
                              }
                            }}
                          >
                            {truncateText(entry?.insCompany?.insCompany || entry?.insurerName)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>{entry?.insDepartment?.insDepartment}</TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>
                          {new Date(entry?.startDate || entry?.tpStartDate || entry?.odStartDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>{entry?.policyNumber}</TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>{Number(entry?.netPremium).toFixed(2)}</TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>{Number(entry?.gstAmount).toFixed(2)}</TableCell>
                        <TableCell sx={{ verticalAlign: 'top', py: 1.5 }}>{Number(entry?.totalAmount).toFixed(2)}</TableCell>
                        <TableCell
                          sx={{
                            verticalAlign: 'bottom',
                            py: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            gap: 0.5
                          }}
                        >
                          <IconButton size="small" color="primary" component={Link} to={`/EditPolicy/${entry?._id}`}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(entry?._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1">No data found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Box>

            {/* Pagination */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TablePagination
                rowsPerPageOptions={[100]}
                component="div"
                count={filteredData.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
              />
            </Box>
          </Paper>
        </CardContent>
      </Card>
      {/* Insurer History Modal */}
      <InsurerHistoryModal
        open={insurerModalOpen}
        onClose={() => setInsurerModalOpen(false)}
        insurerName={selectedInsurerName}
      />

      <ToastContainer />
    </>
  );
};

export default Policy;

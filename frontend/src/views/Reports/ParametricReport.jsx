import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Paper,
  CircularProgress,
  InputLabel,
  Divider,
  Box,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  TableContainer
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
import { set } from 'lodash';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { SignalCellularConnectedNoInternet3Bar } from '@mui/icons-material';

const initialState = {
  dateFrom: null,
  dateTo: null,
  month: null,
  department: '',
  company: ''
};

const ParametricReport = () => {
  const [form, setForm] = useState(initialState);
  const [filterDate, setFilterDate] = useState('byDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toggleState, setToggleState] = useState({});
  const [selectedColumns, setSelectedColumns] = useState(['cutomerName', 'insCompany', 'insDepartment', 'totalAmount']);
  const [exceptionColumns] = useState(['cutomerName', 'insCompany', 'insDepartment', 'totalAmount']);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    brokerageIncGst: 0,
    netPremium: 0,
    gstAmount: 0
  });
  const [totalPremiumGst, setTotalPremiumGst] = useState(0);
  const [totalBrokerageGst, setTotalBrokerageGst] = useState(0);
  const [totalNetPremium, setTotalNetPremium] = useState(0);
  const [totalTotalAmount, setTotalTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [financialYearData, setFinancialYearData] = useState([]);
  const [financialYear, setFinancialYear] = useState('');
  const [insDepartmentData, setInsDepartmentData] = useState([]);
  const [insCompanyData, setInsCompanyData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');

  const handleFilterDateChange = (e) => setFilterDate(e.target.value);

  const handleToggleChange = (e, fieldName) => {
    const checked = e.target.checked;
    setToggleState((prev) => ({ ...prev, [fieldName]: checked }));
    if (!checked) {
      setFiles((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const columnMasterList = [
    { key: 'cutomerName', label: 'Customer Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile Number' },
    { key: 'policyNumber', label: 'Policy Number' },
    {
      key: 'insDepartment',
      label: 'Department',
      render: (row) => row.insDepartment?.insDepartment
    },
    {
      key: 'insCompany',
      label: 'Insurance Company',
      render: (row) => row.insCompany?.insCompany
    },
    { key: 'gstAmount', label: 'GST Amount' },
    { key: 'totalBrokerageGst', label: 'Brokerage GST' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'netPremium', label: 'Net Premium' },
    { key: 'totalBrokerageAmountincGst', label: 'Brokerage Amount (Incl. GST)' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'vehicleNumber', label: 'Vehicle Number' }
  ];

  const toggleItems = [
    'cutomerName',
    'email',
    'mobile',
    'totalBrokerageAmountincGst',
    'policyNumber',
    'Insurance Company',
    'Department',
    'gstAmount',
    'totalBrokerageGst',
    'startDate',
    'endDate',
    'netPremium',
    'totalAmount',
    'vehicleNumber'
  ];

  // const rows = customerList;
  const rows = filteredRows;

  useEffect(() => {}, [filterDate]);

  useEffect(() => {
    // const selectedFY = localStorage.getItem('selectedFY');
    // setFinancialYear(selectedFY);
    fetchDropdownData();
  }, []);

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
      // console.log('Prefix List data', insDepartmentData);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  // useEffect(() => {
  //   fetchDropdownData();
  // }, []);

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

  // Fetch all policy Detail

  const fetchPolicyDetail = async () => {
    // console.log('Function called date From ', form);
    if (!form.dateFrom) return;
    setLoading(true);
    try {
      // const res = await axios.get(`${REACT_APP_API_URL}policyDetail/by-date?dateFrom=${form.dateFrom}`);
      const res = await axios.get(`${REACT_APP_API_URL}policyDetail/by-date`, {
        params: {
          filterDate: filterDate,
          dateFrom: formatDate(form.dateFrom),
          dateTo: formatDate(form.dateTo)
        }
      });
      // console.log('policyDetail data:', res);
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

  useEffect(() => {
    if (!filteredRows || filteredRows.length === 0) {
      setSummary({
        totalAmount: 0,
        brokerageIncGst: 0,
        netPremium: 0,
        gstAmount: 0
      });
      return;
    }

    const totals = filteredRows.reduce(
      (acc, curr) => {
        acc.totalAmount += Number(curr?.totalAmount || 0);
        acc.brokerageIncGst += Number(curr?.totalBrokerageAmountincGst || 0);
        acc.netPremium += Number(curr?.netPremium || 0);
        acc.gstAmount += Number(curr?.gstAmount || 0);
        return acc;
      },
      {
        totalAmount: 0,
        brokerageIncGst: 0,
        netPremium: 0,
        gstAmount: 0
      }
    );

    setSummary(totals);
  }, [filteredRows]);

  const handleFilterChange = (name, value) => {
    if (!value) {
      setForm((prev) => ({
        ...prev,
        dateFrom: null,
        dateTo: null
      }));
      return;
    }

    if (name === 'month') {
      const year = value.getFullYear();
      const month = value.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      firstDay.setHours(0, 0, 0, 0);
      lastDay.setHours(0, 0, 0, 0);

      setForm((prev) => ({
        ...prev,
        dateFrom: firstDay,
        dateTo: lastDay
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const exportToExcel = (data) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    setLoading(true);
    const formattedData = data?.map((row, index) => ({
      SN: index + 1,
      CustomerName: row?.cutomerName,
      email: row?.email,
      mobile: row?.mobile,
      PolicyNumber: row?.policyNumber,
      Department: row?.insDepartment?.insDepartment,
      Company: row?.insCompany?.companyName,
      gstAmount: row?.gstAmount,
      totalBrokerageGst: row?.totalBrokerageGst,
      StartDate: row?.startDate?.split('T')[0] || row?.tpStartDate?.split('T')[0] || row?.odStartDate?.split('T')[0],
      endDate: row?.endDate?.split('T')[0] || row?.tpEndDate?.split('T')[0] || row?.odEndDate?.split('T')[0],
      NetPremium: row?.netPremium,
      totalAmount: row?.totalAmount,
      vehicleNumber: row?.vehicleNumber,
      totalBrokerageAmountincGst: row?.totalBrokerageAmountincGst
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Policies');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(file, 'Filtered_Policies.xlsx');
    setLoading(false);
  };

  const handleFilter = () => {
    if (!customerList.length) return;

    let start = null;
    let end = null;

    // DATE / MONTH FILTER
    if (filterDate === 'byMonth' && form.dateFrom) {
      // const range = getMonthRange(dateFrom);

      start = normalizeDate(form.dateFrom);
      end = normalizeDate(form.dateTo);
    }

    if (filterDate === 'byDate' && form.dateFrom && form.dateTo) {
      start = normalizeDate(form.dateFrom);
      end = normalizeDate(form.dateTo);
    }

    const filtered = customerList.filter((row) => {
      // --- DATE CHECK ---
      if (start && end) {
        if (!row.startDate) return false;
        const rowDate = normalizeDate(row.startDate);
        if (rowDate < start || rowDate > end) return false;
      }

      // --- DEPARTMENT CHECK ---
      if (selectedDepartment) {
        if (row.insDepartment?._id !== selectedDepartment) return false;
      }

      // --- COMPANY CHECK ---
      if (selectedCompany) {
        if (row.insCompany?._id !== selectedCompany) return false;
      }

      // --- CUSTOMER SEARCH CHECK ---
      if (searchCustomer) {
        const customerName = row.cutomerName?.toLowerCase() || '';
        if (!customerName.includes(searchCustomer.toLowerCase())) return false;
      }

      return true;
    });

    setFilteredRows(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchCustomer]);

  const handleClear = () => {
    setForm(initialState);
    setSelectedDepartment('');
    setSelectedCompany('');
    setSearchCustomer('');
    setFilteredRows(customerList);
  };

  const normalizeDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // useEffect(() => {
  //   console.log('Company', selectedCompany);
  //   console.log('Department', selectedDepartment);
  //   if (selectedDepartment) {
  //     console.log('Department changed ', customerList);
  //     const filtered = customerList.filter((row) => row?.insDepartment?._id === selectedDepartment);
  //     setFilteredRows(filtered);
  //   }
  //   if (selectedCompany) {
  //     const filtered = customerList.filter((row) => row?.insCompany?._id === selectedCompany);
  //     setFilteredRows(filtered);
  //   }
  // }, [selectedDepartment, selectedCompany]);

  useEffect(() => {
    let filtered = customerList;

    if (selectedCompany) {
      filtered = filtered.filter((row) => row?.insCompany?._id === selectedCompany);
    }

    if (selectedDepartment) {
      filtered = filtered.filter((row) => row?.insDepartment?._id === selectedDepartment);
    }

    setFilteredRows(filtered);
  }, [selectedCompany, selectedDepartment, customerList]);

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <Typography variant="h6">Loading Report...</Typography>
          </Paper>
        </Box>
      )}
      <Breadcrumb title="Paramentric Report">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Report
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Parametric
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <Grid container spacing={1} sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  <Grid item xs={2}>
                    <TextField select label="filter Date" name="Date" fullWidth value={filterDate} onChange={handleFilterDateChange}>
                      <MenuItem value="byMonth">BY MONTH</MenuItem>
                      <MenuItem value="byDate">BY DATE</MenuItem>
                    </TextField>
                  </Grid>
                  {filterDate === 'byMonth' ? (
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
                  ) : (
                    <>
                      <Grid item xs={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="From Date"
                            value={form.dateFrom}
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
                            onChange={(newValue) => handleFilterChange('dateTo', newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={2}>
                    <Button size="large" sx={{ py: 1 }} variant="contained" onClick={fetchPolicyDetail}>
                      filter
                    </Button>
                  </Grid>
                  {/* <Grid item xs={2}>
                    <TextField label="Search..." name="search" fullWidth></TextField>
                  </Grid> */}
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      onClick={() => exportToExcel(filteredRows)}
                      sx={{
                        fontSize: '15px',
                        padding: '4px 12px',
                        whiteSpace: 'nowrap',
                        minHeight: '32px'
                      }}
                    >
                      Generate Report
                    </Button>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <TextField
                        select
                        label="Department"
                        name="insDepartment"
                        fullWidth
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        {insDepartmentData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.insDepartment}
                          </MenuItem>
                        ))}
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
                        {insCompanyData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.insCompany}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        label="Search Customer"
                        name="searchCustomer"
                        fullWidth
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button size="large" sx={{ py: 1 }} variant="contained" onClick={handleClear}>
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label="Select All"
                      control={
                        <Switch
                          checked={selectedColumns.length === columnMasterList.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColumns(columnMasterList.map((col) => col.key));
                            } else {
                              setSelectedColumns([...exceptionColumns]);
                            }
                          }}
                        />
                      }
                    />

                    {columnMasterList.map((col) => (
                      <FormControlLabel
                        key={col.key}
                        label={col.label} // 👈 pretty label
                        control={
                          <Switch
                            checked={selectedColumns.includes(col.key)}
                            onChange={() => {
                              if (selectedColumns.includes(col.key)) {
                                setSelectedColumns(selectedColumns.filter((c) => c !== col.key));
                              } else {
                                setSelectedColumns([...selectedColumns, col.key]);
                              }
                            }}
                          />
                        }
                      />
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columnMasterList
                    .filter((col) => selectedColumns.includes(col.key))
                    .map((col) => (
                      <TableCell key={col.key}>{col.label}</TableCell>
                    ))}
                </TableRow>
              </TableHead>

              {rows.length > 0 ? (
                <>
                  <TableBody>
                    {paginatedRows.map((row, index) => (
                      <TableRow key={index}>
                        {columnMasterList
                          .filter((col) => selectedColumns.includes(col.key))
                          .map((col) => (
                            <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key]}</TableCell>
                          ))}
                      </TableRow>
                    ))}

                    {/* ✅ TOTAL ROW */}
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      {['gstAmount', 'netPremium', 'totalBrokerageAmountincGst', 'totalAmount'].some((col) =>
                        selectedColumns.includes(col)
                      ) && <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total</TableCell>}

                      {selectedColumns.includes('gstAmount') && (
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          GST Amount :
                          {summary.gstAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                      )}

                      {selectedColumns.includes('totalBrokerageAmountincGst') && (
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Brokerage with GST :
                          {summary.brokerageIncGst.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                      )}

                      {selectedColumns.includes('netPremium') && (
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Net Premuim :
                          {summary.netPremium.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                      )}

                      {selectedColumns.includes('totalAmount') && (
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Total Amount :
                          {summary.totalAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={columnMasterList.length} align="center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>

            {/* ✅ Pagination */}
            <TablePagination
              component="div"
              count={rows.length}
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
        </Grid>
      </Grid>
    </>
  );
};

export default ParametricReport;

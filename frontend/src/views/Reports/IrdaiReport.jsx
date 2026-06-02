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
import { get, post } from '../../api/api';
import { set } from 'lodash';

const IrdaiReport = () => {
  const [filterValue, setFilterValue] = useState('');
  const [filterDate, setFilterDate] = useState('byDate');
  const [month, setMonth] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [dateMonth, setDateMonth] = useState(null);
  const [policy, setPolicy] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [financialYearData, setFinancialYearData] = useState([]);
  const [financialYear, setFinancialYear] = useState(() => {
    return localStorage.getItem('selectedFY') || '';
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Fetch dropdown and lead details
  const fetchDropdownData = async () => {
    try {
      const [financialYearData] = await Promise.all([get('financialYear')]);
      setFinancialYearData(financialYearData.data || []);
      // console.log('FY data', financialYearData);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  const handleFilterDateChange = (e) => setFilterDate(e.target.value);
  const handleFilterChange = (e) => setFilterValue(e.target.value);

  useEffect(() => {}, [filterDate, filterValue]);

  // Fetch all policy Detail

  const fetchPolicyDetail = useCallback(async () => {
    if (!financialYear) return; // Don't call if no FY

    setLoading(true);
    try {
      console.log('Fetching with FY:', financialYear);
      const res = await get(`policyDetail?financialYear=${financialYear}`);
      console.log('policyDetail data:', res);
      if (res.status) setPolicy(res.data);
      else setPolicy([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  }, [financialYear]);

  useEffect(() => {
    if (financialYear) {
      localStorage.setItem('selectedFY', financialYear);
    }
    fetchPolicyDetail();
  }, [financialYear]);

  const handleReset = () => {
    setIsFilterApplied(false);
    setDateFrom(null);
    setDateTo(null);
    setFilterValue('');
  };

  const handleFilter = () => {
    setIsFilterApplied(true);
    console.log(`filer value ${filterValue}, month ${month}, dateFrom ${dateFrom}, to ${dateTo}`);
  };

  const getMonthStartEnd = (date) => {
    if (!date) return { start: null, end: null };

    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    return { start, end };
  };

  const handleMonthChange = (value) => {
    if (!value) {
      setMonth(null);
      return;
    }

    const { start, end } = getMonthStartEnd(value);

    setMonth(value);
    setDateFrom(start);
    setDateTo(end);
  };

  const handleDateChange = (name, value) => {
    setMonth(null); // ❗ Clear month picker
    console.log('hande , ', name, value);

    if (name === 'dateFrom') setDateFrom(value);
    if (name === 'dateTo') setDateTo(value);

    console.log('Date to ', dateTo);
  };

  const isDateInRange = (policyDate, from, to) => {
    if (!policyDate) return false;

    const date = new Date(policyDate);
    if (from && to) {
      return date >= from && date <= to;
    }
    if (from && !to) {
      return date >= from;
    }
    return true;
  };

  const departmentResult = policy?.reduce(
    (acc, item) => {
      const dept = item?.insDepartment?.insDepartment;

      // ❌ No department → skip
      if (!dept) return acc;

      // ✅ Apply filter ONLY after search
      if (isFilterApplied) {
        if (!item.startDate) return acc;

        const isValid = isDateInRange(item.startDate, dateFrom, dateTo);
        if (!isValid) return acc;
      }

      const amount = Number(item.totalAmount) || 0;
      const brokerageIncGst = Number(item.totalBrokerageAmountincGst) || 0;

      if (!acc.departments[dept]) {
        acc.departments[dept] = {
          department: dept,
          count: 0,
          totalAmount: 0,
          totalBrokerageAmountincGst: 0
        };
      }

      acc.departments[dept].count += 1;
      acc.departments[dept].totalAmount += amount;
      acc.departments[dept].totalBrokerageAmountincGst += brokerageIncGst;

      acc.grandTotal.count += 1;
      acc.grandTotal.totalAmount += amount;
      acc.grandTotal.totalBrokerageAmountincGst += brokerageIncGst;

      return acc;
    },
    {
      departments: {},
      grandTotal: {
        count: 0,
        totalAmount: 0,
        totalBrokerageAmountincGst: 0
      }
    }
  );

  const departmentArray = Object.values(departmentResult);
  const departmentsObj = departmentArray[0]; // object
  const departments = Object.values(departmentsObj);
  const footerTotal = departmentArray[1]; // totals

  const DEPARTMENTS = ['ENGINEERING', 'FIRE', 'HEALTH', 'LIABILITY', 'MARINE', 'MISCELLANEOUS', 'MOTOR'];

  const companyCustomerResult = policy.reduce(
    (acc, item) => {
      const rowKey = filterValue === 'byCompany' ? item?.insCompany?.insCompany : item?.cutomerName;

      const department = item?.insDepartment?.insDepartment;

      if (!rowKey || !department) return acc;

      // Apply date / month filter AFTER Search
      if (isFilterApplied) {
        if (!item.startDate) return acc;
        if (!isDateInRange(item.startDate, dateFrom, dateTo)) return acc;
      }

      const premium = Number(item.totalAmount) || 0;

      // Init row
      if (!acc.rows[rowKey]) {
        acc.rows[rowKey] = {
          name: rowKey,
          departments: {},
          totalPolicies: 0,
          totalPremium: 0
        };
      }

      // Init department cell
      if (!acc.rows[rowKey].departments[department]) {
        acc.rows[rowKey].departments[department] = {
          policies: 0,
          premium: 0
        };
      }

      acc.rows[rowKey].departments[department].policies += 1;
      acc.rows[rowKey].departments[department].premium += premium;

      acc.rows[rowKey].totalPolicies += 1;
      acc.rows[rowKey].totalPremium += premium;

      // Grand totals
      if (!acc.grandTotal.departments[department]) {
        acc.grandTotal.departments[department] = {
          policies: 0,
          premium: 0
        };
      }

      acc.grandTotal.departments[department].policies += 1;
      acc.grandTotal.departments[department].premium += premium;
      acc.grandTotal.totalPolicies += 1;
      acc.grandTotal.totalPremium += premium;

      return acc;
    },
    {
      rows: {},
      grandTotal: {
        departments: {},
        totalPolicies: 0,
        totalPremium: 0
      }
    }
  );

  const tableRows = Object.values(companyCustomerResult.rows);
  const footer = companyCustomerResult.grandTotal;

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
      <Breadcrumb title="IRDIA Report">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Report
        </Typography>
        <Typography variant="subtitle2" color="primary">
          IRDIA
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <Grid container spacing={1} sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  <Grid item xs={2}>
                    <TextField select label="filter" name="filter" value={filterValue} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="byFY">BY FINANCIAL YEAR</MenuItem>
                      <MenuItem value="byDepartment">BY DEPARTMENT</MenuItem>
                      <MenuItem value="byCustomer">BY CUSTOMER</MenuItem>
                      <MenuItem value="byCompany">BY INSURANCE COMPANY</MenuItem>
                    </TextField>
                  </Grid>

                  {filterValue === 'byFY' ? (
                    <Grid item xs={2}>
                      <TextField
                        select
                        label="financialYear"
                        name="financialYear"
                        fullWidth
                        value={financialYear}
                        onChange={(event) => setFinancialYear(event.target.value)}
                      >
                        {financialYearData.length > 0 &&
                          financialYearData.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                              {new Date(type.fromDate).getFullYear()} - {new Date(type.toDate).getFullYear()}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={2}>
                        <TextField select label="filterDate" name="Date" fullWidth value={filterDate} onChange={handleFilterDateChange}>
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
                                value={month}
                                onChange={handleMonthChange}
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
                                value={dateFrom}
                                onChange={(value) => handleDateChange('dateFrom', value)}
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="To Date"
                                value={dateTo}
                                onChange={(value) => handleDateChange('dateTo', value)}
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </LocalizationProvider>
                          </Grid>
                        </>
                      )}
                      <Grid item xs={2}>
                        <Button size="large" variant="contained" sx={{ my: 1 }} onClick={handleFilter}>
                          Search
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="large" variant="contained" sx={{ my: 1 }} onClick={handleReset}>
                          Reset Filters
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
        </Grid>
      </Grid>
      {/* Table to display filtered tasks */}
      {(filterValue == 'byDepartment' || filterValue == '' || filterValue == 'byFY') && (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: '#f5f5f5',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <TableCell sx={{ width: 30, px: 1.5, py: 0.8 }}>SN</TableCell>
                          <TableCell sx={{ width: 100, px: 1.5, py: 0.8 }}>DEPARTMENT</TableCell>
                          <TableCell sx={{ width: 70, px: 1.5, py: 0.8 }}>NO. OF POLICIES</TableCell>
                          <TableCell sx={{ width: 120, px: 1.5, py: 0.8 }}>PREMIUM</TableCell>
                          <TableCell sx={{ width: 70, px: 1.5, py: 0.8 }}>BROKERAGE</TableCell>
                          <TableCell sx={{ width: 120, px: 1.5, py: 0.8 }}>BROKERAGE PERCENTAGE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {departments.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.department}</TableCell>
                            <TableCell>{item.count.toLocaleString('en-IN')}</TableCell>
                            <TableCell>
                              {Number(item.totalAmount || 0).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </TableCell>
                            <TableCell>
                              {Number(item.totalBrokerageAmountincGst || 0).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </TableCell>
                            <TableCell>{Number(item.totalBrokerageAmountincGst / item.totalAmount).toFixed(2) + ' %'}</TableCell>
                          </TableRow>
                        ))}

                        {/* GRAND TOTAL ROW */}
                        <TableRow
                          sx={{
                            backgroundColor: '#e0e0e0',
                            fontWeight: 'bold'
                          }}
                        >
                          <TableCell sx={{ px: 1.5, py: 0.8 }}></TableCell>
                          <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>GRAND TOTAL</TableCell>

                          <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>
                            {Number(footerTotal.count).toLocaleString('en-IN')}
                          </TableCell>

                          <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>
                            {Number(footerTotal.totalAmount).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>

                          <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>
                            {Number(footerTotal.totalBrokerageAmountincGst).toFixed(2)}
                          </TableCell>

                          <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>
                            {Number(footerTotal.totalBrokerageAmountincGst / footerTotal.totalAmount).toFixed(2) + ' %'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {(filterValue === 'byCustomer' || filterValue === 'byCompany') && (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      {/* HEADER ROW 1 */}
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell rowSpan={2}>SN</TableCell>
                        <TableCell rowSpan={2}>{filterValue === 'byCustomer' ? 'CUSTOMER' : 'COMPANY'}</TableCell>

                        {DEPARTMENTS.map((dept) => (
                          <TableCell key={dept} align="center" colSpan={2}>
                            {dept}
                          </TableCell>
                        ))}

                        <TableCell align="center" colSpan={2}>
                          TOTAL
                        </TableCell>
                      </TableRow>

                      {/* HEADER ROW 2 */}
                      <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                        {DEPARTMENTS.map((dept) => (
                          <React.Fragment key={dept}>
                            <TableCell>Policies</TableCell>
                            <TableCell>Premium</TableCell>
                          </React.Fragment>
                        ))}
                        <TableCell>Total Policies</TableCell>
                        <TableCell>Total Premium</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {/* BODY */}
                      {tableRows.map((row, index) => (
                        <TableRow key={row.name}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.name}</TableCell>

                          {DEPARTMENTS.map((dept) => (
                            <React.Fragment key={dept}>
                              <TableCell>{row.departments[dept]?.policies || 0}</TableCell>
                              <TableCell>{(row.departments[dept]?.premium || 0).toLocaleString('en-IN')}</TableCell>
                            </React.Fragment>
                          ))}

                          <TableCell sx={{ fontWeight: 'bold' }}>{row.totalPolicies}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{row.totalPremium.toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                      ))}

                      {/* FOOTER */}
                      <TableRow sx={{ backgroundColor: '#d1d1d1', fontWeight: 'bold' }}>
                        <TableCell />
                        <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>GRAND TOTAL</TableCell>

                        {DEPARTMENTS.map((dept) => (
                          <React.Fragment key={dept}>
                            <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>{footer.departments[dept]?.policies || 0}</TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>
                              {(footer.departments[dept]?.premium || 0).toLocaleString('en-IN')}
                            </TableCell>
                          </React.Fragment>
                        ))}

                        <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>{footer.totalPolicies}</TableCell>
                        <TableCell sx={{ px: 1.5, py: 0.8, fontWeight: 'bold' }}>{footer.totalPremium.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default IrdaiReport;

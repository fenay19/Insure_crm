import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  CardContent,
  DialogActions,
  IconButton,
  TablePagination,
  CircularProgress,
  Skeleton
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ReportCard from './ReportCard';
import { gridSpacing } from 'config.js';
import { get, post, put, remove } from '../../../api/api.js';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import DepartmentOpdPieChart from '../Charts/PieChart/DepartmentOPD';
import DepartmentBarChart from '../Charts/BarCharts/DepartmentBarChart/DepartmentBarChart';
import MonthlyBarChart from '../Charts/BarCharts/MonthlyBarChart/MonthlyBarChart';
import ReusableBarChart from '../Charts/BarCharts/ReusbaleBarChart';
import { useSelector } from 'react-redux';
import { Delete, Edit, Info as InfoIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { round } from 'lodash';

const inputData = [
  { department: 'Cardiology', label: 'Dr. Smith', value: 5 },
  { department: 'Orthopedics', label: 'Dr. Brown', value: 8 },
  { department: 'Orthopedics', label: 'Dr. White', value: 3 },
  { department: 'Pediatrics', label: 'Dr. Green', value: 2 },
  { department: 'Cardiology', label: 'Dr. Red', value: 20 },
  { department: 'Orthopedics', label: 'Dr. Blue', value: 10 },
  { department: 'Orthopedics', label: 'Dr. Yellow', value: 7 },
  { department: 'Pediatrics', label: 'Dr. Purple', value: 12 }
];

const Default = () => {
  const theme = useTheme();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('byFinancialYear');
  const [selectedChart, setSelectedChart] = useState('Revenue');
  const [doctorOpdData, setDoctorOpdData] = useState(inputData);
  const [leads, setLeads] = useState([]);
  const [addFollowIndex, setAddFollowIndex] = useState(null);
  const [openAddFollowUp, setOpenAddFollowUp] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [editFollowUpId, setEditFollowUpId] = useState(null);
  const [followUpData, setFollowUpData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [client, setclient] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [paid, setPaid] = useState(0);
  const [unpaid, setUnpaid] = useState(0);
  const [pending, setPending] = useState(0);
  const [leadColours, setLeadColours] = useState([]);
  const [rleadCounts, setrLeadCounts] = useState([]);
  const [leadCounts, setLeadCounts] = useState([]);
  const [leadLabels, setLeadLabels] = useState([]);
  const [rleadLabels, setrLeadLabels] = useState([]);
  const [chartInvoice, setChartInvoive] = useState([]);
  const [chartInvoiceMoney, setChartInvoiveMoney] = useState([]);
  const [chartInvoiceLabels, setChartInvoiveLabels] = useState([]);
  const [clientmonthlabel, setClientMonthLabel] = useState([]);
  const [clientmonthcount, setClientMonthCount] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const systemRights = useSelector((state) => state.systemRights.systemRights);
  const [productCategories, setProductCategories] = useState([]);
  const [chartInvoicePaidMoney, setChartInvoicePaidMoney] = useState([]);

  const [form, setForm] = useState({
    followupDate: '',
    followupTime: '',
    leadstatus: '',
    comment: '',
    leadId: ''
  });

  const [staff, setStaff] = useState([]);
  const [birthday, setBirthDay] = useState([]);
  const [policy, setPolicy] = useState([]);
  const [premium, setPremium] = useState(0);
  const [financialYearData, setFinancialYearData] = useState([]);
  const [selectedFY, setSelectedFY] = useState('');
  const [selectedYearId, setSelectedYearId] = useState('');

  const handleYearChange = (event) => {
    setSelectedYearId(event.target.value);
    console.log('Year ', selectedYearId);
  };

  // const [invoice, setinvoice] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchFYData = async () => {
    const res = await get('financialYear');
    console.log('FY data:', res.data);
    if (res.data) {
      setFinancialYearData(res.data);
    } else setFinancialYearData([]);
  };

  const fetchStaff = async () => {
    try {
      const response = await get('/administrative');
      setStaff(response.data || []);
      console.log('Fetched staff:', response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    // fetchPolicyCount();
    fetchFYData();
    fetchStaff();
    // fetchPolicy();
  }, []);

  const [invoicetotal, setinvoicetotal] = useState(0);
  const [leadtotal, setleadtotal] = useState(0);
  const fetchinvoice = async () => {
    try {
      const response = await get('invoiceRegistration');
      if (response.status === true) {
        const filteredData = response.invoices.filter((invoice) => invoice.gstType === 'gst');
        const nonGstData = response.invoices.filter((invoice) => invoice.gstType === 'non-gst');
        // setGstData(filteredData || []);
        // setNonGstData(nonGstData || []);
        // console.log('filterdata', response);
        // console.log('nongst:', nonGstData);

        // console.log('Fetched invoice:', response.data);
        setinvoicetotal(response?.invoices.length);
        // console.log('total invoice', invoicetotal);
      }
    } catch (error) {
      console.error('Error fetching  invoice:', error);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    // if (systemRights?.actionPermissions?.['lead']) {
    //   setLeadPermission(systemRights.actionPermissions['lead']);
    // }
    fetchLeadStatusOptions();
  }, [systemRights]);

  const fetchLeadStatusOptions = async () => {
    try {
      const response = await get('leadstatus');
      setStatusOptions(response.data || []);
    } catch (err) {
      toast.error('Failed to load leadstatus options');
      console.error(err);
    }
  };

  const handleInfoClose = () => {
    setOpenAddFollowUp(false);
    setForm({
      followupDate: '',
      followupTime: '',
      leadstatus: '',
      comment: ''
    });
    setAddFollowIndex(null);
    setEditFollowUpId(null);
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFollowUp = (id, data) => {
    setEditFollowUpId(id);
    setIsEditMode(true);
    setForm({
      followupDate: data.followupDate || '',
      followupTime: data.followupTime || '',
      leadstatus: data.leadstatus?._id || data.leadstatus || '',
      comment: data.comment || ''
    });
  };

  const handleDeleteFollowUp = async (followUpId) => {
    try {
      await remove(`lead/followup/${followUpId}`);
      toast.success('Follow-up deleted');
      setFollowUpData((prev) => prev.filter((item) => item._id !== followUpId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete follow-up');
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && editFollowUpId) {
        await put(`lead/followup/${editFollowUpId}`, form);
        toast.success('Follow-up updated successfully');
      } else {
        // console.log(form, addFollowIndex);
        const payload = { ...form, leadId: addFollowIndex };
        await post('lead/followup', payload);
        toast.success('Follow-up added successfully');
      }

      await fetchFollowUps(addFollowIndex);
      // await getLeadData();

      setForm({
        followupDate: '',
        followupTime: '',
        leadstatus: '',
        comment: ''
      });
      setEditFollowUpId(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save follow-up');
    }
  };

  useEffect(() => {
    fetchinvoice();
  }, []);

  const fetchClient = async () => {
    try {
      const role = localStorage.getItem('loginRole');
      let url = role === 'super-admin' ? 'clientRegistration' : 'admin-clientRegistration';
      const response = await get(url);
      setclient(response.data || []);
      // console.log(response.data.length);
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await get('lead');

      const filteredLeads = (response.data || []).filter((lead) => Array.isArray(lead.followups) && lead.followups.length > 0);

      const now = new Date();

      const sortedLeads = filteredLeads.sort((a, b) => {
        const lastA = a.followups[a.followups.length - 1];
        const lastB = b.followups[b.followups.length - 1];

        const dateA = new Date(`${lastA.followupDate}T${lastA.followupTime}`);
        const dateB = new Date(`${lastB.followupDate}T${lastB.followupTime}`);

        const isPastA = dateA < now;
        const isPastB = dateB < now;

        // Past first
        if (isPastA && !isPastB) return -1;
        if (!isPastA && isPastB) return 1;

        // Inside same group → sort ascending (nearest first)
        return dateA - dateB;
      });

      setLeads(sortedLeads);
      setleadtotal(sortedLeads.length);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchProductCategories = async () => {
    try {
      const response = await get('/productOrServiceCategory');
      setProductCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };
  useEffect(() => {
    fetchProductCategories();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const assignedTo = `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim();
    const product = lead.productService?.productName || '';

    const matchesStaff = !selectedStaff || assignedTo === selectedStaff;
    const matchesProduct = !selectedProduct || product === selectedProduct;
    const matchesSearch = !searchQuery || fullName.includes(searchQuery.toLowerCase());

    return matchesStaff && matchesProduct && matchesSearch;
  });

  const invoicePaymentStatusData = {
    type: 'donut',
    head: 'Invoice Payment Status',
    height: 320,
    series: [paid, pending, unpaid], // counts
    options: {
      labels: ['Paid', 'Partially Paid', 'Unpaid'],
      colors: ['#4caf50', '#ff9800', '#f44336'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Invoices` }
      }
    }
  };

  const getLeadNos = async () => {
    const res = await get('lead/status');

    setLeadColours(res?.colors || []);
    setLeadCounts(res?.counts || []);
    setLeadLabels(res?.labels || []);
    setrLeadLabels(res?.rlabels || []);
    setrLeadCounts(res?.rcounts || []);

    // console.log(res);
  };
  const getInvoiceNos = async () => {
    const res = await get('invoiceRegistration/status');
    console.log(res);
    setChartInvoicePaidMoney(res?.monthlyPaidTotals);
    setPaid(res?.summary?.paid);
    setUnpaid(res?.summary?.unpaid);
    setPending(res?.summary?.pending);
    setChartInvoive(res?.monthlyCounts);
    setChartInvoiveMoney(res?.monthlyTotals);
    setChartInvoiveLabels(res?.monthLabels);
    // console.log(res);
  };
  const getClientNos = async () => {
    const res = await get('admin-clientRegistration/status');
    setClientMonthCount(res?.monthlyCounts);
    setClientMonthLabel(res?.monthlyCounts);
    // console.log(res);
  };

  useEffect(() => {
    getInvoiceNos();
    getLeadNos();
    getClientNos();
  }, []);

  const fetchFollowUps = async (leadId) => {
    try {
      const response = await get(`lead/followup`);
      setFollowUpData(response.data || []);
    } catch (err) {
      console.error('Error loading followups:', err);
      toast.error('Unable to fetch follow-up data');
    }
  };

  const handleopenAddFollowUp = (leadId) => {
    setAddFollowIndex(leadId);
    fetchFollowUps(leadId);
    setOpenAddFollowUp(true);
    const selectedLead = followUpData.find((lead) => String(lead._id) === String(leadId));
    setDone(selectedLead?.status === 'LS' || selectedLead?.status === 'LW');
  };

  // console.log(leadColours);

  const leadStatusData = {
    type: 'donut',
    head: ' Lead Status',
    height: 320,
    series: [...leadCounts],
    // series: [],
    options: {
      labels: [...leadLabels],
      // labels: [],
      colors: [...leadColours],
      // colors: [],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Leads` }
      }
    }
  };

  const referenceSourceData = {
    type: 'donut',
    head: ' Lead References',
    height: 320,
    series: [...rleadCounts],
    options: {
      labels: [...rleadLabels],
      // colors: ['#29b6f6', '#8e24aa', '#43a047', '#ff7043', '#fdd835'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Customers` }
      }
    }
  };
  // --- existing datasets ---
  const invoiceDataFY = {
    title: 'Monthly Invoices (FY)',
    xLabels: [...chartInvoiceLabels],
    seriesData: [[...chartInvoice]],
    seriesLabelMap: { Invoice: 'Invoices' },
    colors: ['#1E88E5']
  };

  const clientDataFY = {
    title: 'Monthly Clients (FY)',
    xLabels: invoiceDataFY.xLabels,
    seriesData: [[...clientmonthcount]],
    seriesLabelMap: { Client: 'Clients' },
    colors: ['#43A047']
  };

  const revenueDataFY = {
    title: 'Monthly Revenue (FY)',
    xLabels: invoiceDataFY.xLabels,
    seriesData: [[...chartInvoiceMoney], [...chartInvoicePaidMoney]],
    seriesLabelMap: {
      Revenue: 'Revenue',
      Paid: 'Paid'
    },
    colors: ['#FB8C00', '#43A047']
  };

  // map for easy access
  const chartOptions = {
    Invoice: invoiceDataFY,
    Client: clientDataFY,
    Revenue: revenueDataFY
  };

  // Merged financial year data
  const mergedDataFY = {
    title: 'Financial Year Overview',
    xLabels: invoiceDataFY.xLabels,
    seriesData: [invoiceDataFY.seriesData[0], clientDataFY.seriesData[0], revenueDataFY.seriesData[0]],
    seriesLabelMap: {
      Invoice: 'Invoices',
      Client: 'Clients',
      Revenue: 'Revenue'
    },
    colors: [invoiceDataFY.colors[0], clientDataFY.colors[0], revenueDataFY.colors[0]]
  };

  const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const leadStatusChange = async (status) => {
    try {
      const selectedLead = followUpData.find((lead) => String(lead._id) === String(addFollowIndex));

      if (!selectedLead) {
        toast.error('No lead selected');
        return;
      }

      const confirmAction = window.confirm(`Are you sure you want to mark this lead as ${status === 'LW' ? 'Won' : 'Lost'}?`);

      if (!confirmAction) return;

      const response = await put(`lead/leadban/${selectedLead._id}`, { status }, { params: { companyId: selectedLead.companyId } });

      console.log(response);

      if (response.success) {
        toast.success(`Lead marked as ${status === 'LW' ? 'Won' : 'Lost'}`);
      } else {
        toast.error(response.message || 'Failed to update lead status');
      }
      handleInfoClose();
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Something went wrong');
    }
  };

  const handleFilter = (e) => {
    console.log('filter changed ', e.target.value);
    setSelectedFY(e.target.value);
  };

  useEffect(() => {
    if (financialYearData.length === 0) return;

    const now = new Date(); // Jan 19, 2026
    const currentFinancialYear = financialYearData.find((year) => new Date(year.fromDate) <= now && new Date(year.toDate) >= now);

    if (currentFinancialYear?._id && selectedFY === '') {
      setSelectedFY(currentFinancialYear._id);
      localStorage.setItem('selectedFY', currentFinancialYear._id);
    }
  }, [financialYearData]);

  console.log('Selected Year', selectedFY);

  const fetchPolicyDetail = useCallback(async () => {
    console.log('calling policy data ', selectedFY);
    if (!selectedFY) return; // Don't call if no FY

    setLoading(true);
    try {
      console.log('Fetching with FY:', selectedFY);
      const res = await get(`policyDetail?financialYear=${selectedFY}`);
      console.log('policyDetail data:', res);
      if (res.status) {
        setPolicy(res.data);
        const totalPremiumSum = policy.reduce((sum, p) => {
          // console.log(`SUM: ${sum} ,tatolA ${p.totalAmount} `);
          // if (p.financialYear === selectedFY) {
          //   // yearCount = yearCount + 1;
          return Number(sum) + (Number(p.totalAmount) || 0);
          // }
          // return sum;
        }, 0);

        const totalPerLakh = (totalPremiumSum / 100000).toFixed(2);

        setPremium(parseFloat(totalPerLakh));
      } else setPolicy([]);
      // console.log('Policy ', policy);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedFY]);

  useEffect(() => {
    if (selectedFY) {
      fetchPolicyDetail();
    }
  }, [selectedFY, fetchPolicyDetail]);

  useEffect(() => {
    if (!policy || policy.length === 0 || !selectedFY) {
      setPremium(0);
      return;
    }

    const totalPremiumSum = policy.reduce((sum, p) => {
      return sum + (Number(p.totalAmount) || 0);
    }, 0);

    // console.log('Total Premium Sum:', totalPremiumSum);
    const totalPerLakh = totalPremiumSum.toFixed(2);
    // console.log('Premium Per Lakh:', totalPerLakh);
    setPremium(parseFloat(totalPerLakh));
  }, [policy, selectedFY]); // ✅ Runs when policy OR selectedFY changes

  const departmentSummary = policy?.reduce((acc, item) => {
    const dept = item?.insDepartment?.insDepartment;
    const amount = Number(item.totalAmount) || 0;

    if (!dept) return acc;

    if (!acc[dept]) {
      acc[dept] = {
        department: dept,
        count: 0,
        totalAmount: 0
      };
    }

    acc[dept].count += 1;
    acc[dept].totalAmount += amount;

    return acc;
  }, {});

  const departmentArray = Object.values(departmentSummary);

  const FY_MONTH_ORDER = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

  const monthlyAmountArray = useMemo(() => {
    const summary = policy.reduce((acc, item) => {
      // pick whichever date exists
      const validDate = item.startDate || item.tpStartDate || item.odStartDate;

      if (!validDate) return acc;

      const date = new Date(validDate);
      const monthIndex = date.getMonth();
      const month = date.toLocaleString('default', { month: 'short' });
      const amount = Number(item.totalAmount) || 0;

      acc[monthIndex] ??= {
        month,
        totalAmount: 0,
        count: 0,
        monthIndex
      };

      // acc[monthIndex] ??= { month, totalAmount: 0, monthIndex };
      acc[monthIndex].totalAmount += amount;
      acc[monthIndex].count += 1;

      return acc;
    }, {});

    return Object.values(summary)
      .sort((a, b) => FY_MONTH_ORDER.indexOf(a.monthIndex) - FY_MONTH_ORDER.indexOf(b.monthIndex))
      .map(({ month, totalAmount, count }) => ({
        month,
        totalAmount,
        count
      }));
  }, [policy]);

  const monthlyArray = Object.values(monthlyAmountArray);

  const isBirthdayToday = (dob) => {
    if (!dob) return false;

    const today = new Date();
    const birthDate = new Date(dob);

    return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
  };

  const todaysBirthdays = staff.filter((item) => isBirthdayToday(item?.basicDetails?.dateOfBirth));

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
            <Typography variant="h6">Loading Dashboard...</Typography>
          </Paper>
        </Box>
      )}

      <Grid container spacing={gridSpacing}>
        {/* <Card> */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="filter">Filter</InputLabel>
            <Select labelId="filter" label="filter" name="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="byFinancialYear">By Financial Year</MenuItem>
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
                value={selectedFY}
                onChange={(e) => handleFilter(e)}
              >
                {financialYearData.length > 0 &&
                  financialYearData.map((type) => (
                    <MenuItem
                      key={type._id}
                      value={type._id}
                      style={{
                        textAlign: 'center'
                        // padding: '8px 8px'
                      }}
                    >
                      {new Date(type.fromDate).getFullYear()} - {new Date(type.toDate).getFullYear()}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </>
        ) : null}
        {/* </Card> */}

        {/* Top Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} sm={6} xs={12}>
              <ReportCard
                primary={staff.length.toLocaleString('en-IN')}
                secondary="Total Staff"
                color={theme.palette.error.main}
                footerData=""
                iconPrimary={TrendingUpIcon}
              />
            </Grid>
            <Grid item lg={4} sm={6} xs={12}>
              <ReportCard
                primary={policy.length.toLocaleString('en-IN')}
                secondary="Total Policies"
                color={theme.palette.info.main}
                footerData=""
                iconPrimary={TrendingDownIcon}
              />
            </Grid>
            {/* <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={leadtotal.toString()}
              secondary="Total Endorsement"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={MonetizationOnTwoTone}
            />
          </Grid> */}
            <Grid item lg={4} sm={6} xs={12}>
              <ReportCard
                primary={premium.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                secondary="Total Premium"
                color={theme.palette.secondary.main}
                footerData=""
                iconPrimary={PersonIcon}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card spacing={gridSpacing} sx={{ p: 2 }}>
            <Box sx={{ width: '100%', height: 350 }}>{departmentArray?.length > 0 && <DepartmentBarChart data={departmentArray} />}</Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card spacing={gridSpacing} sx={{ p: 2 }}>
            <Box sx={{ width: '100%', height: 350 }}>{monthlyArray?.length > 0 && <MonthlyBarChart data={monthlyArray} />}</Box>
          </Card>
        </Grid>


{/* Follow-up Table */}
      <Grid item xs={12}>
        <Card sx={{ mt: 4, p: 3 }}>
          {/* Search Bar */}
          <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontSize={18} gutterBottom>
              Today's Lead Follow Up Details
            </Typography>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                placeholder="Search Your Data"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {[
                    'SN',
                    'Company Name',
                    'Contact Name',
                    'Contact Phone',
                    'Status',
                    'Follow Up Date & Time',
                    'Last Communication',
                    'Product',
                    'Assign To',
                    // 'Follow Up',
                    'Action'
                  ].map((head) => (
                    <TableCell key={head}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead, index) => {
                    const followup = lead.followups?.[lead.followups.length - 1];

                    const assignedName = lead.assignTo?.basicDetails
                      ? `${lead.assignTo.basicDetails.firstName || ''} ${lead.assignTo.basicDetails.lastName || ''}`.trim()
                      : 'N/A';

                    const contact = lead.contact?.[0];

                    return (
                      <TableRow key={lead._id || index}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>{lead.companyName}</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>{contact?.name}</TableCell>
                        <TableCell>{contact?.phone}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor:
                                lead?.status === 'LS'
                                  ? '#ffcccc' // light red
                                  : lead?.status === 'LW'
                                    ? '#ccffcc' // light green
                                    : lead?.leadstatus?.colorCode || '#f5f5f5',
                              color:
                                lead?.status === 'LS'
                                  ? '#b30000' // dark red
                                  : lead?.status === 'LW'
                                    ? '#006600' // dark green
                                    : '#000000',
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
                            {lead?.status === 'LS'
                              ? 'Lead Lost'
                              : lead?.status === 'LW'
                                ? 'Lead Won'
                                : lead?.leadstatus?.LeadStatus || 'N/A'}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ minWidth: 200 }}>
                          <Box
                            sx={{
                              color: followup?.followupDate && new Date(followup.followupDate) < new Date() ? 'red' : 'inherit'
                            }}
                          >
                            {followup?.followupDate ? followup.followupDate.slice(0, 10) : 'N/A'}
                            &nbsp; &nbsp; &nbsp;
                            {followup?.followupTime ? followup.followupTime : 'N/A'}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ minWidth: 300 }}>{followup?.comment || 'N/A'}</TableCell>

                        <TableCell>{lead.productService?.subProductName || 'N/A'}</TableCell>
                        <TableCell sx={{ minWidth: 160 }}>{assignedName}</TableCell>
                        {/* <TableCell sx={{ minWidth: 150 }}>{followup?.updatedAt ? followup.updatedAt.slice(0, 10) : 'N/A'}</TableCell> */}
                        <TableCell>
                          {/* <Button variant="contained" color="primary" size="small" onClick={() => handleopenAddFollowUp(lead._id)}> */}
                          <IconButton onClick={() => handleopenAddFollowUp(lead._id)}>
                            <InfoIcon sx={{ color: 'primary.main' }} />
                          </IconButton>
                          {/* </Button> */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data available in table
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Grid>


        <Grid item xs={12}>
          <Card spacing={gridSpacing} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '50%', height: 100 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  🎂 Today's Staff Birthdays
                </Typography>
                <Table sx={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ height: 'auto' }}>
                      <TableCell>SN</TableCell>
                      <TableCell>Staff Name</TableCell>
                      <TableCell>DOB</TableCell>
                      {/* <TableCell>Date of Aniversary</TableCell> */}
                      {/* <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaysBirthdays.length > 0 ? (
                      todaysBirthdays.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.basicDetails.firstName}</TableCell>
                          <TableCell>
                            {item.basicDetails.dateOfBirth
                              ? new Date(item.basicDetails.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No Staff Birthday Today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>

              <Box sx={{ width: '50%', height: 150 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  💍 Today's Staff Anniversaries
                </Typography>
                <Table sx={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ height: 'auto' }}>
                      <TableCell>SN</TableCell>
                      <TableCell>Staff Name</TableCell>
                      <TableCell>DOA</TableCell>
                      {/* <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaysBirthdays.length > 0 ? (
                      todaysBirthdays.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.basicDetails.firstName}</TableCell>
                          <TableCell>
                            {item.basicDetails.dateOfBirth
                              ? new Date(item.basicDetails.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No Staff Anniversary Today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card spacing={gridSpacing} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '50%', height: 100 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  🎂 Today's Client Birthdays
                </Typography>
                <Table sx={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ height: 'auto' }}>
                      <TableCell>SN</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>DOB</TableCell>
                      {/* <TableCell>Date of Aniversary</TableCell> */}
                      {/* <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaysBirthdays.length > 0 ? (
                      todaysBirthdays.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.basicDetails.firstName}</TableCell>
                          <TableCell>
                            {item.basicDetails.dateOfBirth
                              ? new Date(item.basicDetails.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No Client's Birthday Today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>

              <Box sx={{ width: '50%', height: 150 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  💍 Today's Client Anniversaries
                </Typography>
                <Table sx={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ height: 'auto' }}>
                      <TableCell>SN</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>DOA</TableCell>
                      {/* <TableCell>Date of Aniversary</TableCell> */}
                      {/* <TableCell sx={{ width: 80, px: 1, py: 0.2 }}>Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaysBirthdays.length > 0 ? (
                      todaysBirthdays.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.basicDetails.firstName}</TableCell>
                          <TableCell>
                            {item.basicDetails.dateOfBirth
                              ? new Date(item.basicDetails.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No Client's Anniversary Today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Default;

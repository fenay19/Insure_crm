import { Card, Grid } from '@mui/material';
import { gridSpacing } from 'config';
import React, { useEffect } from 'react';
import ReportCard from './ReportCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';
import { useTheme } from '@mui/material/styles';
import { get, post } from 'api/api';
import ReusableBarChart from '../Charts/BarCharts/ReusbaleBarChart';
import DepartmentOpdPieChart from '../Charts/PieChart/DepartmentOPD';

const getCurrentFY = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // FY starts in April
  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

const SuperAdminDashboard = () => {
  const theme = useTheme();
  const [selectedFY1, setSelectedFY1] = React.useState(getCurrentFY());
  const [selectedFY2, setSelectedFY2] = React.useState(getCurrentFY());
  const [selectedFY3, setSelectedFY3] = React.useState(getCurrentFY());
  const [selectedFY4, setSelectedFY4] = React.useState(getCurrentFY());

  const [totalAccounts, setTotalAccounts] = React.useState(0);
  const [totalActiveAccounts, setTotalActiveAccounts] = React.useState(0);
  const [totaltrialAccounts, setTotalTrialAccounts] = React.useState(0);
  const [totalActiveTrialAccounts, setTotalActiveTrialAccounts] = React.useState(0);
  const [totalPaidAccounts, setTotalPaidAccounts] = React.useState(0);
  const [totalActivePaidAccounts, setTotalActivePaidAccounts] = React.useState(0);
  const [totalInvoiceGenerated, setTotalInvoiceGenerated] = React.useState(0);
  const [totalRevenueWithoutGST, setTotalRevenueWithoutGST] = React.useState(0);
  const [totalGSTAmount, setTotalGSTAmount] = React.useState(0);
  const [totalRevenueWithGST, setTotalRevenueWithGST] = React.useState(0);
  const [totalSystemUsers, setTotalSystemUsers] = React.useState(0);
  const [monthlyLabels, setMonthlyLabels] = React.useState([]);
  const [monthlySeries, setMonthlySeries] = React.useState([]);
  const [monthlyValueLabels, setMonthlyValueLabels] = React.useState([]);
  const [monthlyValueSeries, setMonthlyValueSeries] = React.useState([]);
  const [clientMonthlyLabels, setClientMonthlyLabels] = React.useState([]);
  const [clientMonthlySeries, setClientMonthlySeries] = React.useState([]);
  const [chartData, setChartData] = React.useState({
    head: 'Monthly Revenue',
    type: 'pie',
    height: 320,
    options: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      legend: { position: 'bottom' },
      colors: [
        '#2196f3',
        '#3f51b5',
        '#00bcd4',
        '#009688',
        '#8bc34a',
        '#cddc39',
        '#ff9800',
        '#ff5722',
        '#9c27b0',
        '#607d8b',
        '#795548',
        '#e91e63'
      ]
    },
    series: Array(12).fill(0)
  });
  const fyList = [
    '2025-2026',
    '2026-2027',
    '2027-2028',
    '2028-2029',
    '2029-2030',
    '2030-2031',
    '2031-2032',
    '2032-2033',
    '2033-2034',
    '2034-2035'
  ];

  const getData = async () => {
    const res = await get('clientRegistration/cardsInfo');
    setTotalAccounts(res.noOfClients);
    setTotalActiveAccounts(res.activeAccounts);
    setTotalTrialAccounts(res.trialAccountsTotal);
    setTotalPaidAccounts(res.paidAccountsTotal);
    setTotalActiveTrialAccounts(res.trialAccountsActive);
    setTotalActivePaidAccounts(res.paidAccountsActive);

    const response = await get('invoiceRegistration/cardsInfo');
    setTotalInvoiceGenerated(response.noOfInvoices);
    setTotalRevenueWithoutGST(response.totalAmount);
    setTotalGSTAmount(response.totalRoundUp - response.totalAmount);
    setTotalRevenueWithGST(response.totalRoundUp);
    setTotalSystemUsers(response.noOfUsers);
    // console.log(response);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const getRevenuePerMonth = async () => {
      const res = await post(`/invoiceRegistration/revenue-summary`, { fy: selectedFY3 });
      console.log(res);

      // res should be like { Apr: 25000, May: 30000, Jun: 22000, ... }
      const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      const series = months.map((m) => res[m] || 0);

      setChartData((prev) => ({ ...prev, series }));
    };

    getRevenuePerMonth();
  }, [selectedFY3]);

  useEffect(() => {
    const getPoliciesPerMonth = async () => {
      const res = await post(`policyDetail/monthly-counts`, {
        financialYear: selectedFY1
      });

      if (res.data) {
        const labels = res.data.map((item) => item.month);
        const series = res.data.map((item) => item.count);
        setMonthlyLabels(labels);
        setMonthlySeries(series);
      }
    };

    getPoliciesPerMonth();
  }, [selectedFY1]);

  useEffect(() => {
    const getClientsPerMonth = async () => {
      const res = await post(`clientRegistration/clients-per-month`, {
        year: selectedFY4 // "2028-2029"
      });

      setClientMonthlyLabels(res.xLabels); // ['Apr','May',...]
      setClientMonthlySeries(res.seriesData); // [12,18,10,...]
    };

    getClientsPerMonth();
  }, [selectedFY4]);

  useEffect(() => {
    const getMonthlyInvoiceValue = async () => {
      const res = await post('invoiceRegistration/monthly-value', {
        financialYear: selectedFY2
      });

      setMonthlyValueLabels(res.xLabels);
      setMonthlyValueSeries(res.seriesData);
    };

    getMonthlyInvoiceValue();
  }, [selectedFY2]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalAccounts.toString()}
              secondary="Total Accounts"
              color={theme.palette.error.main}
              footerData=""
              iconPrimary={AccountCircleIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalActiveAccounts.toString()}
              secondary="Total Active Accounts"
              color={theme.palette.info.main}
              footerData=""
              iconPrimary={VerifiedUserIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totaltrialAccounts.toString()}
              secondary="Trial Accounts"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={HourglassEmptyIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalActiveTrialAccounts.toString()}
              secondary="Active Trial Accounts"
              color={theme.palette.secondary.main}
              footerData=""
              iconPrimary={PlayCircleFilledWhiteIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalPaidAccounts.toString()}
              secondary="Paid Accounts"
              color={theme.palette.success.main}
              footerData=""
              iconPrimary={PaidIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalActivePaidAccounts.toString()}
              secondary="Active Paid Accounts"
              color={theme.palette.primary.main}
              footerData=""
              iconPrimary={CheckCircleIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalInvoiceGenerated.toString()}
              secondary="Total Invoice Generated"
              color={theme.palette.error.main}
              footerData=""
              iconPrimary={DescriptionIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalRevenueWithoutGST.toString()}
              secondary="Revenue (without GST)"
              color={theme.palette.info.main}
              footerData=""
              iconPrimary={AttachMoneyIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalGSTAmount.toString()}
              secondary="GST Amount"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={ReceiptIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalRevenueWithGST.toString()}
              secondary="Revenue (with GST)"
              color={theme.palette.secondary.main}
              footerData=""
              iconPrimary={AccountBalanceWalletIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalSystemUsers.toString()}
              secondary="Total System Users"
              color={theme.palette.success.main}
              footerData=""
              iconPrimary={GroupIcon}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 4 }}>
            <Card sx={{ p: 2 }}>
              <select style={{ padding: '8px', borderRadius: '6px' }} value={selectedFY1} onChange={(e) => setSelectedFY1(e.target.value)}>
                {fyList.map((fy, i) => (
                  <option key={i} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>

              <ReusableBarChart
                title="Policies Per Month"
                seriesData={[monthlySeries]} // MUST be inside array → 1 series
                xLabels={monthlyLabels}
                seriesLabelMap={{ Policies: 'Policies' }}
                colors={['#4caf50']}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ mt: 4 }}>
            <Card sx={{ p: 2 }}>
              <select style={{ padding: '8px', borderRadius: '6px' }} value={selectedFY2} onChange={(e) => setSelectedFY4(e.target.value)}>
                {fyList.map((fy, i) => (
                  <option key={i} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>

              <ReusableBarChart
                title="Monthly Clients"
                seriesData={[clientMonthlySeries]}
                xLabels={clientMonthlyLabels}
                seriesLabelMap={{ Clients: 'Invoice Value' }}
                colors={['#9c27b0']}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ mt: 4 }}>
            <Card sx={{ p: 2 }}>
              <select style={{ padding: '8px', borderRadius: '6px' }} value={selectedFY2} onChange={(e) => setSelectedFY2(e.target.value)}>
                {fyList.map((fy, i) => (
                  <option key={i} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>

              <ReusableBarChart
                title="Monthly Invoice Value"
                seriesData={[monthlyValueSeries]}
                xLabels={monthlyValueLabels}
                seriesLabelMap={{ Revenue: 'Invoice Value' }}
                colors={['#9c27b0']}
              />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <select style={{ padding: '8px', borderRadius: '6px' }} value={selectedFY3} onChange={(e) => setSelectedFY3(e.target.value)}>
                {fyList.map((fy, i) => (
                  <option key={i} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>

              <DepartmentOpdPieChart chartData={chartData} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SuperAdminDashboard;

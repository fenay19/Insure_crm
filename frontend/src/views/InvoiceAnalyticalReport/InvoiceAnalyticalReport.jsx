import { MonetizationOnTwoTone } from '@mui/icons-material';
import { Card, Grid } from '@mui/material';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReportCard from 'views/Dashboard/Default/ReportCard';
import PersonIcon from '@mui/icons-material/Person';
import { gridSpacing } from 'config';
import { useTheme } from '@mui/material/styles';
import { post } from 'api/api';
import ReusableBarChart from 'views/Dashboard/Charts/BarCharts/ReusbaleBarChart';
import DepartmentOpdPieChart from 'views/Dashboard/Charts/PieChart/DepartmentOPD';

// -------------------------
// MONTH LIST GENERATOR
// -------------------------
const generateMonthOptions = (years = 6) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  const list = [];
  for (let y = currentYear; y < currentYear + years; y++) {
    months.forEach((m) => {
      list.push({ value: `${m}-${y}`, label: `${m} ${y}` });
    });
  }
  return list;
};

const getCurrentMonthValue = () => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'short' }); // Jan, Feb...
  const year = now.getFullYear();
  return `${month}-${year}`;
};

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

// -------------------------
const InvoiceAnalyticalReport = () => {
  const theme = useTheme();

  const monthList = generateMonthOptions(6);

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

  // -------------------------
  // FILTER STATES (independent)
  // -------------------------
  const [selectedMonth1, setSelectedMonth1] = useState(getCurrentMonthValue());
  const [selectedFY1, setSelectedFY1] = useState(getCurrentFY());

  const [selectedMonth2, setSelectedMonth2] = useState(getCurrentMonthValue());
  const [selectedFY2, setSelectedFY2] = useState(getCurrentFY());

  const [selectedMonth3, setSelectedMonth3] = useState(getCurrentMonthValue());
  const [selectedFY3, setSelectedFY3] = useState(getCurrentFY());

  // -------------------------
  // CARD DATA STATES
  // -------------------------
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [invoicesTotal, setInvoicesTotal] = useState(0);
  const [invoicesTotalPaidAmount, setInvoicesTotalPaidAmount] = useState(0);

  const [dailyLabels, setDailyLabels] = useState([]);
  const [dailySeries, setDailySeries] = useState([]);

  const [monthlyLabels, setMonthlyLabels] = useState([]);
  const [monthlySeries, setMonthlySeries] = useState([]);

  const [dailyValueLabels, setDailyValueLabels] = useState([]);
  const [dailyValueSeries, setDailyValueSeries] = useState([]);

  const [monthlyValueLabels, setMonthlyValueLabels] = useState([]);
  const [monthlyValueSeries, setMonthlyValueSeries] = useState([]);

  // -------------------------/
  // API CALL - sends all filters
  // -------------------------
  const getData = async (payload) => {
    try {
      const res = await post('invoiceRegistration/cards/value', payload);
      // adapt to your real response shape
      setTotalInvoices(res.totalInvoices || 0);
      setInvoicesTotal(res.totalRoundUp || 0);
      setInvoicesTotalPaidAmount(res.totalPaidAmount || 0);
      // console.log('cards response', res);
    } catch (err) {
      console.error('Failed to fetch cards data', err);
    }
  };

  // call getData whenever any filter changes (you asked for immediate backend calls)
  useEffect(() => {
    const payload = {
      invoicesPerDayMonth: selectedMonth1,
      invoicesPerMonthFY: selectedFY1,
      dailyInvoiceValueMonth: selectedMonth2,
      monthlyInvoiceValueFY: selectedFY2,
      invoiceStatusMonth: selectedMonth3,
      invoiceRevenueFY: selectedFY3
    };
    getData(payload);
  }, [selectedMonth1, selectedFY1, selectedMonth2, selectedFY2, selectedMonth3, selectedFY3]);

  // -------------------------
  // SAMPLE PIE CHART DATA (static samples)
  // -------------------------
  // const invoiceRevenuePieData = {
  //   head: 'Monthly Revenue (Sample)',
  //   type: 'pie',
  //   height: 320,
  //   options: {
  //     labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  //     legend: { position: 'bottom' },
  //     colors: ['#2196f3', '#3f51b5', '#00bcd4', '#009688', '#8bc34a', '#cddc39']
  //   },
  //   series: [25000, 30000, 22000, 28000, 35000, 29000]
  // };

  const [chartData, setChartData] = useState({
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

  const [chartStatusData, setChartStatusData] = useState({
    head: 'Invoice Status',
    type: 'pie',
    height: 320,
    options: {
      labels: ['Paid', 'Unpaid', 'Partial Paid'],
      legend: { position: 'bottom' },
      colors: ['#4caf50', '#f44336', '#ff9800']
    },
    series: [0, 0, 0]
  });

  // const invoiceStatusPieData = {
  //   head: 'Invoice Status',
  //   type: 'pie',
  //   height: 320,
  //   options: {
  //     labels: ['Paid', 'Unpaid', 'Partial Paid'],
  //     legend: { position: 'bottom' },
  //     colors: ['#4caf50', '#f44336', '#ff9800']
  //   },
  //   series: [120, 40, 20]
  // };

  useEffect(() => {
    const getDailyInvoices = async () => {
      const res = await post('invoiceRegistration/daily', {
        month: selectedMonth1
      });

      setDailyLabels(res.xLabels);
      setDailySeries(res.seriesData);
    };

    getDailyInvoices();
  }, [selectedMonth1]);

  useEffect(() => {
    const getInvoicesPerMonth = async () => {
      const res = await post(`invoiceRegistration/monthly`, {
        year: selectedFY1 // "2028-2029"
      });

      setMonthlyLabels(res.xLabels); // ['Apr','May',...]
      setMonthlySeries(res.seriesData); // [12,18,10,...]
    };

    getInvoicesPerMonth();
  }, [selectedFY1]);

  useEffect(() => {
    const getDailyInvoiceValue = async () => {
      const res = await post('invoiceRegistration/daily-value', {
        month: selectedMonth2
      });

      setDailyValueLabels(res.xLabels);
      setDailyValueSeries(res.seriesData);
    };

    getDailyInvoiceValue();
  }, [selectedMonth2]);

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

  useEffect(() => {
    const getInvoiceStatus = async () => {
      const res = await post(`/invoiceRegistration/status-summary`, { month: selectedMonth3 });

      // res should be like { paid: 10, unpaid: 5, pending: 2 }
      setChartStatusData((prev) => ({
        ...prev,
        series: [
          res.data.paid || 0,
          res.data.unpaid || 0,
          res.data.pending || 0 // show "Pending" as "Partial Paid" in chart
        ]
      }));
    };

    getInvoiceStatus();
  }, [selectedMonth3]);

  // -------------------------
  // RENDER UI
  // -------------------------
  return (
    <Grid container spacing={gridSpacing}>
      {/* CARDS */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard primary={totalInvoices} secondary="Total Invoices" color={theme.palette.error.main} iconPrimary={TrendingUpIcon} />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={invoicesTotal}
              secondary="Total Invoice Value"
              color={theme.palette.info.main}
              iconPrimary={TrendingDownIcon}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={invoicesTotalPaidAmount}
              secondary="Total Payment Received"
              color={theme.palette.warning.main}
              iconPrimary={MonetizationOnTwoTone}
            />
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={invoicesTotal - invoicesTotalPaidAmount}
              secondary="Total Overdue"
              color={theme.palette.secondary.main}
              iconPrimary={PersonIcon}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* DAILY INVOICES */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card sx={{ p: 2 }}>
          <select
            style={{ padding: '8px', borderRadius: '6px' }}
            value={selectedMonth1}
            onChange={(e) => setSelectedMonth1(e.target.value)}
          >
            {monthList.map((m, i) => (
              <option key={i} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <ReusableBarChart
            title="Invoices Per Day"
            seriesData={[dailySeries]} // correct for 1 series
            xLabels={dailyLabels}
            seriesLabelMap={{ Invoices: 'Invoices' }}
            colors={['#3f51b5']}
          />
        </Card>
      </Grid>

      {/* MONTHLY INVOICES (FY) */}
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
            title="Invoices Per Month"
            seriesData={[monthlySeries]} // MUST be inside array → 1 series
            xLabels={monthlyLabels}
            seriesLabelMap={{ Invoices: 'Invoices' }}
            colors={['#4caf50']}
          />
        </Card>
      </Grid>

      {/* DAILY VALUE */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card sx={{ p: 2 }}>
          <select
            style={{ padding: '8px', borderRadius: '6px' }}
            value={selectedMonth2}
            onChange={(e) => setSelectedMonth2(e.target.value)}
          >
            {monthList.map((m, i) => (
              <option key={i} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <ReusableBarChart
            title="Daily Invoice Value"
            seriesData={[dailyValueSeries]}
            xLabels={dailyValueLabels}
            seriesLabelMap={{ Revenue: 'Invoice Value' }}
            colors={['#ff9800']}
          />
        </Card>
      </Grid>

      {/* MONTHLY VALUE (FY) */}
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

      {/* PIE CHARTS */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <select
                style={{ padding: '8px', borderRadius: '6px' }}
                value={selectedMonth3}
                onChange={(e) => setSelectedMonth3(e.target.value)}
              >
                {monthList.map((m, i) => (
                  <option key={i} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <DepartmentOpdPieChart chartData={chartStatusData} />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
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

export default InvoiceAnalyticalReport;

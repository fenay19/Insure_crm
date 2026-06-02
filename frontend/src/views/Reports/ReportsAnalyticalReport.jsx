import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Grid, Typography, Card, CardContent, Box, MenuItem, TextField, CircularProgress, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { get } from '../../api/api';
import ReactApexChart from 'react-apexcharts';
// ─── Month helpers ───
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FY_MONTH_ORDER = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]; // Apr → Mar

// ─── KPI Card ───
const KpiCard = ({ label, value, color = '#26a69a' }) => (
  <Card
    sx={{
      borderTop: `4px solid ${color}`,
      boxShadow: '0 2px 14px 0 rgba(32,40,45,0.08)',
      height: '100%'
    }}
  >
    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color, mt: 0.5 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

// ─── Chart Card wrapper with optional filter row ───
const ChartCard = ({ title, filterRow, children }) => (
  <Card sx={{ boxShadow: '0 2px 14px 0 rgba(32,40,45,0.08)', borderRadius: 2 }}>
    <CardContent>
      {/* Title + filters row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {filterRow && <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>{filterRow}</Box>}
      </Box>
      {filterRow && <Divider sx={{ mb: 2 }} />}
      {children}
    </CardContent>
  </Card>
);

// ─── Small filter TextField ───
const FilterSelect = ({ label, value, onChange, children }) => (
  <TextField select label={label} value={value} onChange={(e) => onChange(e.target.value)} size="small" sx={{ minWidth: 130 }}>
    {children}
  </TextField>
);

// ─── Pie Chart Card ───
const PieChartCard = ({ title, bottomTitle, data, filterNode }) => {
  const options = {
    chart: { type: 'pie', toolbar: { show: false } },
    labels: data.labels,
    colors: data.datasets[0]?.backgroundColor || ['#26a69a'],
    legend: { position: 'bottom', markers: { radius: 12 } },
    dataLabels: { 
      enabled: true, 
      formatter: function (val) { return val.toFixed(1) + "%"; },
      dropShadow: { enabled: false }
    },
    stroke: { width: 1, colors: ['#fff'] },
    tooltip: {
      custom: function({ series, seriesIndex, w }) {
        const val = series[seriesIndex];
        const label = w.config.labels[seriesIndex];
        const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
        const percentage = ((val * 100) / total).toFixed(1) + '%';
        const displayValue = title.includes('Value') ? '₹ ' + val.toLocaleString('en-IN') : percentage;
        return `
          <div style="padding: 10px; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: inherit;">
            <div style="font-weight: 700; color: #212121; margin-bottom: 4px;">${label}</div>
            <div style="color: #616161;">${displayValue} (${val})</div>
          </div>
        `;
      }
    }
  };

  return (
    <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
          {filterNode && <Box sx={{ mb: 2 }}>{filterNode}</Box>}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#212121', fontSize: '1.1rem' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          {data.datasets[0]?.data ? (
            <ReactApexChart options={options} series={data.datasets[0].data} type="pie" height={320} />
          ) : null}
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 3, mb: 1, textAlign: 'center', color: '#212121', fontSize: '1rem' }}>
          {bottomTitle || title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ReportsAnalyticalReport = () => {
  // ─── Global State ───
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFY, setSelectedFY] = useState('');
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);

  // ─── Global (KPI) month filter ───
  const [selectedMonth, setSelectedMonth] = useState('all');

  // ─── Per-chart filter state ───
  // Chart 1 – Daily Policy: filter by month
  const [c1Month, setC1Month] = useState('all');

  // Chart 2 – Monthly All Dept: filter by department
  const [c2Dept, setC2Dept] = useState('all');

  // Chart 3 – Dept Wise Policy: filter by month
  const [c3Month, setC3Month] = useState('all');

  // Chart 4 – Monthly Individual Dept: filter by department
  const [c4Dept, setC4Dept] = useState('all');

  // Chart 5 – Company Wise: filter by department + month
  const [c5Dept, setC5Dept] = useState('all');
  const [c5Month, setC5Month] = useState('all');

  // Chart 6 – Dept Across Companies: filter by department
  const [c6Dept, setC6Dept] = useState('all');

  // Chart 7 – Retail vs Corporate: filter by department
  const [c7Dept, setC7Dept] = useState('all');

  // ─── Dummy Filter State for New Pie Charts ───
  const [dummyMonthFilter, setDummyMonthFilter] = useState('Month 1');
  const [dummyYearFilter, setDummyYearFilter] = useState('2023-2024');

  // ─── Initial data fetch ───
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [fyRes, deptRes, compRes] = await Promise.all([get('financialYear'), get('insDepartment'), get('insCompany')]);
        setFinancialYears(fyRes.data || []);
        setDepartments(deptRes.data || []);
        setCompanies(compRes.data || []);

        // Auto-select current FY
        const now = new Date();
        const currentFY = (fyRes.data || []).find((fy) => new Date(fy.fromDate) <= now && new Date(fy.toDate) >= now);
        if (currentFY) setSelectedFY(currentFY._id);
      } catch (err) {
        console.error('Dropdown load error:', err);
      }
    };
    fetchDropdowns();
  }, []);

  // ─── Fetch policies when FY changes ───
  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const isValidFY = selectedFY && selectedFY !== 'undefined' && selectedFY !== 'null' && selectedFY !== '';
      const url = isValidFY ? `policyDetail?financialYear=${selectedFY}` : `policyDetail`;
      const res = await get(url);
      setPolicies(res.status ? res.data || [] : []);
    } catch (err) {
      console.error(err);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFY]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // ─── Helper: get date from policy ───
  // Fallback to createdAt if startDates are missing in local DB dummy data
  const getDate = (p) => new Date(p.startDate || p.tpStartDate || p.odStartDate || p.createdAt || Date.now());

  // ─── Available months in dataset ───
  const availableMonths = useMemo(() => {
    const months = new Set();
    policies.forEach((p) => {
      const d = getDate(p);
      if (!isNaN(d)) months.add(d.getMonth());
    });
    return FY_MONTH_ORDER.filter((m) => months.has(m));
  }, [policies]);

  // ─── Available dept names in dataset ───
  const availableDeptNames = useMemo(() => {
    return [...new Set(policies.map((p) => p.insDepartment?.insDepartment).filter(Boolean))].sort();
  }, [policies]);

  // ─── Global filtered (used for KPIs) ───
  const filteredPolicies = useMemo(() => {
    if (selectedMonth === 'all') return policies;
    return policies.filter((p) => {
      const d = getDate(p);
      return d.getMonth() === parseInt(selectedMonth, 10);
    });
  }, [policies, selectedMonth]);

  // ─── KPI values (react to both year + month filters) ───
  const kpiData = useMemo(() => {
    const total = filteredPolicies.length;
    const totalPremium = filteredPolicies.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
    const totalBrokerage = filteredPolicies.reduce((sum, p) => sum + (Number(p.totalBrokerageAmount) || 0), 0);

    const deptCounts = {};
    const companyCounts = {};
    const monthCounts = {};

    filteredPolicies.forEach((p) => {
      const dept = p.insDepartment?.insDepartment || 'N/A';
      const comp = p.insCompany?.insCompany || p.insCompany?.companyName || 'N/A';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      companyCounts[comp] = (companyCounts[comp] || 0) + 1;

      const d = getDate(p);
      if (!isNaN(d)) {
        const mi = d.getMonth();
        monthCounts[mi] = (monthCounts[mi] || 0) + 1;
      }
    });

    const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    const topComp = Object.entries(companyCounts).sort((a, b) => b[1] - a[1])[0];

    // Default top month to N/A
    let topMonth = 'N/A';
    const topMonthEntry = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
    if (topMonthEntry) {
      topMonth = MONTH_NAMES[topMonthEntry[0]];
    }

    return {
      totalPolicies: total,
      totalPremium,
      totalBrokerage,
      topDepartment: topDept ? topDept[0] : 'N/A',
      topCompany: topComp ? topComp[0] : 'N/A',
      topMonth
    };
  }, [filteredPolicies]);

  // ═══════════════════════════════════════════════
  // CHART 1: Daily Policy (Line) — filter: Month
  // ═══════════════════════════════════════════════
  const c1Policies = useMemo(() => {
    if (c1Month === 'all') return policies;
    return policies.filter((p) => {
      const d = getDate(p);
      return !isNaN(d) && d.getMonth() === parseInt(c1Month, 10);
    });
  }, [policies, c1Month]);

  const dailyPolicyChart = useMemo(() => {
    const dayCounts = {};
    c1Policies.forEach((p) => {
      const d = getDate(p);
      if (isNaN(d)) return;
      const key = d.getDate();
      dayCounts[key] = (dayCounts[key] || 0) + 1;
    });
    const sortedDays = Object.keys(dayCounts)
      .map(Number)
      .sort((a, b) => a - b);
    return {
      series: [{ name: 'No. of Policy', data: sortedDays.map((d) => dayCounts[d]) }],
      options: {
        chart: { type: 'line', height: 320, toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#26a69a'],
        stroke: { width: 2.5, curve: 'smooth' },
        xaxis: { categories: sortedDays.map(String), title: { text: 'Date' } },
        yaxis: { title: { text: 'No. of Policy', style: { fontSize: '15' } } },
        grid: { borderColor: '#f1f1f1' },
        markers: { size: 4 },
        tooltip: { theme: 'light' }
      }
    };
  }, [c1Policies]);

  // ═══════════════════════════════════════════════
  // CHART 2: Monthly Policy (All Dept) — filter: Department
  // ═══════════════════════════════════════════════
  const c2Policies = useMemo(() => {
    if (c2Dept === 'all') return policies;
    return policies.filter((p) => p.insDepartment?.insDepartment === c2Dept);
  }, [policies, c2Dept]);

  const monthlyAllDeptChart = useMemo(() => {
    const monthCounts = {};
    c2Policies.forEach((p) => {
      const d = getDate(p);
      if (isNaN(d)) return;
      const mi = d.getMonth();
      monthCounts[mi] = (monthCounts[mi] || 0) + 1;
    });
    const orderedMonths = FY_MONTH_ORDER.filter((m) => monthCounts[m]);
    return {
      series: [{ name: 'No. of Policy', data: orderedMonths.map((m) => monthCounts[m] || 0) }],
      options: {
        chart: { type: 'bar', height: 320, toolbar: { show: false } },
        colors: ['#26a69a'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
        xaxis: { categories: orderedMonths.map((m) => MONTH_NAMES[m]) },
        yaxis: { title: { text: 'No. of Policy' } },
        grid: { borderColor: '#f1f1f1' },
        tooltip: { theme: 'light' }
      }
    };
  }, [c2Policies]);

  // ═══════════════════════════════════════════════
  // CHART 3: Department Wise Policy (Line) — filter: Month
  // ═══════════════════════════════════════════════
  const c3Policies = useMemo(() => {
    if (c3Month === 'all') return policies;
    return policies.filter((p) => {
      const d = getDate(p);
      return !isNaN(d) && d.getMonth() === parseInt(c3Month, 10);
    });
  }, [policies, c3Month]);

  const departmentWiseChart = useMemo(() => {
    const deptCounts = {};
    c3Policies.forEach((p) => {
      const dept = p.insDepartment?.insDepartment || 'Other';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    const labels = Object.keys(deptCounts);
    return {
      series: [{ name: 'No. of Policy', data: labels.map((l) => deptCounts[l]) }],
      options: {
        chart: { type: 'line', height: 320, toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#26a69a'],
        stroke: { width: 2.5, curve: 'smooth' },
        xaxis: { categories: labels },
        yaxis: { title: { text: 'No. of Policy' } },
        grid: { borderColor: '#f1f1f1' },
        markers: { size: 4 },
        tooltip: { theme: 'light' }
      }
    };
  }, [c3Policies]);

  // ═══════════════════════════════════════════════
  // CHART 4: Monthly Policy (Individual Dept) — filter: Department
  // ═══════════════════════════════════════════════
  const c4Policies = useMemo(() => {
    if (c4Dept === 'all') return policies;
    return policies.filter((p) => p.insDepartment?.insDepartment === c4Dept);
  }, [policies, c4Dept]);

  const monthlyIndividualDeptChart = useMemo(() => {
    const deptNames = c4Dept === 'all' ? [...new Set(c4Policies.map((p) => p.insDepartment?.insDepartment).filter(Boolean))] : [c4Dept];
    const monthData = {};
    c4Policies.forEach((p) => {
      const d = getDate(p);
      if (isNaN(d)) return;
      const mi = d.getMonth();
      const dept = p.insDepartment?.insDepartment;
      if (!dept) return;
      if (!monthData[mi]) monthData[mi] = {};
      monthData[mi][dept] = (monthData[mi][dept] || 0) + 1;
    });
    const orderedMonths = FY_MONTH_ORDER.filter((m) => monthData[m]);
    const deptColors = ['#26a69a', '#ef5350', '#ff9800', '#66bb6a', '#ab47bc', '#42a5f5', '#ffa726'];
    const series = deptNames.map((dept) => ({
      name: dept,
      data: orderedMonths.map((m) => (monthData[m] && monthData[m][dept]) || 0)
    }));
    const colWidth = Math.max(30, Math.min(65, 90 - deptNames.length * 8)) + '%';
    return {
      series,
      options: {
        chart: { type: 'bar', height: 420, toolbar: { show: false }, stacked: false },
        colors: deptColors.slice(0, deptNames.length),
        plotOptions: { bar: { borderRadius: 2, columnWidth: colWidth } },
        dataLabels: { enabled: false },
        xaxis: {
          categories: orderedMonths.map((m) => MONTH_NAMES[m]),
          labels: { style: { fontSize: '12px' } }
        },
        yaxis: { title: { text: 'No. of Policy' } },
        grid: { borderColor: '#f1f1f1' },
        legend: { position: 'top', fontSize: '13px' },
        tooltip: { theme: 'light', shared: true, intersect: false }
      }
    };
  }, [c4Policies, c4Dept]);

  // ═══════════════════════════════════════════════
  // CHART 5: Company Wise Policies — filter: Department + Month
  // ═══════════════════════════════════════════════
  const c5Policies = useMemo(() => {
    let result = policies;
    if (c5Dept !== 'all') result = result.filter((p) => p.insDepartment?.insDepartment === c5Dept);
    if (c5Month !== 'all') {
      result = result.filter((p) => {
        const d = getDate(p);
        return !isNaN(d) && d.getMonth() === parseInt(c5Month, 10);
      });
    }
    return result;
  }, [policies, c5Dept, c5Month]);

  const companyWiseChart = useMemo(() => {
    const companyCounts = {};
    c5Policies.forEach((p) => {
      const comp = p.insCompany?.insCompany || p.insCompany?.companyName || 'Other';
      companyCounts[comp] = (companyCounts[comp] || 0) + 1;
    });
    const sortedEntries = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    return {
      series: [{ name: 'No. of Policy', data: sortedEntries.map(([, v]) => v) }],
      options: {
        chart: { type: 'bar', height: 350, toolbar: { show: false } },
        colors: ['#26a69a'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
        xaxis: {
          categories: sortedEntries.map(([k]) => k),
          title: { text: 'List of Insurance Companies' },
          labels: { rotate: -25, style: { fontSize: '11px' } }
        },
        yaxis: { title: { text: 'No. of Policy' } },
        grid: { borderColor: '#f1f1f1' },
        tooltip: { theme: 'light' }
      }
    };
  }, [c5Policies]);

  // ═══════════════════════════════════════════════
  // CHART 6: Dept Across Companies — filter: Department
  // ═══════════════════════════════════════════════
  const c6Policies = useMemo(() => {
    if (c6Dept === 'all') return policies;
    return policies.filter((p) => p.insDepartment?.insDepartment === c6Dept);
  }, [policies, c6Dept]);

  const deptAcrossCompaniesChart = useMemo(() => {
    const deptNames = c6Dept === 'all' ? [...new Set(c6Policies.map((p) => p.insDepartment?.insDepartment).filter(Boolean))] : [c6Dept];
    const companyTotals = {};
    c6Policies.forEach((p) => {
      const comp = p.insCompany?.insCompany || p.insCompany?.companyName;
      if (!comp) return;
      companyTotals[comp] = (companyTotals[comp] || 0) + 1;
    });
    const topCompanies = Object.entries(companyTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
    const matrix = {};
    c6Policies.forEach((p) => {
      const dept = p.insDepartment?.insDepartment;
      const comp = p.insCompany?.insCompany || p.insCompany?.companyName;
      if (!dept || !comp || !topCompanies.includes(comp)) return;
      if (!matrix[comp]) matrix[comp] = {};
      matrix[comp][dept] = (matrix[comp][dept] || 0) + 1;
    });
    const deptColors = ['#26a69a', '#ef5350', '#ff9800', '#66bb6a', '#ab47bc', '#42a5f5', '#ffa726'];
    const colWidth = Math.max(35, Math.min(65, 90 - deptNames.length * 8)) + '%';
    const series = deptNames.map((dept) => ({
      name: dept,
      data: topCompanies.map((comp) => (matrix[comp] && matrix[comp][dept]) || 0)
    }));
    const trimmedLabels = topCompanies.map((name) => (name.length > 20 ? name.substring(0, 18) + '…' : name));
    return {
      series,
      options: {
        chart: { type: 'bar', height: 440, toolbar: { show: false } },
        colors: deptColors.slice(0, deptNames.length),
        plotOptions: { bar: { borderRadius: 2, columnWidth: colWidth } },
        dataLabels: { enabled: false },
        xaxis: {
          categories: trimmedLabels,
          title: { text: 'List of Companies (Insurance)' },
          labels: { rotate: -45, rotateAlways: true, style: { fontSize: '11px' }, maxHeight: 120 }
        },
        yaxis: { title: { text: 'No. of Policy' } },
        grid: { borderColor: '#f1f1f1', padding: { bottom: 10 } },
        legend: { position: 'top', fontSize: '13px' },
        tooltip: {
          theme: 'light',
          shared: true,
          intersect: false,
          x: {
            formatter: (val, opts) => {
              const idx = opts?.dataPointIndex;
              return idx !== undefined ? topCompanies[idx] : val;
            }
          }
        }
      }
    };
  }, [c6Policies, c6Dept]);

  // ═══════════════════════════════════════════════
  // CHART 7: Retail vs Corporate — filter: Department
  // ═══════════════════════════════════════════════
  const c7Policies = useMemo(() => {
    if (c7Dept === 'all') return policies;
    return policies.filter((p) => p.insDepartment?.insDepartment === c7Dept);
  }, [policies, c7Dept]);

  const retailCorporateChart = useMemo(() => {
    const monthlyRetail = {};
    const monthlyCorporate = {};
    c7Policies.forEach((p) => {
      const d = getDate(p);
      if (isNaN(d)) return;
      const mi = d.getMonth();
      const clientTypeStr = (p.clientType || '').toLowerCase();
      const isCorporate = clientTypeStr.includes('corporate') || clientTypeStr.includes('group') || (p.customerGroup && !p.retailCustomer);
      if (isCorporate) {
        monthlyCorporate[mi] = (monthlyCorporate[mi] || 0) + 1;
      } else {
        monthlyRetail[mi] = (monthlyRetail[mi] || 0) + 1;
      }
    });
    const orderedMonths = FY_MONTH_ORDER.filter((m) => monthlyRetail[m] || monthlyCorporate[m]);
    return {
      series: [
        { name: 'Retail', data: orderedMonths.map((m) => monthlyRetail[m] || 0) },
        { name: 'Corporate', data: orderedMonths.map((m) => monthlyCorporate[m] || 0) }
      ],
      options: {
        chart: { type: 'line', height: 320, toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#26a69a', '#ef5350'],
        stroke: { width: 2.5, curve: 'smooth' },
        xaxis: { categories: orderedMonths.map((m) => MONTH_NAMES[m]) },
        yaxis: { title: { text: 'No. of Policy' } },
        grid: { borderColor: '#f1f1f1' },
        markers: { size: 4 },
        legend: { position: 'top' },
        tooltip: { theme: 'light' }
      }
    };
  }, [c7Policies]);

  // ─── Dept menu items helper ───
  const renderDeptMenuItems = () => [
    <MenuItem key="all" value="all">
      All Departments
    </MenuItem>,
    ...availableDeptNames.map((d) => (
      <MenuItem key={d} value={d}>
        {d}
      </MenuItem>
    ))
  ];

  // ─── Month menu items helper ───
  const renderMonthMenuItems = () => [
    <MenuItem key="all" value="all">
      All Months
    </MenuItem>,
    ...availableMonths.map((mi) => (
      <MenuItem key={mi} value={mi}>
        {MONTH_NAMES[mi]}
      </MenuItem>
    ))
  ];

  // ─── Dummy Data for New Pie Charts ───
  const getDummyData = useMemo(() => {
    return (factor, labels, colors) => ({
      labels,
      datasets: [
        {
          data: labels.map((_, i) => Math.floor(Math.random() * 50 * factor) + 15 * (i + 1)),
          backgroundColor: colors,
          borderWidth: 1
        }
      ]
    });
  }, []);

  const matchMonth = dummyMonthFilter.match(/\d+/);
  const monthNum = matchMonth ? parseInt(matchMonth[0], 10) : 1;
  const dummyFactorMonth = monthNum * 0.5 + 0.5; // Starts at 1.0, grows by 0.5 each month
  const dummyFactorYear = dummyYearFilter === '2023-2024' ? 10 : 15;

  const colorSet1 = ['#26a69a', '#ef5350'];
  const colorSet2 = ['#ff9800', '#42a5f5', '#ab47bc'];
  const colorSet3 = ['#66bb6a', '#ffa726', '#ec407a'];
  const colorSet4 = ['#8d6e63', '#26c6da'];

  const customerStatsMonth = useMemo(() => getDummyData(dummyFactorMonth, ['Corporate', 'Retail'], colorSet1), [dummyFactorMonth, getDummyData]);
  const customerStatsYear = useMemo(() => getDummyData(dummyFactorYear, ['Corporate', 'Retail'], colorSet1), [dummyFactorYear, getDummyData]);

  const deptPolicyMonth = useMemo(() => getDummyData(dummyFactorMonth, ['Fire', 'Health', 'Motor'], colorSet2), [dummyFactorMonth, getDummyData]);
  const deptPolicyYear = useMemo(() => getDummyData(dummyFactorYear, ['Fire', 'Health', 'Motor'], colorSet2), [dummyFactorYear, getDummyData]);

  const deptRevenueMonth = useMemo(() => getDummyData(dummyFactorMonth * 1000, ['Fire', 'Health', 'Motor'], colorSet3), [dummyFactorMonth, getDummyData]);
  const deptRevenueYear = useMemo(() => getDummyData(dummyFactorYear * 1000, ['Fire', 'Health', 'Motor'], colorSet3), [dummyFactorYear, getDummyData]);

  const renewalMonth = useMemo(() => getDummyData(dummyFactorMonth, ['New Policy', 'Renewal'], colorSet4), [dummyFactorMonth, getDummyData]);
  const renewalYear = useMemo(() => getDummyData(dummyFactorYear, ['New Policy', 'Renewal'], colorSet4), [dummyFactorYear, getDummyData]);

  const MonthFilterNode = (
    <TextField select size="small" value={dummyMonthFilter} onChange={(e) => setDummyMonthFilter(e.target.value)} sx={{ minWidth: 120 }}>
      {[...Array(12)].map((_, i) => (
        <MenuItem key={i} value={`Month ${i + 1}`}>Month {i + 1}</MenuItem>
      ))}
    </TextField>
  );

  const YearFilterNode = (
    <TextField select size="small" value={dummyYearFilter} onChange={(e) => setDummyYearFilter(e.target.value)} sx={{ minWidth: 120 }}>
      {['2022-2023', '2023-2024'].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
    </TextField>
  );

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

      <Breadcrumb title="Analytical Report">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Report
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Analytical
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        {/* ─── Global Filters (FY + KPI month) ─── */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 14px 0 rgba(32,40,45,0.08)', borderRadius: 2 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.5, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Global Filters
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    fullWidth
                    label="Financial Year"
                    value={selectedFY}
                    onChange={(e) => setSelectedFY(e.target.value)}
                    size="small"
                  >
                    {financialYears.map((fy) => (
                      <MenuItem key={fy._id} value={fy._id}>
                        {new Date(fy.fromDate).getFullYear()} - {new Date(fy.toDate).getFullYear()}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    fullWidth
                    label="Month (KPI Cards)"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="all">All Months</MenuItem>
                    {availableMonths.map((mi) => (
                      <MenuItem key={mi} value={mi}>
                        {MONTH_NAMES[mi]}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ─── KPI Cards ─── */}
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard label="Total Policies" value={kpiData.totalPolicies.toLocaleString('en-IN')} color="#26a69a" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label="Total Premium"
            value={'₹ ' + kpiData.totalPremium.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label="Total Brokerage"
            value={'₹ ' + kpiData.totalBrokerage.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            color="#ec407a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard label="Top Department" value={kpiData.topDepartment} color="#42a5f5" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard label="Top Company" value={kpiData.topCompany} color="#ab47bc" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard label="Top Month" value={kpiData.topMonth} color="#ef5350" />
        </Grid>

        {/* ─── Chart 1: Daily Policy ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Daily Policy"
            filterRow={
              <FilterSelect label="Month" value={c1Month} onChange={setC1Month}>
                {renderMonthMenuItems()}
              </FilterSelect>
            }
          >
            {dailyPolicyChart.series[0]?.data?.length > 0 ? (
              <ReactApexChart options={dailyPolicyChart.options} series={dailyPolicyChart.series} type="line" height={320} />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available for the selected period
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── Chart 2: Monthly Policy (All Department) ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Monthly Policy (All Department)"
            filterRow={
              <FilterSelect label="Department" value={c2Dept} onChange={setC2Dept}>
                {renderDeptMenuItems()}
              </FilterSelect>
            }
          >
            {monthlyAllDeptChart.series[0]?.data?.length > 0 ? (
              <ReactApexChart options={monthlyAllDeptChart.options} series={monthlyAllDeptChart.series} type="bar" height={320} />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── Chart 3: Department Wise Policy ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Department Wise Policy"
            filterRow={
              <FilterSelect label="Month" value={c3Month} onChange={setC3Month}>
                {renderMonthMenuItems()}
              </FilterSelect>
            }
          >
            {departmentWiseChart.series[0]?.data?.length > 0 ? (
              <ReactApexChart options={departmentWiseChart.options} series={departmentWiseChart.series} type="line" height={320} />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── Chart 4: Monthly Policy (Individual Dept) ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Monthly Policy (Individual Dept)"
            filterRow={
              <FilterSelect label="Department" value={c4Dept} onChange={setC4Dept}>
                {renderDeptMenuItems()}
              </FilterSelect>
            }
          >
            {monthlyIndividualDeptChart.series.length > 0 ? (
              <ReactApexChart
                options={monthlyIndividualDeptChart.options}
                series={monthlyIndividualDeptChart.series}
                type="bar"
                height={420}
              />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── Chart 5: Total Company Wise Policies ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Total Company Wise Policies"
            filterRow={
              <>
                <FilterSelect label="Department" value={c5Dept} onChange={setC5Dept}>
                  {renderDeptMenuItems()}
                </FilterSelect>
                <FilterSelect label="Month" value={c5Month} onChange={setC5Month}>
                  {renderMonthMenuItems()}
                </FilterSelect>
              </>
            }
          >
            {companyWiseChart.series[0]?.data?.length > 0 ? (
              <ReactApexChart options={companyWiseChart.options} series={companyWiseChart.series} type="bar" height={350} />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── Chart 6: Policies By Department Across Companies ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Policies By Department Across Companies"
            filterRow={
              <FilterSelect label="Department" value={c6Dept} onChange={setC6Dept}>
                {renderDeptMenuItems()}
              </FilterSelect>
            }
          >
            {deptAcrossCompaniesChart.series.length > 0 ? (
              <ReactApexChart options={deptAcrossCompaniesChart.options} series={deptAcrossCompaniesChart.series} type="bar" height={440} />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── Chart 7: Monthly Policies - Retail vs Corporate ─── */}
        <Grid item xs={12}>
          <ChartCard
            title="Monthly Policies – Retail vs Corporate"
            filterRow={
              <FilterSelect label="Department" value={c7Dept} onChange={setC7Dept}>
                {renderDeptMenuItems()}
              </FilterSelect>
            }
          >
            {retailCorporateChart.series[0]?.data?.length > 0 ? (
              <ReactApexChart options={retailCorporateChart.options} series={retailCorporateChart.series} type="line" height={320} />
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 6 }}>
                No data available
              </Typography>
            )}
          </ChartCard>
        </Grid>

        {/* ─── NEW SECTION: PIE CHARTS WITH DUMMY DATA ─── */}
        <Grid item xs={12}>
          <Box sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Analytical Pie Charts (Dummy Data)
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        {/* Section 1: Customer Statistics */}
        <Grid item xs={12} md={6}>
          <PieChartCard title="Customer Statistics" bottomTitle="Customer Statistics" filterNode={MonthFilterNode} data={customerStatsMonth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartCard title="Customer Statistics" bottomTitle="Customer Statistics" filterNode={YearFilterNode} data={customerStatsYear} />
        </Grid>

        {/* Section 2: Department-wise Policies */}
        <Grid item xs={12} md={6}>
          <PieChartCard title="Department-wise Policies (%)" bottomTitle="Department-wise Policies (%)" filterNode={MonthFilterNode} data={deptPolicyMonth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartCard title="Department-wise Policies (%)" bottomTitle="Department-wise Policies (%)" filterNode={YearFilterNode} data={deptPolicyYear} />
        </Grid>

        {/* Section 3: Department-wise Revenue */}
        <Grid item xs={12} md={6}>
          <PieChartCard title="Department-wise Revenue (Value)" bottomTitle="Department-wise Revenue (Value)" filterNode={MonthFilterNode} data={deptRevenueMonth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartCard title="Department-wise Revenue (Value)" bottomTitle="Department-wise Revenue (Value)" filterNode={YearFilterNode} data={deptRevenueYear} />
        </Grid>

        {/* Section 4: Renewal vs New Policy */}
        <Grid item xs={12} md={6}>
          <PieChartCard title="Renewal vs New Policy (%)" bottomTitle="Renewal vs New Policy (%)" filterNode={MonthFilterNode} data={renewalMonth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartCard title="Renewal vs New Policy (%)" bottomTitle="Renewal vs New Policy (%)" filterNode={YearFilterNode} data={renewalYear} />
        </Grid>

      </Grid>
    </>
  );
};

export default ReportsAnalyticalReport;

import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography } from '@mui/material';
import ReusableBarChart from 'views/Dashboard/Charts/BarCharts/ReusbaleBarChart';
import { get } from 'api/api';

const LeadWonLostChart = () => {
  const [leadWonLostData, setLeadWonLostData] = useState({
    title: 'Lead Won vs Lost (Last 12 Months)',
    xLabels: [],
    seriesData: [[], []],
    seriesLabelMap: { Won: 'Lead Won', Lost: 'Lead Lost' },
    colors: ['#4CAF50', '#F44336']
  });

  useEffect(() => {
    const fetchLeadWonLost = async () => {
      try {
        const res = await get('lead/analytics/lead-won-lost');
        console.log(res);

        if (res?.success) {
          // ✅ Use API data if available
          setLeadWonLostData({
            title: 'Lead Won vs Lost (Last 12 Months)',
            xLabels: res.labels,
            seriesData: res.datasets.map((d) => d.data),
            seriesLabelMap: Object.fromEntries(res.datasets.map((d) => [d.label, d.label])),
            colors: res.datasets.map((d) => d.color)
          });
        } else {
          // ✅ If no API data, use fallback random data for last 12 months
          const now = new Date();
          const months = [];

          for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.unshift(d.toLocaleString('default', { month: 'short', year: 'numeric' }));
          }

          const random = () => Math.floor(Math.random() * 100) + 20;
          const leadsWon = Array.from({ length: 12 }, random);
          const leadsLost = Array.from({ length: 12 }, random);

          setLeadWonLostData({
            title: 'Lead Won vs Lost (Last 12 Months)',
            xLabels: months,
            seriesData: [leadsWon, leadsLost],
            seriesLabelMap: { 'Leads Won': 'Leads Won', 'Leads Lost': 'Leads Lost' },
            colors: ['#4CAF50', '#F44336']
          });
        }
      } catch (err) {
        console.error('Error fetching lead won/lost data:', err);
      }
    };

    fetchLeadWonLost();
  }, []);

  return (
    <Grid item xs={12}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {/* {leadWonLostData.title} */}
        </Typography>
        <ReusableBarChart {...leadWonLostData} />
      </Card>
    </Grid>
  );
};

export default LeadWonLostChart;

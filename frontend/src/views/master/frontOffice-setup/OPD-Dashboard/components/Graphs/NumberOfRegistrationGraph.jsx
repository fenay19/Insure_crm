import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, ButtonGroup, CircularProgress } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { get } from 'api/api';

export default function NumberOfRegistrationGraph() {
  const [viewType, setViewType] = useState('year');
  const [xData, setXData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [followUpData, setFollowUpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGraphData = async (type) => {
    setLoading(true);
    setError('');
    try {
      const response = await get(`opd-patient/opd-dashboard-data-graph?type=${type}`);
      const data = response;
      console.log(data);
      
      const xValues = data.map(item => new Date(item.date));
      const newValues = data.map(item => item?.newPatients || 0);
      const followUpValues = data.map(item => item?.followUpPatients || 0);

      setXData(xValues);
      setNewData(newValues);
      setFollowUpData(followUpValues);
    } catch (err) {
      console.error(err);
      setError('Failed to load graph data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData(viewType);
  }, [viewType]);

  const formatLabel = (dateStr, type) => {
    const date = new Date(dateStr);
    switch (type) {
      case 'year':
        return date.getFullYear().toString();
      case 'month':
        return date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g. Apr 2025
      case 'date':
      default:
        return `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}`; // e.g. 25-Apr
    }
  };

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Number of Registrations ({viewType?.charAt(0)?.toUpperCase() + viewType.slice(1)} View)
            </Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button onClick={() => setViewType('date')}>By Date</Button>
              <Button onClick={() => setViewType('month')}>By Month</Button>
              <Button onClick={() => setViewType('year')}>By Year</Button>
            </ButtonGroup>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <LineChart
              height={400}
              xAxis={[
                {
                  data: xData,
                  scaleType: 'time',
                  valueFormatter: formatLabel,
                },
              ]}
              series={[
                {
                  label: 'New Registrations',
                  data: newData,
                  showMark: false,
                },
                {
                  label: 'Follow-up Registrations',
                  data: followUpData,
                  showMark: false,
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

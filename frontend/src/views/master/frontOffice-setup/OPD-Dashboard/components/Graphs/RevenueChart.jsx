import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  CircularProgress,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { get } from 'api/api'; // Assumes your GET helper is here

export default function RevenueChart() {
  const [viewType, setViewType] = useState('month');
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fetchData = async (type) => {
    try {
      setLoading(true);
      setError('');
      const response = await get(`opd-patient/opd-dashboard-data-graph?type=${type}`);
      console.log(response);
      
      const transformedData = response?.map((item) => ({
        x: formatLabel(item?.date, type),
        y: item?.totalRevenue || 0,
      }));
      setDataset(transformedData);
    } catch (err) {
      console.error(err);
      setError('Failed to load revenue data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(viewType);
  }, [viewType]);

  const valueFormatter = (value) => `₹${value?.toLocaleString()}`;

  const titleMap = {
    date: 'Daily Revenue',
    month: 'Monthly Revenue',
    year: 'Yearly Revenue',
  };

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{titleMap[viewType]}</Typography>
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
            <BarChart
              height={300}
              margin={{ top: 10, bottom: 40, left: 50, right: 10 }}
              dataset={dataset}
              xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
              series={[{ dataKey: 'y', label: 'Revenue', valueFormatter }]}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

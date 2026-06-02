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
import { get } from 'api/api';

export default function TotalAppointmentGraph() {
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
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day}-${month}`; // e.g. 4-Apr
    }
  };
  

  const fetchData = async (type) => {
    try {
      setLoading(true);
      setError('');
      const response = await get(`opd-patient/opd-dashboard-data-graph?type=${type}`);
      const transformedData = response?.map((item) => ({
        x: formatLabel(item.date, type),
        y: item.totalAppointments || 0,
      }));
      setDataset(transformedData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(viewType);
  }, [viewType]);

  const titleMap = {
    date: 'Daily Appointments',
    month: 'Monthly Appointments',
    year: 'Yearly Appointments',
  };

  return (
    <Box >
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
              series={[{ dataKey: 'y', label: 'Appointments' }]}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { get } from 'api/api';
import React, { useEffect, useState } from 'react';

const CompanyStaffReport = () => {
  const [administrativeData, setAdministrativeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    typeOfEmployee: '',
    gender: '',
    position: '',
    department: '',
    city: ''
  });

  const fetchAdministrativeData = async () => {
    setLoading(true);
    try {
      const response = await get('administrative');
      console.log('staff adminstrative details: ', response.data);
      setAdministrativeData(response.data || []);
      setFilteredData(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministrativeData();
  }, []);

  // handle filter changes
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    let filtered = administrativeData.filter((staff) => {
      const bd = staff.basicDetails || {};
      const ed = staff.employmentDetails || {};

      return (
        (!updatedFilters.gender || bd.gender === updatedFilters.gender) &&
        (!updatedFilters.typeOfEmployee || ed.typeOfEmployee === updatedFilters.typeOfEmployee) &&
        (!updatedFilters.position || ed.position?.position === updatedFilters.position) &&
        (!updatedFilters.department || ed.department?.department === updatedFilters.department) &&
        (!updatedFilters.city || ed.location === updatedFilters.city)
      );
    });

    setFilteredData(filtered);
  };

  // Extract unique values for dropdowns
  const uniqueValues = (keyFn) => Array.from(new Set(administrativeData.map(keyFn).filter(Boolean)));

  const typeOptions = uniqueValues((s) => s.employmentDetails?.typeOfEmployee);
  const genderOptions = uniqueValues((s) => s.basicDetails?.gender);
  const positionOptions = uniqueValues((s) => s.employmentDetails?.position?.position);
  const departmentOptions = uniqueValues((s) => s.employmentDetails?.department?.department);
  const cityOptions = uniqueValues((s) => s.employmentDetails?.location);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Staff Report
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Type of Employee</InputLabel>
            <Select value={filters.typeOfEmployee} onChange={(e) => handleFilterChange('typeOfEmployee', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {typeOptions.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {genderOptions.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Position</InputLabel>
            <Select value={filters.position} onChange={(e) => handleFilterChange('position', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {positionOptions.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Department</InputLabel>
            <Select value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {departmentOptions.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>City</InputLabel>
            <Select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {cityOptions.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Staff Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Mobile No.</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Type of Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((staff, index) => {
                const bd = staff.basicDetails || {};
                const ed = staff.employmentDetails || {};
                return (
                  <TableRow key={staff._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{`${bd.firstName || ''} ${bd.middleName || ''} ${bd.lastName || ''}`.trim()}</TableCell>
                    <TableCell>{ed.position?.position || 'N/A'}</TableCell>
                    <TableCell>{bd.contactNumber || 'N/A'}</TableCell>
                    <TableCell>{bd.gender || 'N/A'}</TableCell>
                    <TableCell>{ed.typeOfEmployee || 'N/A'}</TableCell>
                    <TableCell>{ed.department?.department || 'N/A'}</TableCell>
                    <TableCell>{ed.location || 'N/A'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CompanyStaffReport;

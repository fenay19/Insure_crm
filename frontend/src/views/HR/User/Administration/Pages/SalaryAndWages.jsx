import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  TextField,
  Button
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';

import { useGetIncomeQuery } from 'services/endpoints/Income/income';
import { useGetEntryQuery } from 'services/endpoints/Entry/Entry';
import { useGetPTQuery } from 'services/endpoints/PT/PT';

import REACT_APP_API_URL from '../../../../../api/api.js';
import { get, put } from '../../../../../api/api.js';
import { toast } from 'react-toastify';

function SalaryAndWages({ setValue, storedAllData, setStoredAllData }) {
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const { data: incomeData = [], isLoading, isError, refetch: refetchIncome } = useGetIncomeQuery();
  const { data: deductData = { data: [] }, refetch: refetchDeduct } = useGetEntryQuery();
  const { data: ptData = [], refetch: refetchPt } = useGetPTQuery();

  //!old data
  // const [baseSalary, setBaseSalary] = useState(storedAllData?.salaryAndWages?.incomeDetails?.basicSalary || 100);
  // const [submittedSalary, setSubmittedSalary] = useState(storedAllData?.salaryAndWages?.incomeDetails?.basicSalary || null);
  // const [isEditing, setIsEditing] = useState(submittedSalary === null);
  //todo: new data
  const existingBasic = storedAllData?.salaryAndWages?.incomeDetails?.basicSalary;

  const [baseSalary, setBaseSalary] = useState(existingBasic > 0 ? existingBasic : 100);
  const [submittedSalary, setSubmittedSalary] = useState(existingBasic > 0 ? existingBasic : null);
  const [isEditing, setIsEditing] = useState(!(existingBasic > 0));

  const [designationData, setDesignationData] = useState([]);
  const [designationText, setdesignationText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [salaryDetails, setSalaryDetails] = useState({
    totalIncomeMonthly: 0,
    totalIncomeAnnual: 0,
    employeeDeductionsMonthly: 0,
    employerDeductionsMonthly: 0
  });

  // Function to calculate variable income
  const calculateVariableIncome = (salary) => {
    return incomeData.reduce((sum, item) => sum + (item.amount * salary) / 100, 0);
  };

  // Function to calculate employee deductions
  const calculateEmployeeDeductionTotal = (salary) => {
    if (!deductData.data || !Array.isArray(deductData.data)) return 0;

    // Calculate deductions from entry data
    const entryDeductions = deductData.data.reduce((total, item) => {
      const baseAmount = calculateBaseAmount(item, salary);
      return total + (item.employee * baseAmount) / 100;
    }, 0);

    // Add PT to the total deductions
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    const currentPT = ptData.find((item) => item.month?.toLowerCase() === currentMonth);
    const ptAmount = currentPT ? Number(currentPT.amount) : 0;

    return Number(entryDeductions) + ptAmount;
  };

  // Function to calculate employer deductions
  const calculateEmployerDeductionTotal = (salary) => {
    if (!deductData.data || !Array.isArray(deductData.data)) return 0;

    return deductData.data.reduce((total, item) => {
      const baseAmount = calculateBaseAmount(item, salary);
      return total + (item.employer * baseAmount) / 100;
    }, 0);
  };

  // Helper function to calculate base amount for deductions
  const calculateBaseAmount = (item, salary) => {
    return item.selectedItems
      .map((field) => {
        const match = incomeData.find((i) => i.income === field);
        return match ? (match.amount * salary) / 100 : 0;
      })
      .reduce((sum, quantity) => sum + quantity, 0);
  };

  // Prepare payload for saving
  const preparePayload = (salary) => {
    // Calculate all required values
    const variableIncome = calculateVariableIncome(salary);
    const totalIncomeMonthly = Number(salary) + Number(variableIncome);
    const employeeDeductionsMonthly = calculateEmployeeDeductionTotal(salary);
    const employerDeductionsMonthly = calculateEmployerDeductionTotal(salary);

    // Prepare income components
    const incomeComponents = {};
    incomeData.forEach((item) => {
      incomeComponents[item.income] = Number((item.amount * salary) / 100);
    });

    // Get the current PT amount
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    const currentPT = ptData.find((item) => item.month?.toLowerCase() === currentMonth);
    // const ptAmount = currentPT ? Number(currentPT.amount) : 0;
        const ptAmount = ptData.length > 0 ? Number(ptData[0].amount) : 0;


    // Create deduction components properly
    const deductionComponents = {};

    // Add each deduction with proper structure
    deductData.data.forEach((item) => {
      const baseAmount = calculateBaseAmount(item, salary);
      deductionComponents[item.percentage] = {
        employee: Number((item.employee * baseAmount) / 100),
        employer: Number((item.employer * baseAmount) / 100)
      };
    });

    // Add PT separately
    deductionComponents['PT'] = {
      employee: ptAmount,
      employer: 0
    };

    // Calculate totals from deductionComponents
    const totalEmployeeContributions = Object.values(deductionComponents).reduce((sum, item) => sum + item.employee, 0);
    const totalEmployerContributions = Object.values(deductionComponents).reduce((sum, item) => sum + item.employer, 0);


    // Construct final payload
    // return {
    //   employeeId: storedAllData.submittedFormId || '',
    //   name: `${storedAllData.basicDetails.firstName || ''} ${storedAllData.basicDetails.lastName || ''}`.trim(),
    //   position: designationText,
    //   incomeDetails: {
    //     basicSalary: Number(salary),
    //     incomeComponents: incomeComponents,
    //     grossMonthlyIncome: totalIncomeMonthly
    //   },
    //   deductionDetails: {
    //     deductionComponents: deductionComponents,
    //     totalEmployeeContributions: Number(employeeDeductionsMonthly),
    //     totalEmployerContributions: Number(employerDeductionsMonthly)
    //   }
    // };
    return {
      employeeId: storedAllData.basicDetails.empCode || '',
      name: `${storedAllData.basicDetails.firstName || ''} ${storedAllData.basicDetails.lastName || ''}`.trim(),
      position: designationText,
      incomeDetails: {
        basicSalary: Number(salary),
        incomeComponents: incomeComponents,
        grossMonthlyIncome: totalIncomeMonthly
      },
      deductionDetails: {
        deductionComponents: deductionComponents,
        totalEmployeeContributions: totalEmployeeContributions,
        totalEmployerContributions: totalEmployerContributions
      }
    };
  };

  const handleChange = (event) => {
    const value = Number(event.target.value);
    setBaseSalary(value > 0 ? value : 1); // Ensure value is positive
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedSalary(baseSalary);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (isEditing) return; // Don't save if in editing mode

    try {
      setIsSaving(true);
      const payload = preparePayload(submittedSalary);

      console.log('Payload to be sent:', JSON.stringify(payload, null, 2));
      //!old
      // const id = storedAllData.submittedFormId !== '' ? storedAllData.submittedFormId : '0';
      //todo new
      const id = storedAllData?.submittedFormId;
      console.log("salary id ", id)
            console.log("storeAllData:", storedAllData)

      console.log("storeAllData:", storedAllData.basicDetails.empCode)
      if (!id) {
        toast.error('Form ID missing. Cannot save.');
        return;
      }

      const response = await put(`administrative/SalaryAndWages/${id}`, payload);
      console.log('response ')

      // Check the `success` flag from backend response
      if (!response.success) {
        console.error('Server response error:', response.message);
        throw new Error(response.message || 'Failed to save salary details');
      }

      console.log('Backend response:', response.message);
      toast.success('Salary details saved successfully');
      setStoredAllData((prev) => ({
        ...prev,
        salaryAndWages: payload
      }));

      toast.success('Salary details saved successfully');

      if (typeof setValue === 'function') {
        setValue((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error saving salary details:', error);
      toast.error(`Failed to save salary details: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // async function fetchDesignation() {
  //   const response = await get('adminstrative');
  //   console.log('Designation/positon master:', response.data);
  //   setDesignationData(response.data);
  // }

  // useEffect(() => {
  //   const designation = designationData.filter((item) => item._id === storedAllData.employmentDetails.position.postion);

  //   if (designation.length > 0) {
  //     const designationText = designation[0].designationName;
  //     console.log('desg is:', designation);
  //     setdesignationText(designationText);
  //   } else {
  //     console.warn('No matching designation found');
  //     setdesignationText('');
  //   }
  // }, [designationData]);

  // Update salary details when base salary, income data, or deduction data changes
  useEffect(() => {
    const salary = isEditing ? baseSalary : submittedSalary || baseSalary;
    const variableIncome = calculateVariableIncome(salary);
    const totalIncomeMonthly = Number(salary) + Number(variableIncome);
    const totalIncomeAnnual = totalIncomeMonthly * 12;

    const employeeDeductionsMonthly = calculateEmployeeDeductionTotal(salary);
    const employerDeductionsMonthly = calculateEmployerDeductionTotal(salary);

    setSalaryDetails({
      totalIncomeMonthly,
      totalIncomeAnnual,
      employeeDeductionsMonthly,
      employerDeductionsMonthly
    });
  }, [baseSalary, submittedSalary, isEditing, incomeData, deductData, ptData]);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchIncome();
      refetchDeduct();
      refetchPt();
    }, 1000);

    return () => clearInterval(interval);
  }, [refetchIncome, refetchDeduct, refetchPt]);

  useEffect(() => {
    async function fetchPositionName() {
      const positionId = storedAllData?.employmentDetails?.position;
      console.log('positionID:', positionId);
      if (positionId) {
        try {
          const res = await get(`/administrative`); // This should return an array of administrative users
          // Find the first user whose position._id matches positionId
          const dataPosition = res.data.find(
            (item) => item?.employmentDetails?.position?._id === positionId || item?.employmentDetails?.position === positionId // in case it's not populated
          );
          console.log('dataPosition: ', dataPosition);
          // Get the position name from the matched user
          const positionName =
            dataPosition?.employmentDetails?.position?.position ||
            dataPosition?.employmentDetails?.position?.designationName ||
            dataPosition?.employmentDetails?.position?.positionName ||
            'Unknown Position';
          setdesignationText(positionName);
        } catch (err) {
          console.error('Failed to fetch position:', err);
          setdesignationText('Unknown Position');
        }
      }
    }

    fetchPositionName();
  }, [storedAllData]);

  // useEffect(() => {
  //   async function fetchPositionName() {
  //     const positionId = storedAllData?.employmentDetails?.position;
  //     console.log("positionID:", positionId)
  //     if (positionId) {
  //       try {
  //         const res = await get(`/administrative`); // 👈 Make sure this route exists
  //         console.log('position route salary:', res.data.employmentDetails)
  //         const dataPosition = res.data.filter((item)=> item.employmentDetails.position._id === positionId)
  //         console.log("dtaposition: ", dataPosition)
  //         const positionName = res?.data?.position; // Adjust according to actual response
  //         setdesignationText(positionName || 'Unknown Position');
  //       } catch (err) {
  //         console.error('Failed to fetch position:', err);
  //         setdesignationText('Unknown Position');
  //       }
  //     }
  //   }

  //   fetchPositionName();
  // }, [storedAllData]);

  useEffect(() => {
    // fetchDesignation();
    console.log('employmentDetails:', storedAllData.employmentDetails);
  }, []);

  useEffect(() => {
    console.log('storedAllData:', storedAllData);
  }, [storedAllData]);

  const formatCurrency = (value) => `₹${value.toLocaleString()}`;

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error fetching data. Please try refreshing the page.</Typography>;

  // Find current month's PT for display
  const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
  const currentPT = ptData.find((item) => item.month?.toLowerCase() === currentMonth);
  const ptAmount = currentPT ? Number(currentPT.amount) : 0;
  const annualPTAmount = 2500; // Assuming this is fixed
  // console.log("employmentDetails:", storedAllData.employmentDetails);

  return (
    <Box p={2}>
      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <Box ref={contentRef}>
        <Typography variant="h2" textAlign="center" gutterBottom>
          Salary Structure
        </Typography>

        <Box textAlign="center" mb={3}>
          {storedAllData.basicDetails.firstName || storedAllData.basicDetails.lastName ? (
            <Typography variant="h6">
              <b>Employee: {`${storedAllData.basicDetails.firstName || ''} ${storedAllData.basicDetails.lastName || ''}`}</b>
            </Typography>
          ) : (
            <Typography variant="h6">
              Employee: <b>Please fill the basic details</b>
            </Typography>
          )}

          {/* {storedAllData?.employmentDetails?.position?.position ? (
            <Typography variant="h6">
              <b>Position: {storedAllData.employmentDetails.position.position}</b>
            </Typography>
          ) : (
            <Typography variant="h6">
              Position: <b>Please fill the employment details</b>
            </Typography>
          )} */}
          <Typography variant="h6">
            <b>Position: {designationText || 'Please fill the employment details'}</b>
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Income Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" textAlign="center" gutterBottom>
              Income
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell>
                      <b>Particular</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Monthly</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Annual</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: 20 }}>Basic Salary</TableCell>
                    <TableCell align="right">
                      {isEditing ? (
                        <Box display="flex" gap={1} justifyContent="end" alignItems="center" component="form" onSubmit={handleSubmit}>
                          ₹
                          <TextField
                            size="small"
                            value={baseSalary}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ width: 75 }}
                            inputProps={{ min: 1 }}
                          />
                          <Button size="small" type="submit" variant="contained">
                            Submit
                          </Button>
                        </Box>
                      ) : (
                        <Box display="flex" justifyContent="end" alignItems="center" gap={1}>
                          <Typography sx={{ width: 100 }}>{formatCurrency(submittedSalary)}</Typography>
                          <Button className="no-print" size="small" onClick={handleEdit} variant="contained">
                            Edit
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">{formatCurrency((isEditing ? baseSalary : submittedSalary) * 12)}</TableCell>
                  </TableRow>

                  {incomeData.map((item) => {
                    const salary = isEditing ? baseSalary : submittedSalary;
                    const monthly = (item.amount * salary) / 100;
                    return (
                      <TableRow key={item._id}>
                        <TableCell>{item.income}</TableCell>
                        <TableCell align="right">{formatCurrency(monthly)}</TableCell>
                        <TableCell align="right">{formatCurrency(monthly * 12)}</TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow>
                    <TableCell>
                      <b>Gross Income</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>{formatCurrency(salaryDetails.totalIncomeMonthly)}</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>{formatCurrency(salaryDetails.totalIncomeAnnual)}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Deductions Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" textAlign="center" gutterBottom>
              Deductions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell>
                      <b>Particular</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Employee (Monthly/Annually)</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Employer (Monthly/Annually)</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deductData.data.map((item, index) => {
                    const salary = isEditing ? baseSalary : submittedSalary;
                    const baseAmount = calculateBaseAmount(item, salary);

                    const employeeDeduction = (item.employee * baseAmount) / 100;
                    const employerDeduction = (item.employer * baseAmount) / 100;

                    const employeeDeductionAnnual = employeeDeduction * 12;
                    const employerDeductionAnnual = employerDeduction * 12;

                    return (
                      <TableRow key={index}>
                        <TableCell>{`${item.percentage} (${item.selectedItems.join('+')})`}</TableCell>
                        <TableCell align="right">
                          {`${formatCurrency(employeeDeduction)} (${formatCurrency(employeeDeductionAnnual)})`}
                        </TableCell>
                        <TableCell align="right">
                          {`${formatCurrency(employerDeduction)} (${formatCurrency(employerDeductionAnnual)})`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell>PT</TableCell>
                    <TableCell align="right">{`${formatCurrency(ptAmount)} (${formatCurrency(annualPTAmount)})`}</TableCell>
                    <TableCell align="right">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Total Deductions</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>
                        {`${formatCurrency(salaryDetails.employeeDeductionsMonthly)} (${formatCurrency((salaryDetails.employeeDeductionsMonthly - ptAmount) * 12 + annualPTAmount)})`}
                      </b>
                    </TableCell>
                    <TableCell align="right">
                      <b>
                        {`${formatCurrency(salaryDetails.employerDeductionsMonthly)} (${formatCurrency(salaryDetails.employerDeductionsMonthly * 12)})`}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Summary */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1} p={3} borderRadius={3} boxShadow={2} bgcolor="white">
              <Typography variant="h5">
                <b>Final CTC Overview (Monthly)</b>
              </Typography>
              <Typography variant="h6">
                Gross Income ({formatCurrency(salaryDetails.totalIncomeMonthly)}) - Employee Deductions (
                {formatCurrency(salaryDetails.employeeDeductionsMonthly + salaryDetails.employerDeductionsMonthly)}) ={' '}
                {formatCurrency(
                  salaryDetails.totalIncomeMonthly - (salaryDetails.employeeDeductionsMonthly + salaryDetails.employerDeductionsMonthly)
                )}
              </Typography>
            </Box>
          </Grid>

          {/* Save and Print Buttons */}
          <Grid item xs={12} md={6} display="flex" justifyContent="flex-end" alignItems="end">
            <Box display="flex" gap={2}>
              <Button
                className="no-print"
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<SaveIcon />}
                disabled={isEditing || isSaving}
                onClick={handleSave}
                sx={{ borderRadius: 2 }}
              >
                {isSaving ? 'Saving...' : 'Save & Next'}
              </Button>
              <Button
                className="no-print"
                variant="outlined"
                color="secondary"
                size="medium"
                startIcon={<PrintIcon />}
                onClick={reactToPrintFn}
                disabled={isEditing} // disables button when editing
                sx={{ borderRadius: 2 }}
              >
                Print
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SalaryAndWages;

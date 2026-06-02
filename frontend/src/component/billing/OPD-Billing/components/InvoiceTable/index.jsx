import React, { useEffect, useState } from 'react';
import { Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import DiscountSection from './DiscountSection';
import { useDispatch, useSelector } from 'react-redux';
import { removeServiceData, setTotalAmount } from 'reduxSlices/opdBillingStates';

const InvoiceTable = ({ selectedValues, setSelectedValues }) => {
  const dispatch = useDispatch();
  const { serviceDataSelectedToDisplay, finalAmount, totalDiscount, totalAmount } = useSelector((state) => state.opdBillingStates);
  const { billingData } = useSelector((state) => state.opdBilling);

  // Calculate the total rate of the serviceDataSelectedToDisplay
  const totalRate = serviceDataSelectedToDisplay?.reduce((acc, curr) => {
    let rate = parseFloat(curr?.rate);
    // const payee = billingData?.patientPayee?.toLowerCase()?.trim();

    return acc + rate;
  }, 0);

  const handleRemove = (id) => {
    dispatch(removeServiceData(id));

    setSelectedValues((prevSelectedValues) => {
      const updatedValues = { ...prevSelectedValues };
      Object.keys(updatedValues).forEach((key) => {
        updatedValues[key] = updatedValues[key].filter((itemId) => itemId !== id);
      });
      return updatedValues;
    });
  };

  // function getRateAccordingtoPayeeCategory(rate) {
  //   console.log('RARE', rate);
  //   const payee = billingData?.patientPayee?.toLowerCase()?.trim();

  //   if (payee === 'weaker') {
  //     return rate * 0.5; // 50% off
  //   } else if (payee === 'indigenous') {
  //     return 0; // Free
  //   } else {
  //     return rate; // No discount
  //   }
  // }

  useEffect(() => {
    dispatch(setTotalAmount(totalRate));
  }, [totalRate, dispatch]);

  return (
    <Card sx={{ p: 3, width: '100%', boxShadow: 2, borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Sr No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Rate</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceDataSelectedToDisplay &&
              serviceDataSelectedToDisplay?.map((item, index) => (
                <TableRow
                  key={item?._id}
                  sx={{
                    '&:hover': { backgroundColor: '#fafafa' },
                    transition: 'background 0.3s ease'
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item?.serviceIdOfRelatedMaster?.detailServiceName ||
                      item?.serviceIdOfRelatedMaster?.profileName ||
                      item?.serviceIdOfRelatedMaster?.serviceDataSelectedToDisplay?.[0]?.detailServiceName ||
                      item?.serviceIdOfRelatedMaster?.testName ||
                      `OPD Consultation (${item?.serviceIdOfRelatedMaster?.type} - ${item?.serviceIdOfRelatedMaster?.consultantName})` ||
                      'N/A'}
                  </TableCell>
                  <TableCell>{item?.code}</TableCell>
                  <TableCell>{item?.rate}</TableCell>
                  <TableCell>
                    <Close fontSize="small" sx={{ cursor: 'pointer', color: '#d32f2f' }} onClick={() => handleRemove(item?._id)} />
                  </TableCell>
                </TableRow>
              ))}
            <TableRow sx={{ backgroundColor: '#f7f7f7' }}>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total:
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>₹:{totalAmount}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {/* Discount Section */}
          <DiscountSection />

          <Box sx={{ p: 2, textAlign: 'right', borderRadius: 2, backgroundColor: '#fafafa', width: '200px' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Total Amount: ₹{totalAmount}</Typography>
            <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>Total Discount: ₹{totalDiscount.toFixed(2)}</Typography>
            <Box sx={{ borderBottom: '1px solid #ddd', my: 1 }} />
            {/* <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>Amount: ₹{totalRate - totalDiscount}</Typography> */}
            <Typography sx={{ color: 'success.main', fontWeight: 'bold', mt: 1 }}>
              Final Amount: ₹{finalAmount !== 0 ? finalAmount : totalAmount}
            </Typography>
          </Box>
        </Box>
      </TableContainer>
    </Card>
  );
};

export default InvoiceTable;

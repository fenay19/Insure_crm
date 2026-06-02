import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setDiscountType, setDiscountValue, setFinalAmount, setTotalDiscount } from 'reduxSlices/opdBillingStates';
import { toast } from 'react-toastify';

const DiscountSection = () => {
  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const dispatch = useDispatch();
  const { discountType, discountValue, totalAmount } = useSelector((state) => state.opdBillingStates);

  // Handle change for the discount type (Percent/Value)
  const handleDiscountTypeChange = (event) => {
    dispatch(setDiscountType(event.target.value));
  };

  // Handle change for the discount value input field
  const handleDiscountValueChange = (event) => {
    dispatch(setDiscountValue(event.target.value));
  };

  // Toggle the display of discount fields
  const toggleDiscountFields = () => {
    setShowDiscountFields((prev) => !prev);
  };

  // Handle the apply discount action
  const handleApplyDiscount = () => {
    if (discountType && discountValue) {
      let discountAmount = 0;

      if (discountType?.toLowerCase() === 'percent' && discountValue > 0) {
        discountAmount = (totalAmount * discountValue) / 100;
      } else if (discountType?.toLowerCase() === 'value' && discountValue > 0) {
        if (parseFloat(discountValue) > totalAmount) {
          toast.error('Discount value cannot exceed the total rate.');
          discountAmount = totalAmount;
        } else {
          discountAmount = parseFloat(discountValue);
        }
      }

      const finalAmount = totalAmount - discountAmount;

      dispatch(setTotalDiscount(discountAmount));
      dispatch(setFinalAmount(+finalAmount?.toFixed(2)));
    } else {
      alert('Please select a discount type and enter a discount value!');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ textTransform: 'capitalize', marginRight: '10px' }}
        onClick={toggleDiscountFields}
      >
        Discount
      </Button>

      {showDiscountFields && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }} size={'small'}>
            <InputLabel>Discount Type</InputLabel>
            <Select value={discountType} onChange={handleDiscountTypeChange} label="Discount Type" sx={{ width: '140px' }}>
              <MenuItem value="percent">Percent</MenuItem>
              <MenuItem value="value">Value</MenuItem>
            </Select>
          </FormControl>

          {/* Conditionally render the TextField based on the selected discount type */}
          {discountType && (
            <TextField
              type="number"
              label={discountType === 'percent' ? 'Percent' : 'Value'}
              value={discountValue}
              onChange={handleDiscountValueChange}
              sx={{ width: '150px' }}
              inputProps={{ min: 0 }}
              size={'small'}
            />
          )}
        </Box>
      )}

      {/* Apply Discount Button */}
      {showDiscountFields && (
        <Box sx={{ marginLeft: '10px' }}>
          <Button variant="contained" color="secondary" sx={{ textTransform: 'capitalize' }} onClick={handleApplyDiscount}>
            Apply Discount
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DiscountSection;

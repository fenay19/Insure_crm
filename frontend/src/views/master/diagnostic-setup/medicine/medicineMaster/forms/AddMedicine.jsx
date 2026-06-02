import React, { useState, useEffect } from 'react';
import { FormControl, FormHelperText, Grid, IconButton, TextField, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';

import { Cancel, Save } from '@mui/icons-material';
import { get, post } from 'api/api';
import { toast } from 'react-toastify';

const MenuProps = {
  PaperProps: {
    style: { maxHeight: 400 }
  }
};

const AddMedicine = ({ close, fetchData }) => {
  const [error, setError] = useState({});
  const [genericData, setGenericData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [doseData, setDoseData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [inputData, setInputData] = useState({
    genericName: '',
    type: '',
    brandName: '',
    dose: '',
    category: '',
    route: '',
    instruction: '',
    relatedDrug: '',
    flag: false
  });

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: '' });
    }
  };

  const handleFlagCheckBox = (e) => {
    setInputData({ ...inputData, flag: e.target.checked });
  };

  const fetchGenericData = async () => {
    await get('generic-master').then((response) => {
      setGenericData(response.data);
    });
  };

  const fetchTypeData = async () => {
    await get('type-master').then((response) => {
      setTypeData(response.data);
    });
  };

  const fetchDoseData = async () => {
    await get('dose-master').then((response) => {
      setDoseData(response.data || []);
    });
  };

  const fetchBrandData = async () => {
    await get('brand-master').then((response) => {
      setBrandData(response.data || []);
    });
  };

  const fetchRouteData = async () => {
    await get('route-master').then((response) => {
      setRouteData(response.data);
    });
  };

  const fetchCategoryData = async () => {
    await get('category-master').then((response) => {
      setCategoryData(response.data);
    });
  };

  useEffect(() => {
    fetchGenericData();
    fetchTypeData();
    fetchRouteData();
    fetchCategoryData();
    fetchDoseData();
    fetchBrandData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {};

    if (inputData.genericName === '') {
      newError.genericName = 'Generic Name is required';
    }
    if (inputData.type === '') {
      newError.type = 'Type is required';
    }
    if (inputData.brandName === '') {
      newError.brandName = 'Brand Name is required';
    }
    if (inputData.dose === '') {
      newError.dose = 'Dose is required';
    }
    if (inputData.category === '') {
      newError.category = 'Category is required';
    }
    if (inputData.route === '') {
      newError.route = 'Route is required';
    }
    if (inputData.instruction.length > 100) {
      newError.instruction = 'instruction must be under 100 characters';
    }
    if (inputData.relatedDrug.length > 50) {
      newError.relatedDrug = 'Related Drug must be under 50 characters';
    }

    setError(newError);
    console.log(newError);
    if (Object.keys(newError).length === 0) {
      try {
        const response = await post('medicines', inputData);

        if (response) {
          toast(`${inputData.genericName} added successfully`);

          close();
          fetchData();
        } else {
          toast({
            title: 'Failed to add medicine',
            status: 'error',
            duration: 4000,
            isClosable: true
          });
        }
      } catch (error) {
        toast({
          title: 'Something went wrong, Please try later!',
          status: 'error',
          duration: 4000,
          isClosable: true
        });
      }
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <div className="popupHead">
          <h2>Add Medicine</h2>
        </div>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Generic Name/Formula/Composition</InputLabel>
              <Select
                label="Generic Name/Formula/Composition"
                value={inputData.genericName}
                name="genericName"
                onChange={handleInputChange}
                error={error.genericName ? true : false}
              >
                {genericData.map((item) => (
                  <MenuItem key={item._id} value={item.genericName}>
                    {item.genericName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{error.genericName}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Brand Name</InputLabel>
              <Select
                label="Brand Name"
                value={inputData.brandName}
                name="brandName"
                onChange={handleInputChange}
                error={error.brandName ? true : false}
              >
                {brandData.map((item) => (
                  <MenuItem key={item._id} value={item.brandName}>
                    {item.brandName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{error.brandName}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type/Form</InputLabel>
              <Select label="Type/Form" value={inputData.type} name="type" onChange={handleInputChange} error={error.type ? true : false}>
                {typeData.map((item) => (
                  <MenuItem key={item._id} value={item.typeName}>
                    {item.typeName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{error.type}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={inputData.category}
                name="category"
                onChange={handleInputChange}
                error={error.category ? true : false}
              >
                {categoryData.map((item) => (
                  <MenuItem key={item._id} value={item.categoryName}>
                    {item.categoryName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{error.category}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Route</InputLabel>
              <Select label="Route" value={inputData.route} name="route" onChange={handleInputChange} error={error.route ? true : false}>
                {routeData.map((item) => (
                  <MenuItem key={item._id} value={item.routeName}>
                    {item.routeName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{error.route}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Dose</InputLabel>
              <Select label="Dose" value={inputData.dose} name="dose" onChange={handleInputChange} error={error.dose ? true : false}>
                {doseData.map((item) => (
                  <MenuItem key={item._id} value={item.dose}>
                    {item.dose}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{error.dose}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Instruction"
              fullWidth
              name="instruction"
              value={inputData.instruction}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
              error={error.instruction ? true : false}
              helperText={error.instruction}
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Related Drug"
              fullWidth
              name="relatedDrug"
              value={inputData.relatedDrug}
              onChange={handleInputChange}
              inputProps={{ maxLength: 50 }}
              rows={3}
              error={error.relatedDrug ? true : false}
              helperText={error.relatedDrug}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Checkbox checked={inputData.flag} onChange={handleFlagCheckBox} />
            <InputLabel>Flag</InputLabel>
          </Grid>
        </Grid>

        <div className="btnGroup">
          <IconButton type="submit" title="Save" className="btnSave">
            <Save />
          </IconButton>
          <IconButton title="Cancel" onClick={close} className="btnCancel">
            <Cancel />
          </IconButton>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;

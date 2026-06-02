import React, { useState, useEffect } from 'react';
import { FormControl, FormHelperText, Grid, IconButton, TextField, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';

import { Cancel, Save } from '@mui/icons-material';
import { get, post, put } from 'api/api';
import { toast } from 'react-toastify';

const MenuProps = {
  PaperProps: {
    style: { maxHeight: 400 }
  }
};

const EditMedicine = ({ close, fetchData, editData }) => {
  console.log('Edit Data', editData);
  const [error, setError] = useState({});
  const [genericData, setGenericData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [doseData, setDoseData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [inputData, setInputData] = useState({
    genericName: editData?.genericName,
    type: editData?.type,
    brandName: editData?.brandName,
    dose: editData?.dose,
    category: editData?.category,
    route: editData?.route,
    instruction: editData?.instruction,
    relatedDrug: editData?.relatedDrug,
    flag: editData?.flag
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

  const fetchTypeData = async () => {
    await get('type-master').then((response) => {
      setTypeData(response.data);
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
    if (inputData.instruction?.length > 100) {
      newError.instruction = 'instruction must be under 100 characters';
    }
    if (inputData.relatedDrug?.length > 50) {
      newError.relatedDrug = 'Related Drug must be under 50 characters';
    }

    setError(newError);
    console.log(newError);
    if (Object.keys(newError).length === 0) {
      try {
        const response = await put(`medicines/${editData._id}`, inputData);

        if (response) {
          toast.success(`${inputData.genericName} updated successfully`);

          close();
          fetchData();
        } else {
          toast.error('Failed to add medicine');
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
          <h2>Update Medicine</h2>
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
              <FormHelperText>{error.genericName}</FormHelperText>
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
              <FormHelperText>{error.type}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={inputData.category} name="category" onChange={handleInputChange}>
                {categoryData.map((item) => (
                  <MenuItem key={item._id} value={item.categoryName}>
                    {item.categoryName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.category}</FormHelperText>
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
              <FormHelperText>{error.route}</FormHelperText>
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
              minRows={4}
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

export default EditMedicine;

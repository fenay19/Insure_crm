import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  MenuItem
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';

// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const SubProductCategory = () => {
  const [form, setForm] = useState({ productName: '', subProductName: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [productCategory, setProductCategory] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [subProductCategoryPermission, setSubProductCategoryPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    if (!form.productName) newErrors.productName = 'Product Name is required';
    if (!form.subProductName) newErrors.subProductName = 'Sub Product Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProductCategory = async () => {
    try {
      const response = await get('productOrServiceCategory');
      console.log('product category: ', response.data);
      setProductCategory(response.data);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };
  // use axiosInstance to fetch data from the server with useEffect
  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['sub-product-category']) {
      setSubProductCategoryPermission(systemRights.actionPermissions['sub-product-category']);
    }
    get('SubProductCategory')
      .then((response) => {
        console.log('get sub product category: ', response.data || []);
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    fetchProductCategory();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ productName: '', subProductName: '' });
    setEditIndex(null);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Add or update sub product category using axiosInstance
  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (editIndex !== null) {
          // Update
          const id = data[editIndex]._id;
          const response = await put(`SubProductCategory/${id}`, form);
          console.log('Post sub categories data:', response.data);
          const updated = [...data];
          updated[editIndex] = response.data;
          setData(updated);
        } else {
          // Add
          const response = await post('SubProductCategory', form);
          const newSubCategory = response.data;
          if (!newSubCategory) {
            console.error('Error: No data returned from POST response.');
            return;
          }
          console.log('Subcategory created:', response.data);
          setData([...(data || []), newSubCategory]);
        }
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Delete sub product category using axiosInstance
  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`SubProductCategory/${id}`);
      const updated = [...data];
      updated.splice(index, 1);
      setData(updated);
    } catch (error) {
      // console.error(error);
      console.error('Error deleting sub product category', error);
    }
  };

  const handleEdit = (index) => {
    const item = data[index];
    setForm({
      productName: item.productName || '',
      subProductName: item.subProductName || ''
    });
    setEditIndex(index);
    setOpen(true);
  };

  console.log('porductCategory: ', productCategory);

  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Sub product Categories
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Sub Product Categories</Typography>
        {(subProductCategoryPermission.Add === true || isAdmin) && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Category
          </Button>
        )}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Category' : 'Add Category'}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            error={!!errors.productName}
            helperText={errors.productName}
            fullWidth
            margin="dense"
          >
            {productCategory?.map((item, index) => {
              return (
                <MenuItem key={index} value={item.productName}>
                  {item.productName}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            label="Sub Product Name"
            name="subProductName"
            value={form.subProductName}
            onChange={handleChange}
            error={!!errors.subProductName}
            helperText={errors.subProductName}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px',
              padding: '2px'
            }}
          >
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              minWidth: '40px',
              padding: '2px',
              backgroundColor: value.primaryLight
            }}
          >
            <IconButton color="inherit">{editIndex !== null ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
        <Card>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Sub Product Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                {data?.length > 0 ? 
                <TableBody>
                  {data?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.productName}</TableCell>
                      <TableCell>{row.subProductName}</TableCell>
                      <TableCell>
                        {(subProductCategoryPermission.Edit === true || isAdmin) && (
                          <Button
                            size="small"
                            onClick={() => handleEdit(index)}
                            sx={{
                              padding: '1px',
                              minWidth: '24px',
                              height: '24px',
                              mr: '5px'
                            }}
                          >
                            <IconButton color="inherit">
                              <Edit />
                            </IconButton>
                          </Button>
                        )}
                        {(subProductCategoryPermission.Delete === true || isAdmin) && (
                          <Button
                            color="error"
                            onClick={() => handleDelete(index)}
                            sx={{
                              padding: '1px',
                              minWidth: '24px',
                              height: '24px'
                            }}
                          >
                            <IconButton color="inherit">
                              <Delete />
                            </IconButton>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                : <TableRow>
                        <TableCell colSpan={4} align="center">
                          No Data Found
                        </TableCell>
                      </TableRow>
}
              </Table>
            </Box>
          </CardContent>
        </Card>
      
    </div>
  );
};

export default SubProductCategory;

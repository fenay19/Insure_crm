import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
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
  Paper,
  Box,
  InputAdornment,
  TablePagination,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
// import { SearchIcon, ClearIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { gridSpacing } from 'config.js';
import value from 'assets/scss/_themes-vars.module.scss';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const initialState = {
  insDepartment: '',
  productName: ''
};

const ProductOrServiceCategory = () => {
  const [form, setForm] = useState(initialState);
  const [insDepartmentData, setInsDepartmentData] = useState({});
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [productCategoryPermission, setProductCategoryPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });

  // Pagination & Search states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const systemRights = useSelector((state) => state.systemRights.systemRights);

  const validate = () => {
    const newErrors = {};
    // if (!form.department) newErrors.department = 'Department Name is required';
    if (!form.productName) newErrors.productName = 'Product Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // use axiosInstance to fetch data from the server with useEffect
  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['product-or-service-category']) {
      setProductCategoryPermission(systemRights.actionPermissions['product-or-service-category']);
    }
    const fetchData = async () => {
      try {
        const response = await get('productOrServiceCategory');

        console.log('Full API Response:', response.data); // 👀 should show { status: 'true', data: [...] }

        const list = response.data; // ✅ safely access nested data
        // console.log('Final Data Set:', list); // 👀 confirm it has productName values

        setData(list); // ✅ populate table
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchData();
  }, [systemRights]);

  useEffect(() => {
    const fetchInsDepartment = async () => {
      const res = await get('insDepartment');

      console.log('insurance Department', res.data);
      if (res.data) setInsDepartmentData(res.data);
      else setInsDepartmentData([]);
    };
    fetchInsDepartment();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm(initialState);
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  //todo: handleSubmit
  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (editIndex !== null) {
          // Edit case
          const id = data[editIndex]._id;
          console.log('edit submit ', form);
          const response = await put(`/productOrServiceCategory/${id}`, form);
          console.log('res  ', response);
          if (response.status) {
            toast.success('Record Edited Succefully');
          }

          console.log('Respomse ', response);
          const updatedCategory = response.data;
          // console.log('Updated Category from API:', updatedCategory); // 🔍 debug

          if (updatedCategory) {
            const updated = [...data];
            updated[editIndex] = updatedCategory;
            setData(updated);
          }
          handleClose();
          // setOpen(false);
        } else {
          // Add case
          console.log('form is', form);
          const response = await post('/productOrServiceCategory', form);

          console.log('New Category from API:', response.data); // 🔍 debug
          const newCategory = response.data;

          if (newCategory) {
            // setData([...data, newCategory]);
            setData([...(data || []), response.data]);
            toast.success('Record inserted Successfully');
          }
          setOpen(false);
          handleClose();
        }

        setOpen(false);
        setEditIndex(null); // ✅ Clear state after submit
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  };

  // Delete product/service category using axiosInstance
  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`/productOrServiceCategory/${id}`);
      toast.success('Record Deleted Successfully');

      const updated = [...data];
      updated.splice(index, 1);
      setData(updated);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  //todo: handleEdit
  const handleEdit = (index, row) => {
    // if(productCategoryPermission.Edit){
    const selected = data[index];
    console.log('edit data ', selected.insDepartment);
    setForm({ productName: selected.productName, insDepartment: selected?.insDepartment?._id });
    setEditIndex(index);
    setOpen(true);
    // }
    // else
    // {
    //   toast.error("You are not authorised");
    // }
  };
  console.log('productCategoryPermission', productCategoryPermission);

  // Search handlers
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowerSearch = searchTerm.toLowerCase().trim();
    return data.filter(
      (entry) =>
        entry?.productName?.toLowerCase().includes(lowerSearch) || entry?.insDepartment?.insDepartment?.toLowerCase().includes(lowerSearch)
    );
  }, [data, searchTerm]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData?.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Truncate text
  const truncateText = (text, maxLength = 30) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Product/Service Category
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Product/Service Category</Typography>
            {/* {(productCategoryPermission.Add === true || isAdmin) && ( */}
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
              Add Product
            </Button>
            {/* )} */}
          </Grid>
        </Grid>

        {/* Search Field */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by product name or department..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>

      {/* Table with Pagination */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Paper sx={{ overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>SN</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell sx={{ width: 200 }}>Department</TableCell>
                  <TableCell sx={{ width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              {paginatedData?.length > 0 ? (
                <TableBody>
                  {paginatedData?.map((row, index) => (
                    <TableRow key={row._id || index} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{truncateText(row?.productName)}</TableCell>
                      <TableCell>{row?.insDepartment?.insDepartment || row?.insDepartment || 'N/A'}</TableCell>
                      <TableCell>
                        {(productCategoryPermission.Edit === true || isAdmin) && (
                          <IconButton size="small" onClick={() => handleEdit(data.findIndex((item) => item._id === row._id))}>
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        {(productCategoryPermission.Delete === true || isAdmin) && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(data.findIndex((item) => item._id === row._id))}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1">{searchTerm ? 'No matching data found' : 'No data available'}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </Table>

            {/* Pagination */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
              />
            </Box>
          </Paper>
        </CardContent>
      </Card>

      {/* Modal Form - unchanged */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Product' : 'Add Product'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            select
            label="Department Name"
            name="insDepartment"
            value={form.insDepartment}
            onChange={handleChange}
            error={!!errors.insDepartment}
            helperText={errors.insDepartment}
            fullWidth
            margin="dense"
          >
            {insDepartmentData.length > 1 &&
              insDepartmentData?.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.insDepartment}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            error={!!errors.productName}
            helperText={errors.productName}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ProductOrServiceCategory;

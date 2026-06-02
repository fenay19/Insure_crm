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
  IconButton
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
import value from 'assets/scss/_themes-vars.module.scss';

// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const MarineClauses = () => {
  const [form, setForm] = useState({ marineClause: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    setOpen(true);
  };

  // Fetch all Insurance departments from backend
  const fetchMarineClauses = async () => {
    try {
      const response = await get('marineClause');
      console.log('marineClause data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMarineClauses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const newErrors = {};
    if (!form.marineClause) newErrors.marineClause = 'Marine Clause is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submit ', editIndex);
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`marineClause/${id}`, form);
        fetchMarineClauses();
        toast.success('Record Edited Sucessfully');
      } else {
        // Create new
        await post('marineClause', form);
        fetchMarineClauses();
        toast.success('Record Saved Sucessfully');
      }
      setOpen(false);
      setForm({ marineClause: '' });
      setEditIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`marineClause/${id}`);
      fetchMarineClauses();
      toast.success('Record deleted Successfully');
    } catch (error) {
      console.error(error);
      toast.error('Record deleted Failed');
    }
  };
  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Masters
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Marine Clause
        </Typography>
      </Breadcrumb>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Marine Clause</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Marine Clause
        </Button>
        {/* {(positionPermission.Add === true || isAdmin) && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                          Add position
                        </Button>
                      )} */}
      </Grid>
      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Add Marine Clause
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
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            label="Marine Clause"
            name="marineClause"
            value={form.marineClause}
            onChange={handleChange}
            error={!!errors.marineClause}
            helperText={errors.marineClause}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ minWidth: '40px', padding: '2px' }}>
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ minWidth: '40px', padding: '2px', backgroundColor: value.primaryLight }}>
            <IconButton color="inherit">{editIndex !== null ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SN</TableCell>
                <TableCell>Marine Clause</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {data?.length > 0 ?
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.marineClause}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEdit(index)}
                      sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                    >
                      <IconButton color="inherit">
                        <Edit />
                      </IconButton>
                    </Button>
                    <Button color="error" onClick={() => handleDelete(index)} sx={{ padding: '1px', minWidth: '24px', height: '24px' }}>
                      <IconButton color="inherit">
                        <Delete />
                      </IconButton>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            :<TableRow>
                    <TableCell colSpan={3} align="center">
                      No Data Found
                    </TableCell>
                  </TableRow>
}
          </Table>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default MarineClauses;

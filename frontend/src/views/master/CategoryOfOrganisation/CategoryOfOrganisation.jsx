import React, { useState } from 'react';
import {
    Grid, TextField, Button, Typography, Card, CardContent, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';

import {get,post,put,remove} from "../../../api/api.js"

const CategoryOfOrganisation = () => {
    const [form, setForm] = useState({ categoryOfOrganisation: '' });
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!form.categoryOfOrganisation) newErrors.categoryOfOrganisation = 'Category Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOpen = () => {
        setForm({ categoryOfOrganisation: '' });
        setErrors({});
        setEditIndex(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        if (validate()) {
            if (editIndex !== null) {
                const updated = [...data];
                updated[editIndex] = form;
                setData(updated);
            } else {
                setData([...data, form]);
            }
            setOpen(false);
        }
    };

    const handleEdit = (index) => {
        setForm(data[index]);
        setEditIndex(index);
        setOpen(true);
    };

    const handleDelete = (index) => {
        const updated = [...data];
        updated.splice(index, 1);
        setData(updated);
    };

    return (
        <div>
            <Breadcrumb>
                <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                    Home
                </Typography>
                <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
                    Category Of Organisation
                </Typography>
            </Breadcrumb>

            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Category Of Organisation</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                    Add Category
                </Button>
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
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <TextField
                        label="Category Name"
                        name="categoryOfOrganisation"
                        value={form.categoryOfOrganisation}
                        onChange={handleChange}
                        error={!!errors.categoryOfOrganisation}
                        helperText={errors.categoryOfOrganisation}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="error"
                        sx={{ minWidth: '40px', padding: '2px' }}
                    >
                        <IconButton color="inherit">
                            <CancelIcon />
                        </IconButton>
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ minWidth: '40px', padding: '2px', backgroundColor: value.primaryLight }}
                    >
                        <IconButton color="inherit">
                            {editIndex !== null ? <EditIcon /> : <SaveIcon />}
                        </IconButton>
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Table */}
            {data.length > 0 && (
                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SN</TableCell>
                                    <TableCell>Category Name</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.categoryOfOrganisation}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                color='primary'
                                                onClick={() => handleEdit(index)}
                                                sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px'}}
                                            >
                                                <IconButton  color='inherit'><Edit /></IconButton>
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => handleDelete(index)}
                                                sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
                                            >
                                                <IconButton  color='inherit'><Delete /></IconButton>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default CategoryOfOrganisation;

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  MenuItem,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { Cancel, Save } from '@mui/icons-material';
import { useGetPTQuery, useAddPTMutation, useUpdatePTMutation, useDeletePTMutation } from 'services/endpoints/PT/PT';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn'; // Adjust path accordingly
import { useSelector } from 'react-redux';
import { baseApi } from 'services/baseApi';

const PT = ({ salaryIncomeHeadPermission, isAdmin }) => {
  const { data: ptData = [], refetch } = useGetPTQuery();
  const [addPT] = useAddPTMutation();
  const [updatePT] = useUpdatePTMutation();
  const [deletePT] = useDeletePTMutation();
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  useEffect(() => {
    if (ptData.length) {
      setRows(ptData.map((row) => ({ ...row, isEditing: false })));
    }
  }, [ptData]);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), month: '', amount: '', isEditing: true, isNew: true }]);
  };

  const handleChange = (id, field, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleEdit = (row) => {
    if (!row._id) {
      toast.error('This row has not been saved to the database yet.');
      return;
    }
    setCurrentRow({ ...row });
    setOpen(true);
  };

  const handleSave = async (id) => {
    const row = rows.find((row) => row.id === id);
    const payload = { month: row.month, amount: parseFloat(row.amount) };

    try {
      if (row.isNew) {
        const res = await addPT(payload).unwrap();
        setRows(
          rows.map((r) =>
            r.id === id
              ? {
                  ...r,
                  _id: res._id,
                  isEditing: false,
                  isNew: false
                }
              : r
          )
        );
      } else {
        if (!row._id) throw new Error('Missing _id for update');
        await updatePT({ id: row._id, updatedData: payload }).unwrap();
        setRows(
          rows.map((r) =>
            r.id === id
              ? {
                  ...r,
                  isEditing: false,
                  isNew: false
                }
              : r
          )
        );
      }

      toast.success('Saved Successfully');
      refetch();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  const handleDelete = async (id, _id) => {
    if (!_id) {
      toast.error('Cannot delete: Missing record ID from the database.');
      return;
    }
    try {
      await deletePT(_id).unwrap();
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success('Deleted successfully');
      refetch();
    } catch (err) {
      toast.error('Delete failed');
      console.error('Error deleting record:', err);
    }
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalSave = async () => {
    const payload = {
      month: currentRow.month,
      amount: parseFloat(currentRow.amount)
    };

    try {
      if (currentRow._id) {
        await updatePT({ id: currentRow._id, updatedData: payload }).unwrap();
        toast.success('Updated successfully');
      } else {
        await addPT(payload).unwrap();
        toast.success('Saved new record successfully');
      }

      handleModalClose();
      refetch();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  const monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <div
      style={{
        padding: '32px 16px',
        background: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        boxSizing: 'border-box'
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '100%', // ✅ Set max-width for better layout
          overflowX: 'auto',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
          {(salaryIncomeHeadPermission.Add === true || isAdmin) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow}>
              Add
            </Button>
          )}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 250 }}
          />
        </div>

        <Divider sx={{ mb: 3 }} />

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F0F2F8' }}>
                <TableCell>Month</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .filter((row) => row.month?.toLowerCase().includes(searchTerm.toLowerCase()) || row.amount?.toString().includes(searchTerm))
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.isEditing ? (
                        <TextField
                          select
                          value={row.month}
                          onChange={(e) => handleChange(row.id, 'month', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: '120px' }}
                        >
                          {monthOptions.map((month) => (
                            <MenuItem key={month} value={month}>
                              {month}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        row.month
                      )}
                    </TableCell>
                    <TableCell>
                      {row.isEditing ? (
                        <TextField
                          type="text"
                          value={row.amount}
                          onChange={(e) => handleChange(row.id, 'amount', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        />
                      ) : (
                        row.amount
                      )}
                    </TableCell>
                    <TableCell>
                      {(salaryIncomeHeadPermission.Edit === true || isAdmin) && (
                        <IconButton onClick={() => handleEdit(row)} color="primary">
                          <EditBtn />
                        </IconButton>
                      )}
                      {(salaryIncomeHeadPermission.Delete === true || isAdmin) && (
                        <IconButton onClick={() => handleDelete(row.id, row._id)} color="error">
                          <DeleteBtn />
                        </IconButton>
                      )}
                      <IconButton
                        type="submit"
                        title="save"
                        className="btnSave"
                        sx={{ marginLeft: 2 }}
                        onClick={() => handleSave(row.id)}
                        color="success"
                      >
                        <Save sx={{ width: 15, height: 12 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No rows added yet. Click "Add" to insert a new row.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ToastContainer />

      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>
          {currentRow && (
            <>
              <TextField
                select
                label="Month"
                value={currentRow.month}
                onChange={(e) => setCurrentRow({ ...currentRow, month: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                {monthOptions.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Amount"
                value={currentRow.amount}
                onChange={(e) => setCurrentRow({ ...currentRow, amount: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <IconButton title="Cancel" onClick={handleModalClose} className="btnCancel">
            <Cancel />
          </IconButton>
          <IconButton type="submit" title="save" className="btnSave" sx={{ marginLeft: 2 }} onClick={handleModalSave} color="success">
            <Save sx={{ width: 18, height: 18 }} />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PT;

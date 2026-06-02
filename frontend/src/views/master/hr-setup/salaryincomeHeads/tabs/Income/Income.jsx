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
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box
} from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import {
  useGetIncomeQuery,
  useAddIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation
} from 'services/endpoints/Income/income';

const Income = ({salaryIncomeHeadPermission,isAdmin}) => {
  const { data: incomeData = [], refetch } = useGetIncomeQuery();
  const [addIncome] = useAddIncomeMutation();
  const [updateIncome] = useUpdateIncomeMutation();
  const [deleteIncome] = useDeleteIncomeMutation();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (incomeData.length) {
      setRows(incomeData.map((row) => ({ ...row, isEditing: false })));
    }
  }, [incomeData]);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), income: '', amount: '', isEditing: true, isNew: true }]);
  };

  const handleChange = (id, field, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleEdit = (row) => {
    // If the row doesn't have an _id, show an error and don't proceed to edit
    // if (!row._id) {
    //   toast.error("This row has not been saved to the database yet.");
    //   return;
    // }
    setCurrentRow({ ...row });
    setOpen(true);
  };

  const handleSave = async (id) => {
    const row = rows.find((row) => row.id === id);
    const payload = { income: row.income, amount: parseFloat(row.amount) };

    try {
      if (row.isNew) {
        // Add the new income
        const res = await addIncome(payload).unwrap();
        console.log(res); // Add new income
        setRows(
          rows.map((r) =>
            r.id === id
              ? {
                  ...r,
                  _id: res._id, // Save the _id from the backend response
                  isEditing: false,
                  isNew: false
                }
              : r
          )
        );
      } else {
        // Update the existing row
        if (!row._id) throw new Error('Missing _id for update');
        await updateIncome({ id: row._id, updatedData: payload }).unwrap();
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

      refetch();
      toast.success('Saved Successfully');
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Save failed');
    }
  };

  const handleDelete = async (_id) => {
    if (!_id) {
      toast.error('Cannot delete: Missing record ID from the database.');
      return;
    }
    try {
      // Pass the ID as an object with the key `id` to match the expected mutation format
      await deleteIncome({ id: _id }).unwrap();
      setRows(rows.filter((row) => row._id !== _id));
      toast.success('Deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed');
    }
  };

  const handleModalClose = () => setOpen(false);

  const handleModalSave = async () => {
    const payload = {
      income: currentRow.income,
      amount: parseFloat(currentRow.amount)
    };

    try {
      if (currentRow._id) {
        await updateIncome({ id: currentRow._id, updatedData: payload }).unwrap();
        toast.success('Updated successfully');
      } else {
        await addIncome(payload).unwrap();
        toast.success('Saved new record successfully');
      }

      handleModalClose();
      refetch();
    } catch (err) {
      toast.error('Save failed');
      console.error('Error saving record:', err);
    }
  };

  const filteredRows = rows.filter(
    (row) => row.income?.toLowerCase().includes(searchTerm.toLowerCase()) || row.amount?.toString().includes(searchTerm)
  );

  return (
    <div style={{ padding: '30px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '1200px',
          boxSizing: 'border-box',
          overflowX: 'auto',
          margin: '0 auto'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          {(salaryIncomeHeadPermission.Add===true || isAdmin) && <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow}>
            Add
          </Button>}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by income or amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F0F2F8' }}>
                <TableCell>Income</TableCell>
                <TableCell>Amount(%)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.isEditing ? (
                      <TextField
                        value={row.income}
                        onChange={(e) => handleChange(row.id, 'income', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: '160px' }}
                        placeholder="Enter income"
                      />
                    ) : (
                      row.income
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
                      `${row.amount}%`
                    )}
                  </TableCell>
                  <TableCell>
                    {(salaryIncomeHeadPermission.Edit===true || isAdmin) && <IconButton onClick={() => handleEdit(row)} color="primary">
                      <EditBtn />
                    </IconButton>}
                    {(salaryIncomeHeadPermission.Delete===true || isAdmin) && <IconButton onClick={() => handleDelete(row._id)} color="error">
                      <DeleteBtn />
                    </IconButton>}
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
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No matching records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ToastContainer />

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>
          {currentRow && (
            <>
              <TextField
                label="Income"
                value={currentRow.income}
                onChange={(e) => setCurrentRow({ ...currentRow, income: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Enter income type"
              />
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
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleModalSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Income;

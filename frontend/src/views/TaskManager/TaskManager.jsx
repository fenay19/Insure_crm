import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { Add, Save as SaveIcon, Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Close from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import { get, post, put, remove } from '../../api/api';
import { useSelector } from 'react-redux';

const TaskManager = () => {
  const [form, setForm] = useState({
    title: '',
    priority: '',
    client: '',
    description: '',
    status: '',
    employeeName: '',
    startDate: null,
    endDate: null,
    createdBy: '',
    assignedTo: []
  });

  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    client: '',
    dateFrom: null,
    dateTo: null,
    employeeName: ''
  });

  const [priorityOptions, setPriorityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [adminStaffOptions, setAdminStaffOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [company, setCompany] = useState({});

  const [isAdmin, setAdmin] = useState(false);
  const [taskManagementPermission, setTaskManagementPermission] = useState({
    View: false,
    Add: false,
    Edit: false,
    Delete: false
  });
  const systemRights = useSelector((state) => state.systemRights.systemRights);

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['task-manager']) {
      setTaskManagementPermission(systemRights.actionPermissions['task-manager']);
    }
    const companyName = localStorage.getItem('loginName');
    setCompany(companyName);
  }, [systemRights]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await get('task-manager');
        console.log('get res is', res);
        if (res.success === true) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error loading tasks:', err);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    async function loadPriorities() {
      try {
        const response = await get('priority');
        if (response.status === 'true') {
          setPriorityOptions(response.data);
        }
      } catch (error) {
        console.error('Failed to load priorities:', error);
      }
    }
    loadPriorities();
  }, []);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const res = await get('taskStatus');
        console.log('roes is ', res);
        setStatusOptions(res.data);
      } catch (error) {
        console.error('Failed to fetch status options', error);
      }
    };
    fetchStatusOptions();
  }, []);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await get('admin-clientRegistration');
        if (res.status === 'true' && Array.isArray(res.data)) {
          const clients = res.data.map((client) => ({
            id: client._id,
            name: client.clientName
          }));
          setClientOptions(clients);
        }
      } catch (err) {
        console.error('Error fetching client options:', err);
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    async function fetchAdminStaff() {
      try {
        const response = await get('administrative');
        if (response.data) {
          const staffList = response.data.map((staff) => ({
            id: staff._id,
            name: `${staff.basicDetails.firstName} ${staff.basicDetails.lastName}`
          }));
          setAdminStaffOptions(staffList);
        }
      } catch (error) {
        console.error('Error fetching admin staff:', error);
      }
    }
    fetchAdminStaff();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleDateFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const updatedFilteredData = data.filter((task) => {
      const matchesPriority = !filters.priority || task.priority?.priorityName === filters.priority;
      const matchesStatus = !filters.status || task.status?.TaskStatus === filters.status;
      const matchesClient = !filters.client || task.client?.clientName === filters.client;
      const matchesEmployee = !filters.employeeName || task.employeeName === filters.employeeName;
      const matchesDate =
        (!filters.dateFrom || new Date(task.startDate) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(task.endDate) <= new Date(filters.dateTo));

      return matchesPriority && matchesStatus && matchesClient && matchesEmployee && matchesDate;
    });

    setFilteredData(updatedFilteredData);
  }, [data, filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'assignedTo' ? (Array.isArray(value) ? value : [value]) : value
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    const loginData = JSON.parse(localStorage.getItem('loginData')) || {};
    const employeeName = loginData?.name || '';

    setOpen(true);
    setForm({
      title: '',
      priority: '',
      client: '',
      description: '',
      status: '',
      employeeName: employeeName, // still stored
      startDate: new Date(), // still stored
      endDate: null,
      createdBy: '',
      assignedTo: []
    });
    setErrors({});
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    const task = data[index];
    if (!task || !task._id) {
      toast.error('Invalid task data');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      await remove(`task-manager/${task._id}`);
      toast.info('Task deleted!');
      setData((prevData) => prevData.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (index) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    const task = data[index];
    if (!task) return;

    setForm({
      title: task.title ?? '',
      priority: task.priority?._id ?? '',
      client: task.client?._id ?? '',
      description: task.description ?? '',
      status: task.status?._id ?? '',
      employeeName: task.employeeName ?? '',
      startDate: task.startDate ? new Date(task.startDate) : null,
      endDate: task.endDate ? new Date(task.endDate) : null,
      createdBy: task.createdBy ?? '',
      assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo.map((a) => a._id) : []
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    e.preventDefault();

    // Prepare payload for API
    const payload = {
      ...form,
      createdBy: company,
      startDate: form.startDate,
      endDate: form.endDate
    };

    try {
      if (editIndex !== null) {
        const id = data[editIndex]._id;

        const updatePayload = {
          ...payload,
          priority: form.priority,
          status: form.status,
          client: form.client,
          assignedTo: form.assignedTo,
          startDate: form.startDate ? form.startDate.toISOString() : null,
          endDate: form.endDate ? form.endDate.toISOString() : null
        };
        await put(`task-manager/update/${id}`, updatePayload);
        toast.success('Task updated!');
      } else {
        // Create new
        const sanitizedPayload = {
          assignedTo: payload.assignedTo,
          client: payload.client,
          createdBy: payload.createdBy,
          description: payload.description,
          employeeName: payload.employeeName,
          endDate: payload.endDate.toISOString(),
          priority: payload.priority,
          startDate: payload.startDate.toISOString(),
          status: payload.status,
          title: payload.title
        };
        console.log('sanitized payload is', sanitizedPayload);
        const response = await post('task-manager', sanitizedPayload);
        if (response.success === true) {
          toast.success('Task created!');
        }
      }

      // Refresh tasks
      const res = await get('task-manager');
      if ((res.status === 'true' || res.success === true) && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        toast.error('Failed to refresh task list');
      }

      // Reset form
      setForm({
        title: '',
        priority: '',
        client: '',
        description: '',
        status: '',
        employeeName: '',
        startDate: null,
        endDate: null,
        createdBy: '',
        assignedTo: []
      });
      setEditIndex(null);
      setOpen(false);
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Error saving task');
    }
  };

  useEffect(() => {
    async function fetchCompany() {
      try {
        const rawRefId = localStorage.getItem('refId');
        const refId = rawRefId?.replace(/^"|"$/g, '').trim(); // fix here

        console.log('Sanitized refId:', refId);

        const response = await get('clientRegistration');
        console.log('API Response:', response.data);

        if ((response.status === true || response.status === 'true') && Array.isArray(response.data)) {
          const companyData = response.data.find((c) => c._id === refId);
          console.log('Matched companyData:', companyData);

          if (companyData) {
            setCompany(companyData);
          } else {
            console.warn('Company not found for refId:', refId);
          }
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    }

    fetchCompany();
  }, []);

  return (
    <>
      <Breadcrumb title="Task Manager">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Task Manager
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <Grid container spacing={1} sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {/* Filters */}
                  <Grid item xs={2}>
                    <TextField select label="Priority" name="priority" value={filters.priority} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {priorityOptions.map((p) => (
                        <MenuItem key={p.priorityName} value={p.priorityName}>
                          {p.priorityName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField select label="Status" name="status" value={filters.status} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {statusOptions?.map((s) => (
                        <MenuItem key={s._id} value={s.TaskStatus}>
                          {s.TaskStatus}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField select label="Client" name="client" value={filters.client} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {clientOptions.map((client) => (
                        <MenuItem key={client.id} value={client.name}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={filters.dateFrom}
                        onChange={(value) => handleDateFilterChange('dateFrom', value)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={2}>
                    <TextField
                      select
                      label="Employee Name"
                      name="employeeName"
                      value={filters.employeeName}
                      onChange={handleFilterChange}
                      fullWidth
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(filteredData.map((task) => task.employeeName))].filter(Boolean).map((name, index) => (
                        <MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {(taskManagementPermission.Add === true || isAdmin) && (
                      <Button size="large" variant="contained" onClick={handleOpen}>
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Table to display filtered tasks */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: '#f5f5f5',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <TableCell sx={{ width: 30, px: 1.5, py: 0.8 }}>SN</TableCell>
                        <TableCell sx={{ width: 100, px: 1.5, py: 0.8 }}>Title</TableCell>
                        <TableCell sx={{ width: 70, px: 1.5, py: 0.8 }}>Priority</TableCell>
                        <TableCell sx={{ width: 120, px: 1.5, py: 0.8 }}>Client</TableCell>
                        <TableCell sx={{ width: 70, px: 1.5, py: 0.8 }}>Status</TableCell>
                        <TableCell sx={{ width: 120, px: 1.5, py: 0.8 }}>Employee</TableCell>
                        <TableCell
                          sx={{
                            width: 150,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            px: 1.5,
                            py: 0.8
                          }}
                        >
                          Assigned To
                        </TableCell>
                        <TableCell sx={{ width: 80, px: 1.5, py: 0.8 }}>Start</TableCell>
                        <TableCell sx={{ width: 80, px: 1.5, py: 0.8 }}>Due</TableCell>
                        <TableCell sx={{ width: 150, px: 1.5, py: 0.8 }}>Created By</TableCell>
                        <TableCell sx={{ width: 120, px: 1.5, py: 0.8 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((task, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>{index + 1}</TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>
                              <Typography
                                component={Link}
                                to={`/task-details/${task._id}`}
                                variant="subtitle2"
                                sx={{ textDecoration: 'none', color: '#2563eb' }}
                              >
                                {task.title}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>
                              {(() => {
                                const priority = task.priority?.priorityName?.toLowerCase();
                                const colorMap = {
                                  high: { color: '#d32f2f', backgroundColor: '#fdecea' },
                                  medium: { color: '#f57c00', backgroundColor: '#fff3e0' },
                                  low: { color: '#1976d2', backgroundColor: '#e3f2fd' }
                                };
                                const selected = colorMap[priority] || colorMap['low'];
                                return (
                                  <Box
                                    sx={{
                                      display: 'inline-block',
                                      px: 1.2,
                                      py: 0.4,
                                      borderRadius: '50px',
                                      fontWeight: 500,
                                      fontSize: '0.75rem',
                                      color: selected.color,
                                      backgroundColor: selected.backgroundColor
                                    }}
                                  >
                                    {task.priority?.priorityName || 'N/A'}
                                  </Box>
                                );
                              })()}
                            </TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>{task?.client?.clientName}</TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  px: 1.2,
                                  height: '24px',
                                  borderRadius: '50px',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                  lineHeight: 1,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  backgroundColor: `${task.status?.colorCode}`
                                }}
                              >
                                {task.status?.TaskStatus || 'N/A'}
                              </Box>
                            </TableCell>

                            <TableCell sx={{ px: 1.5, py: 0.8 }}>{task.employeeName}</TableCell>
                            <TableCell sx={{ px: 1, py: 0.6, fontSize: '0.75rem', lineHeight: 1.2 }}>
                              {task.assignedTo.map((item) => `${item.basicDetails.firstName} ${item.basicDetails.lastName}`).join(',')}
                            </TableCell>

                            <TableCell sx={{ px: 1.5, py: 0.8 }}>
                              {new Date(task.startDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>
                              {new Date(task.endDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>{company.clientName || 'N/A'}</TableCell>
                            <TableCell sx={{ px: 1.5, py: 0.8 }}>
                              {(taskManagementPermission.Edit === true || isAdmin) && (
                                <IconButton color="primary" onClick={() => handleEdit(index)}>
                                  <EditIcon />
                                </IconButton>
                              )}
                              {(taskManagementPermission.Delete === true || isAdmin) && (
                                <IconButton color="error" onClick={() => handleDelete(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} align="center">
                            No tasks found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Add/Edit Task Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth key={editIndex !== null ? `edit-${editIndex}` : 'create'}>
        <DialogTitle>
          {editIndex !== null ? 'Edit Task' : 'Add Task'}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                label="Priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.priority}
                helperText={errors.priority}
              >
                {priorityOptions.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.priorityName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                error={!!errors.status}
                helperText={errors.status}
                fullWidth
                required
              >
                {statusOptions?.map((status) => (
                  <MenuItem key={status._id} value={status._id}>
                    {status.TaskStatus}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                label="Assigned To"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                SelectProps={{
                  multiple: true,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200
                      }
                    }
                  }
                }}
                fullWidth
              >
                {adminStaffOptions.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                label="Client Name"
                name="client"
                value={form.client}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.client}
                helperText={errors.client}
              >
                {clientOptions.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
                multiline
                required
              />
            </Grid>

            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={form.endDate}
                  onChange={(value) => handleDateChange('endDate', value)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editIndex !== null ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskManager;

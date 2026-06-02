import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  MenuItem,
  Stack,
  Breadcrumbs
} from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Send } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { get, put } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

const TaskDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [statusChanged, setStatusChanged] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);

  console.log(taskData);

  // when you need it
  const company = JSON.parse(localStorage.getItem('company') || '{}');
  // console.log(company);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const fetchStatusOptions = async () => {
    try {
      const res = await get('taskStatus');
      if (res?.data) {
        setStatusOptions(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch status options', error);
    }
  };

  const fetchTicketDetails = async () => {
    try {
      const response = await get(`task-manager/${id}`);
      // console.log('response is status', response);
      if (response.success === true) {
        setTaskData(response.data);
        setStatusChanged(response.data.status._id);
        if (response.data.statusHistory) {
          setStatusHistory(response.data.statusHistory);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatusChanged(newStatus);
  };

  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    // console.log('task data is', taskData);
    try {
      const statusData = {
        user: taskData?.assignedTo.map((item) => `${item.basicDetails.firstName} ${item.basicDetails.lastName}`).join(', '),
        fromStatus: taskData?.status._id,
        toStatus: statusChanged,
        comment: comment
      };
      if (comment === '') {
        toast.error('comment is required!');
        return;
      }
      // console.log('status data is', statusData);
      const response = await put(`task-manager/status/${id}`, statusData);
      // console.log('response is', response);
      if (response) {
        toast.success('Status updated successfully');
        setComment('');
        fetchTicketDetails(); // Refresh view
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchStatusOptions();
    fetchTicketDetails();
  }, []);

  // console.log('statusHistory', taskData);

  return (
    <>
      {/* Breadcrumb */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 2,
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <Breadcrumbs title="Ticket Management" className="flex">
          <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
            Home
          </Typography>
          <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
            Task Details
          </Typography>
        </Breadcrumbs>

        <Button sx={{ mb: 2 }} variant="contained" onClick={() => navigate('/ticket-management')}>
          Back
        </Button>
      </Box>
      <Box p={2}>
        <Grid container>
          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ border: '1px solid #e0e0e0', p: 1, cursor: 'pointer' }} onClick={toggleDetails}>
                  <Grid container py={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" fontWeight="bold">
                        Details
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'end' }}>
                      <ExpandMoreOutlinedIcon
                        sx={{
                          transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {showDetails && (
                  <Box sx={{ border: '1px solid #e0e0e0', borderTop: 'none', p: 1 }}>
                    {[
                      {
                        label: 'Assignee',
                        value: taskData?.assignedTo.map((item) => `${item.basicDetails.firstName} ${item.basicDetails.lastName}`).join(', ')
                      },
                      { label: 'Priority', value: taskData?.priority.priorityName, isChip: true, chipColor: '#f43f5e' },
                      // { label: 'Product', value: taskData?.product, isChip: true },
                      // { label: 'Phone Number', value: taskData?.phoneNumber },
                      // { label: 'Employee Name', value: taskData?.employeeName },
                      { label: 'Created By', value: company?.Name }
                    ].map((field, index) => (
                      <Grid container py={1} key={index}>
                        <Grid item xs={5}>
                          <Typography variant="body2" color="text.secondary">
                            {field.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          {field.isChip ? (
                            <Chip
                              label={field.value}
                              size="small"
                              sx={{ bgcolor: field.chipColor || '', fontWeight: 500, color: field.chipColor ? 'white' : '' }}
                            />
                          ) : (
                            <Typography variant="body2" fontWeight={500}>
                              {field.value}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid container py={1}>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Created on
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Chip
                          label={new Date(taskData?.statusHistory[0]?.timestamp).toLocaleDateString('en-US')}
                          size="small"
                          sx={{ bgcolor: '#9ca3af', color: 'white', fontWeight: 500 }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container py={1}>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Due Date
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Chip
                          label={new Date(taskData?.endDate).toLocaleDateString('en-US')}
                          size="small"
                          sx={{ bgcolor: '#9ca3af', color: 'white', fontWeight: 500 }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Box sx={{ border: '1px solid #e0e0e0', mt: 2, p: 1 }}>
                  <Typography variant="body2">{new Date(taskData?.statusHistory[0]?.timestamp).toLocaleString()}</Typography>
                  <Typography variant="body2" mt={1}>
                    {new Date(taskData?.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Left Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {taskData?.title}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ color: '#4B5563', fontWeight: 600, mb: 1 }}>
                  Description
                </Typography>

                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #F0F4F8, #FFFFFF)',
                    borderRadius: 3,
                    p: 1,
                    mb: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#1F2937',
                      fontSize: '1rem',
                      fontWeight: 400,
                      lineHeight: 1.75,
                      fontFamily: 'Segoe UI, Roboto, sans-serif'
                    }}
                  >
                    {taskData?.description || 'No description provided.'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, display: 'inline-block', bgcolor: '#10b981', borderRadius: '6px', px: 1.5, py: 0.5 }}>
                  <TextField
                    value={statusChanged}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    select
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        fontWeight: 600,
                        color: 'white',
                        '& .MuiSelect-icon': { color: 'white' }
                      }
                    }}
                    SelectProps={{
                      sx: { color: 'white' }
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option._id || option.task} value={option._id}>
                        {option.TaskStatus}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Typography variant="subtitle2" sx={{ color: '#6b7280', mt: 2 }}>
                  Comments
                </Typography>
                <Box display="flex" gap={2} mb={3}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button variant="contained" sx={{ bgcolor: '#6366f1' }} onClick={handleSubmit}>
                    <Send />
                  </Button>
                </Box>
                <Box
                  sx={{
                    maxHeight: 300, // Set desired height
                    overflowY: 'auto',
                    pr: 1, // Padding for scrollbar space
                    scrollbarWidth: 'thin', // Firefox
                    '&::-webkit-scrollbar': {
                      width: '6px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1'
                    }
                  }}
                >
                  <Stack spacing={2}>
                    {statusHistory?.map((item, idx) => (
                      <Paper key={idx} elevation={2} sx={{ p: 2, mb: 2 }}>
                        <Box display="flex" gap={2}>
                          <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
                            <ArrowCircleRightOutlinedIcon sx={{ fontSize: 20, color: 'white' }} />
                          </Avatar>
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" color="text.primary">
                                Comment
                              </Typography>
                              <Typography variant="body2" color="#6366f1" fontWeight={500}>
                                {item.comment}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" color="text.primary">
                                Status changed by
                              </Typography>
                              <Typography variant="body2" color="#6366f1" fontWeight={500}>
                                {item.user}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af', marginLeft: 'auto' }}>
                                {item.timestamp}
                              </Typography>
                            </Box>
                            <Box display="flex" gap={1} mt={0.5}>
                              <Chip
                                label={item.fromStatus}
                                size="small"
                                sx={{
                                  bgcolor: item.fromStatus === 'Pending' ? '#f97316' : '#3b82f6',
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <ArrowCircleRightOutlinedIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
                              <Chip
                                label={item.toStatus}
                                size="small"
                                sx={{
                                  bgcolor: item.toStatus === 'Completed' ? '#10b981' : '#28a745',
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <ToastContainer />
      </Box>
    </>
  );
};

export default TaskDetailView;

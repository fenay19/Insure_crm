import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import loginBackground from '../../assets/images/bg_login.jpg';
import { useTheme } from '@mui/material/styles';
import { post } from 'api/api';

const TrialRegistration = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    clientName: '',
    officialMailId: '',
    officialPhoneNo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const payload = {
      ...formData,
      clientType: '68d691f731cbb60e09508afa',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    try {
      const res = await post('clientRegistration', payload);
      if (res.status === true) {
        toast.success('Client registered successfully');
        setFormData({ clientName: '', officialMailId: '', officialPhoneNo: '' });
      } else {
        toast.error(res.message || 'Failed to register');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        height: '100%',
        p: 2
      }}
    >
      <Grid item xs={11} sm={7} md={6} lg={4}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            maxWidth: '475px',
            margin: '24px auto',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(50px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4), width: '100%' }}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column" spacing={4} justifyContent="center">
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Typography color="textPrimary" gutterBottom variant="h4" fontWeight="bold">
                    Mirai CRM
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start your <b>30-Day Free Trial</b> today!
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Official Email"
                    name="officialMailId"
                    type="email"
                    value={formData.officialMailId}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Official Phone Number"
                    name="officialPhoneNo"
                    type="tel"
                    value={formData.officialPhoneNo}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2, py: 1.4, borderRadius: 2, fontWeight: 'bold' }}
                  >
                    Sign Up for 30-Day Trial
                  </Button>
                </Grid>

                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Already have an account?{' '}
                    <a
                      href="/login"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Log in
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TrialRegistration;

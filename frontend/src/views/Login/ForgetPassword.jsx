import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent, IconButton, Box, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import REACT_APP_API_URL, { post } from '../../api/api';
import loginBackground from 'assets/images/bg_login.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const sendOtp = async () => {
    try {
      const response = await post(`/admin/auth/send-otp`, { email });
      if (response.success === true) {
        setEmailVerified(true);
        alert('OTP sent to your email');
      } else {
        alert('Email not found');
      }
    } catch (error) {
      alert(error.response?.data || 'Something went wrong');
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      otp: Yup.string().required('OTP is required'),
      newPassword: Yup.string().min(8, 'Must be at least 8 characters').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${REACT_APP_API_URL}admin/reset-password`, {
          email,
          otp: values.otp,
          newPassword: values.newPassword
        });

        alert(response.data.msg || 'Password reset successfully');
        navigate('/login');
      } catch (error) {
        alert(error.response?.data?.msg || 'Something went wrong');
      }
    }
  });

  return (
    <Box
      sx={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        minHeight: '100vh'
      }}
    >
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={11} sm={8} md={4}>
          <Card
            sx={{
              overflow: 'visible',
              maxWidth: '475px',
              margin: '24px auto',
              background: 'transparent',
              backdropFilter: 'blur(50px)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  Forgot Password
                </Typography>
                <Button
                  onClick={() => navigate('/login')}
                  color="error"
                  variant="contained"
                  sx={{
                    fontSize: '13px',
                    minWidth: '36px',
                    height: '36px',
                    borderWidth: '0.5px',
                    borderColor: 'error.main',
                    borderRadius: '8px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  X
                </Button>
              </Box>

              {!emailVerified ? (
                <Box>
                  <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={sendOtp}>
                    Send OTP
                  </Button>
                </Box>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="OTP"
                    name="otp"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                    helperText={formik.touched.otp && formik.errors.otp}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                    Reset Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;

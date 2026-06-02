import React from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent, IconButton, Box, InputAdornment } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import REACT_APP_API_URL from '../../api/api';
// Import your background image here (adjust the path as needed)
import loginBackground from 'assets/images/bg_login.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      // email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      // email: Yup.string().email('Invalid email').required('Email is required'),
      oldPassword: Yup.string().required('Old password is required'),
      newPassword: Yup.string().min(8, 'Must be at least 8 characters').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token'); // 👈 get token stored at login

        const response = await axios.post(
          `${REACT_APP_API_URL}admin/change-password`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
          },
          {
            headers: {
              Authorization: `Bearer ${token}` // 👈 send token in header
            }
          }
        );

        alert(response.data.msg || 'Password changed successfully');
        navigate('/dashboard');
      } catch (error) {
        alert(error.response?.data?.msg || 'Something went wrong');
      }
    }
  });
  const isNewPasswordValid = formik.values.newPassword.length >= 8;
  const doPasswordsMatch = formik.values.newPassword && formik.values.confirmPassword === formik.values.newPassword;

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
                  Change Password
                </Typography>
                <Button
                  onClick={() => navigate('/dashboard')}
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
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                  helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                />
                {/* <TextField
                  fullWidth
                  margin="normal"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                  helperText={formik.touched.newPassword && formik.errors.newPassword}
                /> */}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: formik.values.newPassword.length === 0 ? undefined : isNewPasswordValid ? 'success' : 'error'
                      }
                    }
                  }}
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

                {/* <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                /> */}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: formik.values.confirmPassword.length === 0 ? undefined : doPasswordsMatch ? 'success' : 'error'
                      }
                    }
                  }}
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
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;

import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router';
import * as Yup from 'yup';
import axios from 'axios';
import loginBackground from 'assets/images/bg1.jpg.jpeg';
import amikaLogo from 'assets/images/amikaLogoNoBG.png';
import insureLogo from 'assets/images/insure_logo.png';
import { useDispatch } from 'react-redux';
import { fetchUserRights } from '../../reduxSlices/authSlice';
import REACT_APP_API_URL from '../../api/api';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  const validationSchema = Yup.object({
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      //todo:
      try {
        let response = null;

        // Try admin login
        try {
          const adminRes = await axios.post(`${REACT_APP_API_URL}admin/login`, values, { withCredentials: true });

          if (adminRes.data.role === 'admin') {
            response = adminRes;

            localStorage.setItem('companyId', response?.data?.adminId);
            const endDate = new Date(response?.data?.endDate);
            localStorage.setItem('end', endDate);

            const now = new Date();

            if (endDate <= now) {
              localStorage.setItem('expired', 'true');
            } else {
              localStorage.setItem('expired', 'false');
            }
          } else {
            throw new Error('Not an admin');
          }
        } catch (adminError) {
          try {
            const superRes = await axios.post(`${REACT_APP_API_URL}superAdmin/login`, values, { withCredentials: true });
            if (superRes.data.role === 'super-admin') {
              response = superRes;
              localStorage.setItem('companyId', superRes.data.userId);
            } else {
              throw new Error('Not a super admin');
            }
          } catch (superAdminError) {
            try {
              const staffRes = await axios.post(`${REACT_APP_API_URL}administrative/staff-login`, values, { withCredentials: true });

              if (staffRes.data.role === 'staff') {
                console.log(staffRes);
                response = staffRes;

                localStorage.setItem('companyId', response?.data?.companyId);
                localStorage.setItem('empId', response?.data?.empId);
                const endDate = new Date(response?.data?.endDate);
                localStorage.setItem('end', endDate);

                const now = new Date();

                if (endDate <= now) {
                  localStorage.setItem('expired', 'true');
                } else {
                  localStorage.setItem('expired', 'false');
                }
              } else {
                throw new Error('Not a staff user');
              }
            } catch (staffError) {
              console.error('❌ Staff login failed:', staffError.response?.data || staffError.message);
              throw new Error('Invalid login credentials');
            }
          }
        }

        if (!response) throw new Error('Login failed. Please try again!');

        const data = response.data;
        const role = data.role;
        const token = data.token;

        if (!token || !role) throw new Error('Invalid login response');

        localStorage.setItem('token', token);

        localStorage.setItem('company', JSON.stringify(data));

        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        expirationDate.setHours(0, 0, 0, 0);

        const secureCookie = location.protocol === 'https:' ? 'Secure; SameSite=None;' : 'SameSite=Lax;';
        document.cookie = `hmsToken=${token}; expires=${expirationDate.toUTCString()}; path=/; ${secureCookie}`;

        // Handle user info
        let loginName = '';
        let loginEmail = '';
        let id = '';
        let refId = '';
        let loginData = {};
        let systemRight = [];

        if (role === 'admin') {
          loginName = data.login?.Name || '';
          loginEmail = data.login?.Email || '';
          id = data.adminId || data.login?._id || '';
          loginData = data.login || {};

          refId = data.login?.refId || '';

          localStorage.setItem('refId', JSON.stringify(refId));

          localStorage.setItem('departmentName', data.departmentName || '');
          localStorage.setItem('departmentId', data.departmentId || '');
          localStorage.setItem('empCode', data.empCode || '');
        } else if (role === 'super-admin') {
          loginName = 'Super Admin';
          loginEmail = data.email || '';
          id = data.userId || '';
          loginData = { name: 'Super Admin' };
        } else if (role === 'staff') {
          loginName = data.name || '';
          loginEmail = data.email || '';
          id = data.staffId || data.login?._id || '';
          loginData = data.login || {};

          if (typeof data.login?.refId === 'object') {
            refId = data.login.refId._id || '';
          } else {
            refId = data.login?.refId || '';
          }

          localStorage.setItem('refId', JSON.stringify(refId));
          localStorage.setItem('systemRight', JSON.stringify(data.systemRight || []));
          localStorage.setItem('departmentName', data.departmentName || '');
          localStorage.setItem('departmentId', data.departmentId || '');
          localStorage.setItem('empCode', data.empCode || '');
        }

        localStorage.setItem('loginName', loginName);
        localStorage.setItem('loginEmail', loginEmail);
        localStorage.setItem('Id', id);
        localStorage.setItem('loginRole', role);
        localStorage.setItem('loginData', JSON.stringify(loginData));

        const idr = typeof refId === 'object' ? refId._id : refId;

        localStorage.setItem('refId', JSON.stringify(idr)); // ✅ Always save as string

        localStorage.setItem('loginRole', role);
        localStorage.setItem('loginData', JSON.stringify(loginData));

        sessionStorage.removeItem('alreadyRedirected');
        if (role === 'admin' || role === 'staff') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || error.response?.data?.msg || error.message || 'Something went wrong. Please try again later.';
        alert(errorMsg);
      }
    }
  });
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    setChecking(false);
  }, []);

  if (checking) {
    // console.log('⏳ Still checking auth state...');
    return null;
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        minHeight: '100vh'
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
            background: 'transparent',
            backdropFilter: 'blur(50px)'
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }} style={{ width: '100%' }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container direction="column" spacing={4} justifyContent="center">
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mt: 2
                    }}
                  >
                    <img
                      src={insureLogo}
                      alt="Isync Logo"
                      style={{
                        width: '180px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.3))'
                      }}
                    />
                  </Box>
                  {/* <Typography color="white" gutterBottom variant="h2">
                    Login
                  </Typography> */}
                  <Typography variant="body2" color="white">
                    To keep connected with us.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{
                      input: { color: 'white' },
                      label: { color: 'white' },
                      '& label.Mui-focused': { color: 'white' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' }
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'white'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={{
                      input: { color: 'white' },
                      label: { color: 'white' },
                      '& label.Mui-focused': { color: 'white' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' }
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'white'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button variant="text" color="secondary" size="small" onClick={() => navigate('/forgot-password')}>
                    Forgot Password?
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontWeight: 500,
              mb: 0.1,
              letterSpacing: '1px'
            }}
          >
            Powered by
          </Typography>
          <img
            src={amikaLogo}
            alt="Amika Logo"
            style={{
              width: '180px',
              objectFit: 'contain',
              filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.3))'
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;

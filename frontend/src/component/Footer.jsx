import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: '#111827', color: '#d1d5db', py: 1.5, px: 2 }}>
      <Grid container maxWidth="lg" margin="auto" spacing={2} textAlign={{ xs: 'center', md: 'left' }}>
        {/* Address */}
        <Grid item xs={12} md={3}>
          <Typography fontSize="12px" fontWeight={600} color="white" mb={0.3}>
            Address
          </Typography>
          <Typography fontSize="11px" fontWeight={500}>
            Amika Softwares
          </Typography>
          <Typography fontSize="11px" lineHeight={1.4}>
            High5 Coworking Space 2nd Floor, Saykar Classic, above Athvale Sweet, Baner, Pune, Maharashtra 411069
          </Typography>
        </Grid>

        {/* Phone */}
        <Grid item xs={12} md={3}>
          <Typography fontSize="12px" fontWeight={600} color="white" mb={0.3}>
            Phone
          </Typography>
          <Typography fontSize="11px">+91 7722075447 | +91 8767307387 | +91 7722055200</Typography>
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={3}>
          <Typography fontSize="12px" fontWeight={600} color="white" mb={0.3}>
            Email
          </Typography>
          <Typography fontSize="11px">info@miraicrm.com</Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={3}>
          <Typography fontSize="12px" fontWeight={600} color="white" mb={0.3}>
            Quick Links
          </Typography>

          <Typography fontSize="11px" sx={{ cursor: 'pointer' }} onClick={() => navigate('/privacy-policy')}>
            Privacy Policy
          </Typography>

          <Typography fontSize="11px" sx={{ cursor: 'pointer' }} onClick={() => navigate('/terms-and-conditions')}>
            Terms and Conditions
          </Typography>

          <Typography fontSize="11px" sx={{ cursor: 'pointer' }} onClick={() => navigate('/cancellation-refund')}>
            Cancellation and Refund Policy
          </Typography>
        </Grid>
      </Grid>

      <Typography textAlign="center" mt={0.8} fontSize="10px" color="gray">
        © {new Date().getFullYear()} Amika Softwares. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

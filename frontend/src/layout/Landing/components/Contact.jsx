import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

const Contact = () => {
  return (
    <Box
      sx={{
        // background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
        backgroundColor: '#fff',
        py: 10
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: '#fff',
            boxShadow: 6,
            borderRadius: 4,
            p: 5,
            border: '1px solid #e5e7eb',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 5,
            alignItems: 'center'
          }}
        >
          {/* ✅ LEFT: EMBEDDED GOOGLE MAP */}
          <Box
            sx={{
              width: '100%',
              height: 350,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 3,
              border: '1px solid #e5e7eb'
            }}
          >
            <iframe
              title="Amika Softwares Location"
              src="https://www.google.com/maps?q=High5%20Coworking%20Space%20Baner%20Pune&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>

          {/* ✅ RIGHT: CONTACT INFORMATION */}
          <Box>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Contact Us
            </Typography>

            <Typography variant="h6" fontWeight={700} mb={1}>
              Address
            </Typography>
            <Typography variant="body2" paragraph>
              Amika Softwares
              <br />
              High5 Coworking Space 2nd Floor, Saykar Classic,
              <br />
              above Athvale Sweet, Baner,
              <br />
              Pune, Maharashtra 411069
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight={700} mb={1}>
              Phone
            </Typography>
            <Typography variant="body2" paragraph>
              +91 7722075447 | +91 8767307387 | +91 7722055200
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight={700} mb={1}>
              Email
            </Typography>
            <Typography variant="body2">info@miraicrm.com</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;

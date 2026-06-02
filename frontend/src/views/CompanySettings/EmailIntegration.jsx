import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const EmailIntegration = ({ onSave }) => {
  const [emailConfig, setEmailConfig] = useState({
    officialEmail: '',
    officialEmailPassword: '',
    officialEmailHost: '',
    accountEmail: '',
    accountEmailPassword: '',
    accountEmailHost: ''
  });

  const handleChange = (e) => {
    setEmailConfig({
      ...emailConfig,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (onSave) onSave(emailConfig);
    console.log('Email Integration Config:', emailConfig);
  };

  return (
    <Grid item xs={12} sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Email Integration
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            {/* Left column: Official Email */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Official Email ID"
                    name="officialEmail"
                    value={emailConfig.officialEmail}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Official Email Password"
                    type="password"
                    name="officialEmailPassword"
                    value={emailConfig.officialEmailPassword}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Official Email Host"
                    name="officialEmailHost"
                    value={emailConfig.officialEmailHost}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Right column: Account Email */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Account Email ID"
                    name="accountEmail"
                    value={emailConfig.accountEmail}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Account Email Password"
                    type="password"
                    name="accountEmailPassword"
                    value={emailConfig.accountEmailPassword}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Account Email Host"
                    name="accountEmailHost"
                    value={emailConfig.accountEmailHost}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Save button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default EmailIntegration;

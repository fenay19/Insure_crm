import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ForumIcon from '@mui/icons-material/Forum';
import SecurityIcon from '@mui/icons-material/Security';

const featuresData = [
  {
    title: 'Sales Automation',
    description: 'Automate your sales journey — from capturing leads to closing deals. Focus on relationships, not repetitive tasks.',
    icon: <TrendingUpIcon fontSize="large" sx={{ color: '#1976d2' }} />
  },
  {
    title: 'Customer Management',
    description:
      'Keep every customer detail in one place. Build stronger connections with complete visibility into interactions and preferences.',
    icon: <PeopleAltIcon fontSize="large" sx={{ color: '#1976d2' }} />
  },
  {
    title: 'Analytics & Reporting',
    description: 'Monitor performance in real-time with dynamic dashboards. Turn insights into strategy with clear, actionable reports.',
    icon: <BarChartIcon fontSize="large" sx={{ color: '#1976d2' }} />
  },
  {
    title: 'Task & Workflow Management',
    description: 'Organize work with intuitive task tracking and smart reminders. Empower your team to stay aligned and meet goals easily.',
    icon: <TaskAltIcon fontSize="large" sx={{ color: '#1976d2' }} />
  },
  {
    title: 'Multi-Channel Communication',
    description:
      'Engage with customers via calls, emails, and messages — all from within the CRM. Stay connected wherever your clients are.',
    icon: <ForumIcon fontSize="large" sx={{ color: '#1976d2' }} />
  },
  {
    title: 'Role-Based Access Control',
    description: 'Maintain security and structure by assigning permissions based on roles. Ensure that sensitive data stays protected.',
    icon: <SecurityIcon fontSize="large" sx={{ color: '#1976d2' }} />
  }
];

const Features = () => {
  return (
    <Box
      sx={{
        width: '99vw',
        minHeight: '80vh',
        background: 'linear-gradient(to bottom right, #f5f9ff, #ffffff)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 8 },
        boxSizing: 'border-box'
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 6,
          fontWeight: 'bold',
          color: '#1976d2',
          textAlign: 'center'
        }}
      >
        Empower Your Business with Modern CRM Features
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{
          width: '100%',
          maxWidth: '1400px',
          justifyContent: 'center'
        }}
      >
        {featuresData.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                p: 2,
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#e3f2fd',
                  width: 64,
                  height: 64,
                  margin: '0 auto',
                  mb: 2
                }}
              >
                {feature.icon}
              </Avatar>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.5,
                    color: '#0d47a1',
                    fontWeight: 600
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;

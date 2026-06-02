import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FaCheckCircle, FaUsers, FaChartLine, FaFileInvoice, FaTasks, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const modules = [
  { name: 'Customer 360 Hub', icon: <FaUsers /> },
  { name: 'Smart Connect Directory', icon: <FaUsers /> },
  { name: 'Opportunity Desk', icon: <FaChartLine /> },
  { name: 'Lead Flow Engine', icon: <FaChartLine /> },
  { name: 'Deal Track Navigator', icon: <FaChartLine /> },
  { name: 'Quick Bill Suite', icon: <FaFileInvoice /> },
  { name: 'Work Force Hub', icon: <FaUsers /> },
  { name: 'Pulse Track', icon: <FaTasks /> },
  { name: 'Day Off Planner', icon: <FaTasks /> },
  { name: 'People Care', icon: <FaUsers /> },
  { name: 'Service Desk', icon: <FaPhoneAlt /> },
  { name: 'Task Master Board', icon: <FaTasks /> }
];

const pricingPlans = [
  {
    title: 'Free Trial',
    price: 'Free • 30 Days • 1 Login',
    color: '#90a4ae',
    free: true,
    description: 'Get a hands-on preview of all modules before committing.',
    features: ['Access to all modules', 'Basic analytics', 'Email support']
  },
  {
    title: 'Quarterly',
    price: '₹6249 / Company',
    color: '#4fc3f7',
    description: 'Perfect for small businesses looking to scale operations.',
    features: ['Full feature access', 'Priority support', 'Quarterly analytics']
  },
  {
    title: 'Half-Yearly',
    price: '₹9749 / Company',
    color: '#81c784',
    description: 'Ideal for growing teams needing consistent insights.',
    features: ['All premium features', 'Custom reports', 'Dedicated manager']
  },
  {
    title: 'Yearly',
    price: '₹14,999 / Company',
    color: '#ffb74d',
    description: 'Best value for established organizations.',
    features: ['Unlimited users', 'Advanced automation', '24/7 Support']
  }
];

const Pricing = () => {
  const navigation = useNavigate();
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        width: '100%',
        // height: '80vh',
        background: 'linear-gradient(to bottom right, #f9fbff, #ffffff)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 4,
        py: 6,
        overflowY: 'auto'
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={1}>
        Transparent & Flexible Pricing
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={5}>
        Choose a plan that fits your business. All plans include access to core CRM and productivity modules.
      </Typography>

      <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ width: '100%', maxWidth: '1300px' }}>
        {pricingPlans.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 10
                }
              }}
            >
              {/* Header */}
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color={plan.color}>
                  {plan.title}
                </Typography>
                <Typography variant="subtitle1" fontWeight={500} mt={1}>
                  {plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {plan.description}
                </Typography>
              </CardContent>

              <Divider sx={{ my: 2 }} />

              {/* Features */}
              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Includes:
                </Typography>
                <List dense disablePadding>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28, color: plan.color }}>
                        <FaCheckCircle size={14} />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }} primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              {/* CTA */}
              <Box textAlign="center" pb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: plan.color,
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    width: '80%',
                    '&:hover': { opacity: 0.9, backgroundColor: plan.color }
                  }}
                  onClick={() => {
                    if (plan.free) navigation('/signup');
                    else scrollToContact();
                    navigation('/signup');
                  }}
                >
                  {plan.free ? 'Start Free Trial' : 'Get Started'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Highlight Section */}
      <Box mt={6} textAlign="center" maxWidth="1000px">
        <Typography variant="h6" fontWeight={600} mb={1}>
          All Plans Include Access To:
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {modules.slice(0, 6).map((module, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Box display="flex" flexDirection="column" alignItems="center" p={1}>
                <Box sx={{ fontSize: 22, color: '#1976d2', mb: 1 }}>{module.icon}</Box>
                <Typography variant="body2" textAlign="center">
                  {module.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Pricing;
